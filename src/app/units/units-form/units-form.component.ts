import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LevelDropDownList } from '@dropDownLists/levelDropDownList';
import { MaterialDropDownList } from '@dropDownLists/MaterialDropDownList';
import { Unit } from '@models/unit';
import { LevelsService } from '@services/levels.service';
import { MaterialsService } from '@services/materials.service';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { UnitService } from '@services/unit.service';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-units-form',
  templateUrl: './units-form.component.html',
  styleUrls: ['./units-form.component.css']
})
export class UnitsFormComponent implements OnInit {


  public unitsForm: FormGroup;
  public materialDropDownList: MaterialDropDownList[];
  public levelDropDownList: LevelDropDownList[];

  constructor(public dialogRef: MatDialogRef<UnitsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificationsService: NotificationDialogService,
    public httpServiceunits: UnitService,
    public httpServicelevels: LevelsService,
    public httpServicematerials: MaterialsService,) { }

  ngOnInit(): void {
    this.levelsGetDropDownList().subscribe(response => {
      if (response.length > 0) {
        this.materialsGetDropDownListByLevelId(response[0].id).subscribe(response => {
          this.unitsFormCreate()
        });

        if (this.data.id != 0) {
          this.unitsGetById(this.data.id);
        }
      }
      else {
        this.notificationsService.delete('لا يوجد مراحل مضافة');
        this.closeDialog();
      }
    });

  }

  ngAfterViewInit(): void {

  }

  //Form Values -------
  public unitsFormCreate() {
    this.unitsForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      materialId: new FormControl(this.materialDropDownList[0].id, [Validators.required]),
      levelId: new FormControl(this.levelDropDownList[0].id),
    });
  }

  public onSubmit = (formValues) => {
    if (formValues.materialId == null) {
      this.notificationsService.delete('ادخل المادة');
      return;
    }
    if (this.unitsForm.valid) {
      if (this.data.id != 0) {
        this.unitsUpdate(formValues);
      }
      else {
        this.unitsCreate(formValues);
      }
    }
  }


  //Database -------
  private unitsCreate = (formValues) => {
    let unit: Unit = {
      name: formValues.name,
      materialId: formValues.materialId,
    }
    this.httpServiceunits.unitsCreate(unit).pipe(
      finalize(() => {
        this.notificationsService.success('تمت الاضافة بنجاح!');
        this.dialogRef.close({ event: 'Add' })
      })
    ).subscribe();
  }

  levelsSelectionChanged(levelId: number) {
    this.materialsGetDropDownListByLevelId(levelId).subscribe(response => {
      this.materialDropDownList = response;
    });
  }

  private materialsGetDropDownListByLevelId(levelId: number): Observable<MaterialDropDownList[]> {
    return this.httpServicematerials.materialsGetDropDownListByLevelId(levelId).pipe(
      map(response => this.materialDropDownList = response)
    );
  }

  private levelsGetDropDownList(): Observable<LevelDropDownList[]> {
    return this.httpServicelevels.levelsGetDropDownList().pipe(
      map(response => this.levelDropDownList = response)
    );
  }

  public unitsUpdate = (formValues) => {
    let unit: Unit = {
      id: formValues.id,
      name: formValues.name,
      materialId: formValues.materialId,
    }
    this.httpServiceunits.unitsUpdate(unit).pipe(
      finalize(() => {
        this.notificationsService.success('تم التعديل بنجاح!');
        this.dialogRef.close({ event: 'Update' })
      })
    ).subscribe();
  }

  unitsGetById(id: number) {
    this.httpServiceunits.unitsGetById(id).pipe(
      map(response => {
        this.unitsForm.get('id').setValue(response.id);
        this.unitsForm.get('name').setValue(response.name);
        this.unitsForm.get('materialId').setValue(response.materialId);
      })
    ).subscribe();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.unitsForm.controls[controlName].hasError(errorName);
  }

  public closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
