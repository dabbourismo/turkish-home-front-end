import { LevelDropDownList } from '@dropDownLists/levelDropDownList';
import { Level } from '@models/level';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LevelsService {

  url = `${environment.urlAddress}levels/`;

  constructor(private http: HttpClient) { }

  levelsGet(): Observable<Level[]> {
    return this.http.get<Level[]>(`${this.url}levelsGet`);
  }

  levelsGetDropDownList(): Observable<LevelDropDownList[]> {
    return this.http.get<LevelDropDownList[]>(`${this.url}levelsGetDropDownList`);
  }

  levelsGetById(id: number): Observable<Level> {

    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.get<LevelDropDownList>(`${this.url}levelsGetById`, { params: params });
  }

  levelsSearch(name: string): Observable<Level[]> {

    const params = new HttpParams()
      .set('name', name.toString());

    return this.http.get<Level[]>(`${this.url}levelsSearch`, { params: params });
  }

  levelsCreate(level: Level): Observable<void> {
    return this.http.post<void>(`${this.url}levelsCreate`, level);
  }

  levelsUpdate(level: Level): Observable<void> {
    return this.http.post<void>(`${this.url}levelsUpdate`, level);
  }

  levelsDelete(id: number): Observable<any> {

    const params = new HttpParams()
      .set('id', id.toString());


    return this.http.post<any>(`${this.url}levelsDelete`, {}, { params: params });
  }


}
