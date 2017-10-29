import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { SecurityService } from '../../providers/security-service';
import { MangaDownloadPage } from './manga.download';
import { LoginPage } from '../login/index';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.info.html',
    providers: [CommonService, MangaService, SecurityService]
})
export class MangaInfoPage {

    private manga:any = {};
    private mangaId:any = 0;

    constructor(private navCtrl: NavController, public modalCtrl: ModalController,
                public params: NavParams, private securityService: SecurityService,
                public commonService: CommonService, public mangaService: MangaService) {
        this.mangaId = this.params.get('mangaId');
        this.showMangaInfo();
    }

    ionViewDidEnter () {
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

    addToFavorite() {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.addFavorite(this.mangaId).then(isAdd => {
            let msg = '';
            if (isAdd) {
                msg = ' a été ajouté aux favoris.';
            } else {
                msg = ' fait déjà parti de vos favoris.';
            }
            this.commonService.loadingHide();
            this.commonService.toastShow(this.manga['title'] + msg);
        });
    }

    openModal() {
        let modal = this.modalCtrl.create(MangaDownloadPage, {'manga': this.manga});
        modal.present();
    }

    closeInfo() {
        this.navCtrl.pop();
    }

}
