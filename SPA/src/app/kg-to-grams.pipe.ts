import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kgToGrams',
  standalone: true
})
export class KgToGramsPipe implements PipeTransform {
  
    transform(value: number): string {
      if (!value) {
        return '';
      }
      const grams = value * 1000;
      return `${grams}g`;
    }

}
