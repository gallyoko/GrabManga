import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';

@Component({
    selector: 'page-download',
    templateUrl: 'download.html',
    providers: [CommonService, MangaService]
})
export class DownloadPage {

    private progress:any = 0;

    constructor(public navCtrl: NavController,
                public commonService: CommonService, public mangaService: MangaService) {
        this.loadProgress();
    }

    loadProgress() {
        return this.mangaService.getCurrentDownload().then(download => {
            let currentPageDecode = parseInt(download['currentPageDecode']);
            let countPage = parseInt(download['countPage']);
            let progress = (currentPageDecode / countPage) * 100;
            this.progress = parseInt(""+progress);
        });
    }

}
