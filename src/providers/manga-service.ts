import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MangaService {

    constructor(public http: Http) {
        
    }

    updateMangas() {
        return new Promise(resolve => {
            resolve("ok update");
        });
    }


}

