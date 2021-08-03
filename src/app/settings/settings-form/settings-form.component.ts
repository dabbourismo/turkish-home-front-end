import { Setting } from './../../_models/setting';
import { NotificationDialogService } from './../../services/notification-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsService } from '@services/settings.service';
import { Component, Inject, OnInit } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {

  formData: FormData;
  public progress: number;
  public message: string;
  selectedFiles: FileList;
  public settingsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<SettingsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public notificationsService: NotificationDialogService,
    public httpService: SettingsService) { }

  ngOnInit(): void {
    this.settingsFormCreate();
    if (this.data.id != 0) {
      this.settingsGet();
    }
  }

  //Form Values -------
  public settingsFormCreate() {
    this.settingsForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    });
  }

  public onSubmit = (formValues) => {
    if (this.settingsForm.valid) {
      if (this.data.id != 0) {
        this.settingsUpdate(formValues);
        this.uploadFile()
      }
    }
  }

  //Database -------


  public settingsUpdate = (formValues) => {
    let setting: Setting = {
      id: formValues.id,
      name: formValues.name,
    }
    this.httpService.settingsUpdate(setting).pipe(
      finalize(() => {
        this.notificationsService.success('تم التعديل بنجاح!');
        this.dialogRef.close({ event: 'Update' })
      })
    ).subscribe();
  }

  settingsGet() {
    this.httpService.settingsGet().pipe(
      map(response => {
        this.settingsForm.get('id').setValue(response.id);
        this.settingsForm.get('name').setValue(response.name);
      })
    ).subscribe();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.settingsForm.controls[controlName].hasError(errorName);
  }

  public closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }


  public selectFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData = new FormData();
    this.formData.append('file', fileToUpload, fileToUpload.name);
  }

  public uploadFile() {
    let url = `${environment.urlAddress}settings/`;

    this.http.post(`${url}uploadPhoto`
      , this.formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response ) {

        }
      });
  }


}
