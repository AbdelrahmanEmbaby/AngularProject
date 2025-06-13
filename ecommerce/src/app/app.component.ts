import { Component } from '@angular/core';
import { RouteWrapperComponent } from './components/route-wrapper/route-wrapper.component';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  imports: [RouteWrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private titleService: Title){
    this.titleService.setTitle('NgMart');
  }
}
