import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Dialogs } from '@ionic-native/dialogs';
import { MangaDownloadPage } from '../manga/manga.download';

@Component({
    selector: 'page-favorite',
    templateUrl: 'favorite.html',
    providers: [CommonService]
})
export class FavoritePage {
    private noFavorite:any = false;
    private favorites:any = [];

    constructor(public navCtrl: NavController, private commonService: CommonService,
                private actionsheetCtrl: ActionSheetController, private alertCtrl: AlertController,
                private actionSheet: ActionSheet, private platform: Platform, private dialogs: Dialogs) {

    }

    ionViewDidEnter () {
        this.noFavorite = false;
        this.showFavorites();
    }

    ionViewDidLeave () {
        this.favorites = [];
    }

    showFavorites() {
        this.favorites = [];
        this.commonService.getFavorites().then(favorites => {
            if (favorites) {
                this.favorites = favorites;
                if (this.favorites.length == 0 ) {
                    this.noFavorite = true;
                }
            } else {
                this.noFavorite = true;
            }
        });
    }

    openMenu(favorite) {
        if (this.platform.is('cordova')) {
            this.openMenuNative(favorite);
        } else {
            this.openMenuNoNative(favorite);
        }
    }

    openMenuNative(favorite) {
        let buttonLabels = ['Voir les téléchargements'];
        const options: ActionSheetOptions = {
            title: favorite.title,
            subtitle: 'Choisissez une action',
            buttonLabels: buttonLabels,
            addCancelButtonWithLabel: 'Annuler',
            addDestructiveButtonWithLabel: 'Supprimer',
            androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
            destructiveButtonLast: true
        };

        this.actionSheet.show(options).then((buttonIndex: number) => {
            if (buttonIndex==1) {
                this.openDownloadPage(favorite);
            } else if (buttonIndex==2) {
                this.showConfirmDelete(favorite);
            }
        });
    }

    openMenuNoNative(favorite) {
        let actionSheet = this.actionsheetCtrl.create({
            title: favorite.title,
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Voir les téléchargements',
                    icon: 'cloud-download',
                    handler: () => {
                        this.openDownloadPage(favorite);
                    }
                },
                {
                    text: 'Supprimer',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.showConfirmDelete(favorite);
                    }
                },
                {
                    text: 'Annuler',
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

    openDownloadPage(favorite) {
        this.navCtrl.push(MangaDownloadPage, { manga: favorite });
    }

    showConfirmDelete(favorite) {
        if (this.platform.is('cordova')) {
            this.showConfirmDeleteNative(favorite);
        } else {
            this.showConfirmDeleteNoNative(favorite);
        }
    }

    showConfirmDeleteNative(favorite) {
        this.dialogs.confirm('Confirmez-vous la suppression de "'+favorite.title + '" des favoris ?', 'Suppression')
            .then((number) => {
                    if (number==1) {
                        this.remove(favorite);
                    } else if (number==2) {
                        //console.log('cancel');
                    }
            })
            .catch(e => console.log('Error displaying dialog', e));
    }

    showConfirmDeleteNoNative(favorite) {
        let confirm = this.alertCtrl.create({
            title: 'Suppression',
            message: 'Confirmez-vous la suppression de "'+favorite.title+'" des favoris ?',
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

    remove(favorite) {
        this.commonService.removeFavorite(favorite).then(remove => {
            if (remove) {
                this.showFavorites();
            }
        });
    }
}
