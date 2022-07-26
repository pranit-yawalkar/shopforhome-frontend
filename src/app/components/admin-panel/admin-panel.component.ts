import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  token!: string | null;
  user!: User;

  constructor(private userService: UserService) { }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(user => {
        this.user = user;
      })
    }
  }

}
