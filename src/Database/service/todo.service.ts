import { Injectable } from "@angular/core";
import { List } from "../Todo-List/list";
import { AngularFireDatabase } from "angularfire2/database";


@Injectable()
export class TodoService {

    private todoListdb = this.db.list<List>('Todo-list');

    constructor(
      private db: AngularFireDatabase
    
    ) {}

    //CREATE
    addList(list:List){
      return this.todoListdb.push(list);
    }

    //READ
    getList(){
      return this.todoListdb;
    }

    //UPDATE
    editList(list:List){
      return this.todoListdb.update(list.key, list);
    }

    //DELETE permanently
    removeList(list:List){
      return this.todoListdb.remove(list.key);
    }

  }