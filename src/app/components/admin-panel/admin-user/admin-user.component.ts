import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {
  userForm!: FormGroup;
  updateUserForm!: FormGroup;
  users!: User[];
  user!: User;
  token!: string | null;
  response!: any;
  registered: boolean = false;
  errorOccured: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private toastrService: ToastrService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.getAllUsers(this.token);
    } else {
      this.toastrService.error("Access Denied!", "Error", {
        timeOut: 3000,
        progressBar: true,
      })
    }
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      role: ['', Validators.required]
    })
    this.updateUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      role: ['', Validators.required]
    })
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  onPasswordChange() {
    if (this.confirmPassword.value == this.password.value) {
      this.confirmPassword.setErrors(null);
    } else {
      this.confirmPassword.setErrors({ mismatch: true });
    }
  }

  get password(): AbstractControl {
    return this.userForm.controls['password'];
  }

  get confirmPassword(): AbstractControl {
    return this.userForm.controls['confirmPassword'];
  }

  doSignUp(): void {
    if (this.userForm.valid) {
      this.userService.doSignUp(this.userForm.value).subscribe(response => {
        this.response = response;
        this.registered = true;
        this.errorOccured = false;
        this.userForm.reset();
        this.reloadComponent("/admin-panel/users");
        this.toastrService.success("User added successfully!", "Success", {
          progressBar: true,
          timeOut: 3000
        })
      }, error => {
        this.registered = false;
        this.userForm.reset();
        this.errorOccured = true;
        this.toastrService.error("Some Error Occured!", "Error", {
          progressBar: true,
          timeOut: 3000
        })
      })

    }
  }

  onClickAddButton(): void {
    this.userForm.reset();
  }

  onClickUpdateButton(id: number): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(user => {

        this.userService.getUserById(id, user.role).subscribe(updateUser => {
          this.user = updateUser;
          this.updateUserForm.patchValue({
            firstName: updateUser.firstName,
            lastName: updateUser.lastName,
            email: updateUser.email,
            contactNumber: updateUser.contactNumber,
            address: updateUser.address,
            city: updateUser.city,
            state: updateUser.state,
            zipCode: updateUser.zipCode,
            role: updateUser.role,
          })
        }, error => {
          console.log(error);
        })
      }, error => {
        console.log(error);
      })
    } else {
      console.log("Something went wrong");
    }

  }

  getAllUsers(token: string): void {
    this.userService.getUserByToken(token).subscribe(user => {
      this.userService.getAllUsers(user.role).subscribe(users => {
        this.users = users;
      }, error => {
        this.toastrService.error("Access Denied!", "Error", {
          timeOut: 3000,
          progressBar: true,
        })
      })
    })
  }

  updateUser() {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(response => {
        this.userService.updateUser(this.user.id, response.role, this.updateUserForm.value).subscribe(response => {
          this.toastrService.success("user updated successfully!", "Success", {
            timeOut: 3000,
            progressBar: true,
          })
          this.reloadComponent("/admin-panel/users")

        }, error => {
          this.toastrService.error("Something went wrong!", "Error", {
            timeOut: 3000,
            progressBar: true,
          })
        })
      })
    }
  }

  deleteUser(id: number) {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(response => {
        this.userService.deleteUser(id, response.role).subscribe(response => {
          this.toastrService.success("user deleted successfully!", "Success", {
            timeOut: 3000,
            progressBar: true,
          })
          this.reloadComponent("/admin-panel/users")

        }, error => {
          this.toastrService.error("Something went wrong!", "Error", {
            timeOut: 3000,
            progressBar: true,
          })
        })
      })
    } else {
      console.log("Access Denied!");
    }
  }
}


