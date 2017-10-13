import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.info.html',
    providers: [CommonService, MangaService]
})
export class MangaInfoPage {

    private manga:any = {};
    private mangaId:any;

    constructor(public params: NavParams, public viewCtrl: ViewController,
              public commonService: CommonService, public mangaService: MangaService) {
        this.mangaId = this.params.get('mangaId');
        this.showMangaInfo();
    }

    showMangaInfo() {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.getMangaInfo(this.mangaId).then(manga => {
            this.manga = manga;
            this.commonService.loadingHide();
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    download() {
        this.commonService.loadingShow('Please wait...');
        this.mangaService.generateManga(this.mangaId).then(generate => {
            if (generate) {
                this.commonService.toastShow('Le manga a été ajouté aux téléchargements');
            } else {
                this.commonService.toastShow("Erreur lors de l'ajout du manga aux téléchargements");
            }
            this.commonService.loadingHide();
        });
    }
}
