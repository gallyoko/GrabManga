import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'page-download',
    templateUrl: 'download.html',
    providers: [CommonService, MangaService]
})
export class DownloadPage {

    private subscription:any = 0;
    private downloads:any = [];

    constructor(public navCtrl: NavController,
                public commonService: CommonService, public mangaService: MangaService) {
    }

    ionViewDidLoad () {
        this.subscription = Observable.interval(1000).subscribe(x => {
            this.loadProgress();
        });
    }

    ionViewDidLeave () {
        this.subscription.unsubscribe ();
    }

    loadProgress() {
        this.mangaService.getWaitingDownloads().then(downloads => {
            if (downloads !== false) {
                this.downloads = downloads;
            }
        });
    }

}
