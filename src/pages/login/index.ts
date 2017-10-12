import { Component } from '@angular/core';
import { CommonService } from '../../providers/common-service';
import { SecurityService } from '../../providers/security-service';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'index.html',
  providers: [CommonService, SecurityService]
})
export class LoginPage {
    private password: string;

    constructor(public navCtrl: NavController, public commonService: CommonService,
                public securityService: SecurityService) {
        this.init();
    }

    init() {
        this.password = '';
        this.commonService.loadingShow('Please wait...');
        this.securityService.checkAuth().then(auth => {
            if (auth) {
                this.navCtrl.setRoot(HomePage);
            } else {
                this.commonService.toastShow('Vous êtes déconnecté');
            }
            this.commonService.loadingHide();
        });
    }

    checkLogin(value) {
        this.password += value;
        if ( this.password.length == 4 ) {
            this.connect ();
        }
    }

    connect() {
        this.commonService.loadingShow('Please wait...');
        let password = this.password;
        this.password = '';
        this.securityService.auth(this.commonService.getLogin(), password).
        then(connect => {
            if (connect) {
                this.commonService.toastShow('Connecté');
                this.navCtrl.setRoot(HomePage);
            } else {
                this.commonService.toastShow("Erreur d'authentification");
            }
            this.commonService.loadingHide();
        });
    }

}
