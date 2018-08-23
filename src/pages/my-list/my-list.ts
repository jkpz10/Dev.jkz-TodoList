import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { List } from '../../Database/Todo-List/list';
import { TodoService } from '../../Database/service/todo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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

  list: List = {
    ListName: '',
    date: undefined,
    category: '',
  }

  IsHidden = true; //hide serach input


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private todoList: TodoService
  ) {
    this.todoView = this.todoList.getList()
      .snapshotChanges()
      .map(change => {
        return change.map( c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyListPage');
  }

  //Custom methods

  showSearch() {
    this.IsHidden = !this.IsHidden;
  }

  click() {
    console.log("clicked");
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
          name: 'date',
          placeholder: 'Date',
          type: 'date'
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
              date: data.date,
              category: data.category
            }
            this.todoList.addList(this.list); //push data to firebase
          }
        }
      ]
    });
    prompt.present();
  }
}