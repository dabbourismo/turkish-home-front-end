import { LevelsService } from '@services/levels.service';
import { LevelDropDownList } from '@dropDownLists/levelDropDownList';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Material } from '@models/material';
import { MaterialsService } from '@services/materials.service';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-materials-form',
  templateUrl: './materials-form.component.html',
  styleUrls: ['./materials-form.component.css']
})
export class MaterialsFormComponent implements OnInit {

  public materialsForm: FormGroup;
  public levelsDropDownList: LevelDropDownList[]

  constructor(public dialogRef: MatDialogRef<MaterialsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificationsService: NotificationDialogService,
    public httpServiceMaterials: MaterialsService,
    public httpServiceLevels: LevelsService,
  ) { }

  ngOnInit(): void {
    this.levelsGetDropDownList().pipe(
      map(response => {
        if (response.length > 0) {
          this.levelsDropDownList = response;
          this.materialsFormCreate();
          if (this.data.id != 0) {
            this.materialsGetById(this.data.id);
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
  public materialsFormCreate() {
    console.log('here2')
    this.materialsForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      levelId: new FormControl(this.levelsDropDownList[0].id)
    });
  }

  public onSubmit = (formValues) => {
    if (this.materialsForm.valid) {
      if (this.data.id != 0) {
        this.materialsUpdate(formValues);
      }
      else {
        this.materialsCreate(formValues);
      }
    }
  }


  //Database -------
  private materialsCreate = (formValues) => {
    let material: Material = {
      name: formValues.name,
      levelId: formValues.levelId,
    }
    this.httpServiceMaterials.materialsCreate(material).pipe(
      finalize(() => {
        this.notificationsService.success('تمت الاضافة بنجاح!');
        this.dialogRef.close({ event: 'Add' })
      })
    ).subscribe();
  }


  private levelsGetDropDownList(): Observable<LevelDropDownList[]> {
    return this.httpServiceLevels.levelsGetDropDownList();
  }

  public materialsUpdate = (formValues) => {
    let material: Material = {
      id: formValues.id,
      name: formValues.name,
      levelId: formValues.levelId,
    }
    this.httpServiceMaterials.materialsUpdate(material).pipe(
      finalize(() => {
        this.notificationsService.success('تم التعديل بنجاح!');
        this.dialogRef.close({ event: 'Update' })
      })
    ).subscribe();
  }

  materialsGetById(id: number) {
    this.httpServiceMaterials.materialsGetById(id).pipe(
      map(response => {
        this.materialsForm.get('id').setValue(response.id);
        this.materialsForm.get('name').setValue(response.name);
        this.materialsForm.get('levelId').setValue(response.levelId);

      })
    ).subscribe();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.materialsForm.controls[controlName].hasError(errorName);
  }

  public closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
