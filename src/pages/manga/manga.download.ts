import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaService } from '../../providers/manga-service';

@Component({
    selector: 'page-manga-download',
    templateUrl: 'manga.download.html',
    providers: [CommonService, MangaService]
})
export class MangaDownloadPage {

    private manga:any = {};
    private tomes:any = [];
    private tomeId:any = 0;
    private chapters:any = [];
    private chapterId:any = 0;

    constructor(private navCtrl: NavController, public params: NavParams,
                public viewCtrl: ViewController, public commonService: CommonService,
                public mangaService: MangaService) {
        this.manga = this.params.get('manga');
    }

    ionViewDidEnter () {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
