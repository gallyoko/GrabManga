import { Component } from '@angular/core';
import { CommonService } from '../../providers/common-service';
import { SecurityService } from '../../providers/security-service';
import { LoginPage } from '../login/index';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [CommonService, SecurityService]
})
export class HomePage {

  constructor(private navCtrl: NavController, private commonService: CommonService,
              private securityService: SecurityService) {

  }

  ionViewDidEnter () {
      this.securityService.checkAuth().then(auth => {
          if (!auth) {
              this.navCtrl.setRoot(LoginPage);
          }
      });
  }

}
