import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '@models/unit';
import { UnitDropDownList } from '@dropDownLists/UnitDropDownList';
@Injectable({
  providedIn: 'root'
})
export class UnitService {

  url = `${environment.urlAddress}units/`;

  constructor(private http: HttpClient) { }

  unitsGet(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.url}unitsGet`);
  }

  unitsGetByMaterialId(materialId: number): Observable<Unit[]> {
    const params = new HttpParams()
      .set('materialId', materialId.toString());
    return this.http.get<Unit[]>(`${this.url}unitsGet`, { params: params });
  }


  unitsGetDropDownList(): Observable<UnitDropDownList[]> {
    return this.http.get<UnitDropDownList[]>(`${this.url}unitsGetDropDownList`);
  }

  unitsGetDropDownListByMaterialId(materialId: number): Observable<UnitDropDownList[]> {
    const params = new HttpParams()
      .set('materialId', materialId.toString());
    return this.http.get<UnitDropDownList[]>(`${this.url}unitsGetDropDownList`, { params: params });
  }

  unitsGetById(id: number): Observable<Unit> {

    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.get<UnitDropDownList>(`${this.url}unitsGetById`, { params: params });
  }

  unitsSearch(name: string): Observable<Unit[]> {

    const params = new HttpParams()
      .set('name', name.toString());

    return this.http.get<Unit[]>(`${this.url}unitsSearch`, { params: params });
  }

  unitsCreate(unit: Unit): Observable<void> {
    return this.http.post<void>(`${this.url}unitsCreate`, unit);
  }

  unitsUpdate(unit: Unit): Observable<void> {
    return this.http.post<void>(`${this.url}unitsUpdate`, unit);
  }

  unitsDelete(id: number): Observable<void> {
    const params = new HttpParams()
      .set('id', id.toString());
    return this.http.post<void>(`${this.url}unitsDelete`, {}, { params: params });
  }
}
