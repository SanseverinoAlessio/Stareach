import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import { Router, CanActivate } from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class IsLoggedService implements CanActivate {

  constructor(private auth:AuthService, private router:Router) {
  }
  canActivate():Observable<boolean>{
    return this.auth.islogged().pipe(
      map((e)=>{
        if(e.valid == true){
          this.router.navigate(['account/tasks']);
          return false;
        }
        else{
          return true;
        }
      })
    );

  }




}
