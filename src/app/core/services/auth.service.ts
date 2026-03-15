import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'skillswap_token';
  private readonly USER_KEY = 'skillswap_user';

  readonly userSignal = signal<User | null>(this.getStoredUser());
  readonly isLoggedIn = computed(() => !!this.userSignal());

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: {
    name: string;
    username: string;
    email: string;
    password: string;
    bio: string;
    skills: string[];
  }): Observable<unknown> {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, payload).pipe(
      tap((res) => this.setSession(res))
    );
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/users/me`).pipe(
      tap((user) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.userSignal.set(user);
      })
    );
  }

  setSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.userSignal.set(res.user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) as User : null;
  }
}
