import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Completed } from '../../Database/Todo-List/completed';
import { TodoService } from '../../Database/service/todo.service';
import { List } from '../../Database/Todo-List/list';

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
    private todoList: TodoService) {

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

  showSearch() {
    this.IsHidden = !this.IsHidden;
  }

  //view
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
      message: `<p class="text-left">Date Added: ${completed.date}<br>Tags: <span class="text-color-primary">${completed.category}</span></p>`,

      buttons: ['OK']
    });
    alert.present();
  }

  //settings - more
  singleSettings(completed: Completed) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            console.log('Remove clicked');
            this.todoList.removeCompletList(completed);
          }
        },{
          text: 'Edit',
          handler: () => {
            console.log('Edit clicked');
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

}
