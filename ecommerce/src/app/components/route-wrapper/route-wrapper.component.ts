import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { RouteProtection } from '../../enums/route-protection.enum';

@Component({
  selector: 'ec-route-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class RouteWrapperComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let current = this.route.root;
        while (current.firstChild) {
          current = current.firstChild;
        }
        const protection: RouteProtection =
          current.snapshot.data['protection'] || RouteProtection.Neutral;
        const loggedIn = this.auth.isLoggedIn();
        const isAdmin = this.auth.isAdmin();

        switch (protection) {
          case RouteProtection.Protected:
            if (!loggedIn) {
              this.router.navigate(['/login'], {
                queryParams: { returnUrl: this.router.url },
              });
            }
            break;

          case RouteProtection.GuestOnly:
            if (loggedIn) {
              this.router.navigate(['/']);
            }
            break;

          case RouteProtection.AdminOnly:
            if (!isAdmin) {
              this.router.navigate(['/']);
            }
            break;

          case RouteProtection.Neutral:
          default:
            break;
        }
      });
  }
}
