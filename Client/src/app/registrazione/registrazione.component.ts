import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {CheckPass} from '../password-repeat-validator';
import {UserService} from '../user.service';
import {uniqueEmail} from '../unique-email';
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
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css'],
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
export class RegistrazioneComponent implements OnInit {
  public buttonState:string;
  public completed:boolean;
  public registerForm:any;
  public spinner:boolean;
  public registerTextBtn:string;
  constructor(private uniqueEmailValidator:uniqueEmail, private user:UserService,
    private router:Router) {
      this.buttonState = 'startBtn';
      this.registerTextBtn = 'Registrati';
      this.completed = false;
      this.spinner = false;
      this.registerForm = new FormGroup({
        nome: new FormControl('',[
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ]),
        email: new FormControl('',[
          Validators.email,
          Validators.required,
        ],
        [
          this.uniqueEmailValidator.emailValidate(),
        ]
      ),
      password: new FormControl('',[
        Validators.required,
        Validators.pattern('^[A-Z]\\w+(\\d{1}\\w+)$'),
      ]),
      repeat_password: new FormControl('',[
        Validators.required,
        CheckPass,
      ]),
    });
    this.registerForm.get('password').valueChanges.subscribe((val)=>{
      this.registerForm.get('repeat_password').updateValueAndValidity();

    });
  }
  submit(){
    if(this.registerForm.valid){
      this.buttonAnimationStart('fadeOutBtn');
      let user = {
        username: this.registerForm.value.nome,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        repeat_password: this.registerForm.value.repeat_password,
      }
      setTimeout(() => {
        this.user.register(user).subscribe(res=>{
          if(res.success !== undefined){
            this.registerCompleted();
          }
        });
      }, 1000);

    }
    else{
      return;
    }
  }
  isValid(){
    if(this.registerForm.valid){
      return false;
    }
    else{
      return true;
    }
  }
  ngOnInit(): void {
  }
  registerCompleted() :void{
    this.registerForm.reset();
    this.spinner = false;
    this.buttonAnimationStart('startBtn');
    this.completed = true;

    setTimeout(() => {
      this.router.navigate(['accedi']);
    }, 1500);
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
        this.registerTextBtn = 'Success';
      },200);
    }
  }
  Password_toggle($event):void{
    let e:any = event;
    let icon = event.target;
    let input = $(icon).prev()[0];
    PasswordReveal.toggle(icon,input);
  }
}
