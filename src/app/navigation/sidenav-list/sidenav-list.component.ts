import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent {
  @Input() isAuth: boolean;
  @Output() closeSidenav = new EventEmitter<void>();
  @Output() logOut = new EventEmitter<void>();

  onClose() {
    this.closeSidenav.emit();
  }

  onLogOut() {
    this.logOut.emit();
  }
}
