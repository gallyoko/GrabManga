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
    private tomeIndex:any;
    private chapters:any = [];
    private chapterIndex:any;
    private showChapters: any = false;

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
            if (this.chapters.length > 0) {
                this.showChapters = true;
            } else {
                this.showChapters = false;
            }
        }
    }

    loadChapters() {
        this.chapters = this.manga.tomes[this.tomeIndex].chapters;
        if (this.chapters.length > 0) {
            this.showChapters = true;
        } else {
            this.showChapters = false;
        }
    }

    downloadTome() {
        if (this.tomeIndex) {
            this.commonService.loadingShow('Please wait...');
            this.japscanService.getMangaTomeImages(this.manga.tomes[this.tomeIndex]).subscribe(imagesToOrder => {
                if (imagesToOrder) {
                    this.japscanService.makePdfTome().then(pdf => {
                        const name: string = this.manga.title + '_' +
                            this.manga.tomes[this.tomeIndex].title;
                        this.commonService.downloadPdf(name, pdf);
                        this.commonService.loadingHide();
                    });
                }

            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un tome.');
        }
    }

    downloadChapter() {
        if (this.chapterIndex) {
            this.commonService.loadingShow('Please wait...');
            this.japscanService.getMangaChapterImages(this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex]).subscribe(images => {
                this.japscanService.makePdfChapter(images).then(pdf => {
                    const name: string = this.manga.title + '_' +
                        this.manga.tomes[this.tomeIndex].chapters[this.chapterIndex].title;
                    this.commonService.downloadPdf(name, pdf);
                    this.commonService.loadingHide();
                });
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner un chapitre.');
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
