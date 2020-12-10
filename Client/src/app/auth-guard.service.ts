import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import { Router, CanActivate } from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private auth:AuthService, private router:Router) { }
  canActivate():Observable<boolean>{
    return this.auth.islogged().pipe(
      map((e)=>{
        if(e.valid == true){
          return true;
        }
        else{
        this.router.navigate(['home']);
          return false;
        }
      })
    );

  }
}
