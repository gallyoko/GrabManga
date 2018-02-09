import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MangaPage } from '../pages/manga/manga';
import { MangaInfoPage } from '../pages/manga/manga.info';
import { MangaDownloadPage } from '../pages/manga/manga.download';
import { FavoritePage } from '../pages/favorite/favorite';
import { DownloadPage } from '../pages/download/download';

import { ProgressBarComponent } from '../directives/progress-bar/progress-bar';

import { JapscanService } from '../providers/japscan-service';
import { CommonService } from '../providers/common-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { NativeStorage } from '@ionic-native/native-storage';
import { ActionSheet } from '@ionic-native/action-sheet';
import { Dialogs } from '@ionic-native/dialogs';

@NgModule({
  declarations: [
      MyApp,
      HomePage,
      MangaPage,
      MangaInfoPage,
      MangaDownloadPage,
      FavoritePage,
      DownloadPage,
      ProgressBarComponent
  ],
  imports: [
      BrowserModule,
      HttpModule,
      IonicModule.forRoot(MyApp),
      IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
      MyApp,
      HomePage,
      MangaPage,
      MangaInfoPage,
      MangaDownloadPage,
      FavoritePage,
      DownloadPage
  ],
  providers: [
      StatusBar,
      SplashScreen,
      Toast,
      SpinnerDialog,
      CommonService,
      JapscanService,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      File,
      FileOpener,
      NativeStorage,
      ActionSheet,
      Dialogs
  ]
})
export class AppModule {}
