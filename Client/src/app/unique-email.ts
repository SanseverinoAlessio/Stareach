import { AbstractControl, ValidationErrors,AsyncValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import {UserService} from './user.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class uniqueEmail {
  constructor(private user:UserService) {
  }
  emailValidate() : AsyncValidatorFn {
    return (control:AbstractControl): Observable<{[key:string] :any} | null>  =>{
      return this.user.getEmail(control.value).pipe(map((e)=>{
        return e.value == true ? {uniqueEmail:true} : null;
      }));
    }
  }
}
