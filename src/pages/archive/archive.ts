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
        this.showArchives();
    }

    showArchives() {
        this.mangaService.getFinishedDownloads().then(archives => {
            if (archives !== false) {
                this.archives = archives;
            }
        });
    }

}
