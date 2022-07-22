import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  response!: any;
  registered: boolean = false;
  errorOccured: boolean = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    })
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/login']);
  }

  onPasswordChange() {
    if (this.confirmPassword.value == this.password.value) {
      this.confirmPassword.setErrors(null);
    } else {
      this.confirmPassword.setErrors({ mismatch: true });
    }
  }

  get password(): AbstractControl {
    return this.registerForm.controls['password'];
  }
  
  get confirmPassword(): AbstractControl {
    return this.registerForm.controls['confirmPassword'];
  }

  doSignUp(): void {
    if(this.registerForm.valid) {
      this.userService.doSignUp(this.registerForm.value).subscribe(response=> {
        this.response = response;
        this.registered = true;
        this.errorOccured = false;
        this.registerForm.reset();
        this.reloadComponent();
        this.toastrService.success("User registered successfully! Now you can login.", "Success", {
          progressBar: true,
          timeOut: 3000
        })
        // this.router.navigate(['/login', {registered: true}]);
        // setTimeout(() => {
        //   this.registered = false;
        // }, 3000);
      }, error=> {
        this.registered = false;
        this.registerForm.reset();
        this.errorOccured = true;
        this.toastrService.error("Some Error Occured!", "Error", {
          progressBar: true,
          timeOut: 3000
        })
        // setTimeout(() => {
        //   this.errorOccured = false;
        // }, 5000);
      })
      
    }

    
  }
}
