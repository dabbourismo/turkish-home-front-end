import { Exam } from '@models/exam';
import { ExamDropDownList } from '@dropDownLists/ExamDropDownList';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  url = `${environment.urlAddress}exams/`;

  constructor(private http: HttpClient) { }

  examsGet(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.url}examsGet`);
  }

  examsGetByunitId(unitId: number): Observable<Exam[]> {
    const params = new HttpParams()
      .set('unitId', unitId.toString());
    return this.http.get<Exam[]>(`${this.url}examsGet`, { params: params });
  }
  examsGetByunitIdAndExamType(unitId: number, examType: number): Observable<Exam[]> {
    const params = new HttpParams()
      .set('unitId', unitId.toString())
      .set('examType', examType.toString());
    return this.http.get<Exam[]>(`${this.url}examsGet`, { params: params });
  }

  examsGetByunitIdAndExamTypeAndDate(unitId: number, examType: number, date: Date): Observable<Exam[]> {
    const params = new HttpParams()
      .set('unitId', unitId.toString())
      .set('examType', examType.toString())
      .set('date', date.toString());
    return this.http.get<Exam[]>(`${this.url}examsGet`, { params: params });
  }

  examsGetDropDownList(): Observable<ExamDropDownList[]> {
    return this.http.get<ExamDropDownList[]>(`${this.url}examsGetDropDownList`);
  }

  examsGetById(id: number): Observable<Exam> {

    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.get<ExamDropDownList>(`${this.url}examsGetById`, { params: params });
  }

  examsSearch(name: string): Observable<Exam[]> {

    const params = new HttpParams()
      .set('name', name.toString());

    return this.http.get<Exam[]>(`${this.url}examsSearch`, { params: params });
  }

  examsCreate(exam: Exam): Observable<void> {
    return this.http.post<void>(`${this.url}examsCreate`, exam);
  }

  examsUpdate(exam: Exam): Observable<void> {
    return this.http.post<void>(`${this.url}examsUpdate`, exam);
  }

  examsDelete(id: number): Observable<void> {
    const params = new HttpParams()
      .set('id', id.toString());
    return this.http.post<void>(`${this.url}examsDelete`, {}, { params: params });
  }
}
