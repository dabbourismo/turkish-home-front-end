import { UnitsFormComponent } from './../units-form/units-form.component';
import { finalize, map, switchMap } from 'rxjs/operators';
import { NotificationDialogService } from './../../services/notification-dialog.service';
import { DialogService } from './../../services/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Unit } from '@models/unit';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UnitService } from '@services/unit.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.css']
})
export class UnitsListComponent implements OnInit {


  //Datatable
  public displayedColumns = ['name','levelName', 'materialName', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Unit>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchText: string = '';



  constructor(private httpService: UnitService,
    private confirmDialogService: DialogService,
    private notificationService: NotificationDialogService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.unitsGet();
  }

  ngAfterViewInit(): void {
    this.applySortingAndPaging();
  }


  private unitsGet() {
    this.httpService.unitsGet()
      .pipe(map(response => this.dataSource.data = response))
      .subscribe();
  }

  public unitsSearch(value: string) {
    this.httpService.unitsSearch(value)
      .pipe(map(response => this.dataSource.data = response))
      .subscribe();
  }

  public onDeleteClick(id: number) {
    const dialogRef = this.confirmDialogService.openConfirmDialog('هل انت متأكد من رغبتك في حذف الوحدة');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpService.unitsDelete(id).pipe(
          switchMap(response => this.httpService.unitsGet().pipe(map(response => this.dataSource.data = response))),
          finalize(() => this.notificationService.delete('تم حذف الوحدة'))
        ).subscribe();
      }
    });
  }


  openDialog(id: number): void {
    const dialogRef = this.dialog.open(UnitsFormComponent, {
      width: '350px',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'Add' || result.event == 'Update')) {
        //console.log('operation ', result);
        this.unitsGet();
      }
    });
  }


  applySortingAndPaging(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
