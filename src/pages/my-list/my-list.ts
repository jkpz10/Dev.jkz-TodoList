import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { List } from '../../Database/Todo-List/list';
import { TodoService } from '../../Database/service/todo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Completed } from '../../Database/Todo-List/completed';
import { CompletedListPage } from '../completed-list/completed-list';

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
    date: '',
    category: '',
    status: '',
  }

  IsHidden = true; //hide serach input

  //SEARCH script

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private todoList: TodoService
  ) {

      this.initializeItems();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyListPage');
  }

  //Custom methods

  date = new Date();
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  dateNow = `${this.months[this.date.getMonth()]} ${this.date.getDate()}, ${this.date.getFullYear()} | ${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`;

  showSearch() {
    this.IsHidden = !this.IsHidden;
  }

  test(list: List) {
    console.log(list);
  }

  click() {
    console.log("clicked");
  }
  //navigate to Completed List
  showCompleted() {
    this.navCtrl.push(CompletedListPage);
  }

  //VIEW LIST ALERT
  showConfirm(list: List) {
    const confirm = this.alertCtrl.create({
      title: 'Mark as complete?',
      message: `<h6 class="no-margin">${list.ListName.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')} Details</h6><br><p class="no-margin">
        Date Added: ${list.date}<br>Tags: <span class="text-color-primary">${list.category}</span></p>`,
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

            this.todoList.completList(list);
          }
        }
      ]
    });
    confirm.present();
  }

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
      title: 'Options',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            console.log('Remove clicked');

            this.todoList.delete(list);
          }
        }, {
          text: 'Edit',
          handler: () => {
            console.log('Edit clicked');

            this.showEdit(list);
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
      message: "Enter a name of this list and category",
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
              date: this.dateNow,
              category: data.category,
              status: 'active',
            }
            this.todoList.addList(this.list); //push data to firebase
          }
        }
      ]
    });
    prompt.present();
  }

  showEdit(list: List) {
    const prompt = this.alertCtrl.create({
      title: 'Edit',
      message: "Edit the name of this list and category",
      inputs: [
        {
          name: 'ListName',
          placeholder: 'Name',
          type: 'text',
          value: list.ListName
        },
        {
          name: 'category',
          placeholder: 'Tags',
          type: 'text',
          value: list.category
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
              key: list.key,
              ListName: data.ListName,
              date: this.dateNow,
              category: data.category,
              status: list.status
            }
            this.todoList.editList(this.list); //update data to firebase
          }
        }
      ]
    });
    prompt.present();
  }

  initializeItems(){
    this.todoView = this.todoList.getList()
      .snapshotChanges()
      .map(change => {
        return change.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      }).map(changes => changes.reverse());
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    // if (val && val.trim() != '') {
    //   this.todoView = this.items.filter((list) => {
    //     return (list.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //   })
    // }
  }

}