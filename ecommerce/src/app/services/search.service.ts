import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
// Services
import { AuthService } from '../services/auth.service';
// Enums
import { RouteEnum } from '../enums/route.enum';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.route.queryParams
      .pipe(
        map((params) => params['q'] || ''),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.searchSubject.next(searchTerm);
      });
  }

  get searchTerm$(): Observable<string> {
    return this.searchSubject.asObservable();
  }

  get currentSearchTerm(): string {
    return this.searchSubject.value;
  }

  updateSearchTerm(searchTerm: string): void {
    const currentUrl = this.router.url;

    if (this.auth.isLoggedIn()) {
      if (!currentUrl.startsWith(`/${RouteEnum.Products}`)) {
        this.router.navigate([`/${RouteEnum.Products}`], {
          queryParams: { q: searchTerm || null },
          queryParamsHandling: 'merge',
        });
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: searchTerm || null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    }else {
      if (!currentUrl.startsWith(`/${RouteEnum.Login}`)) {
        this.router.navigate([`/${RouteEnum.Login}`], {
          queryParams: { q: searchTerm || null },
          queryParamsHandling: 'merge',
        });
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: searchTerm || null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    }
  }

  clearSearch(): void {
    this.updateSearchTerm('');
  }
}
