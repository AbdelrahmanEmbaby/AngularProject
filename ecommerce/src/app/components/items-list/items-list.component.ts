import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Identifiable } from '../../interfaces/identifiable.interface';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'ec-items-list',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  templateUrl: './items-list.component.html',
})
export class ItemsListComponent<T extends Identifiable> {
  @Input() items: T[] | null = null;
  @Input() loading = false;
}
