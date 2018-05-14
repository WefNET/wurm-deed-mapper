import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable} from 'rxjs';

@Injectable()
export class DataServiceService {

  constructor(private http: HttpClient) { }

  demoUrl = 'assets/AE.MAP';

  getSample() {
    return this.http.get(this.demoUrl, {responseType: 'text'});
  }

  
}
