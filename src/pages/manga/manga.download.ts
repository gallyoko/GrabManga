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

    constructor(public params: NavParams,
                public viewCtrl: ViewController, public commonService: CommonService,
                public japscanService: JapscanService) {
        this.manga = this.params.get('manga');
        this.loadChaptersInit();
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
                    let name: string = '';
                    if (this.manga.tomes[this.tomeIndex].title == '') {
                        name = this.manga.title + '_tome-' + (this.tomeIndex +1);
                    } else {
                        name = this.manga.title + '_' +
                            this.manga.tomes[this.tomeIndex].title;
                    }
                    this.japscanService.makePdfTome(name).then(pdf => {
                        this.isStep1 = false;
                        this.isStep2 = true;
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
            this.japscanService.getMangaChapterImages(this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex]).subscribe(images => {
                const name: string = this.manga.title + '_' +
                    this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex].title;
                this.japscanService.makePdfChapter(images, name).then(pdf => {
                    this.isStep1 = false;
                    this.isStep2 = true;
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
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
