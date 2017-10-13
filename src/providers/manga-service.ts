import { Injectable } from '@angular/core';
import { CommonService } from '../providers/common-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MangaService {
    private routeGetMangaByTitleBegin: any = '/mangas/search/begin';
    private routeGetMangaInfo: any = '/manga/info';
    private routeGenerateManga: any = '/generate/manga';
    private routeGetCurrentDowload: any = '/download/user/current';
    private routeGetWaitingDowloads: any = '/downloads/user/waiting';
    private routeGetFinishedDowloads: any = '/downloads/user/finished';

    constructor(public http: Http, public commonService: CommonService) {
        
    }

    getMangasBeginBy(word) {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetMangaByTitleBegin+'/'+token+'/'+word;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            resolve(response.data);
                        },
                        err => {
                            //resolve(this.commonService.errorApiReturn(err));
                            resolve(false);
                        }
                    );
            });

        });

    }

    getMangaInfo(mangaId) {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetMangaInfo+'/'+token+'/'+mangaId;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            resolve(response.data);
                        },
                        err => {
                            //resolve(this.commonService.errorApiReturn(err));
                            resolve(false);
                        }
                    );
            });

        });
    }

    generateManga(mangaId) {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGenerateManga+'/'+token+'/'+mangaId;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            resolve(true);
                        },
                        err => {
                            //resolve(this.commonService.errorApiReturn(err));
                            resolve(false);
                        }
                    );
            });
        });
    }

    getCurrentDownload() {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetCurrentDowload+'/'+token;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            if (response.data) {
                                resolve(response.data);
                            } else {
                                resolve(false);
                            }
                        },
                        err => {
                            //resolve(this.commonService.errorApiReturn(err));
                            resolve(false);
                        }
                    );
            });
        });
    }

    getWaitingDownloads() {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetWaitingDowloads+'/'+token;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            if (response.data) {
                                resolve(response.data);
                            } else {
                                resolve(false);
                            }
                        },
                        err => {
                            //resolve(this.commonService.errorApiReturn(err));
                            resolve(false);
                        }
                    );
            });
        });
    }

    getFinishedDownloads() {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetFinishedDowloads+'/'+token;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            if (response.data) {
                                resolve(response.data);
                            } else {
                                resolve(false);
                            }
                        },
                        err => {
                            //resolve(this.commonService.errorApiReturn(err));
                            resolve(false);
                        }
                    );
            });
        });
    }
}

