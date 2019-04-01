import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
import {UserService} from '../../servicios/user.service';
import {DeudasService} from '../../servicios/deudas.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menumobile:boolean=false;
  menu:boolean=false;
  nombre:string=null;
  admin:string="ADMIN";
  salir:boolean=null;

  root:boolean=null
  @Output() public brake = new EventEmitter<void>();
  @Input("iduser") id:string;
  constructor(private  UserService:UserService,
    private DeudasService:DeudasService) { }

  ngOnInit() {
    this.DeudasService.setUserActive(this.id);
    this.UserService.getUsers().subscribe(users =>{
             for (let unUser of users) {
               if (unUser.id===this.id) {
                   this.nombre=unUser.user;
                   if (unUser.user===this.admin) {
                       this.root=true;
                   }
               }
           }
       });



    //this.obtenerUsuario();
  }
  onMostrarmenu(){
    this.menu=!this.menu;
    this.menumobile=!this.menumobile
  }
  onSalir(){
    this.salir=true;
  }
  onNSalir(){
    this.salir=false;
  }

}
