import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {UserService} from '../../servicios/user.service';
import {UserInterface} from '../../interfaces/userinterface';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  dato:boolean=false;
  userritem:UserInterface[];
  UserParaEditar:UserInterface;
  constructor(private router:Router,private  UserService:UserService) { }

  ngOnInit() {
    if (!this.UserService.info()) {
      console.log(this.UserService.info());
      this.router.navigate(['deudores']);
    }
    this.UserService.getUsers().subscribe(users =>{
            this.userritem=users;
       });
  }

  onChange(user: UserInterface){
    if (user.user!="ADMIN") {
      this.UserParaEditar=user;
      this.UserParaEditar.estado=!user.estado;
      console.log(user);
      this.UserService.editUser(this.UserParaEditar);
      this.ngOnInit();
    }

  }

}
