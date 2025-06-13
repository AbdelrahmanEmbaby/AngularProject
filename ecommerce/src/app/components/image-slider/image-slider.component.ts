import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ec-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
})
export class ImageSliderComponent {
  @Input() images: string[] = [];
  @Input() currentIndex = 0;
  @Output() imageSelected = new EventEmitter<number>();

  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLElement>;

  isDragging = false;
  startPosition = 0;
  scrollLeft = 0;

  startDrag(e: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startPosition = 'pageX' in e ? e.pageX : e.touches[0].pageX;
    this.scrollLeft = this.sliderContainer.nativeElement.scrollLeft;
    e.preventDefault();
  }

  onDrag(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    e.preventDefault();

    const x = 'pageX' in e ? e.pageX : e.touches[0].pageX;
    const walk = (x - this.startPosition) * 2;
    this.sliderContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  stopDrag() {
    this.isDragging = false;
  }

  scroll(direction: number) {
    this.sliderContainer.nativeElement.scrollBy({
      left: direction * 100,
      behavior: 'smooth',
    });
  }

  selectImage(index: number, event: MouseEvent) {
    if (!this.isDragging) {
      this.imageSelected.emit(index);
    }
    this.isDragging = false;
    event.stopPropagation();
  }
}
