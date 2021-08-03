import { UnitsFormComponent } from './units/units-form/units-form.component';
import { UnitsListComponent } from './units/units-list/units-list.component';
import { NotificationsFormComponent } from './notifications/notifications-form/notifications-form.component';
import { NotificationsListComponent } from './notifications/notifications-list/notifications-list.component';
import { LevelsFormComponent } from './levels/levels-form/levels-form.component';
import { LevelsListComponent } from './levels/levels-list/levels-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialsListComponent } from './materials/materials-list/materials-list.component';
import { MaterialsFormComponent } from './materials/materials-form/materials-form.component';
import { ExamsListComponent } from './exams/exams-list/exams-list.component';
import { ExamsFormComponent } from './exams/exams-form/exams-form.component';


const routes: Routes = [
  { path: 'levels-list', component: LevelsListComponent },
  { path: 'levels-form', component: LevelsFormComponent },
  { path: 'levels-form/:id', component: LevelsFormComponent },


  { path: 'materials-list', component: MaterialsListComponent },
  { path: 'materials-form', component: MaterialsFormComponent },
  { path: 'materials-form/:id', component: MaterialsFormComponent },

  { path: 'exams-list', component: ExamsListComponent },
  { path: 'exams-form', component: ExamsFormComponent },
  { path: 'exams-form/:id', component: ExamsFormComponent },


  { path: 'notifications-list', component: NotificationsListComponent },
  { path: 'notifications-form', component: NotificationsFormComponent },
  { path: 'notifications-form/:id', component: NotificationsFormComponent },


  { path: 'units-list', component: UnitsListComponent },
  { path: 'units-form', component: UnitsFormComponent },
  { path: 'units-form/:id', component: UnitsFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
