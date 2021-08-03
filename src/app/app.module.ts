import { HttpLoggerService } from './auth/http-logger.service';
import { LoaderInterceptorService } from './auth/loader-interceptor.service';
import { LoaderService } from '@services/loader.service';
import { HttpErrorHandlerService } from './auth/http-error-handler.service';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar/navigation-bar.component';
import { LevelsListComponent } from './levels/levels-list/levels-list.component';
import { LevelsFormComponent } from './levels/levels-form/levels-form.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { MatConfirmDialogComponent } from './shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { MaterialsListComponent } from './materials/materials-list/materials-list.component';
import { MaterialsFormComponent } from './materials/materials-form/materials-form.component';
import { ExamsListComponent } from './exams/exams-list/exams-list.component';
import { ExamsFormComponent } from './exams/exams-form/exams-form.component';
import { NotificationsListComponent } from './notifications/notifications-list/notifications-list.component';
import { NotificationsFormComponent } from './notifications/notifications-form/notifications-form.component';
import { UnitsListComponent } from './units/units-list/units-list.component';
import { UnitsFormComponent } from './units/units-form/units-form.component';
import { SettingsFormComponent } from './settings/settings-form/settings-form.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    LevelsListComponent,
    LevelsFormComponent,
    LoaderComponent,
    MatConfirmDialogComponent,
    MaterialsListComponent,
    MaterialsFormComponent,
    ExamsListComponent,
    ExamsFormComponent,
    NotificationsListComponent,
    NotificationsFormComponent,
    UnitsListComponent,
    UnitsFormComponent,
    SettingsFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorHandlerService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoggerService,
      multi: true,
    },
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
