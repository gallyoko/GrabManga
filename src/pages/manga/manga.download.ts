import { Component } from '@angular/core';
import { NavParams, NavController, Platform } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';

@Component({
    selector: 'page-manga-download',
    templateUrl: 'manga.download.html',
    providers: [CommonService]
})
export class MangaDownloadPage {
    private manga:any = {};
    private tomeIndex:any;
    private chapters:any = [];
    private chapterIndex:any;
    private showChapters: any = false;
    private showDlTomeButton;
    private compressionMode: boolean = true;

    constructor(private params: NavParams, private navCtrl: NavController,
                private commonService: CommonService, private platform: Platform) {
        this.manga = this.params.get('manga');
        this.showDlTomeButton = true;
        if (this.platform.is('cordova')) {
            this.showDlTomeButton = false;
        }
        this.loadChaptersInit();
    }

    ionViewDidLeave () {
        this.manga = {};
        this.chapters = [];
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
            if (this.manga.tomes[this.tomeIndex].chapters.length < 12) {
                this.commonService.setDownloadTome(this.manga.tomes[this.tomeIndex], this.compressionMode).then(setDownloadTome => {
                    if (setDownloadTome) {
                        this.commonService.toastShow('Le tome a été ajouté aux téléchargements.');
                    } else {
                        this.commonService.toastShow("Erreur : impossible d'ajouter le tome aux téléchargements.");
                    }
                });
            } else {
                this.commonService.toastShow('Trop de chapitres dans ce tome ! Téléchargez par chapitre.');
            }
        } else {
            this.commonService.toastShow('Veuillez sélectionner un tome.');
        }
    }

    downloadChapter() {
        if (this.chapterIndex) {
            if (!this.tomeIndex) {
                this.tomeIndex = 0;
            }
            this.commonService.setDownloadChapter(this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex], this.compressionMode).then(setDownloadChapter => {
                if (setDownloadChapter) {
                    this.commonService.toastShow('Le chapitre a été ajouté aux téléchargements.');
                } else {
                    this.commonService.toastShow("Erreur : impossible d'ajouter le chapitre aux téléchargements.");
                }
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un chapitre.');
        }
    }

    closeDownload() {
        this.navCtrl.pop();
    }
}
