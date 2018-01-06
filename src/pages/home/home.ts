import { Component } from '@angular/core';
import { MangaService } from '../../providers/manga-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [MangaService]
})
export class HomePage {

  constructor(private mangaService: MangaService) {

  }

  ionViewDidEnter () {
      this.mangaService.updateMangas().then(mangas => {
          console.log(mangas);
      });
  }

}
