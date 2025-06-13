// item-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'ec-item-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-card.component.html',
})
export class ItemCardComponent {
  routeEnum = RouteEnum;
  @Input() item: any;

  getDiscountedPrice(): number {
    return this.item.price * (1 - (this.item.discount || 0) / 100);
  }

  getFilteredKeys(): string[] {
    if (!this.item) return [];
    return Object.keys(this.item).filter(
      (key) =>
        !['id', 'isDeleted'].includes(key) &&
        !key.startsWith('_') &&
        this.item[key] !== undefined &&
        this.item[key] !== null
    );
  }

  getPropertyType(value: any): string {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'string';
  }
}
