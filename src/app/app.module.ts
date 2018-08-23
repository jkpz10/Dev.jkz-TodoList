import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//ANGULAR FIREBASE IMPORTS
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { config } from './firebase.api';
import { TodoService } from '../Database/service/todo.service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MyListPage } from '../pages/my-list/my-list';
import { CustomToast } from '../services/toast/toast.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MyListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MyListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoService,
    CustomToast
  ]
})
export class AppModule {}
