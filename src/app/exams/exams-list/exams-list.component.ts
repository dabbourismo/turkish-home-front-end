import { ExamsService } from '@services/exams.service';
import { Exam } from '@models/exam';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from '@services/dialog.service';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ExamsFormComponent } from '../exams-form/exams-form.component';

@Component({
  selector: 'app-exams-list',
  templateUrl: './exams-list.component.html',
  styleUrls: ['./exams-list.component.css']
})
export class ExamsListComponent implements OnInit {

  
 //Datatable
 public displayedColumns = ['name','materialName','unitName','examType','apperanceDate','endDate','url', 'update', 'delete'];
 public dataSource = new MatTableDataSource<Exam>();
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatPaginator) paginator: MatPaginator;
 searchText: string = '';



 constructor(private httpService: ExamsService,
   private confirmDialogService: DialogService,
   private notificationService: NotificationDialogService,
   public dialog: MatDialog) { }

 ngOnInit(): void {
   this.examsGet();
 }

 ngAfterViewInit(): void {
   this.applySortingAndPaging();
 }


 private examsGet() {
   this.httpService.examsGet()
     .pipe(map(response => this.dataSource.data = response))
     .subscribe();
 }

 public examsSearch(value: string) {
   this.httpService.examsSearch(value)
     .pipe(map(response => this.dataSource.data = response))
     .subscribe();
 }

 public onDeleteClick(id: number) {
   const dialogRef = this.confirmDialogService.openConfirmDialog('هل انت متأكد من رغبتك في حذف الاختبار');
   dialogRef.afterClosed().subscribe(result => {
     if (result) {
       this.httpService.examsDelete(id).pipe(
         switchMap(response => this.httpService.examsGet().pipe(map(response => this.dataSource.data = response))),
         finalize(() => this.notificationService.delete('تم حذف الاختبار'))
       ).subscribe();
     }
   });
 }


 openDialog(id: number): void {
   const dialogRef = this.dialog.open(ExamsFormComponent, {
     width: '350px',
     data: { id: id }
   });
   dialogRef.afterClosed().subscribe(result => {
    if (result != null && (result.event == 'Add' || result.event == 'Update')) {
       //console.log('operation ', result);
       this.examsGet();
     }    
   });
 }


 applySortingAndPaging(): void {
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
 }


}
