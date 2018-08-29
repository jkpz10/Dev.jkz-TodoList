import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Completed } from '../../Database/Todo-List/completed';
import { TodoService } from '../../Database/service/todo.service';
import { List } from '../../Database/Todo-List/list';
import { CustomToast } from '../../services/toast/toast.service';

/**
 * Generated class for the CompletedListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-completed-list',
  templateUrl: 'completed-list.html',
})
export class CompletedListPage {

  todoView: Observable<List[]>
  items: Observable<Completed[]>


  completed: Completed = {
    ListID: '',
    ListName: '',
    date: '',
    category: '',
    status: '',

  }

  IsHidden = true; //hide serach input

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private todoList: TodoService,
    private myToast: CustomToast
  ) {

    //script to read data from completed table

    this.items = this.todoList.completedList()
      .snapshotChanges()
      .map(change => {
        return change.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      }).map(changes => changes.reverse());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompletedListPage');
  }

  //Custom methods From My-list.ts
  //search toggle to hide or show search bar
  showSearch() {
    this.IsHidden = !this.IsHidden;
  }

  //view lists informations
  showSingleList(completed: Completed) {
    const alert = this.alertCtrl.create({
      title: completed.ListName.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
      //.toLowerCase()
      // .split(' ')
      // .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      // .join(' ')
      cssClass: 'text-left',
      message: `<p class="text-left">Date Added: ${completed.date}<br>Category: <span class="text-color-primary">${completed.category}</span></p>`,

      buttons: ['OK']
    });
    alert.present();
  }

  //settings - trigger this method when more icon is clicked
  singleSettings(completed: Completed) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            console.log('Remove clicked');
            this.myToast.display(`Removed Successfuly`, 3000, `top`)
            this.DeleteConfirm(completed);
          }
        }, {
          text: 'Mark as Uncomplete',
          handler: () => {
            console.log('Uncomplete clicked');
            this.myToast.display(`Task set to uncomplete`, 3000, `top`)
            this.todoList.removeCompletList(completed);
            ;
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  //confirmation alert

  DeleteConfirm(completed: Completed) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure you want to delete?',
      message: `<h6 class="no-margin">${completed.ListName.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')}</h6><br><p class="no-margin">
        will be permanently deleted from our server.`,
      buttons: [
        {
          text: 'Disagree',
          cssClass: 'text-color-danger',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');

            this.todoList.deletePermanent(completed);//call method from TodoService when agree button is clicked
          }
        }
      ]
    });
    confirm.present();
  }

}
