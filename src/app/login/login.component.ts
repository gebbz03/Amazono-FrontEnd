import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DataService } from "../data.service";
import { RestApiService } from "../rest-api.service";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email='';
  password='';


  btnDisabled=false;

  constructor(
    private router:Router,
    private rest: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
  }


  validate(){
    if(this.email){
      if(this.password){
        return true;
      }else{
        Swal('Message!',
        'Password is not entered!',
        'error');
        //this.data.error('Password is not entered.');
      }

    }else{
      Swal('Message!',
      'Email is not entered!',
      'error');
      //this.data.error('Email is not entered');
    }
  }

async login(){

  this.btnDisabled=true;

  try{
    if(this.validate()){
      const data= await this.rest.post(
        'http://localhost:3030/api/accounts/login',
        {
          email:this.email,
          password:this.password
        }
      );
      if(data['success']){
        localStorage.setItem('token',data['token']);
        await this.data.getProfile();
        this.router.navigate(['/']);
        Swal('Message!',
        'Successfully logged in!',
        'success');
      }else{
        Swal('Message!',
        'Login Failed!',
        'error');
        //this.data.error(data['message']);
      }
    }

  }catch(error){
    this.data.error(error['message']);
  }
  this.btnDisabled=false;
}   

}
