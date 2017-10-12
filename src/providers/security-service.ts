import { Injectable } from '@angular/core';
import { CommonService } from '../providers/common-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SecurityService {
    private routeAuth: any = '/auth';
    private routeCheckAuth: any = '/auth/check';

    constructor(public http: Http, public commonService: CommonService) {
        
    }

    auth(login, password) {
        return new Promise(resolve => {
            let request: any = {
                "login":login,
                "password":password
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.commonService.getUrlApi()+this.routeAuth, param)
                .map(res => res.json())
                .subscribe(
                    response => {
                        this.commonService.setToken(response.token);
                        this.commonService.setProfil(response.profil);
                        resolve(true);
                    },
                    err => {
                        //resolve(this.commonService.errorApiReturn(err));
                        resolve(false);
                    }
                );
        });
    }

    checkAuth() {
        return new Promise(resolve => {
            this.commonService.getToken().then(token => {
                let request: any = {
                    "token": token
                };
                let param:any = JSON.stringify(request);
                this.http.post(this.commonService.getUrlApi()+this.routeCheckAuth, param)
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
}

