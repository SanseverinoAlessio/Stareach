import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {SettingsService} from '../settings.service';
import {UserService} from '../user.service';
import {SharedService} from '../shared-service.service';
import {checkNewPass} from '../repeat_new_password';
import {samePassword} from '../samePassword';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import * as $ from 'jquery';
import {PasswordReveal} from '../password-reveal';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [
    trigger('sectionAnim',[
      transition(":enter",[
        style({
          transform: "translateY(-10px)",
          opacity: 0,
          position:"absolute",

        }),
        animate('0.3s 0.2s',style({
          transform: "translateY(0px)",
          position:"relative",
          opacity: 1,
        })),
      ]),
      transition(':leave',[
        style({
          transform: "translateY(0px)",
          position:"absolute",
          opacity: 1,
        }),
        animate('0.3s',style({
          transform: "translateY(-10px)",

          position:"absolute",
          opacity: 0,
          //  transform: "translateY(-10px)",
        })),
      ]),
    ]),],
  })
  export class SettingsComponent implements OnInit {
    avatarPreview:string;
    avatarImg:any;
    avatar:string;
    email:string;
    name:string;
    success:boolean;
    loading:boolean;
    error:string;
    avatarError:string;
    public informationForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
      ]),
      email: new FormControl('',[
        Validators.required,
        Validators.email
      ]),
    });
    public passwordForm = new FormGroup({
      oldPassword: new FormControl('',[
        Validators.pattern('^[A-Z]\\w+(\\d{1}\\w+)$'),
        Validators.required,
      ]),
      newPassword: new FormControl('',[
        Validators.pattern('^[A-Z]\\w+(\\d{1}\\w+)$'),
        Validators.required,
        samePassword,
      ]),
      repeatNewPassword: new FormControl('',[
        Validators.required,
        checkNewPass,
      ]),
    })
    section;
    constructor(private settings:SettingsService,private shared:SharedService,private user:UserService) {
      this.avatarError = '';
      this.success = false;
      this.error = '';
      this.section = 'Informazioni';
      this.loading = false;
      this.passwordForm.get('newPassword').valueChanges.subscribe((val)=>{
        this.passwordForm.get('repeatNewPassword').updateValueAndValidity();
      })
    }
    ngOnInit(): void {
      this.getInformation();
      this.user.getSessionData().subscribe((data:any)=>{
        this.avatarPreview = data.avatar || '../../assets/Images/avatar_placeholder.png';
        this.avatar = data.avatar || '../../assets/Images/avatar_placeholder.png';
      },
      err=>{
      })
    }
    getInformation(){
      this.settings.getInformation().subscribe((res:any)=>{
        this.informationForm['controls']['name'].setValue(res.name);
        this.informationForm['controls']['email'].setValue(res.email);
      },err=>{
      });
    }
    avatarFileChange($event){
      let e:any = event;
      let file = e.srcElement.files[0];
      if(file != undefined && (file.size/1024)/1024 <  200){
        let regex = new RegExp("\/(gif|jpe?g|tiff?|png|webp|bmp)");
        if(regex.exec(file.type)){
          this.avatarImg = file;
          let fileReader = new FileReader();
          this.avatarError = "";
          fileReader.onloadend = (data:any)=>{
            let url = data.currentTarget.result;
            this.avatarPreview = url;
          }
          fileReader.readAsDataURL(file);
        }
        else{
          this.avatarImg = undefined;
          this.avatarPreview = '';
          this.avatarError = "Il file non è un'immagine";
        }
      }
      else{
        this.avatarImg = undefined;
        this.avatarPreview = '';
        this.avatarError = 'Il file è troppo grande';
      }
    }
    changeInformation(){
      if(this.informationForm.valid){
        this.loading = true;
        var data = {
          name: this.informationForm.value.name,
          email: this.informationForm.value.email,
        }
        this.settings.updateInformation(data).subscribe((res:any)=>{
          this.loading = false;
          this.shared.nameChange(data.name);
        },err=>{
        })
      }
    }
    changePassword(){
      if(this.passwordForm.valid){
        let data = {
          oldPassword: this.passwordForm.value.oldPassword,
          newPassword: this.passwordForm.value.newPassword,
        }
        this.loading = true;
        this.settings.updatePassword(data).subscribe((e:any)=>{
          if(e.success != undefined ){
            this.passwordForm.reset();
            this.error = '';
            this.success = true;
          }
          else{
            if(e.errore != undefined){
              this.error = e.errore;
            }
            else if(e.same != undefined){
              this.error = e.same;
            }
          }
          this.loading = false;
        },err=>{
          this.loading = false;
          this.error = 'Problemi con il token';
        });
      }
    }
    changeAvatar(){
      if(this.avatarImg != undefined){
        this.loading = true;
        this.settings.updateAvatar(this.avatarImg).subscribe((e:any)=>{
          this.loading = false;
          if(e.url != undefined){
            this.avatar = e.url;
            this.shared.avatarChange(this.avatar);
            this.avatarImg = undefined;
          }
        },err=>{

          this.loading = false;
        });
      }
    }
    deleteAvatar(){
      this.loading = true;
      this.settings.deleteAvatar().subscribe((e:any)=>{
        this.avatarPreview = '../../assets/Images/avatar_placeholder.png';
        this.avatar = '../../assets/Images/avatar_placeholder.png';
        this.shared.avatarChange(this.avatar);
        this.loading = false;
      },err=>{
        this.loading = false;
      });
    }
    changeSection(section:string){
      if(section !== this.section){
        this.passwordForm.reset();
        this.success = false;
        this.error = '';
        this.section = section;
      }
      else{
        return;
      }
    }
    Password_toggle($event){
      let e:any = event;
      let icon = e.target;
      let input = $(e.target).prev()[0];
      PasswordReveal.toggle(icon,input);
    }
  }
