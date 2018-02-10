import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, Platform, LoadingController, ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Toast } from '@ionic-native/toast';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';
import {TomeModel} from "../models/tome.model";
import {ChapterModel} from "../models/chapter.model";
import {DownloadModel} from "../models/download.model";

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
                  let blob = new Blob([buffer], { type: 'application/pdf' });
                  let filenameTmp1: any = name.replace(/ /g, '_');
                  let filenameTmp2: any = filenameTmp1.replace(/'/g, '_');
                  let filename: any = filenameTmp2.replace(/:/g, '_');
                  path = this.file.externalRootDirectory+'Download/';
                  this.file.writeFile(this.file.externalRootDirectory+'Download/', filename+'.pdf', blob, { replace: true }).then(() => {
                      pdfObj = null;
                      blob = null;
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

    setDownloadTome(title: string, tome: TomeModel, compression: boolean = true) {
        return this.getDownloads().then(getDownloads => {
            const downloads: any = getDownloads;
            let downloadsToSave:any = [];
            let order: number = 1;
            if (downloads) {
                downloadsToSave = downloads;
                order = downloads.length + 1;
            }
            let download: DownloadModel = new DownloadModel(order, title, compression, tome);
            downloadsToSave.push(download);
            return this.setDownloads(downloadsToSave).then(setDownloads => {
                return setDownloads;
            });
        });
    }

    setDownloadChapter(title: string, chapter: ChapterModel, compression: boolean = true) {
        return this.getDownloads().then(getDownloads => {
            const downloads: any = getDownloads;
            let downloadsToSave:any = [];
            let order: number = 1;
            if (downloads) {
                downloadsToSave = downloads;
                order = downloads.length + 1;
            }
            let download: DownloadModel = new DownloadModel(order, title, compression, null, chapter);
            downloadsToSave.push(download);
            return this.setDownloads(downloadsToSave).then(setDownloads => {
                return setDownloads;
            });
        });
    }

    setDownloads(downloads) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('downloads', downloads)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('downloads', downloads));
        }
    }

    getDownloads() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('downloads')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('downloads'));
        }
    }

    getCountDownload() {
        return this.getDownloads().then(getDownloads => {
            let count: number = 0;
            if (getDownloads) {
                let downloads:any = getDownloads;
                count = downloads.length;
            }
            return count;
        });
    }

    removeDownload(download: DownloadModel) {
        return this.getDownloads().then(downloads => {
            let downloadsToSave:any = [];
            if (downloads) {
                let order: number = 1;
                for(let i = 0; i < downloads.length; i++) {
                    if (download.order != downloads[i].order) {
                        let downloadToSave = downloads[i];
                        downloadToSave.order = order;
                        downloadsToSave.push(downloadToSave);
                        order++;
                    }
                }
            }
            return this.setDownloads(downloadsToSave).then(setDownloads => {
                return setDownloads;
            });
        });
    }

}
