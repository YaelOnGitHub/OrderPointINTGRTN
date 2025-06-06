import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusItemFilter'
})
export class StatusItemFilterPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter || filter === '[All]') {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.status === Number(filter));
    // return items.filter(item => item.status.indexOf(filter.status) !== -1);
  }

}



// Order Type Filter

@Pipe({
  name: 'orderTypeItemFilter'
})
export class OrderTypeItemFilterPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter || filter === '[All]') {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.status === Number(filter));
    // return items.filter(item => item.status.indexOf(filter.status) !== -1);
  }

}
@Pipe({
  name: 'nameItemFilter'
})
export class NameItemFilterPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter || filter === '') {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.name.indexOf(filter) !== -1);
  }

}



// Status Product
@Pipe({
  name: 'productStatusFilter'
})
export class ProductStatusFilterPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter || filter === '0') {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.value === filter + '');
    // return items.filter(item => item.status.indexOf(filter.status) !== -1);
  }

}