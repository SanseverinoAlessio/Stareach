import {AsyncValidator,AbstractControl,ValidationErrors} from '@angular/forms';
export function CheckPass(control:AbstractControl) :{[key:string]:any}| null {
  if(control.value){
    if(control.value == control.root.get('password').value){
      return null;
    }
    else{
      return {
        notEqual:true,
      }
    }
  
  }
}
