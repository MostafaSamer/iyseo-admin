import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public GetAll(url: string, headers: any) {
    return this.http.get(environment.baseUrl + url, headers)
  }

  public Update(url: string, headers: any, data: any) {
    return this.http.patch(environment.baseUrl + url, headers, data)
  }

  public Post(url: string, headers: any, data: any) {
    return this.http.post(environment.baseUrl + url, headers, data)
  }

  public Patch(url: string, headers: any, data: any) {
    return this.http.patch(environment.baseUrl + url, headers, data)
  }

}
