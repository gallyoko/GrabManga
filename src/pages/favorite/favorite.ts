import { Component } from '@angular/core';
import { CommonService } from '../../providers/common-service';
import { SecurityService } from '../../providers/security-service';
import { MangaService } from '../../providers/manga-service';
import { LoginPage } from '../login/index';
import { MangaDownloadPage } from '../manga/manga.download';
import { NavController, ActionSheetController, ModalController } from 'ionic-angular';

@Component({
    selector: 'page-favorite',
    templateUrl: 'favorite.html',
    providers: [CommonService, SecurityService, MangaService]
})
export class FavoritePage {
    private favorites:any = [];

    constructor(private navCtrl: NavController, private commonService: CommonService,
                private securityService: SecurityService, private mangaService: MangaService,
                private actionsheetCtrl: ActionSheetController, private modalCtrl: ModalController) {

    }

    ionViewDidEnter () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            } else {
                this.commonService.loadingShow('Please wait...');
                this.showFavorites();
            }
        });
    }

    showFavorites() {
        this.mangaService.getFavorites().then(favorites => {
            if (favorites) {
                this.favorites = favorites;
            }
            this.commonService.loadingHide();
        });
    }

    openMenu(favorite) {
        let actionSheet = this.actionsheetCtrl.create({
            title: favorite.title,
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.remove(favorite);
                    }
                },
                {
                    text: 'Download',
                    icon: 'download',
                    handler: () => {
                        this.showDownload(favorite);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close',
                    handler: () => {
                        //console.log('Cancel clicked  ' + favorite.id);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    remove(favorite) {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.removeFavorite(favorite.id).then(remove => {
            if (!remove) {
                this.commonService.toastShow("Impossible de supprimer le favori");
            }
            this.showFavorites();
        });
    }

    showDownload(favorite) {
        let modal = this.modalCtrl.create(MangaDownloadPage, {'manga': favorite.manga});
        modal.present();
    }

}
