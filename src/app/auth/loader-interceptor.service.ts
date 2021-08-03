import { finalize } from 'rxjs/operators';
import { LoaderService } from '@services/loader.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  requestCount = 0;
  constructor(public loaderService: LoaderService) { }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<| HttpEvent<any>> {
    //this.requestCount++;
    console.log('shown')
    this.loaderService.show();

    return next.handle(req).pipe(
      finalize(() => {
        //this.requestCount--;
        //if (this.requestCount === 0) {
        //this.requestCount++;
        console.log('hidden')
        this.loaderService.hide();
        //}
      })
    );

  }
}
