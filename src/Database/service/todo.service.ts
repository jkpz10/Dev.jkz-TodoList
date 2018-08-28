import { Injectable } from "@angular/core";
import { List } from "../Todo-List/list";
import { AngularFireDatabase } from "angularfire2/database";
import { Completed } from "../Todo-List/completed";


@Injectable()
export class TodoService {

  private todoListdb = this.db.list<List>('Todo-list');
  private completeListdb = this.db.list('Completed');
  private completeListObservables = this.db.list<Completed>('Completed');

  constructor(
    private db: AngularFireDatabase

  ) { }

  //For Timestamp
  date = new Date();
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
  dateNow = `${this.months[this.date.getMonth()]} ${this.date.getDate()}, ${this.date.getFullYear()} | ${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`;

  //CREATE
  addList(list: List) {
    return this.todoListdb.push(list);
  }

  //READ
  getList() {
    return this.db.list<List>('Todo-list', ref => ref.orderByChild('status').equalTo('active'));
  }
  //filter display only with the status = "active"

  // return this.todoListdb.db.list('/Todo-list', ref => ref.orderByChild('status').equalTo('active'))
  // return this.todoListdb;

  //UPDATE
  editList(list: List) {
    return this.todoListdb.update(list.key, list);
  }

  //COMPLETED
  completList(list: List) {
    let complete = {
      ListID: list.key,
      ListName: list.ListName,
      date: this.dateNow,
      category: list.category,
      status: 'Completed',
    }
    list.status = 'Completed'
    return this.todoListdb.update(list.key, list),
      this.completeListdb.push(complete);
  }

  //temporary delete
  delete(list: List) {
    list.status = 'removed';
    return this.todoListdb.update(list.key, list);
  }

  //DELETE permanently
  removeList(list: List) {
    return this.todoListdb.remove(list.key);
  }

  //FOR COMPLETED PAGE
    //READ
  completedList() {
    return this.completeListObservables;
  }
    //DELETE
  removeCompletList(completed: Completed) {
    let x = {
      ListName: completed.ListName,
      date: this.dateNow,
      category: completed.category,
      status: 'active'
    }

    return this.completeListObservables.remove(completed.key), this.todoListdb.update(completed.ListID, x);
  }

}