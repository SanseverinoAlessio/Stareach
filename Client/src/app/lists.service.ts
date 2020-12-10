import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ListsService {
  constructor(private http:HttpClient) { }
  create(name){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = `name=${name}`;
    return  this.http.post( environment.serverIp + '/list/create',body,{withCredentials:true,headers:header});
  }
  delete(id){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(environment.serverIp +  '/list/delete/' + id,{withCredentials:true,headers:header});
  }
  update(id,name){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = 'id=' + id + '&name='+ name;
    return this.http.post(environment.serverIp + '/list/update',body,{withCredentials:true,headers:header});
  }
  getAll(){
    return this.http.get(environment.serverIp + '/list/read',{withCredentials:true});
  }
}
