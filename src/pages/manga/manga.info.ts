import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { SecurityService } from '../../providers/security-service';
import { LoginPage } from '../login/index';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.info.html',
    providers: [CommonService, MangaService, SecurityService]
})
export class MangaInfoPage {

    private manga:any = {};
    private mangaId:any;

    constructor(private navCtrl: NavController, public params: NavParams,
                public viewCtrl: ViewController, public commonService: CommonService,
                public mangaService: MangaService, private securityService: SecurityService) {
        this.mangaId = this.params.get('mangaId');
        this.showMangaInfo();
    }

    ionViewDidLoad () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            }
        });
    }

    showMangaInfo() {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.getMangaInfo(this.mangaId).then(manga => {
            this.manga = manga;
            this.commonService.loadingHide();
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    download() {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.generateManga(this.mangaId).then(generate => {
            if (generate) {
                this.commonService.toastShow('Le manga a été ajouté aux téléchargements');
            } else {
                this.commonService.toastShow("Erreur lors de l'ajout du manga aux téléchargements");
            }
            this.commonService.loadingHide();
        });
    }
}
