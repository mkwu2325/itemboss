// shared/pipes/filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  /**
   * Transform an array of items by filtering it based on a given value
   * and optionally a key to filter by.
   *
   * If no key is provided, the filter will be done by checking if each item
   * in the array is equal to the given value.
   *
   * If a key is provided, the filter will be done by checking if each item
   * in the array has a property with the given key and if the value of that
   * property is equal to the given value.
   *
   * @param {T[]} array - The array of items to filter.
   * @param {any} value - The value to filter by.
   * @param {string} [key] - The key to filter by.
   * @returns {T[]} - The filtered array of items.
   */
  transform<T>(array: T[], value: any, key?: string): T[] {
    if (!Array.isArray(array) || value === undefined) {
      return array;
    }

    if (key) {
      return array.filter(item => 
        item && typeof item === 'object' && item[key as keyof T] === value
      );
    }

    return array.filter(item => item === value);
  }
}