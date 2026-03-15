import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/users/${username}`);
  }
}
