import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {UserService} from '../user.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {CheckPass} from '../password-repeat-validator';
import {PasswordReveal} from '../password-reveal';
import * as $ from 'jquery';
@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.css'],
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
        opacity:1,
        transform: "translateY(0px)",
      })),
    ]),
  ]),
],
})
export class RequestPasswordComponent implements OnInit {
  requestForm = new FormGroup({
    email: new FormControl('',[
      Validators.email,
      Validators.required,
    ])
  });
  passwordForm = new FormGroup({
    password: new FormControl('',[
      Validators.required,
      Validators.pattern('^[A-Z]\\w+(\\d{1}\\w+)$'),
    ]),
    repeat_password: new FormControl('',[
      Validators.required,
      CheckPass,
    ]),
  })
  public spinner:boolean;
  public registerTextBtn:string;
  success:boolean;
  requestButton;
  token;
  buttonState:string;
  passwordButton:string;
  passwordResetError:string;
  sendEmailError:string;
  constructor(private user:UserService, private route:ActivatedRoute,private router:Router) {
    this.sendEmailError = '';
    this.passwordResetError = '';
    this.buttonState = 'startBtn';
    this.token = this.route.snapshot.params['token'];
    this.success = false;
    this.spinner = false;
    this.requestButton = 'Invia';
    this.passwordButton = 'Conferma';
    this.passwordForm.get('password').valueChanges.subscribe((val)=>{
      this.passwordForm.get('repeat_password').updateValueAndValidity();
    });
  }
  ngOnInit(): void {
  }
  requestFormValid(){
    if(this.requestForm.valid){
      return false;
    }
    else{
      return true;
    }
  }
  passwordFormValid(){
    if(this.passwordForm.valid){
      return false;
    }
    else{
      return true;
    }
  }
  submitEmail(){
    if(this.requestForm.valid && this.buttonState != 'error' && this.success != true){
      let email = this.requestForm.value.email;
      this.buttonAnimationStart('fadeOutBtn');
      this.spinner = true;
      this.user.sendResetPassworEmail(email).subscribe((res)=>{
        if( res.success != undefined && res.success == true){
          this.requestCompleted();
        }
      }, (err:any)=>{
        if(err.status == 404){
          this.sendEmailError = "L'email non è associata ad alcun account";
          this.requestError();
        }
      })
    }
  }
  submitPasswordRequest(){
    if(this.passwordForm.valid && this.buttonState != 'error' && this.success != true){
      let data = {
        password: this.passwordForm.value.password,
        token: this.token,
      };
      this.buttonAnimationStart('fadeOutBtn');
      this.spinner = true;
      this.user.changePassword(data).subscribe((res:any)=>{
        if(res.success != undefined){
          this.requestCompleted();
        }
        else{
          this.passwordResetError = res.error;
          this.requestError();
        }
      }, (err:any)=>{
        if(err.status == 404){
          this.passwordResetError = 'La richiesta non è stata trovata';
          this.requestError();
        }
      });
    }
  }
  requestCompleted() :void{
    this.passwordResetError = '';
    this.sendEmailError = '';
    this.requestForm.reset();
    this.spinner = false;
    this.buttonAnimationStart('startBtn');
    this.success = true;
    setTimeout(() => {
      this.router.navigate(['accedi']);
    }, 1500);
  }
  requestError():void{
    this.spinner = false;
    this.buttonAnimationStart('error');
  }
  passwordToggle($event){
    let e:any = event;
    let icon = event.target;
    let input = $(icon).prev()[0];
    PasswordReveal.toggle(icon,input);
  }

  buttonAnimationStart(anim:string) :void{
    if(anim == 'fadeOutBtn'){
      this.buttonState = anim;
      this.registerTextBtn = '';
      this.spinner = true;
    }
    else if(anim == 'startBtn'){
      this.buttonState = anim;
      setTimeout(() => {
        this.requestButton = 'Completato';
      },200);
    }
    else if(anim == 'error'){
      this.buttonState = anim;
      setTimeout(() => {
        this.requestButton = 'Errore';
        this.passwordButton = 'Errore';
      },200);
      setTimeout(() => {
        this.requestButton = 'Invia';
        this.passwordButton = 'Conferma';
        this.buttonState = 'startBtn';
      }, 1500);
    }
  }
}
