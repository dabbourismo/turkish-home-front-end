import { Level } from '@models/level';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LevelsService } from '@services/levels.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-levels-form',
  templateUrl: './levels-form.component.html',
  styleUrls: ['./levels-form.component.css']
})
export class LevelsFormComponent implements OnInit {
  public levelsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<LevelsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificationsService: NotificationDialogService,
    public httpService: LevelsService) { }

  ngOnInit(): void {
    this.levelsFormCreate();
    if (this.data.id != 0) {
      this.levelsGetById(this.data.id);
    }
  }

  //Form Values -------
  public levelsFormCreate() {
    this.levelsForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    });
  }

  public onSubmit = (formValues) => {
    if (this.levelsForm.valid) {
      if (this.data.id != 0) {
        this.levelsUpdate(formValues);
      }
      else {
        this.levelsCreate(formValues);
      }
    }
  }


  //Database -------
  private levelsCreate = (formValues) => {
    let level: Level = {
      name: formValues.name,
    }
    this.httpService.levelsCreate(level).pipe(
      finalize(() => {
        this.notificationsService.success('تمت الاضافة بنجاح!');
        this.dialogRef.close({event:'Add'})
      })
    ).subscribe();
  }

  public levelsUpdate = (formValues) => {
    let level: Level = {
      id: formValues.id,
      name: formValues.name,
    }
    this.httpService.levelsUpdate(level).pipe(
      finalize(() => {
        this.notificationsService.success('تم التعديل بنجاح!');
        this.dialogRef.close({event:'Update'})
      })
    ).subscribe();
  }

  levelsGetById(id: number) {
    this.httpService.levelsGetById(id).pipe(
      map(response => {
        this.levelsForm.get('id').setValue(response.id);
        this.levelsForm.get('name').setValue(response.name);
      })
    ).subscribe();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.levelsForm.controls[controlName].hasError(errorName);
  }

  public closeDialog() : void {
    console.log('here')
    this.dialogRef.close({event:'Cancel'});
  }

}
