import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { List } from '../../Database/Todo-List/list';
import { TodoService } from '../../Database/service/todo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Completed } from '../../Database/Todo-List/completed';
import { CompletedListPage } from '../completed-list/completed-list';
import { CustomToast } from '../../services/toast/toast.service';

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

  // LIST Properties. 

  todoView: Observable<List[]>
  items: Observable<Completed[]>

  list: List = {
    ListName: '',
    date: '',
    category: '',
    status: '',
  }

//Search properties
  IsHidden = true; //hide serach input


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private todoList: TodoService,
    private myToast: CustomToast
  ) {

      this.initializeItems(); // method to read data from firebase
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyListPage');
  }

  //Custom methods
    //script for timestamp purpose
  date = new Date();
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  dateNow = `${this.months[this.date.getMonth()]} ${this.date.getDate()}, ${this.date.getFullYear()} | ${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`;


  //method to show and hide search bar when click
  showSearch() {
    this.IsHidden = !this.IsHidden;
  }


// test methods for testing click events 
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

  //VIEW LIST ALERT -- source ionic components 
  // confirm if user want to complete the task
  showConfirm(list: List) {
    const confirm = this.alertCtrl.create({
      title: 'Are you done with this list?',
      message: `<p class="no-margin">
        Details <br>
        List name: ${list.ListName.toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')} <br>
        Date Added: ${list.date}<br>Category: <span class="text-color-primary">${list.category}</span></p>`,
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

            this.myToast.display(`Task Completed`,3000,`top`)
            this.todoList.completList(list);//call method from TodoService when agree button is clicked
          }
        }
      ]
    });
    confirm.present();
  }

  // Display alert -- all information of each list clicked.
    //basic alert - ionic components
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
      message: `<p class="text-left">Date Added: ${list.date}<br>Category: <span class="text-color-primary">${list.category}</span></p>`,

      buttons: ['OK']
    });
    alert.present();
  }

  removeConfirm(list: List) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure you want to remove?',
      message: `<p class="no-margin">
        Details <br>
        List name: ${list.ListName.toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')} <br>
        Date Added: ${list.date}<br>Category: <span class="text-color-primary">${list.category}</span></p>`,
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

            this.myToast.display(`Item removed`,3000,`top`)
            this.todoList.delete(list);//call method from TodoService when agree button is clicked
          }
        }
      ]
    });
    confirm.present();
  }

  //SETTINGS-SINGLE ALERT -- when more icons clicked. trigger this method -- 
    //Action sheet -  ionic components
  singleSettings(list: List) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            console.log('Remove clicked');

            this.removeConfirm(list);
          }
        },{
          text: 'Mark as Complete',
          handler: () => {
            console.log('Complete clicked');

            this.showConfirm(list);
          }
        },{
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
    //prompt alert - ionic component
  showAdd() {
    const prompt = this.alertCtrl.create({
      title: 'Add List',
      message: "Enter a name of this list and category",
      inputs: [
        {
          name: 'ListName',
          placeholder: 'List Name',
          type: 'text'
        },
        {
          name: 'category',
          placeholder: 'Category',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'text-color-danger',
          handler: data => {
            console.log('Cancel');
          }
        },
        {
          text: 'Add',
          handler: data => {
            console.log('Saved');
            this.list = {
              ListName: data.ListName,
              date: Date(),
              category: data.category,
              status: 'active',
            }
            this.myToast.display(`Added Successfuly`,3000,`top`)
            this.todoList.addList(this.list); //push data to firebase
          }
        }
      ]
    });
    prompt.present();
  }

  //Edit Alert
    //prompt alert - ionic components
  showEdit(list: List) {
    const prompt = this.alertCtrl.create({
      title: 'Edit',
      message: "Edit the name of this list and category",
      inputs: [
        {
          name: 'ListName',
          placeholder: 'List Name',
          type: 'text',
          value: list.ListName
        },
        {
          name: 'category',
          placeholder: 'Category',
          type: 'text',
          value: list.category
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'text-color-danger',
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
              date: Date(),
              category: data.category,
              status: list.status
            }
            this.myToast.display(`Updated Successfuly`,3000,`top`);
            this.todoList.editList(this.list); //update data from firebase
          }
        }
      ]
    });
    prompt.present();
  }

  // method query to read data from firebase using angularfire
  initializeItems(){ //output data to view
    this.todoView = this.todoList.getList()
      .snapshotChanges()
      .map(change => {
        return change.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      }).map(changes => changes.reverse());
  }

  //Search script -- still not working.
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