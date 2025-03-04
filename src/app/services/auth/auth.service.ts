import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/models/user/user.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSubject = new BehaviorSubject<User | null>(null);
  userDataSubject = new BehaviorSubject<IUser | null>(null);

  constructor(
    private router: Router,
    private userService: UserService,
    public auth: Auth
  ) {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await this.userService.getUserByID(user.uid);
        this.currentUserSubject.next(user);
        return this.userDataSubject.next(data);
      } else {
        return this.userDataSubject.next(null);
      }
    });
  }

  async signupUser(data: IUser): Promise<string | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );
      const memberSince = userCredential.user.metadata.creationTime as string;
      data.uid = userCredential.user.uid;
      data = { ...data, memberSince };
      await this.userService.createProfileUser(data.uid, data);
      this.router.navigate(['/recherche']);
      return null;
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = 'Un compte existe déjà avec cet Email.';
        return errorMessage;
      }
    }
    return null;
  }

  async signinUser(data: IUser): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(this.auth, data.email, data.password);
      this.router.navigate(['/recherche']);
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        errorMessage = 'Le mot de passe est inccorect.';
        return errorMessage;
      }
      if (
        errorCode === 'auth/invalid-email' ||
        errorCode === 'auth/user-not-found'
      ) {
        errorMessage = "Ce compte n'existe pas.";
        return errorMessage;
      }
    }
    return null;
  }

  async signOutUser(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        this.userDataSubject.next(null);
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion', error);
      });
  }
}
