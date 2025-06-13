import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IProduct, IUpdateProduct } from '../../interfaces/product.interface';

@Component({
  selector: 'ec-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  @Input() product: IProduct = {
    name: '',
    description: '',
    price: 0,
    discount: 0,
    quantity: 0,
    images: [],
    isDeleted: false,
  };

  @Input() isEditing = false;
  @Output() create = new EventEmitter<IProduct>();
  @Output() update = new EventEmitter<IProduct>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  newImageUrl = new FormControl('');

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.productForm = this.fb.group({
      name: [this.product.name, [Validators.required, Validators.minLength(3)]],
      description: [this.product.description],
      price: [this.product.price, [Validators.required, Validators.min(0)]],
      discount: [
        this.product.discount,
        [Validators.min(0), Validators.max(100)],
      ],
      quantity: [
        this.product.quantity,
        [Validators.required, Validators.min(0)],
      ],
      images: this.fb.array(this.product.images || []),
      isDeleted: [this.product.isDeleted],
    });
  }

  get images() {
    return this.productForm.get('images') as FormArray;
  }

  addImage() {
    const url = this.newImageUrl.value;
    if (url && !this.images.value.includes(url)) {
      this.images.push(this.fb.control(url));
      this.newImageUrl.reset();
    }
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;
    if (this.isEditing) {
      const updatedProduct: IProduct = {
        ...this.product,
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        discount: formValue.discount,
        quantity: formValue.quantity,
        images: formValue.images,
        isDeleted: formValue.isDeleted,
      };
      this.update.emit(updatedProduct);
    } else {
      this.create.emit(formValue as IProduct);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  private markAllAsTouched() {
    Object.values(this.productForm.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched();
      }
    });
  }
}
