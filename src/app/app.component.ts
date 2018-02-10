import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { MangaPage } from '../pages/manga/manga';
import { FavoritePage } from '../pages/favorite/favorite';
import { DownloadPage } from '../pages/download/download';

import { CommonService } from '../providers/common-service';

import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    private timer: any;
    private callTimer: any;

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: string, badge: boolean, badgeValue: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen, private commonService: CommonService) {
      this.timer = 1000;
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.commonService.getCountDownload().then(count => {
      this.pages = [
          { title: 'Accueil', component: HomePage, icon:'home', badge: false, badgeValue: null },
          { title: 'Recherche', component: MangaPage, icon:'search', badge: false, badgeValue: null },
          { title: 'Favoris', component: FavoritePage, icon:'bookmarks', badge: false, badgeValue: null },
          { title: 'Téléchargement', component: DownloadPage, icon:'download', badge: true, badgeValue: count }
      ];
    });
    this.callTimer = this.startTimer().subscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  startTimer = () => {
    return IntervalObservable
      .create(this.timer)
      .map((i) => this.setCountDownload())
  }

  setCountDownload() {
      this.commonService.getCountDownload().then(count => {
          this.pages[3].badgeValue = count;
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
