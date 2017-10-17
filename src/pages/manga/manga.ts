import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { MangaInfoPage } from './manga.info';
import { SecurityService } from '../../providers/security-service';
import { LoginPage } from '../login/index';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.html',
    providers: [CommonService, MangaService, SecurityService]
})
export class MangaPage {

    private paginatorAlpha:any = [];
    private mangas:any = [];

    constructor(public navCtrl: NavController, public modalCtrl: ModalController,
                public commonService: CommonService, public mangaService: MangaService,
                private securityService: SecurityService) {
        this.paginatorAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'
            , 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    }

    ionViewDidLoad () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            }
        });
    }

    getMangasBeginBy(word) {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.getMangasBeginBy(word).then(mangas => {
            if (mangas) {
                this.mangas = mangas;
            }
            this.commonService.loadingHide();
        });
    }

    openModal(mangaId) {
        let modal = this.modalCtrl.create(MangaInfoPage, {'mangaId': mangaId});
        modal.present();
    }

}