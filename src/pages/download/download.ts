import { Component } from '@angular/core';
import { CommonService } from '../../providers/common-service';
import { JapscanService } from '../../providers/japscan-service';

@Component({
    selector: 'page-download',
    templateUrl: 'download.html',
    providers: [CommonService, JapscanService]
})
export class DownloadPage {

  constructor(private commonService: CommonService, private japscanService: JapscanService) {

  }
}
