import { SettingsFormComponent } from './../../settings/settings-form/settings-form.component';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router,
    public dialog: MatDialog,
    private authService:AuthService) { }
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingsFormComponent, {
      width: '350px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(result => {    
      if (result != null && (result.event == 'Add' || result.event == 'Update')) {
      
      
      }    
    });
  }

}
