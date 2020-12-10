import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AccessoComponent } from './accesso/accesso.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountPageComponent } from './account-page/account-page.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { TasksComponent } from './tasks/tasks.component';
import { SettingsComponent } from './settings/settings.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './logout/logout.component';
import { CreateListComponent } from './create-list/create-list.component';
import { FilterByIdPipe } from './filter-by-id.pipe';
import { CreateTaskComponent } from './create-task/create-task.component';
import { CompletedPipe } from './completed.pipe';
import { UpdateTaskComponent } from './update-task/update-task.component';
import {NgsRevealModule} from 'ngx-scrollreveal';
import { TaskNotComplCounterPipe } from './task-not-compl-counter.pipe';
import { TaskComplCounterPipe } from './task-compl-counter.pipe';
import { RequestPasswordComponent } from './request-password/request-password.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    AccessoComponent,
    RegistrazioneComponent,
    FooterComponent,
    AccountPageComponent,
    AccountSidebarComponent,
    TasksComponent,
    SettingsComponent,
    LogoutComponent,
    CreateListComponent,
    FilterByIdPipe,
    CreateTaskComponent,
    CompletedPipe,
    UpdateTaskComponent,
    TaskNotComplCounterPipe,
    TaskComplCounterPipe,
    RequestPasswordComponent,
  ],
  imports: [
    NgScrollbarModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgsRevealModule,
  ],
  providers: [


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
