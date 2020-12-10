import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';

import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http:HttpClient) { }
  getAll(){
    return this.http.get(environment.serverIp + '/task/read',{withCredentials:true});
  }
  create(data:{
    taskName:string,
    importance:string,
    listId:number,
    completed:boolean}){
      let body = `name=${data.taskName}&list_id=${data.listId}&importance=${data.importance}&completed=${data.completed}`;
      const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(environment.serverIp + '/task/create',body,{withCredentials:true,headers:header});
    }
    remove(id){
      const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.get(environment.serverIp + '/task/delete/'+ id,{withCredentials:true,headers:header});
    }
    update(data:{
      id:number,
      list_id:number
      name:string,
      importance:string,
      completed:number,
    }){
      const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let body = `name=${data.name}&id=${data.id}&importance=${data.importance}&completed=${data.completed}`;
      return this.http.post(environment.serverIp + '/task/update',body,{withCredentials:true,headers:header});
    }
  }
