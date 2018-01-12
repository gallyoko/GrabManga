import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { JapscanService } from '../../providers/japscan-service';
import { MangaDownloadPage } from './manga.download';

@Component({
    selector: 'page-manga-info',
    templateUrl: 'manga.info.html',
    providers: [CommonService, JapscanService]
})
export class MangaInfoPage {

    private manga:any = {};

    constructor(private navCtrl: NavController, private modalCtrl: ModalController,
                private params: NavParams, private commonService: CommonService,
                private japscanService: JapscanService) {
        this.manga = this.params.get('manga');
        this.showMangaInfo();
    }

    ionViewDidEnter () {}

    showMangaInfo() {
        this.commonService.loadingShow('Please wait...');
        this.japscanService.getMangaTomeAndChapter(this.manga).then(manga => {
            this.commonService.loadingHide();
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
