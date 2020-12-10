import {AsyncValidator,AbstractControl,ValidationErrors} from '@angular/forms';
export function checkNewPass(control:AbstractControl) :{[key:string]:any}| null {
  if(control.value){
    if(control.value == control.root.get('newPassword').value){
      return null;
    }
    else{
      return {
        notEqual:true,
      }
    }
  }
}
