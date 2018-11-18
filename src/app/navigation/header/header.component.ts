import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isAuth: boolean;
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() logOut = new EventEmitter<void>();

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogOut() {
      this.logOut.emit();
  }

}
