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
        this.chapters = this.manga.tomes[this.tomeIndex].chapters;
        if (this.chapters.length > 0) {
            this.showChapters = true;
        } else {
            this.showChapters = false;
        }
    }

    downloadTome() {
        if (this.tomeIndex) {
            this.commonService.loadingShow('Veuillez patienter... Génération du PDF depuis les images du dépôt...');
            this.japscanService.getMangaTomeImages(this.manga.tomes[this.tomeIndex]).subscribe(imagesToOrder => {
                if (imagesToOrder) {
                    this.japscanService.makePdfTome().then(pdf => {
                        this.commonService.loadingHide();
                        let name: string = '';
                        if (this.manga.tomes[this.tomeIndex].title == '') {
                            name = this.manga.title + '_tome-' + (this.tomeIndex +1);
                        } else {
                            name = this.manga.title + '_' +
                                this.manga.tomes[this.tomeIndex].title;
                        }
                        this.commonService.loadingShow('Veuillez patienter... Ecriture du PDF dans le dossier de destination...');
                        this.commonService.downloadPdf(name, pdf).then(() => {
                            this.commonService.loadingHide();
                        });
                    });
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
            //this.commonService.loadingShow('Veuillez patienter... Génération du PDF depuis les images du dépôt...');
            this.japscanService.getMangaChapterImages(this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex]).subscribe(images => {
                this.japscanService.makePdfChapter(images).then(pdf => {
                    //this.commonService.loadingHide();
                    this.isStep1 = false;
                    const name: string = this.manga.title + '_' +
                        this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex].title;
                    //this.commonService.loadingShow('Veuillez patienter... Ecriture du PDF dans le dossier de destination...');
                    this.isStep2 = true;
                    this.commonService.downloadPdf(name, pdf).then(() => {
                        this.isStep2Finish = true;
                        this.isStep2 = false;
                        this.isDownload = false;
                        //this.commonService.loadingHide();
                    });
                });
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un chapitre.');
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
