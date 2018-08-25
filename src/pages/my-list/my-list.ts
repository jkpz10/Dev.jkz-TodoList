import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { List } from '../../Database/Todo-List/list';
import { TodoService } from '../../Database/service/todo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Completed } from '../../Database/Todo-List/completed';

//FIX OBSERVALBE to able  to view list
// npm i rxjs@6 rxjs-compat@6 promise-polyfill --save
// then add import 'rxjs/add/operator/map';

/**
 * Generated class for the MyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-list',
  templateUrl: 'my-list.html',
})
export class MyListPage {

  todoView: Observable<List[]>
  items: Observable<Completed[]>

  list: List = {
    ListName: '',
    date: undefined,
    category: '',
    status: '',
    done: ''
  }

  IsHidden = true; //hide serach input


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private todoList: TodoService
  ) {

    this.todoView = this.todoList.getList()
      .snapshotChanges()
      .map(change => {
        return change.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      }).map(changes => changes.reverse());

    this.items = this.todoList.completedList()
      .snapshotChanges()
      .map(change => {
        return change.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      }).map(changes => changes.reverse());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyListPage');
  }

  //Custom methods

  showSearch() {
    this.IsHidden = !this.IsHidden;
  }

  test(list: List) {
    console.log(list);
  }

  click() {
    console.log("clicked");
  }

  //VIEW LIST ALERT
  showSingleList(list: List) {
    const alert = this.alertCtrl.create({
      title: list.ListName.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
      //.toLowerCase()
      // .split(' ')
      // .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      // .join(' ')
      cssClass: 'text-left',
      message: `<p class="text-left">Date Added: ${list.date}<br>Tags: <span class="text-color-primary">${list.category}</span></p>`,

      buttons: ['OK']
    });
    alert.present();
  }

  //SETTINGS-SINGLE ALERT
  singleSettings(list: List) {
    const actionSheet = this.actionSheetCtrl.create({
      title: list.ListName.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            console.log('Remove clicked');

            this.todoList.delete(list);
          }
        }, {
          text: 'Mark as Complete',
          handler: () => {
            console.log('Complete clicked');

            this.todoList.completList(list);
          }
        }, {
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

  //ADD ALERT
  showAdd() {
    const prompt = this.alertCtrl.create({
      title: 'Add List',
      message: "Enter a name of this list , date and category",
      inputs: [
        {
          name: 'ListName',
          placeholder: 'Name',
          type: 'text'
        },
        {
          name: 'category',
          placeholder: 'Tags',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved');
            this.list = {
              ListName: data.ListName,
              date: Date(),
              category: data.category,
              status: 'active',
              done: 'Uncomplete'
            }
            this.todoList.addList(this.list); //push data to firebase
          }
        }
      ]
    });
    prompt.present();
  }
}