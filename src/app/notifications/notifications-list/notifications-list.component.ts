import { Notification } from '@models/notification';
import { NotificationsService } from '@services/notifications.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogService } from '@services/dialog.service';
import { NotificationDialogService } from '@services/notification-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, map, switchMap } from 'rxjs/operators';
import { NotificationsFormComponent } from '../notifications-form/notifications-form.component';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit {


  //Datatable
  public displayedColumns = ['name', 'apperanceDate', 'endDate', 'levelName', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Notification>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchText: string = '';



  constructor(private httpService: NotificationsService,
    private confirmDialogService: DialogService,
    private notificationService: NotificationDialogService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.notificationsGet();
  }

  ngAfterViewInit(): void {
    this.applySortingAndPaging();
  }


  private notificationsGet() {
    this.httpService.notificationsGet()
      .pipe(map(response => this.dataSource.data = response))
      .subscribe();
  }

  public notificationsSearch(value: string) {
    this.httpService.notificationsSearch(value)
      .pipe(map(response => this.dataSource.data = response))
      .subscribe();
  }

  public onDeleteClick(id: number) {
    const dialogRef = this.confirmDialogService.openConfirmDialog('هل انت متأكد من رغبتك في حذف الاشعار');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpService.notificationsDelete(id).pipe(
          switchMap(response => this.httpService.notificationsGet().pipe(map(response => this.dataSource.data = response))),
          finalize(() => this.notificationService.delete('تم حذف المادة الاشعار'))
        ).subscribe();
      }
    });
  }


  openDialog(id: number): void {
    const dialogRef = this.dialog.open(NotificationsFormComponent, {
      width: '350px',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'Add' || result.event == 'Update')) {
        //console.log('operation ', result);
        this.notificationsGet();
      }
    });
  }


  applySortingAndPaging(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
