import { UnitService } from '@services/unit.service';
import { UnitDropDownList } from '@dropDownLists/UnitDropDownList';
import { LevelsService } from '@services/levels.service';
import { LevelDropDownList } from '@dropDownLists/levelDropDownList';
import { Exam } from '@models/exam';
import { MaterialDropDownList } from '@dropDownLists/MaterialDropDownList';
import { MaterialsService } from '@services/materials.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { ExamsService } from '@services/exams.service';
import { finalize, map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-exams-form',
  templateUrl: './exams-form.component.html',
  styleUrls: ['./exams-form.component.css']
})
export class ExamsFormComponent implements OnInit {

  public examsForm: FormGroup;
  public materialDropDownList: MaterialDropDownList[];
  public levelDropDownList: LevelDropDownList[];
  public unitDropDownList: UnitDropDownList[];

  public examTypes = [
    { value: '0', name: 'دائم' },
    { value: '1', name: 'مؤقت' },
  ]

  constructor(public dialogRef: MatDialogRef<ExamsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    public notificationsService: NotificationDialogService,
    public httpServiceexams: ExamsService,
    public httpServiceUnits: UnitService,
    public httpServicelevels: LevelsService,
    public httpServicematerials: MaterialsService,
  ) { }

  ngOnInit(): void {
    this.levelsGetDropDownList().subscribe(response => {
      if (response.length > 0) {
        this.materialsGetDropDownListByLevelId(response[0].id).subscribe(response => {
          if (response.length > 0) {
            this.unitsGetDropDownListByMaterialId(response[0].id).subscribe(response => {
              if (response.length > 0) {
                this.examsFormCreate()
                if (this.data.id != 0) {
                  this.examsGetById(this.data.id);
                }
              }
              else {
                this.notificationsService.delete('لا يوجد وحدات مضافة');
                this.closeDialog();
              }

            })

          }
          else {
            this.notificationsService.delete('لا يوجد مواد مضافة');
            this.closeDialog();
          }

        });
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
  public examsFormCreate() {
    console.log('form')
    let apperanceDate = new Date(this.datePipe.transform(new Date(), "yyyy-MM-dd"));
    let endDate = new Date(this.datePipe.transform(new Date(), "yyyy-MM-dd"));

    this.examsForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      examType: new FormControl(this.examTypes[0].value),
      levelId: new FormControl(this.levelDropDownList[0].id),
      materialId: new FormControl(this.materialDropDownList[0].id),
      unitId: new FormControl(this.unitDropDownList[0].id, [Validators.required]),
      apperanceDate: new FormControl(apperanceDate),
      endDate: new FormControl(endDate),
      url: new FormControl('', [Validators.required]),
    });
  }

  public onSubmit = (formValues) => {
    if (formValues.unitId == null) {
      this.notificationsService.delete('ادخل المادة');
      return;
    }
    if (this.examsForm.valid) {
      if (this.data.id != 0) {
        this.examsUpdate(formValues);
      }
      else {
        this.examsCreate(formValues);
      }
    }
  }


  //Database -------
  private examsCreate = (formValues) => {
    let exam: Exam = {
      name: formValues.name,
      unitId: formValues.unitId,
      examType: formValues.examType,
      apperanceDate: formValues.apperanceDate,
      endDate: formValues.endDate,
      url: formValues.url,
    }
    this.httpServiceexams.examsCreate(exam).pipe(
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

  materialSelectionChanged(materialId: number) {
    this.unitsGetDropDownListByMaterialId(materialId).subscribe(response => {
      this.unitDropDownList = response;
    });
  }




  private levelsGetDropDownList(): Observable<LevelDropDownList[]> {
    return this.httpServicelevels.levelsGetDropDownList().pipe(
      map(response => this.levelDropDownList = response)
    );
  }

  private materialsGetDropDownListByLevelId(levelId: number): Observable<MaterialDropDownList[]> {
    return this.httpServicematerials.materialsGetDropDownListByLevelId(levelId).pipe(
      map(response => this.materialDropDownList = response)
    );
  }


  private unitsGetDropDownListByMaterialId(materialId: number): Observable<UnitDropDownList[]> {
    return this.httpServiceUnits.unitsGetDropDownListByMaterialId(materialId).pipe(
      map(response => this.unitDropDownList = response)
    );
  }

  public examsUpdate = (formValues) => {
    let exam: Exam = {
      id: formValues.id,
      name: formValues.name,
      unitId: formValues.unitId,
      examType: formValues.examType,
      apperanceDate: formValues.apperanceDate,
      endDate: formValues.endDate,
      url: formValues.url,
    }
    this.httpServiceexams.examsUpdate(exam).pipe(
      finalize(() => {
        this.notificationsService.success('تم التعديل بنجاح!');
        this.dialogRef.close({ event: 'Update' })
      })
    ).subscribe();
  }

  examsGetById(id: number) {
    this.httpServiceexams.examsGetById(id).pipe(
      map(response => {
        this.examsForm.get('id').setValue(response.id);
        this.examsForm.get('name').setValue(response.name);
        this.examsForm.get('unitId').setValue(response.unitId);
        this.examsForm.get('examType').setValue(this.examTypes[response.examType].value);
        this.examsForm.get('apperanceDate').setValue(response.apperanceDate);
        this.examsForm.get('endDate').setValue(response.endDate);
        this.examsForm.get('url').setValue(response.url);
      })
    ).subscribe();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.examsForm.controls[controlName].hasError(errorName);
  }

  public closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
