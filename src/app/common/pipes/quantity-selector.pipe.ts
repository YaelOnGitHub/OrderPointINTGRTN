import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantitySelector'
})
export class QuantitySelectorPipe implements PipeTransform {

  transform(value: [], args: {
    max_quantity: number,
    increment: number
  }): any {
    let quantities: Array<number> = Array.from({ length: args.max_quantity / args.increment + 1 }, (_, i) => i * args.increment);
    //quantities.splice(0, 1);  //Commented out - zero is now valid selection and can be used to remove from cart.
    if (quantities.indexOf(args.max_quantity) === -1) {
      quantities.push(args.max_quantity);
    }
    quantities = quantities.filter(function (x) { return x <= args.max_quantity; });

    //Special handling of max quantity that further limits possible selections.
    //This code has been disabled.
    // switch (args.increment) {
    //   case 1:
    //     for (let v = 0; v <= quantities.length; v++) {
    //       if ((quantities[v] === 4 ||
    //         quantities[v] === 6 ||
    //         quantities[v] === 7 ||
    //         quantities[v] === 8 ||
    //         quantities[v] === 9) &&
    //         quantities[v] < args.max_quantity) {
    //         quantities.splice(v, 1);
    //         v--;
    //       } else if (quantities[v] > 10 && quantities[v] < args.max_quantity) {
    //         quantities.splice(v, 1);
    //         v--;
    //       }
    //     }
    //     break;
    //   case 10:
    //     for (let d = 0; d <= quantities.length; d++) {
    //       if (quantities[d] > 50 && quantities[d] < args.max_quantity) {
    //         quantities.splice(d, 1);
    //         d--;
    //       }
    //     }
    //     break;
    //   case 20:
    //     for (let c = 0; c <= quantities.length; c++) {
    //       if (quantities[c] > 100 && quantities[c] < args.max_quantity) {
    //         quantities.splice(c, 1);
    //         c--;
    //       }
    //     }
    //     break;
    //   case 50:
    //     for (let e = 0; e <= quantities.length; e++) {
    //       if (quantities[e] > 200 && quantities[e] != 500 && quantities[e] < args.max_quantity) {
    //         quantities.splice(e, 1);
    //         e--;
    //       }
    //     }
    //     break;
    // }
    return quantities;
  }

}
