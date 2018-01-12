import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, Platform, LoadingController, ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Toast } from '@ionic-native/toast';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {
  private loader: any = null;

  constructor(public app: App, public storage: Storage, public platform: Platform,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public spinnerDialog: SpinnerDialog, public toast: Toast,
              private file: File, private fileOpener: FileOpener) {}

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

  downloadPdf(name, pdfObj) {
    if (this.platform.is('cordova')) {
      pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        this.file.writeFile(this.file.dataDirectory, name+'.pdf', blob, { replace: true }).then(fileEntry => {
          this.fileOpener.open(this.file.dataDirectory + name+'.pdf', 'application/pdf');
        })
      });
    } else {
      pdfObj.download(name+'.pdf');
    }
  }
}
