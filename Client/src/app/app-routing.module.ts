import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AccessoComponent} from './accesso/accesso.component';
import {RegistrazioneComponent} from './registrazione/registrazione.component';
import {AccountPageComponent} from './account-page/account-page.component';
import {TasksComponent} from './tasks/tasks.component';
import {SettingsComponent} from './settings/settings.component';
import { CanActivate } from '@angular/router';
import {AuthGuardService} from './auth-guard.service';
import {IsLoggedService} from './is-logged.service';
import {LogoutComponent} from './logout/logout.component';
import { RequestPasswordComponent } from "./request-password/request-password.component";
const routes: Routes = [
  {path:'home', component: HomeComponent, canActivate: [IsLoggedService], },
  {path:'accedi', component:AccessoComponent,canActivate: [IsLoggedService], },
  {path:'registrati', component: RegistrazioneComponent,canActivate: [IsLoggedService], },
  {path:'reset_password',component: RequestPasswordComponent,canActivate: [IsLoggedService]},
  {path:'reset_password/:token',component: RequestPasswordComponent,canActivate: [IsLoggedService]},
  {path:'', redirectTo:'/home',pathMatch: 'full', },

  {
    path:'account',
    component: AccountPageComponent,
    canActivate:[AuthGuardService],
    children:[
      {path: '', redirectTo: 'tasks',pathMatch:'full' },
      {path:'tasks', component:TasksComponent,},
      {path: 'settings', component: SettingsComponent,}
    ],
  },
  {path:'logout',component:LogoutComponent, canActivate: [AuthGuardService], },

  {path:'**', redirectTo:'/home',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
