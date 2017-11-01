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

    ionViewDidEnter () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            } else {
                this.mangaService.getTomesByManga(this.manga.id,true, true).then(tomes => {
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
            this.mangaService.getChaptersByManga(this.manga.id,false, true).then(chapters => {
                this.chapters = chapters;
            });
        } else {
            this.mangaService.getChaptersByTome(this.tomeId,false, true).then(chapters => {
                this.chapters = chapters;
            });
        }
        this.chapterId = 0;
    }

    downloadManga() {
        this.mangaService.generateManga(this.manga.id,true, true).then(generate => {
            if (generate) {
                this.commonService.toastShow('La demande de génération du manga a été effectuée');
            }
        });
    }

    downloadTome() {
        if (this.tomeId > 0) {
            this.mangaService.generateTome(this.tomeId, true, true).then(generate => {
                if (generate) {
                    this.commonService.toastShow('La demande de génération du tome a été effectuée');
                }
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un tome');
        }
    }

    downloadChapter() {
        if (this.chapterId > 0) {
            this.mangaService.generateChapter(this.chapterId, true, true).then(generate => {
                if (generate) {
                    this.commonService.toastShow('La demande de génération du chapitre a été effectuée');
                }
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un chapitre');
        }
    }


}
