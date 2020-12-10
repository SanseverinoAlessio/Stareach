import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) {
  }
  getEmail(email:string){
    return this.http.get<any>(environment.serverIp + '/email/' +email);
  }
  register(userAccount:{
    username:string,
    email:string,
    password:string,
    repeat_password:string,
  }){
    let body = 'username=' + userAccount.username + '&email=' + userAccount.email +
    '&password=' + userAccount.password + '&repeat_password=' + userAccount.repeat_password;
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<any>(environment.serverIp + '/register', body,{headers:header});
  }
  login(user:{
    email:string,
    password:string,
  }){
    let body = 'email=' + user.email + '&password=' + user.password;
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<any>( environment.serverIp + '/login',body,{headers:header,withCredentials:true});
  }
  logout(){
    return this.http.get<any>( environment.serverIp + '/logout',{withCredentials:true});
  }
  getSessionData(){
    return this.http.get<any>(environment.serverIp + '/getSessionData',{withCredentials:true});
  }
  sendResetPassworEmail(email:string){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = 'email='+ email;
    return this.http.post<any>(environment.serverIp + '/user/sendResetEmail',body,{headers:header});
  }
  changePassword(data:{
    password:string,
    token:string,
  })  {
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = 'password=' + data.password + '&&token=' + data.token;
    return this.http.post<any>(environment.serverIp + '/user/resetPassword', body, {headers:header});
  }
}
