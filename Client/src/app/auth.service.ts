import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }
  islogged(){
    return this.http.get<any>(environment.serverIp + '/islogged',{withCredentials:true});
  }
}
