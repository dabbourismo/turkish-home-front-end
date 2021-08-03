import { environment } from '@environments/environment';
import { MaterialDropDownList } from '@dropDownLists/MaterialDropDownList';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Material } from '@models/material';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  url = `${environment.urlAddress}materials/`;

  constructor(private http: HttpClient) { }

  materialsGet(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.url}materialsGet`);
  }

  materialsGetByLevelId(levelId: number): Observable<Material[]> {
    const params = new HttpParams()
      .set('levelId', levelId.toString());
    return this.http.get<Material[]>(`${this.url}materialsGet`, { params: params });
  }

  materialsGetDropDownList(): Observable<MaterialDropDownList[]> {
    return this.http.get<MaterialDropDownList[]>(`${this.url}materialsGetDropDownList`);
  }

  materialsGetDropDownListByLevelId(levelId: number): Observable<MaterialDropDownList[]> {
    const params = new HttpParams()
      .set('levelId', levelId.toString());
    return this.http.get<MaterialDropDownList[]>(`${this.url}MaterialsGetDropDownListByLevelId`, { params: params });
  }

  materialsGetById(id: number): Observable<Material> {

    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.get<MaterialDropDownList>(`${this.url}materialsGetById`, { params: params });
  }

  materialsSearch(name: string): Observable<Material[]> {

    const params = new HttpParams()
      .set('name', name.toString());

    return this.http.get<Material[]>(`${this.url}materialsSearch`, { params: params });
  }

  materialsCreate(material: Material): Observable<void> {
    return this.http.post<void>(`${this.url}materialsCreate`, material);
  }

  materialsUpdate(material: Material): Observable<void> {
    return this.http.post<void>(`${this.url}materialsUpdate`, material);
  }

  materialsDelete(id: number): Observable<void> {
    const params = new HttpParams()
      .set('id', id.toString());
    return this.http.post<void>(`${this.url}materialsDelete`, {}, { params: params });
  }
}
