import { DialogService } from '@services/dialog.service';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { Observable } from 'rxjs';
import { Level } from '@models/level';
import { LevelsService } from '@services/levels.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { map, switchMap, tap, finalize } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LevelsFormComponent } from '../levels-form/levels-form.component';

@Component({
  selector: 'app-levels-list',
  templateUrl: './levels-list.component.html',
  styleUrls: ['./levels-list.component.css']
})
export class LevelsListComponent implements OnInit {

  //Datatable
  public displayedColumns = ['name', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Level>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchText: string = '';


  // MatPaginator Inputs
  length = 100; // total number of records
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];


  constructor(private httpService: LevelsService,
    private confirmDialogService: DialogService,
    private notificationService: NotificationDialogService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.levelsGet();
  }

  ngAfterViewInit(): void {
    this.applySortingAndPaging();
  }

  //not used
  public onPaginateChange(pageEvent: PageEvent) {
    this.length = pageEvent.length;
    this.pageSize = pageEvent.pageSize;
  }

  private levelsGet() {
    this.httpService.levelsGet()
      .pipe(map(response => this.dataSource.data = response))
      .subscribe();
  }

  public levelsSearch(value: string) {
    this.httpService.levelsSearch(value)
      .pipe(map(response => this.dataSource.data = response))
      .subscribe();
  }

  public onDeleteClick(id: number) {
    const dialogRef = this.confirmDialogService.openConfirmDialog('هل انت متأكد من رغبتك في حذف المرحلة');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpService.levelsDelete(id).pipe(
          switchMap(response => this.httpService.levelsGet().pipe(map(response => this.dataSource.data = response))),
          finalize(() => this.notificationService.delete('تم حذف المرحلة بنجاح'))
        ).subscribe();
      }
    });
  }


  openDialog(id: number): void {
    const dialogRef = this.dialog.open(LevelsFormComponent, {
      width: '350px',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result != null && (result.event == 'Add' || result.event == 'Update')) {
        //console.log('operation ', result);
        this.levelsGet();
      }
    });
  }


  applySortingAndPaging(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
