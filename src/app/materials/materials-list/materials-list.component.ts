import { MaterialsService } from '@services/materials.service';
import { Material } from '@models/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogService } from '@services/dialog.service';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { finalize, map, switchMap } from 'rxjs/operators';
import { MaterialsFormComponent } from '../materials-form/materials-form.component';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.css']
})
export class MaterialsListComponent implements OnInit {

 //Datatable
 public displayedColumns = ['name','levelName', 'update', 'delete'];
 public dataSource = new MatTableDataSource<Material>();
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatPaginator) paginator: MatPaginator;
 searchText: string = '';



 constructor(private httpService: MaterialsService,
   private confirmDialogService: DialogService,
   private notificationService: NotificationDialogService,
   public dialog: MatDialog) { }

 ngOnInit(): void {
   this.materialsGet();
 }

 ngAfterViewInit(): void {
   this.applySortingAndPaging();
 }


 private materialsGet() {
   this.httpService.materialsGet()
     .pipe(map(response => this.dataSource.data = response))
     .subscribe();
 }

 public materialsSearch(value: string) {
   this.httpService.materialsSearch(value)
     .pipe(map(response => this.dataSource.data = response))
     .subscribe();
 }

 public onDeleteClick(id: number) {
   const dialogRef = this.confirmDialogService.openConfirmDialog('هل انت متأكد من رغبتك في حذف المادة');
   dialogRef.afterClosed().subscribe(result => {
     if (result) {
       this.httpService.materialsDelete(id).pipe(
         switchMap(response => this.httpService.materialsGet().pipe(map(response => this.dataSource.data = response))),
         finalize(() => this.notificationService.delete('تم حذف المادة بنجاح'))
       ).subscribe();
     }
   });
 }


 openDialog(id: number): void {
   const dialogRef = this.dialog.open(MaterialsFormComponent, {
     width: '350px',
     data: { id: id }
   });
   dialogRef.afterClosed().subscribe(result => {
    if (result != null && (result.event == 'Add' || result.event == 'Update')) {
       //console.log('operation ', result);
       this.materialsGet();
     }    
   });
 }


 applySortingAndPaging(): void {
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
 }

}
