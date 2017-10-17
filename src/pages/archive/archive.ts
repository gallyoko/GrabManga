import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'page-archive',
    templateUrl: 'archive.html',
    providers: [CommonService, MangaService]
})
export class ArchivePage {

    private archives:any = [];
    private fileTransfer:FileTransferObject = null;
    private subscription:any = 0;
    private filesize:any = 0;
    private progress:any = 0;
    private inProgress:any = false;

    constructor(public navCtrl: NavController, public commonService: CommonService,
                public mangaService: MangaService, private transfer: FileTransfer,
                private file: File, private localNotifications: LocalNotifications) {
        if(!this.fileTransfer) {
            this.fileTransfer = this.transfer.create();
        }
    }

    ionViewDidLoad () {
        this.commonService.loadingShow('Please wait...');
        this.showArchives();
        this.subscription = Observable.interval(1000).subscribe(x => {
            this.loadProgress();
        });
    }

    ionViewDidLeave () {
        this.subscription.unsubscribe ();
    }

    showArchives() {
        this.mangaService.getFinishedDownloads().then(archives => {
            this.archives = archives;
            this.commonService.loadingHide();
        });
    }

    remove(archive) {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.removeDownload(archive.id).then(remove => {
            if (!remove) {
                this.commonService.toastShow('Impossible de supprimer le téléchargement');
            }
            this.showArchives();
        });
    }

    download(archive) {
        this.commonService.toastShow('Lancement du téléchargement');
        this.commonService.loadingShow('Please wait...');
        this.mangaService.getNameArchiveDownload(archive.id).then(data => {
            if (!data) {
                this.commonService.toastShow('Impossible de récupérer le nom du fichier à télécharger');
            } else {
                let filename = data['name'];
                this.filesize = data['size'];
                this.mangaService.getUrlArchiveDownload(archive.id).then(url => {
                    this.inProgress = true;
                    this.fileTransfer.download(url.toString(), this.file.externalRootDirectory + '/Download/' + filename).then((entry) => {
                        this.localNotifications.schedule({
                            id: 1,
                            text: 'Le fichier téléchargé a été déposé sous '+ entry.toURL(),
                            sound: null
                        });
                        this.filesize = 0;
                        this.inProgress = false;
                    }, (error) => {
                        this.commonService.toastShow('Erreur : impossible de télécharger le fichier');
                    });
                });
            }
            this.commonService.loadingHide();
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
