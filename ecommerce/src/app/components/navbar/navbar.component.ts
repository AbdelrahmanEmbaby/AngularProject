import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';
import { RouteEnum } from '../../enums/route.enum';
import { IUser } from '../../interfaces/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'ec-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  user: IUser | null = null;
  constructor(
    private titleService: Title,
    private searchService: SearchService,
    public auth: AuthService
  ) {
    this.auth.userSubject.subscribe((user) => (this.user = user));

    this.searchService.searchTerm$.subscribe((searchTerm) => {
      this.searchQuery = searchTerm;
    });
  }

  routeEnum = RouteEnum;
  isMenuOpen = false;
  isProfileMenuOpen = false;
  searchQuery = '';

  getTitle() {
    return this.titleService.getTitle();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  setProfileMenuToggle(state: boolean) {
    this.isProfileMenuOpen = state;
  }

  setToggle(state: boolean) {
    this.isMenuOpen = state;
  }

  closeAllMenus() {
    this.isMenuOpen = false;
    this.isProfileMenuOpen = false;
  }

  onSearch() {
    this.searchService.updateSearchTerm(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchService.clearSearch();
  }

  logout() {
    
    this.auth.logout();
    this.closeAllMenus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.profile-menu') &&
      !target.closest('.profile-button')
    ) {
      this.setProfileMenuToggle(false);
    }
  }
}
