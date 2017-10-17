import { Injectable } from '@angular/core';
import { CommonService } from '../providers/common-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MangaService {
    private routeGetMangaByTitleBegin: any = '/mangas/search/begin';
    private routeGetMangaInfo: any = '/manga/info';
    private routeGenerateManga: any = '/generate/manga';
    private routeGetCurrentDownload: any = '/download/user/current';
    private routeGetWaitingDownloads: any = '/downloads/user/waiting';
    private routeGetFinishedDownloads: any = '/downloads/user/finished';
    private routeRemoveDownload: any = '/download/remove';
    private routeArchiveName: any = '/archive/name';
    private routeArchiveDownload: any = '/archive/download';

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
                            resolve(this.commonService.checkErrorApi(err));
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
                            resolve(this.commonService.checkErrorApi(err));
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
                            resolve(this.commonService.checkErrorApi(err));
                        }
                    );
            });
        });
    }

    getCurrentDownload() {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetCurrentDownload+'/'+token;
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
                            resolve(this.commonService.checkErrorApi(err));
                        }
                    );
            });
        });
    }

    getWaitingDownloads() {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetWaitingDownloads+'/'+token;
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
                            resolve(this.commonService.checkErrorApi(err));
                        }
                    );
            });
        });
    }

    getFinishedDownloads() {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeGetFinishedDownloads+'/'+token;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            resolve(response.data);
                        },
                        err => {
                            resolve(this.commonService.checkErrorApi(err));
                        }
                    );
            });
        });
    }

    removeDownload(id) {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeRemoveDownload+'/'+token+'/'+id;
                this.http.delete(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            resolve(true);
                        },
                        err => {
                            resolve(this.commonService.checkErrorApi(err));
                        }
                    );
            });
        });
    }

    getNameArchiveDownload(id) {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route = this.routeArchiveName+'/'+token+'/'+id;
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            resolve(response.data);
                        },
                        err => {
                            resolve(this.commonService.checkErrorApi(err));
                        }
                    );
            });
        });
    }

    getUrlArchiveDownload(id) {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let route:string = this.routeArchiveDownload+'/'+token+'/'+id;
                let url:string = this.commonService.getUrlApi()+route;
                resolve(url);
            });
        });
    }
}

