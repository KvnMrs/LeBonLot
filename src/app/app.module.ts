import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
// Components
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CardItemComponent } from './components/card-item/card-item.component';
import { ListItemsComponent } from './components/list-items/list-items.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { BuyTickectComponent } from './components/buy-ticket/buy-ticket.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ModalProfileComponent } from './components/modals/modal-profile/modal-profile.component';

// Services
import { AnnouncesService } from './services/announces/announces.service';
import { AuthService } from './services/auth/auth.service';
import { UploadImgService } from './services/uploads/upload-img.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },
  // { path: '', component: SignUpComponent },
  {
    path: 'liste',
    /* canActivate: [AuthGuardService], */ component: ListItemsComponent,
  },
  {
    path: 'profil',
    /* canActivate: [AuthGuardService], */ component: ProfileComponent,
  },
  {
    path: 'liste/:id',
    /* canActivate: [AuthGuardService], */ component: ItemDetailsComponent,
  },
  {
    path: 'ajout-annonce',
    /* canActivate: [AuthGuardService], */ component: AddItemComponent,
  },
  {
    path: 'achat-ticket/:id',
    /* canActivate: [AuthGuardService], */ component: BuyTickectComponent,
  },
];
@NgModule({
  declarations: [
    // Components
    AppComponent,
    NavigationComponent,
    CardItemComponent,
    ListItemsComponent,
    SignUpComponent,
    AddItemComponent,
    ItemDetailsComponent,
    BuyTickectComponent,
    ProfileComponent,
    SignInComponent,
    LandingPageComponent,
    ModalProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    NgbModule,
  ],
  providers: [NgForm, AnnouncesService, AuthService, UploadImgService],
  bootstrap: [AppComponent],
})
export class AppModule {}
