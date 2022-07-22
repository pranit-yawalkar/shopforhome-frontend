import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User;
  token!: string | null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.getUserByToken(this.token);
    }
  }

  getUserByToken(token: string): void {
    this.userService.getUserByToken(token).subscribe(user => {
      this.user = user;
      console.log(user);
    });
  }

}
