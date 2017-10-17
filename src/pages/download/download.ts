import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { SecurityService } from '../../providers/security-service';
import { LoginPage } from '../login/index';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'page-download',
    templateUrl: 'download.html',
    providers: [CommonService, MangaService, SecurityService]
})
export class DownloadPage {

    private subscription:any = 0;
    private downloads:any = [];

    constructor(public navCtrl: NavController, public commonService: CommonService,
                public mangaService: MangaService, private securityService: SecurityService) {
    }

    ionViewDidLoad () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            } else {
                this.subscription = Observable.interval(1000).subscribe(x => {
                    this.loadProgress();
                });
            }
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
