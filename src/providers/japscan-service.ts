import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MangaModel } from '../models/manga.model';
import { TomeModel } from '../models/tome.model';
import { ChapterModel } from '../models/chapter.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import 'rxjs/add/operator/map';

@Injectable()
export class JapscanService {
    letterObj = {
        to: '',
        from: '',
        text: ''
    }

    pdfObj = null;

    constructor(public http: Http) {
        
    }

    getMangas() {
        return new Promise(resolve => {
            this.http.get('/mangas/')
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
                                            titleTmp[0].trim()
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
                                            let urlChapter: any = urlAndTitleChapterToClean[0].trim().replace('//www.japscan.com', '');
                                            let titleChapterToClean: any = urlAndTitleChapterToClean[1].trim().replace('</a>\n' +
                                                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</li>', '');
                                            let titleChapter: any = titleChapterToClean.trim().replace('"', '');
                                            let chapter: any = new ChapterModel(titleChapter, urlChapter);
                                            chapters.push(chapter);
                                        }
                                    }
                                }
                            }
                            if (chapters.length > 0) {
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
        return new Promise(resolve => {
            console.log(tome.chapters);
            let images: any = [];
            for(let i = 0; i < tome.chapters.length; i++) {
                this.getMangaChapterImages(tome.chapters[i]).then(imagesChapter => {
                    images.push(imagesChapter);
                });
            }
            resolve(images);
        });
    }


    getMangaChapterImages(chapter) {
        return new Promise(resolve => {
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
                            }
                            if (bookPages.length > 0) {
                                let baseUrlToCleanTmp: any = elements[0].trim().split('<select name="mangas" id="mangas" ');
                                let baseUrlToClean: any = baseUrlToCleanTmp[1].trim().split('" data-uri="');
                                let dataUrlNomToClean: any = baseUrlToClean[0];
                                let dataUrlTomeToClean: any = baseUrlToClean[2];
                                let dataUrlNom: any = dataUrlNomToClean.trim().replace('data-nom="', '');
                                let dataUrlTome: any = '';
                                if (dataUrlTomeToClean.indexOf('" data-nom="') > -1) {
                                    let dataUrlTomeToCleanTmp: any = dataUrlTomeToClean.trim().split('" data-nom="');
                                    dataUrlTome = dataUrlTomeToCleanTmp[0].replace('"></select>', '');
                                } else {
                                    dataUrlTome = dataUrlTomeToClean.trim().replace('"></select>', '');
                                }
                                let urlMask: any = 'http://ww1.japscan.com/lel/' + dataUrlNom.replace(/ /g, '-') + '/'  + dataUrlTome + '/';
                                images.urlMask = urlMask;
                                images.pages = bookPages;
                                images.order = dataUrlTome;
                            }
                        }
                        resolve(images);
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    makePdf() {
        return new Promise(resolve => {
            var docDefinition = {
                content: [
                    { text: 'REMINDER', style: 'header' },
                    { text: new Date().toTimeString(), alignment: 'right' },

                    { text: 'From', style: 'subheader' },
                    { text: this.letterObj.from },

                    { text: 'To', style: 'subheader' },
                    this.letterObj.to,

                    { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

                    {
                        ul: [
                            'Bacon',
                            'Rips',
                            'BBQ',
                        ]
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 15, 0, 0]
                    },
                    story: {
                        italic: true,
                        alignment: 'center',
                        width: '50%',
                    }
                }
            }
            this.pdfObj = pdfMake.createPdf(docDefinition);
            resolve(this.pdfObj);
        });
    }

}

