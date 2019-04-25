import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings.component';
import { FormsModule } from '@angular/forms';
import { FileSelectDirective } from 'ng2-file-upload';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [

//         {path: 'settings', component: AccountSettingsComponent, canActivate: [AuthGuard],
//   children: [
//     { path: 'profile', component: UserProfileComponent },

//   ]}

];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        DropzoneModule,
        NgbModule

    ],
    declarations: [
        AccountSettingsComponent,
        FileSelectDirective

    ],

})
export class AccountSettingsModule { }
