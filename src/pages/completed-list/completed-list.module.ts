import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletedListPage } from './completed-list';

@NgModule({
  declarations: [
    CompletedListPage,
  ],
  imports: [
    IonicPageModule.forChild(CompletedListPage),
  ],
})
export class CompletedListPageModule {}
