import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { JapscanService } from '../../providers/japscan-service';

@Component({
    selector: 'page-manga-download',
    templateUrl: 'manga.download.html',
    providers: [CommonService, JapscanService]
})
export class MangaDownloadPage {

    private manga:any = {};
    private tomeIndex:any;
    private chapters:any = [];
    private chapterIndex:any;
    private showChapters: any = false;
    private isDownload: any = false;
    private showResultDownload: any = false;
    private isStep1: any = false;
    private isStep2: any = false;
    private isStep2Finish: any = false;
    private downloadError: any = false;
    private pdfFilename: any = '';
    private pdfPath: any = '';
    private compressionMode: any = false;
    private countImages: any;
    private currentImage: any;
    private progress: any;

    constructor(public params: NavParams,
                public viewCtrl: ViewController, private commonService: CommonService,
                private japscanService: JapscanService) {
        this.manga = this.params.get('manga');
        this.progress = 0;
        this.currentImage = 0;
        this.countImages = 0;
        this.loadChaptersInit();
        this.japscanService.getCurrentPagePdf()
            .subscribe((res) => {
                if (this.isDownload) {
                    if (this.countImages > 0) {
                        this.currentImage = res;
                        const progress: any = (this.currentImage/this.countImages)*100;
                        this.progress = parseInt(progress);
                    }
                }
            });
    }

    ionViewDidEnter () {
        this.progress = 0;
        this.currentImage = 0;
        this.countImages = 0;
    }

    ionViewDidLeave () {
        this.progress = 0;
        this.currentImage = 0;
        this.countImages = 0;
    }

    loadChaptersInit() {
        const filterTome = () => {
            return this.manga.tomes.filter((tome) =>
                tome.title==''
            );
        };
        let tome = filterTome();
        if (tome.length > 0) {
            this.chapters = tome[0]['chapters'];
            if (this.chapters.length > 0) {
                this.showChapters = true;
            } else {
                this.showChapters = false;
            }
        }
    }

    loadChapters() {
        this.resetDownloadResult();
        this.chapters = this.manga.tomes[this.tomeIndex].chapters;
        if (this.chapters.length > 0) {
            this.showChapters = true;
        } else {
            this.showChapters = false;
        }
    }

    downloadTome() {
        if (this.tomeIndex) {
            this.isStep2Finish = false;
            this.isDownload = true;
            this.showResultDownload = true;
            this.isStep1 = true;
            this.isStep2 = false;
            this.downloadError = false;
            this.japscanService.getMangaTomeImages(this.manga.tomes[this.tomeIndex]).subscribe(imagesToOrder => {
                if (imagesToOrder) {
                    this.countImages = imagesToOrder.length;
                    let name: string = '';
                    if (this.manga.tomes[this.tomeIndex].title == '') {
                        name = this.manga.title + '_tome-' + (this.tomeIndex +1);
                    } else {
                        name = this.manga.title + '_' +
                            this.manga.tomes[this.tomeIndex].title;
                    }
                    this.japscanService.makePdfTome(name, this.compressionMode).then(pdf => {
                        this.isStep1 = false;
                        this.isStep2 = true;
                        this.currentImage = this.countImages;
                        this.progress = 100;
                        this.commonService.downloadPdf(name, pdf).then((pathAndName) => {
                            this.pdfFilename = pathAndName['name']+'.pdf';
                            this.pdfPath = pathAndName['path'];
                            this.isStep2Finish = true;
                            this.isStep2 = false;
                            this.isDownload = false;
                        });
                    });
                } else {
                    this.isStep1 = false;
                    this.isDownload = false;
                    this.downloadError = true;
                }
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un tome.');
        }
    }

    downloadChapter() {
        if (this.chapterIndex) {
            this.isStep2Finish = false;
            this.isDownload = true;
            this.showResultDownload = true;
            this.isStep1 = true;
            this.isStep2 = false;
            if (!this.tomeIndex) {
                this.tomeIndex = 0;
            }
            this.japscanService.getMangaChapterImages(this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex]).subscribe(images => {
                this.countImages = images.pages.length;
                const name: string = this.manga.title + '_' +
                    this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex].title;
                this.japscanService.makePdfChapter(images, name, this.compressionMode).then(pdf => {
                    this.isStep1 = false;
                    this.isStep2 = true;
                    this.currentImage = this.countImages;
                    this.progress = 100;
                    this.commonService.downloadPdf(name, pdf).then((pathAndName) => {
                        this.pdfFilename = pathAndName['name']+'.pdf';
                        this.pdfPath = pathAndName['path'];
                        this.isStep2Finish = true;
                        this.isStep2 = false;
                        this.isDownload = false;
                    });
                });
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un chapitre.');
        }
    }

    resetDownloadResult() {
        this.isStep2Finish = false;
        this.isDownload = false;
        this.showResultDownload = false;
        this.isStep1 = false;
        this.isStep2 = false;
        this.downloadError = false;
        this.progress = 0;
        this.currentImage = 0;
        this.countImages = 0;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
