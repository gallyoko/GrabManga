import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { SecurityService } from '../../providers/security-service';
import { LoginPage } from '../login/index';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'page-archive',
    templateUrl: 'archive.html',
    providers: [CommonService, MangaService, SecurityService]
})
export class ArchivePage {

    private isCurrentArchiveDownload:any = false;
    private currentArchiveIdDownload:any = 0;
    private noArchive:any = true;
    private archives:any = [];
    private fileTransfer:FileTransferObject = null;
    private subscription:any = 0;
    private filesize:any = 0;
    private progress:any = 0;
    private inProgress:any = false;

    constructor(public navCtrl: NavController, public commonService: CommonService,
                public mangaService: MangaService, private transfer: FileTransfer,
                private file: File, private localNotifications: LocalNotifications,
                private actionsheetCtrl: ActionSheetController, private alertCtrl: AlertController,
                private securityService: SecurityService) {
    }

    ionViewDidEnter () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            } else {
                this.showArchives();
                this.subscription = Observable.interval(1000).subscribe(x => {
                    this.loadProgress();
                });
            }
        });
    }

    ionViewDidLeave () {
        this.subscription.unsubscribe ();
    }

    showArchives() {
        this.mangaService.getFinishedDownloads(true, true).then(archives => {
            this.archives = archives;
            if (this.archives.length > 0 ) {
                this.noArchive = false;
            } else {
                this.noArchive = true;
            }
        });
    }

    openMenu(archive) {
        let actionSheet = this.actionsheetCtrl.create({
            title: archive.title,
            cssClass: 'action-sheets-basic-page',
            buttons: [
                                {
                    text: 'Download',
                    icon: 'download',
                    handler: () => {
                        this.download(archive);
                    }
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.showConfirmDelete(archive);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close',
                    handler: () => {
                        //console.log('Cancel clicked  ' + archive.id);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    showConfirmDelete(archive) {
        let confirm = this.alertCtrl.create({
            title: 'Suppression',
            message: 'Confirmez-vous la suppression de "'+archive.title+' - '+archive.mangaTitle+'" des archives ?',
            buttons: [
                {
                    text: 'Oui',
                    handler: () => {
                        this.remove(archive);
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

    remove(archive) {
        if (this.isCurrentArchiveDownload) {
            this.commonService.toastShow("Impossible de supprimer l'archive pendant son téléchargement");
        } else {
            this.mangaService.removeDownload(archive.id, true, true).then(remove => {
                this.showArchives();
            });
        }
    }

    download(archive) {
        this.commonService.toastShow('Lancement du téléchargement');
        this.mangaService.getNameArchiveDownload(archive.id, false, true).then(data => {
            let filename = data['name'];
            this.filesize = data['size'];
            this.mangaService.getUrlArchiveDownload(archive.id).then(url => {
                if(this.fileTransfer==null) {
                    this.inProgress = true;
                    this.isCurrentArchiveDownload = true;
                    this.currentArchiveIdDownload = archive.id;
                    this.fileTransfer = this.transfer.create();
                    this.fileTransfer.download(url.toString(), this.file.externalRootDirectory + '/Download/' + filename).then((entry) => {
                        this.localNotifications.schedule({
                            id: 1,
                            text: 'Le fichier téléchargé a été déposé sous '+ entry.toURL(),
                            sound: null
                        });
                        this.filesize = 0;
                        this.inProgress = false;
                        this.fileTransfer = null;
                        this.isCurrentArchiveDownload = false;
                        this.currentArchiveIdDownload = 0;
                    }, (error) => {
                        this.commonService.toastShow('Erreur : impossible de télécharger le fichier');
                    });
                } else {
                    this.commonService.toastShow('Veuillez patienter, un téléchargement est déjà en cours.');
                }
            });
        });
    }

    loadProgress() {
        if (this.inProgress) {
            this.fileTransfer.onProgress((progressEvent: ProgressEvent) => {
                let progress = (progressEvent.loaded / this.filesize) * 100;
                this.progress = parseInt(progress.toString());
            });
        }
    }

}
