import * as $ from 'jquery';
export class PasswordReveal {
  static toggle(icon:any,input:any){
    let src = $(icon).attr('src');
    if($(input).attr('type') == 'password'){
      var newSrc = src.replace('reveal-off','reveal-on');
      $(input).attr('type','text');
    }
    else{
      var newSrc = src.replace('reveal-on','reveal-off');
      $(input).attr('type','password');
    }
    $(icon).attr('src',newSrc);
  }
}
