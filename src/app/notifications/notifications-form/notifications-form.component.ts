import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LevelDropDownList } from '@dropDownLists/levelDropDownList';
import { LevelsService } from '@services/levels.service';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { NotificationsService } from '@services/notifications.service';
import { finalize, map } from 'rxjs/operators';
import { Notification } from '@models/notification';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications-form',
  templateUrl: './notifications-form.component.html',
  styleUrls: ['./notifications-form.component.css']
})
export class NotificationsFormComponent implements OnInit {

  public notificationsForm: FormGroup;
  public levelsDropDownList: LevelDropDownList[]

  constructor(public dialogRef: MatDialogRef<NotificationsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificationsService: NotificationDialogService,
    public httpServicenotifications: NotificationsService,
    public httpServiceLevels: LevelsService, public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.levelsGetDropDownList().pipe(
      map(response => {
        if (response.length > 0) {
          this.levelsDropDownList = response;
          this.notificationsFormCreate();
          if (this.data.id != 0) {
            this.notificationsGetById(this.data.id);
          }
        }
        else {
          this.notificationsService.delete('لا يوجد مراحل مضافة');
          this.closeDialog();
        }
      })
    ).subscribe();

  }

  ngAfterViewInit(): void {

  }

  //Form Values -------
  public notificationsFormCreate() {
    let apperanceDate = new Date(this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm"));
    let endDate = new Date(this.datePipe.transform(new Date(), "yyyy-MM-dd"));

    this.notificationsForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      levelId: new FormControl(this.levelsDropDownList[0].id),
      apperanceDate: new FormControl(apperanceDate),
      endDate: new FormControl(endDate),
    });
  }

  public onSubmit = (formValues) => {
    if (this.notificationsForm.valid) {
      if (this.data.id != 0) {
        this.notificationsUpdate(formValues);
      }
      else {
        this.notificationsCreate(formValues);
      }
    }
  }


  //Database -------
  private notificationsCreate = (formValues) => {
    let notification: Notification = {
      name: formValues.name,
      levelId: formValues.levelId,
      apperanceDate: formValues.apperanceDate,
      endDate: formValues.endDate,
    }
    this.httpServicenotifications.notificationsCreate(notification).pipe(
      finalize(() => {
        this.notificationsService.success('تمت الاضافة بنجاح!');
        this.dialogRef.close({ event: 'Add' })
      })
    ).subscribe();
  }


  private levelsGetDropDownList(): Observable<LevelDropDownList[]> {
    return this.httpServiceLevels.levelsGetDropDownList();
  }

  public notificationsUpdate = (formValues) => {
    let notification: Notification = {
      id: formValues.id,
      name: formValues.name,
      levelId: formValues.levelId,
      apperanceDate: formValues.apperanceDate,
      endDate: formValues.endDate,
    }
    this.httpServicenotifications.notificationsUpdate(notification).pipe(
      finalize(() => {
        this.notificationsService.success('تم التعديل بنجاح!');
        this.dialogRef.close({ event: 'Update' })
      })
    ).subscribe();
  }

  notificationsGetById(id: number) {
    this.httpServicenotifications.notificationsGetById(id).pipe(
      map(response => {
        this.notificationsForm.get('id').setValue(response.id);
        this.notificationsForm.get('name').setValue(response.name);
        this.notificationsForm.get('levelId').setValue(response.levelId);
        this.notificationsForm.get('apperanceDate').setValue(response.apperanceDate);
        this.notificationsForm.get('endDate').setValue(response.endDate);
      })
    ).subscribe();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.notificationsForm.controls[controlName].hasError(errorName);
  }

  public closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
