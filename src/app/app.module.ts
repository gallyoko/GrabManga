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

import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

import { JapscanService } from '../providers/japscan-service';
import { CommonService } from '../providers/common-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@NgModule({
  declarations: [
      MyApp,
      HomePage,
      MangaPage,
      MangaInfoPage,
      MangaDownloadPage,
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
      MangaDownloadPage
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
      FileOpener
  ]
})
export class AppModule {}
