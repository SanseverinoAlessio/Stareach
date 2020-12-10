import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterById',
  pure:false,
})
export class FilterByIdPipe implements PipeTransform {
  transform(value: any,listId:number):any {
    if(value){
    let temp = [];
    value.map((val)=>{
      if(val.list_id == listId && val.completed != 1){
        temp.push(val);
      }
    });
    return temp;
  }
}
}
