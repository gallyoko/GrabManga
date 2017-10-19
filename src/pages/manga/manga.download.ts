import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';
import { SecurityService } from '../../providers/security-service';
import { LoginPage } from '../login/index';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.download.html',
    providers: [CommonService, MangaService, SecurityService]
})
export class MangaDownloadPage {

    private manga:any = {};

    constructor(private navCtrl: NavController, public params: NavParams,
                public viewCtrl: ViewController, public commonService: CommonService,
                public mangaService: MangaService, private securityService: SecurityService) {
        this.manga = this.params.get('manga');
    }

    ionViewDidLoad () {
        this.securityService.checkAuth().then(auth => {
            if (!auth) {
                this.navCtrl.setRoot(LoginPage);
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    download() {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.generateManga(this.manga.id).then(generate => {
            if (generate) {
                this.commonService.toastShow('Le manga a été ajouté aux téléchargements');
            } else {
                this.commonService.toastShow("Erreur lors de l'ajout du manga aux téléchargements");
            }
            this.commonService.loadingHide();
        });
    }
}
