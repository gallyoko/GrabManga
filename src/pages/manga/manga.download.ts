import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { JapscanService } from '../../providers/japscan-service';

@Component({
    selector: 'page-manga-download',
    templateUrl: 'manga.download.html',
    providers: [CommonService, JapscanService]
})
export class MangaDownloadPage {

    private manga:any = {};
    private tomeIndex:any = 0;
    private chapters:any = [];
    private chapterIndex:any = 0;

    constructor(public params: NavParams,
                public viewCtrl: ViewController, public commonService: CommonService,
                public japscanService: JapscanService) {
        this.manga = this.params.get('manga');
        this.loadChaptersInit();
    }

    loadChaptersInit() {
        const filterTome = () => {
            return this.manga.tomes.filter((tome) =>
                tome.title==''
            );
        };
        let tome = filterTome();
        if (tome.length > 0) {
            this.chapters = tome[0]['chapters'];
        }
    }

    loadChapters() {
        this.chapters = this.manga.tomes[this.tomeIndex].chapters;
    }

    downloadManga() {
        /*this.japscanService.getMangaBookImages(this.manga).then(images => {
            console.log(images);
            this.commonService.loadingHide();
        });*/
        this.commonService.loadingShow('Please wait...');
        this.japscanService.makePdf().then(pdf => {
            this.commonService.downloadPdf(pdf);
            this.commonService.loadingHide();
        });
    }

    downloadTome() {
        this.commonService.loadingShow('Please wait...');
        this.japscanService.getMangaTomeImages(this.manga.tomes[this.tomeIndex]).then(images => {
            console.log(images);
            this.commonService.loadingHide();
        });
    }

    downloadChapter() {
        this.commonService.loadingShow('Please wait...');
        this.japscanService.getMangaChapterImages(this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex]).then(images => {
            console.log(images);
            this.commonService.loadingHide();
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
