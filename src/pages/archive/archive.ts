import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';

@Component({
    selector: 'page-archive',
    templateUrl: 'archive.html',
    providers: [CommonService, MangaService]
})
export class ArchivePage {

    private archives:any = [];

    constructor(public navCtrl: NavController,
              public commonService: CommonService, public mangaService: MangaService) {

    }

    ionViewDidLoad () {
        this.commonService.loadingShow('Please wait...');
        this.showArchives();
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
        console.log('download id='+archive.id);
    }

}
