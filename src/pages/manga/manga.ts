import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { MangaInfoPage } from './manga.info';

@Component({
    selector: 'page-manga',
    templateUrl: 'manga.html',
    providers: [CommonService]
})
export class MangaPage {
    private paginatorAlpha:any = [];
    private mangaList:any = [];
    private mangas:any = [];

    constructor(private navCtrl: NavController, private commonService: CommonService) {
        this.paginatorAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'
            , 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.commonService.getMangas().then(mangas => {
            if (mangas) {
                this.mangaList = mangas;
            } else {
                this.commonService.toastShow('Impossible d\'afficher le liste.');
            }
        });
    }

    getMangasBeginBy(word) {
        const filterTitle = (request) => {
            return this.mangaList.filter((manga) =>
                manga.title.toLowerCase().indexOf(request.toLowerCase()) == 0
            );
        };
        this.mangas = filterTitle(word);
    }

    getMangasContent(event) {
        let value = event.target.value;
        if (value && value.trim() != '' && value.length > 2) {
            const filterTitle = (request) => {
                return this.mangaList.filter((manga) =>
                    manga.title.toLowerCase().indexOf(request.toLowerCase()) > -1
                );
            };
            this.mangas = filterTitle(value);
        } else {
            this.mangas = [];
        }
    }

    showInfo(manga) {
        this.navCtrl.push(MangaInfoPage, {'manga': manga});
    }


}