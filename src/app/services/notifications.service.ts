import { Notification } from '@models/notification';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  url = `${environment.urlAddress}notifications/`;

  constructor(private http: HttpClient) { }

  notificationsGet(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}notificationsGet`);
  }

  notificationsGetByLevelId(levelId: number): Observable<Notification[]> {
    const params = new HttpParams()
      .set('levelId', levelId.toString());
    return this.http.get<Notification[]>(`${this.url}notificationsGet`, { params: params });
  }

  notificationsGetById(id: number): Observable<Notification> {

    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.get<Notification>(`${this.url}notificationsGetById`, { params: params });
  }

  notificationsSearch(name: string): Observable<Notification[]> {

    const params = new HttpParams()
      .set('name', name.toString());

    return this.http.get<Notification[]>(`${this.url}notificationsSearch`, { params: params });
  }

  notificationsCreate(notification: Notification): Observable<void> {
    return this.http.post<void>(`${this.url}notificationsCreate`, notification);
  }

  notificationsUpdate(notification: Notification): Observable<void> {
    return this.http.post<void>(`${this.url}notificationsUpdate`, notification);
  }

  notificationsDelete(id: number): Observable<void> {
    const params = new HttpParams()
      .set('id', id.toString());
    return this.http.post<void>(`${this.url}notificationsDelete`,{}, { params: params });
  }
}
