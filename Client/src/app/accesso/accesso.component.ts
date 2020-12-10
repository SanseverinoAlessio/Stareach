import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {UserService} from '../user.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {PasswordReveal} from '../password-reveal';


@Component({
  selector: 'app-accesso',
  templateUrl: './accesso.component.html',
  styleUrls: ['./accesso.component.css'],
  animations: [
    trigger('btnAnim',[
      state('startBtn', style({
        opacity:1,
        transform: 'scaleX(1)',
      })),
      state('fadeOutBtn', style({
        opacity:0,
        transform:'scaleX(0.2)',
        background:'#163F73',
      }
    )),
    transition('btnAnim <=> fadeOutBtn', [
      animate('0.2s 0s ease-out')
    ]),
  ]),
  trigger('sectionAnim',[
    transition(':enter',[
      style({
        opacity: 0,
        transform: "translateY(-10px)",
      }),
      animate('0.3s',style({
        opacity: 1,
        transform: "translateY(0px)",
      })),
    ]),
  ]),
],
})
export class AccessoComponent implements OnInit {
  public success:boolean;
  public error:string;
  public spinner:boolean;
  public animState:string;
  public loginTextBtn:string;

  userForm = new FormGroup(
    {
      email: new FormControl('',[
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('',[
        Validators.required,
      ]),
    }
  );
  constructor( private user:UserService,private router:Router) {
    this.loginTextBtn = 'Accedi';
    this.spinner = false;
    this.success = false;
    this.error = '';
    this.animState = 'startBtn';
  }
  isValid():boolean{
    if(!this.userForm.valid){
      return true;
    }
    else{
      return false;
    }
  }
  submit():void{
    if(this.userForm.valid && this.animState !=='error' ){
      this.buttonAnimationStart('fadeOutBtn');
      let user = {
        email: this.userForm.value.email,
        password: this.userForm.value.password,
      }
      setTimeout(() => {
        this.user.login(user).subscribe(res=>{
          this.logged();
        }, (err:any)=>{
          if(err.status == 404 || err.status == 401){
            this.buttonAnimationStart('error');
            this.error = "Controlla l'email o la password";
          }
        } )
      }, 700);
    }
    else{
      return;
    }
  }
  logged():void{
    this.error = '';
    this.success = true;
    this.buttonAnimationStart('startBtn');
    console.log('accesso effettuato con successo!');
  }
  ngOnInit(): void {
  }
  buttonAnimationStart(anim:string) :void{
    if(anim == 'fadeOutBtn'){
      this.animState = anim;
      this.loginTextBtn = '';
      this.spinner = true;
    }
    else if(anim == 'startBtn'){
      console.log('success');
      this.animState = anim;
      setTimeout(() => {
        this.loginTextBtn = 'Login effettuato';
      },200);
      setTimeout(() => {
        this.Redirect();
      }, 800);
    }
    else if(anim == 'error'){
      console.log('error');
      this.animState = anim;
      setTimeout(() => {
        this.spinner = false;
        this.loginTextBtn = 'Errore';
      },200);
      setTimeout(() => {
        this.loginTextBtn = 'Accedi';
        this.animState = 'startBtn';
      }, 1500);
    }
  }
  Password_toggle($event):void{
    let e:any = event;
    let icon = e.target;
    let input = $(icon).prev()[0];
    PasswordReveal.toggle(icon,input);

  }
  Redirect(){
    this.router.navigate(['account/tasks']);
  }
}
