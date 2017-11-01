import { Injectable } from '@angular/core';
import { CommonService } from '../providers/common-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MangaService {
    private routeGetMangaByTitleBegin: any = '/mangas/search/begin';
    private routeGetMangaByTitleContent: any = '/mangas/search';
    private routeGetMangaInfo: any = '/manga/info';
    private routeGetTomesByManga: any = '/tomes/manga';
    private routeGetChaptersByManga: any = '/chapters/manga';
    private routeGetChaptersByTome: any = '/chapters/tome';
    private routeGenerateManga: any = '/generate/manga';
    private routeGenerateTome: any = '/generate/tome';
    private routeGenerateChapter: any = '/generate/chapter';
    private routeGetCurrentDownload: any = '/download/user/current';
    private routeGetWaitingDownloads: any = '/downloads/user/waiting';
    private routeGetFinishedDownloads: any = '/downloads/user/finished';
    private routeRemoveDownload: any = '/download/remove';
    private routeArchiveName: any = '/archive/name';
    private routeArchiveDownload: any = '/archive/download';
    private routeAddFavorite: any = '/favorite';
    private routeGetFavorites: any = '/favorites';
    private routeRemoveFavorite: any = '/favorite/remove';

    constructor(public http: Http, public commonService: CommonService) {
        
    }

    getMangasBeginBy(word, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetMangaByTitleBegin+'/'+token+'/'+word;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    getMangasContent(word, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetMangaByTitleContent+'/'+token+'/'+word;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    getMangaInfo(mangaId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetMangaInfo+'/'+token+'/'+mangaId;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    getTomesByManga(mangaId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetTomesByManga+'/'+token+'/'+mangaId;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    getChaptersByManga(mangaId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetChaptersByManga+'/'+token+'/'+mangaId;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    getChaptersByTome(tomeId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetChaptersByTome+'/'+token+'/'+tomeId;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    generateManga(mangaId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGenerateManga+'/'+token+'/'+mangaId;
            return this.execGenericRoute(route, 'get', {},
                true, showLoading, showToastErrMsg);
        });
    }

    generateTome(tomeId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGenerateTome+'/'+token+'/'+tomeId;
            return this.execGenericRoute(route, 'get', {},
                true, showLoading, showToastErrMsg);
        });
    }

    generateChapter(chapterId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGenerateChapter+'/'+token+'/'+chapterId;
            return this.execGenericRoute(route, 'get', {},
                true, showLoading, showToastErrMsg);
        });
    }

    getCurrentDownload(showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetCurrentDownload+'/'+token;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    getWaitingDownloads(showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetWaitingDownloads+'/'+token;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    getFinishedDownloads(showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetFinishedDownloads+'/'+token;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    removeDownload(id, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeRemoveDownload+'/'+token+'/'+id;
            return this.execGenericRoute(route, 'delete', {},
                true, showLoading, showToastErrMsg);
        });
    }

    getNameArchiveDownload(id, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeArchiveName+'/'+token+'/'+id;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
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

    addFavorite(mangaId, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeAddFavorite+'/'+token;
            let param: any = {
                "mangaId":mangaId
            };
            return this.execGenericRoute(route, 'post', param,
                true, showLoading, showToastErrMsg);
        });
    }

    getFavorites(showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeGetFavorites+'/'+token;
            return this.execGenericRoute(route, 'get', {},
                false, showLoading, showToastErrMsg);
        });
    }

    removeFavorite(id, showLoading=false, showToastErrMsg=false) {
        return this.commonService.getToken().then(token => {
            let route = this.routeRemoveFavorite+'/'+token+'/'+id;
            return this.execGenericRoute(route, 'delete', {},
                true, showLoading, showToastErrMsg);
        });
    }

    execGenericRoute(route, method, param={}, isBoolReturn=false, showLoading=false, showToastErrMsg=false) {
        return new Promise(resolve => {
            if (showLoading) {
                this.commonService.loadingShow('Please wait...');
            }
            if (method == 'get') {
                this.http.get(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            if (showLoading) {
                                this.commonService.loadingHide();
                            }
                            if(isBoolReturn) {
                                resolve(true);
                            } else {
                                resolve(response.data);
                            }
                        },
                        err => {
                            if (showLoading) {
                                this.commonService.loadingHide();
                            }
                            this.commonService.checkErrorApi(err, showToastErrMsg)
                            resolve(false);
                        }
                    );
            } else if (method == 'post') {
                let request:any = JSON.stringify(param);
                this.http.post(this.commonService.getUrlApi()+route, request)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            if (showLoading) {
                                this.commonService.loadingHide();
                            }
                            if(isBoolReturn) {
                                resolve(true);
                            } else {
                                resolve(response.data);
                            }
                        },
                        err => {
                            if (showLoading) {
                                this.commonService.loadingHide();
                            }
                            this.commonService.checkErrorApi(err, showToastErrMsg)
                            resolve(false);
                        }
                    );
            } else if (method == 'delete') {
                this.http.delete(this.commonService.getUrlApi()+route)
                    .map(res => res.json())
                    .subscribe(
                        response => {
                            this.commonService.setToken(response.token);
                            if (showLoading) {
                                this.commonService.loadingHide();
                            }
                            if(isBoolReturn) {
                                resolve(true);
                            } else {
                                resolve(response.data);
                            }
                        },
                        err => {
                            if (showLoading) {
                                this.commonService.loadingHide();
                            }
                            this.commonService.checkErrorApi(err, showToastErrMsg)
                            resolve(false);
                        }
                    );
            } else if (method == 'put') {
                //todo
            }


        });
    }
}

