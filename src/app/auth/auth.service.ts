import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }
  
  constructor() { }

  public makeMeLoggedIn() {
    this.loggedIn.next(true);
  }
}
