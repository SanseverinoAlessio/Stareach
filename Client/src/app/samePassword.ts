import {AsyncValidator,AbstractControl,ValidationErrors} from '@angular/forms';
export function samePassword(control:AbstractControl) :{[key:string]:any}| null {
  if(control.value){
    if(control.value == control.root.get('oldPassword').value){
      return {
        equal: true,

      };
    }
    else{
      console.log('Non sono uguali');
      return null;
    }
  }
}
