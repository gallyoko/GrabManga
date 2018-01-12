import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MangaModel } from '../models/manga.model';
import { TomeModel } from '../models/tome.model';
import { ChapterModel } from '../models/chapter.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class JapscanService {
    pdfObj = null;
    private images: any = [];

    constructor(public http: Http) {}

    getMangas() {
        return new Promise(resolve => {
            this.http.get('/api/mangas/')
                .subscribe(
                    response => {
                        let mangas: any = [];
                        let body: any = response['_body'];
                        let elements: any = body.split('<div class="row">\n' +
                            '\t\t\t\t\t\t\t<div class="cell"><a href="');
                        if (elements.length > 0) {
                            for(let i = 0; i < elements.length; i++) {
                                if (i>0 && i<(elements.length-1)) {
                                    let titleElement: any = elements[i].split('</a></div>\n' +
                                        '\t\t\t\t\t\t\t<div class="cell">');
                                    let titleTmp: any = titleElement[0].split('">');
                                    if (titleTmp.length > 0 ) {
                                        let manga = new MangaModel(
                                            titleTmp[1],
                                            '/api'+titleTmp[0].trim()
                                        );
                                        mangas.push(manga);
                                    }
                                }
                            }
                        }
                        resolve(mangas);
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    getMangaTomeAndChapter(manga) {
        return new Promise(resolve => {
            this.http.get(manga.url)
                .subscribe(
                    response => {
                        let body: any = response['_body'];
                        let tomes: any = [];
                        // cut between header/ synopsis & chapter list
                        let elements: any = body.split('<h2 class="bg-header">Liste Des Chapitres</h2>\n' +
                            '\t\t\t\t\t<div id="liste_chapitres">');
                        // set synopsis if exist
                        if (elements[0].indexOf('<div id="synopsis">') > -1) {
                            let partSynopis: any = elements[0].split('<div id="synopsis">');
                            let synopsisToClean: any = partSynopis[1].trim().replace('</div>','');
                            let synopsis: any = synopsisToClean.trim().replace('"','');
                            manga.synopsis = synopsis;
                        }
                        let chapterAndTomeList: any = elements[1].split('</a>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</li>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>');
                        for(let i = 0; i < chapterAndTomeList.length; i++) {
                            let chapters: any = [];
                            let tomeTitle: any = '';
                            if (chapterAndTomeList[i].trim().substr(0, 4) == '<h2>') {
                                let tomeTitleToClean: any = chapterAndTomeList[i].trim().split('</h2>');
                                let tomeTitleTmp: any = tomeTitleToClean[0].trim().replace('<h2>', '');
                                tomeTitle = tomeTitleTmp.trim().replace('"', '');
                            }
                            let chapterList: any = chapterAndTomeList[i].trim().split('<li>\n' +
                                '\t\t\t\t\t\t\t\t\t<a href="');
                            if (chapterList.length > 1) {
                                for(let j = 0; j < chapterList.length; j++) {
                                    let urlAndTitleChapterToClean: any = chapterList[j].trim().split('">');
                                    if (urlAndTitleChapterToClean.length > 1) {
                                        if (urlAndTitleChapterToClean[0].indexOf('//www.japscan.com/lecture-en-ligne') > -1) {
                                            let urlChapter: any = '/api/'+urlAndTitleChapterToClean[0].trim().replace('//www.japscan.com', '');
                                            let titleChapterToClean: any = urlAndTitleChapterToClean[1].trim().replace('</a>\n' +
                                                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</li>', '');
                                            let titleChapter: any = titleChapterToClean.trim().replace('"', '');
                                            let order : number = chapterList.length - j;
                                            let chapter: any = new ChapterModel(titleChapter, urlChapter, order);
                                            chapters.push(chapter);
                                        }
                                    }
                                }
                            }
                            if (chapters.length > 0) {
                                chapters.sort(function (a, b) {
                                    return a.order - b.order;
                                });
                                let tome: any = new TomeModel(tomeTitle, chapters);
                                tomes.push(tome);
                            }
                        }
                        manga.tomes = tomes;
                        resolve(manga);
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    getImages() {
        return Observable.create((observer) => {
            observer.next(this.images);
            observer.complete();
        });
    }

    getMangaBookImages(manga) {
        return new Promise(resolve => {
            let images: any = [];
            for(let i = 0; i < manga.tomes.length; i++) {
                this.getMangaTomeImages(manga.tomes[i]).then(imagesTome => {
                    images.push(imagesTome);
                });
            }
            resolve(images);
        });
    }

    getMangaTomeImages(tome) {
        return Observable.create((observer) => {
            //console.log(tome.chapters);
            this.images = [];
            for(let i = 0; i < tome.chapters.length; i++) {
                this.getMangaChapterImages(tome.chapters[i]).subscribe(imagesChapter => {
                    this.images.push(imagesChapter);
                    if (this.images.length == tome.chapters.length) {
                        this.images.sort(function (a, b) {
                            return a.order - b.order;
                        });
                        observer.next(true);
                        observer.complete();
                    }
                });
            }
        });
    }

    getMangaChapterImages(chapter) {
        return Observable.create((observer) => {
            this.http.get(chapter.url)
                .subscribe(
                    response => {
                        let images: any = {};
                        let body: any = response['_body'];
                        let elements: any = body.split('<select id="pages" name="pages"');
                        if (elements.length > 1) {
                            let pageListToClean: any = elements[1].trim().split('</select>');
                            let pageList: any = pageListToClean[0].trim().split('data-img="');
                            let bookPages: any = [];
                            for(let i = 0; i < pageList.length; i++) {
                                let pageInfo: any = pageList[i].trim().split('" value="');
                                if (pageInfo.length > 1) {
                                    let page: any = pageInfo[0].trim();
                                    if (page.substr(0, 4) != 'IMG_') {
                                        bookPages.push(page);
                                    }
                                }
                                if (i >= (pageList.length -1)) {
                                    if (bookPages.length > 0) {
                                        let dataUrlTomeToClean: any = '';
                                        let dataUrlNom: any = '';
                                        let checkBaseUrl: any = elements[0].trim().split('<select name="chapitres" id="chapitres" ');
                                        let baseUrlToCleanTmp: any = elements[0].trim().split('<select name="mangas" id="mangas" ');
                                        let baseUrlToClean: any = baseUrlToCleanTmp[1].trim().split('" data-uri="');
                                        let dataUrlNomToClean: any = baseUrlToClean[0];
                                        dataUrlTomeToClean = baseUrlToClean[2];
                                        dataUrlNom = dataUrlNomToClean.trim().replace('data-nom="', '');
                                        let dataUrlTome: any = '';
                                        let dataUrlTomeToCleanTmp: any = checkBaseUrl[1].trim().split('data-nom="');
                                        dataUrlTome = dataUrlTomeToCleanTmp[1].trim().replace('" ></select>', '')
                                            .replace('" class="flex-item big"></select>', '');

                                        if (dataUrlTome.trim() == '') {
                                            if (dataUrlTomeToClean.indexOf('" data-nom="') > -1) {
                                                let dataUrlTomeToCleanTmp: any = dataUrlTomeToClean.trim().split('" data-nom="');
                                                dataUrlTome = dataUrlTomeToCleanTmp[0].replace('"></select>', '');
                                            } else {
                                                dataUrlTome = dataUrlTomeToClean.trim().replace('"></select>', '');
                                            }
                                        }
                                        let urlMask: any = '/book/' + dataUrlNom.replace(/ /g, '-') + '/'  + dataUrlTome.replace(/ /g, '-') + '/';
                                        images.urlMask = urlMask;
                                        images.pages = bookPages;
                                        images.order = chapter.order;
                                        observer.next(images);
                                        observer.complete();
                                    } else {
                                        observer.next(false);
                                        observer.complete();
                                    }
                                }
                            }
                        } else {
                            observer.next(false);
                            observer.complete();
                        }
                    },
                    err => {
                        observer.next(false);
                        observer.complete();
                    }
                );
        });
    }

    makePdfChapter(images) {
        return new Promise(resolve => {
            const content: any = [];
            const contentToOrder: any = [];
            for(let i = 0; i < images.pages.length; i++) {
                this.getBase64ImageFromURL(images.urlMask + images.pages[i]).subscribe(base64data => {
                    contentToOrder.push({'order': i, 'value': base64data});
                    if (contentToOrder.length == images.pages.length) {
                        contentToOrder.sort(function (a, b) {
                            return a.order - b.order;
                        });
                        for(let j = 0; j < contentToOrder.length; j++) {
                            content.push({image: 'data:image/jpg;base64,'+contentToOrder[j].value, width: 500});
                            if (content.length == contentToOrder.length) {
                                var docDefinition = {
                                    content: content
                                };
                                this.pdfObj = pdfMake.createPdf(docDefinition);
                                resolve(this.pdfObj);
                            }
                        }
                    }
                });
            }
        });
    }

    makePdfTome() {
        return new Promise(resolve => {
            this.getImages().subscribe(imagesTome => {
                //console.log(imagesTome);
                let images: any = imagesTome;
                images.sort(function (a, b) {
                    return a.order - b.order;
                });
                const content: any = [];
                const contentToOrder: any = [];
                let allUrl: any = [];
                let count: number = 0;
                for(let k = 0; k < images.length; k++) {
                    count = count + images[k].pages.length;
                    for(let i = 0; i < images[k].pages.length; i++) {
                        allUrl.push(images[k].urlMask + images[k].pages[i]);
                    }
                }
                for(let j = 0; j < allUrl.length; j++) {
                    this.getBase64ImageFromURL(allUrl[j]).subscribe(base64data => {
                        contentToOrder.push({'order': j, 'value': base64data});
                        if (contentToOrder.length == allUrl.length) {
                            contentToOrder.sort(function (a, b) {
                                return a.order - b.order;
                            });
                            for(let l = 0; l < contentToOrder.length; l++) {
                                content.push({image: 'data:image/jpg;base64,'+contentToOrder[l].value, width: 500});
                                if (content.length == contentToOrder.length) {
                                    var docDefinition = {
                                        content: content
                                    };
                                    this.pdfObj = pdfMake.createPdf(docDefinition);
                                    resolve(this.pdfObj);
                                }
                            }
                        }
                    });
                }
            });
        });
    }

    getBase64ImageFromURL(url: string) {
        return Observable.create((observer) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        });
    }

    getBase64Image(img: HTMLImageElement) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
}