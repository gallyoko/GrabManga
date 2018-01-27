import { Component } from '@angular/core';
import { CommonService } from '../../providers/common-service';
import { JapscanService } from '../../providers/japscan-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [CommonService, JapscanService]
})
export class HomePage {

  constructor(private commonService: CommonService, private japscanService: JapscanService) {
      let timestampToCheck: any = Math.floor(Date.now() / 1000);
      this.commonService.getTimestamp().then(timestamp => {
          if (!timestamp) {
              timestamp = timestampToCheck;
          }
          if (timestampToCheck - timestamp > 86400) {
              this.updateMangas();
          } else {
              this.commonService.getMangas().then(mangas => {
                  if (!mangas) {
                      this.updateMangas();
                  }
              });
          }
      });
  }

  updateMangas() {
      this.commonService.loadingShow('Mise à jour de la liste des mangas...');
      this.japscanService.getMangas().then(mangas => {
          if (!mangas) {
              this.commonService.toastShow('Erreur lors de la récupération des titres manga. La mise à jour a échoué.');
          } else {
              this.commonService.setMangas(mangas).then(setMangas => {
                  if (!setMangas) {
                      this.commonService.toastShow('Erreur : impossible d\'enregistrer la liste de mangas. La mise à jour a échoué.');
                  }
              });
          }
          let timestampToCheck: any = Math.floor(Date.now() / 1000);
          this.commonService.setTimestamp(timestampToCheck).then(setTimestamp => {
              if (!setTimestamp) {
                  this.commonService.toastShow('Erreur : impossible d\'enregistrer la date de mise à jour.');
              }
          });
          this.commonService.loadingHide();
      });
  }
}
