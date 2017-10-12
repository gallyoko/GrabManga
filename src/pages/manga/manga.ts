import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { MangaInfoPage } from './manga.info';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.html',
    providers: [CommonService, MangaService]
})
export class MangaPage {

    private paginatorAlpha:any = [];
    private mangas:any = [];

    constructor(public navCtrl: NavController, public modalCtrl: ModalController,
                public commonService: CommonService, public mangaService: MangaService) {
        this.paginatorAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'
            , 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    }

    getMangasBeginBy(word) {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.getMangasBeginBy(word).then(mangas => {
            this.mangas = mangas;
            this.commonService.loadingHide();
        });
    }

    openModal(mangaId) {
        let modal = this.modalCtrl.create(MangaInfoPage, {'mangaId': mangaId});
        modal.present();
    }

}