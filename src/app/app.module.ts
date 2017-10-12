import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/index';
import { HomePage } from '../pages/home/home';
import { MangaPage } from '../pages/manga/manga';
import { MangaInfoPage } from '../pages/manga/manga.info';
import { DownloadPage } from '../pages/download/download';
import { ArchivePage } from '../pages/archive/archive';

import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
      LoginPage,
      HomePage,
      MangaPage,
      MangaInfoPage,
      DownloadPage,
      ArchivePage,
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
      LoginPage,
      HomePage,
      MangaPage,
      MangaInfoPage,
      DownloadPage,
      ArchivePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
