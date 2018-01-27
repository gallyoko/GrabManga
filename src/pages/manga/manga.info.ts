import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    private titleIsFavorite:any = false;
    private waitCover: any = true;

    constructor(private navCtrl: NavController, private params: NavParams,
                private commonService: CommonService, private japscanService: JapscanService) {
        this.manga = this.params.get('manga');
        this.checkFavorite();
        this.showMangaInfo();
    }

    ionViewDidEnter () {
        this.waitCover = true;
        this.japscanService.getGoogleImages(this.manga.title + ' affiche').then(covers => {
            this.manga.cover = covers[1];
            this.waitCover = false;
        });
    }

    checkFavorite() {
        this.titleIsFavorite = false;
        this.commonService.checkFavorite(this.manga).then(exist => {
            this.titleIsFavorite = exist;
        });
    }

    showMangaInfo() {
        this.commonService.loadingShow('Please wait...');
        this.japscanService.getMangaTomeAndChapter(this.manga).then(manga => {
            this.commonService.loadingHide();
        });
    }

    addToFavorite() {
        this.commonService.setFavorite(this.manga).then(setFavorite => {
            if (setFavorite) {
                this.titleIsFavorite = true;
                this.commonService.toastShow('Le titre a été ajouté aux favoris.');
            } else {
                this.commonService.toastShow("Erreur : impossible d'ajouter le titre aux favoris.");
            }
        });
    }

    openModal() {
        this.navCtrl.push(MangaDownloadPage, { manga: this.manga });
    }

    closeInfo() {
        this.navCtrl.pop();
    }

}
