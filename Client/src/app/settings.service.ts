import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private http:HttpClient) { }
  getInformation(){
    return this.http.get(environment.serverIp + '/getSessionData',{withCredentials:true});
  }
  updateInformation(data:{
    name:string,
    email:string,
  }){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = `name=${data.name}&email=${data.email}`;
    return this.http.post(environment.serverIp + '/user/updateInformation',body,{headers:header,withCredentials:true});
  }
  updatePassword(data:{
    oldPassword:string,
    newPassword:string,
  }){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = `oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`;
    return this.http.post(environment.serverIp + '/user/updatePassword',body,{headers:header,withCredentials:true} );
  }
  updateAvatar(file){
    let fileData = new FormData();
    fileData.append('avatar',file,file.name);
    return this.http.post(environment.serverIp + '/user/updateAvatar',fileData,{withCredentials:true});
  }

  deleteAvatar(){
  return this.http.get(environment.serverIp + '/user/deleteAvatar',{withCredentials:true});
  }

}
