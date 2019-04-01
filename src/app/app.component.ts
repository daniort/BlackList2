import { Component,Output,Input } from '@angular/core';

import {UserService} from '../app/servicios/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input() id:string;

  title = 'BlackList';
  salir:boolean=false;
  logeado:boolean;

  constructor(private  UserService:UserService){}

  onLogear(id):void{
    this.id=id;
    if (this.id != null) {
        this.logeado=true;
    }
  }
  onBrake(){
    this.salir=true;
  }
  onConfirmer(){
    this.salir=false;
    this.logeado=!this.logeado;
    this.UserService.Reset();
  }
}
