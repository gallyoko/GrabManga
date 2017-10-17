import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { App, NavController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Toast } from '@ionic-native/toast';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {
  private login: string = 'GrabManga';
  private urlApi: string = 'http://192.168.1.17:8000';
  private loader: any = null;

  constructor(public app: App, public navCtrl: NavController, public http: Http, public storage: Storage, public platform: Platform,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public spinnerDialog: SpinnerDialog, public toast: Toast
  ) {

  }

  getLogin() {
    return this.login;
  }

  getUrlApi() {
    return this.urlApi;
  }

  getDataApi(route, param='', autodisconnect=true) {
    return new Promise(resolve => {
      this.getToken().then(token => {
        this.http.get(this.getUrlApi() + route + token + param)
            .map(res => res.json())
            .subscribe(
                data => {
                  resolve(this.checkApiReturn(data, autodisconnect));
                },
                err => {
                  resolve(this.errorApiReturn(err));
                }
            );
      });
    });
  }
  
  checkApiReturn(data, autodisconnect=true) {
    let apiReturn = {statut: false, message: null, data: null};
    if (data.statut) {
      let token = '';
      if ( data.data.token != undefined ) {
        token = data.data.token;
      } else {
        token = data.data;
      }
      this.storage.set('token', token);
      apiReturn.statut = true;
      apiReturn.data = data.data;
    } else {
      apiReturn.statut = false;
      if (data.data == '' || data.data == undefined) {
        apiReturn.message = 'Vous êtes déconnecté.';
        if (autodisconnect) {
          this.toastShow(apiReturn.message);
          const root = this.app.getRootNav();
          root.popToRoot();
        }
      } else {
        this.storage.set('token', data.data);
      }
    }
    return apiReturn;
  }

  errorApiReturn(err) {
    let error:any = err;
    let jsonContent:any = error.json();
    let errorApiReturn = {status: false, code: error.status, message: jsonContent.message};
    return errorApiReturn;
  }

  setToken(token) {
    this.storage.set('token', token);
  }

  getToken() {
    return Promise.resolve(this.storage.get('token'));
  }

  setProfil(profil) {
    this.storage.set('profil', profil);
  }

  getProfil() {
    return Promise.resolve(this.storage.get('profil'));
  }

  loadingShow(message) {
    if (this.platform.is('cordova')) {
      this.spinnerDialog.show(null, message);
    } else {
      let loading = this.loadingCtrl.create({
        content: message
      });
      this.loader = loading;
      this.loader.present();
    }
  }

  loadingHide() {
    if (this.platform.is('cordova')) {
      this.spinnerDialog.hide();
    } else {
      this.loader.dismiss();
    }
  }

  toastShow(message) {
    if (this.platform.is('cordova')) {
      this.toast.show(message, "short", "bottom").subscribe(
          toast => {
            console.log(toast);
          }
      );
    } else {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('latitude => ' + position.coords.latitude);
      console.log('longitude => ' + position.coords.longitude);
    });
  }

  getTimestamp() {
    let date = new Date();
    let bigTimestamp = date.getTime();
    let timestamp = Math.round(bigTimestamp / 1000);
    return timestamp;
  }
}
