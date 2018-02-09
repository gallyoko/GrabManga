import { Component } from '@angular/core';
import { ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Dialogs } from '@ionic-native/dialogs';
import { CommonService } from '../../providers/common-service';
import { JapscanService } from '../../providers/japscan-service';

@Component({
    selector: 'page-download',
    templateUrl: 'download.html',
    providers: [CommonService, JapscanService]
})
export class DownloadPage {
    private downloads: any = [];
    private noDownload:any = false;

    constructor(private commonService: CommonService, private japscanService: JapscanService,
                private actionsheetCtrl: ActionSheetController, private alertCtrl: AlertController,
                private actionSheet: ActionSheet, private platform: Platform, private dialogs: Dialogs) {

    }

    ionViewDidEnter () {
        this.noDownload = false;
        this.showDownloads();
    }

    ionViewDidLeave () {
        this.downloads = [];
    }

    showDownloads() {
        this.downloads = [];
        this.commonService.getDownloads().then(downloads => {
            if (downloads) {
                this.downloads = downloads;
                if (this.downloads.length == 0 ) {
                    this.noDownload = true;
                }
            } else {
                this.noDownload = true;
            }
        });
    }

    openMenu(download) {
        if (this.platform.is('cordova')) {
            this.openMenuNative(download);
        } else {
            this.openMenuNoNative(download);
        }
    }

    openMenuNative(download) {
        let buttonLabels = ['Voir le détail'];
        const options: ActionSheetOptions = {
            title: download.title,
            subtitle: 'Choisissez une action',
            buttonLabels: buttonLabels,
            addCancelButtonWithLabel: 'Annuler',
            addDestructiveButtonWithLabel: 'Supprimer',
            androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
            destructiveButtonLast: true
        };

        this.actionSheet.show(options).then((buttonIndex: number) => {
            if (buttonIndex==1) {
                // this.openDownloadPage(favorite);
            } else if (buttonIndex==2) {
                this.showConfirmDelete(download);
            }
        });
    }

    openMenuNoNative(download) {
        let actionSheet = this.actionsheetCtrl.create({
            title: download.title,
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Voir le détail',
                    icon: 'cloud-download',
                    handler: () => {
                        //this.openDownloadPage(favorite);
                    }
                },
                {
                    text: 'Supprimer',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.showConfirmDelete(download);
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

    showConfirmDelete(download) {
        if (this.platform.is('cordova')) {
            this.showConfirmDeleteNative(download);
        } else {
            this.showConfirmDeleteNoNative(download);
        }
    }

    showConfirmDeleteNative(download) {
        this.dialogs.confirm('Confirmez-vous la suppression de "'+download.title + '" des téléchargemens ?', 'Suppression')
            .then((number) => {
                if (number==1) {
                    this.remove(download);
                } else if (number==2) {
                    //console.log('cancel');
                }
            })
            .catch(e => console.log('Error displaying dialog', e));
    }

    showConfirmDeleteNoNative(download) {
        let confirm = this.alertCtrl.create({
            title: 'Suppression',
            message: 'Confirmez-vous la suppression de "'+download.title+'" des téléchargemens ?',
            buttons: [
                {
                    text: 'Oui',
                    handler: () => {
                        this.remove(download);
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

    remove(download) {
        this.commonService.removeDownload(download).then(remove => {
            if (remove) {
                this.showDownloads();
            }
        });
    }
}
