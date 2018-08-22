//Toast Features from Ionic documentation
import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";

@Injectable()
export class CustomToast {

  constructor(private toastCtrl: ToastController){

  }

  display(message: string, duration: number = 3000, position: string){
    return this.toastCtrl
      .create({
        message,
        duration,
        position,
      })
      .present();
  }
}