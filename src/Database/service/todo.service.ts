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

  //CREATE
  addList(list: List) {
    return this.todoListdb.push(list);
  }

  //READ
  getList() {
    return this.db.list<List>('Todo-list', ref => ref.orderByChild('status').equalTo('active') && ref.orderByChild('done').equalTo('Uncomplete')); //filter display only with the status = "active"

    // return this.todoListdb.db.list('/Todo-list', ref => ref.orderByChild('status').equalTo('active'))
    // return this.todoListdb;
  }
  completedList() {
    return this.completeListObservables;
  }

  //UPDATE
  editList(list: List) {
    return this.todoListdb.update(list.key, list);
  }

  //COMPLETED
  completList(list: List) {
    let complete = {
      TodoListID: list.key,
      ListName: list.ListName,
      date: Date(),
      category: list.category,
      status: list.status,
      done: 'Completed'
    }
    list.done = 'Completed'
    return this.todoListdb.update(list.key,list),
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

}