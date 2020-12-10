import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'completed',
  pure:false,
})
export class CompletedPipe implements PipeTransform {
  transform(val:any,id:number): any {
    let temp = [];
    val.map((val)=>{
      if(val.completed == 1 && val.list_id == id){
        temp.push(val);
      }
    });
    return temp;
  }
}
