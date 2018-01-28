import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, Platform, LoadingController, ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Toast } from '@ionic-native/toast';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {
  private loader: any = null;

  constructor(public app: App, public storage: Storage, public platform: Platform,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public spinnerDialog: SpinnerDialog, public toast: Toast,
              private file: File, private fileOpener: FileOpener, private nativeStorage: NativeStorage) {}

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
            //console.log(toast);
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
      return new Promise(resolve => {
          let path: any = 'votre dossier de téléchargement';
          if (this.platform.is('cordova')) {
              pdfObj.getBuffer((buffer) => {
                  var blob = new Blob([buffer], { type: 'application/pdf' });
                  let filenameTmp1: any = name.replace(/ /g, '_');
                  let filenameTmp2: any = filenameTmp1.replace(/'/g, '_');
                  let filename: any = filenameTmp2.replace(/:/g, '_');
                  path = this.file.externalRootDirectory+'Download/';
                  this.file.writeFile(this.file.externalRootDirectory+'Download/', filename+'.pdf', blob, { replace: true }).then(() => {
                      this.fileOpener.open(this.file.externalRootDirectory+'Download/' + filename+'.pdf', 'application/pdf');
                      resolve({'path': path.replace('file:/', ''), 'name': filename});
                  })
              });
          } else {
              pdfObj.download(name+'.pdf');
              pdfObj = null;
              resolve({'path': path, 'name': name});
          }
      });
  }

    setTimestamp(timestamp) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('timestamp', timestamp)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('timestamp', timestamp));
        }
    }

    getTimestamp() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('timestamp')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('timestamp'));
        }
    }

    setMangas(mangas) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('mangas', mangas)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('mangas', mangas));
        }
    }

    getMangas() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('mangas')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('mangas'));
        }
    }

  setDownload(download) {
      if (this.platform.is('cordova')) {
          return this.nativeStorage.setItem('download', download)
              .then(
                  () => {
                      return Promise.resolve(true);
                  },
                  error => {
                      return Promise.resolve(false);
                  }
              );
      } else {
          return Promise.resolve(this.storage.set('download', download));
      }
  }

  getDownload() {
      if (this.platform.is('cordova')) {
          return this.nativeStorage.getItem('download')
              .then(
                  data => {
                      return Promise.resolve(data);
                  },
                  error => {
                      return Promise.resolve(false);
                  }
              );
      } else {
          return Promise.resolve(this.storage.get('download'));
      }
  }

    setFavorites(favorites) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('favorites', favorites)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('favorites', favorites));
        }
    }

    getFavorites() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('favorites')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('favorites'));
        }
    }

    setFavorite(favorite) {
        return this.getFavorites().then(favorites => {
            let favoritesToSave:any = [];
            if (favorites) {
                favoritesToSave = favorites;
            }
            favoritesToSave.push(favorite);
            return this.setFavorites(favoritesToSave).then(setFavorites => {
                return setFavorites;
            });
        });
    }

    removeFavorite(favorite) {
        return this.getFavorites().then(favorites => {
            let favoritesToSave:any = [];
            if (favorites) {
                favoritesToSave = favorites;
                for(let i = 0; i < favorites.length; i++) {
                    if (favorite.title == favorites[i].title) {
                        favoritesToSave.splice(i, 1);
                    }
                }
            }
            return this.setFavorites(favoritesToSave).then(setFavorites => {
                return setFavorites;
            });
        });
    }

    checkFavorite(favorite) {
        return this.getFavorites().then(favorites => {
            if (!favorites) {
                return false;
            }
            for(let i = 0; i < favorites.length; i++) {
                if (favorite.title == favorites[i].title) {
                    return true;
                }
            }
            return false;
        });
    }
}
