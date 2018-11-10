import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../rest-api.service";
import { DataService } from "../data.service";
import { Router } from "@angular/router";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  password1 = '';
  isSeller = false;

  btnDisabled = false;

  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  ngOnInit() {
  }

  validate() {
    if (this.name) {
      if (this.email) {
        if (this.password) {
          if (this.password1) {
            if (this.password === this.password1) {
              return true;
            } else {
              Swal('Message!',
                'Password do not match!',
                'error');
              //this.data.error('Password do not match.');
            }

          } else {
            Swal('Message!',
              'Confirmation password is not entered!',
              'error');
            //this.data.error('Confirmation password is not entered.');
          }

        } else {
          Swal('Message!',
            'Password is not entered!',
            'error');
          //this.data.error('Password is not entered');
        }

      } else {
        Swal('Message!',
          'Email is not entered!',
          'error');
        //this.data.error('Email is not entered.');
      }

    } else {
      Swal('Message!',
        'Name is not entered!',
        'error');
      //this.data.error('Name is not entered.');
    }
  }
  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/signup',
          {
            name: this.name,
            email: this.email,
            password: this.password,
            isSeller: this.isSeller

          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          await this.data.getProfile();
          this.router.navigate(['profile/address'])
            .then(() => {
              this.data.success(
                'Successfully registered! Please enter you shipping address below.'
              );
            }).catch(error => this.data.error(error))
        } else {
          Swal('Message!',
            'Error occured!',
            'error');
          //this.data.error(data['message']);
        }
      }

    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }
}
