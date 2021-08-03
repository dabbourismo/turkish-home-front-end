import { Setting } from '@models/setting';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  url = `${environment.urlAddress}settings/`;

  constructor(private http: HttpClient) { }

  settingsGet(): Observable<Setting> {
    return this.http.get<Setting>(`${this.url}settingsGet`);
  }

  settingsUpdate(setting: Setting): Observable<void> {
    return this.http.post<void>(`${this.url}settingsUpdate`, setting);
  }
}
