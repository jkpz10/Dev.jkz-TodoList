import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyListPage } from '../my-list/my-list';
import { CustomToast } from '../../services/toast/toast.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private myToast: CustomToast
  ) {}
  

  //METHODS to Navigate pages
  
  goToMyList(){
    this.navCtrl.push(MyListPage);
  }

  //custom methods
  comingSoon(){ //Coming soon features
    this.myToast.display(`Coming Soon !!!`,3000,`top`);
  }
}
