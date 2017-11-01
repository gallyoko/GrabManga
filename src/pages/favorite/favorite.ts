import { NavController, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { CommonService } from '../../providers/common-service';
import { SecurityService } from '../../providers/security-service';
import { MangaService } from '../../providers/manga-service';
import { LoginPage } from '../login/index';
import { MangaDownloadPage } from '../manga/manga.download';
import { MangaInfoPage } from '../manga/manga.info';

@Component({
    selector: 'page-favorite',
    templateUrl: 'favorite.html',
    providers: [CommonService, SecurityService, MangaService]
})
export class FavoritePage {
    private favorites:any = [];

    constructor(private navCtrl: NavController, private commonService: CommonService,
                private securityService: SecurityService, private mangaService: MangaService,
                private actionsheetCtrl: ActionSheetController, private modalCtrl: ModalController,
                private alertCtrl: AlertController) {

    }

    ionViewDidEnter () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            } else {
                this.showFavorites();
            }
        });
    }

    showFavorites() {
        this.mangaService.getFavorites(true, true).then(favorites => {
            this.favorites = favorites;
        });
    }

    openMenu(favorite) {
        let actionSheet = this.actionsheetCtrl.create({
            title: favorite.manga.title,
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Information',
                    icon: 'md-information-circle',
                    handler: () => {
                        this.showInfo(favorite);
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
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.showConfirmDelete(favorite);
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
        this.mangaService.removeFavorite(favorite.id, false, true).then(favorites => {
            this.showFavorites();
        });
    }

    showDownload(favorite) {
        let modal = this.modalCtrl.create(MangaDownloadPage, {'manga': favorite.manga});
        modal.present();
    }

    showInfo(favorite) {
        this.navCtrl.push(MangaInfoPage, {'mangaId': favorite.manga.id});
    }

    showConfirmDelete(favorite) {
        let confirm = this.alertCtrl.create({
            title: 'Suppression',
            message: 'Confirmez-vous la suppression de "'+favorite.manga.title+'" des favoris ?',
            buttons: [
                {
                    text: 'Oui',
                    handler: () => {
                        this.remove(favorite);
                    }
                },
                {
                    text: 'Non',
                    handler: () => {
                        //console.log('Non');
                    }
                }
            ]
        });
        confirm.present();
    }

}
