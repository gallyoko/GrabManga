import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, Platform, LoadingController, ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Toast } from '@ionic-native/toast';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {
  private loader: any = null;

  constructor(public app: App, public storage: Storage, public platform: Platform,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public spinnerDialog: SpinnerDialog, public toast: Toast) {}

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
}
