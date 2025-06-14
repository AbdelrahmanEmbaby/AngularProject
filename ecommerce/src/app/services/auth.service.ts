import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL_TOKEN } from '../configs/tokens.config';
import { IUser, IUserRequest, IUserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userSubject = new BehaviorSubject<IUser | null>(
    this.getUserFromStorage()
  );
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL_TOKEN) private apiUrl: string
  ) {}

  private getUserFromStorage(): IUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).user : null;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.roles.includes('admin') ?? false;
  }

  getUserData(): IUser | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<IUserResponse> {
    return this.http
      .post<IUserResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user.user);
          return user;
        })
      );
  }

  register(user: IUserRequest): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(`${this.apiUrl}/register`, user).pipe(
      map((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user.user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    window.location.reload();
    this.userSubject.next(null);
  }
}
