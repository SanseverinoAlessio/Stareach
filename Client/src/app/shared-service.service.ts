import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private subj = new Subject<string>();
  private subjAvatar = new Subject<string>();
  nameChangeOb = this.subj.asObservable();
  avatarChangeOb = this.subjAvatar.asObservable();
  nameChange(value:string){
    this.subj.next(value);
  }
  avatarChange(value:string){
    this.subjAvatar.next(value);
  }


  constructor() { }
}
