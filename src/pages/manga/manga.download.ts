import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { SecurityService } from '../../providers/security-service';
import { LoginPage } from '../login/index';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.download.html',
    providers: [CommonService, MangaService, SecurityService]
})
export class MangaDownloadPage {

    private manga:any = {};
    private tomes:any = [];
    private tomeId:any = 0;
    private chapters:any = [];
    private chapterId:any = 0;

    constructor(private navCtrl: NavController, public params: NavParams,
                public viewCtrl: ViewController, public commonService: CommonService,
                public mangaService: MangaService, private securityService: SecurityService) {
        this.manga = this.params.get('manga');
    }

    ionViewDidLoad () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            } else {
                this.commonService.loadingShow('Please wait...');
                this.mangaService.getTomesByManga(this.manga.id).then(tomes => {
                    this.tomes = tomes;
                    this.loadChapters();
                });

            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    loadChapters() {
        if (this.tomeId == 0) {
            this.mangaService.getChaptersByManga(this.manga.id).then(chapters => {
                this.chapters = chapters;
                this.commonService.loadingHide();
            });
        } else {
            this.commonService.loadingShow('Please wait...');
            this.mangaService.getChaptersByTome(this.tomeId).then(chapters => {
                this.chapters = chapters;
                this.commonService.loadingHide();
            });
        }
        this.chapterId = 0;
    }

    downloadManga() {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.generateManga(this.manga.id).then(generate => {
            if (generate) {
                this.commonService.toastShow('Le manga a été ajouté aux téléchargements');
            } else {
                this.commonService.toastShow("Erreur lors de l'ajout du manga aux téléchargements");
            }
            this.commonService.loadingHide();
        });
    }

    downloadTome() {
        if (this.tomeId > 0) {
            this.commonService.loadingShow('Please wait...');
            this.mangaService.generateTome(this.tomeId).then(generate => {
                if (generate) {
                    this.commonService.toastShow('Le tome a été ajouté aux téléchargements');
                } else {
                    this.commonService.toastShow("Erreur lors de l'ajout du tome aux téléchargements");
                }
                this.commonService.loadingHide();
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un tome');
        }
    }

    downloadChapter() {
        if (this.chapterId > 0) {
            this.commonService.loadingShow('Please wait...');
            this.mangaService.generateChapter(this.chapterId).then(generate => {
                if (generate) {
                    this.commonService.toastShow('Le chapitre a été ajouté aux téléchargements');
                } else {
                    this.commonService.toastShow("Erreur lors de l'ajout du chapitre aux téléchargements");
                }
                this.commonService.loadingHide();
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un chapitre');
        }
    }


}
