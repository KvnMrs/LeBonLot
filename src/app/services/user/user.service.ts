import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IAnnounce } from 'src/app/models/annouce/annouce.model';
import { IUser } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  createProfileUser(uid: string, userData: IUser) {
    return setDoc(doc(this.firestore, 'Users', uid), userData);
  }

  async getUserByID(id: string): Promise<IUser | null> {
    const userRef = doc(this.firestore, `Users`, id);
    const docSnap = await getDoc(userRef);
    const data = docSnap.data();
    return data as IUser;
  }

  async upadteUserProfile(userData: IUser) {
    const userRef = doc(this.firestore, `Users`, userData.uid);
    return setDoc(userRef, { ...userData }, { merge: true });
  }

  async onCreditUserAccount(uid: string, sum: number) {
    const userRef = doc(this.firestore, `Users`, uid);
    await getDoc(userRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          userData['bankAccount'] = sum;
          setDoc(userRef, userData);
        } else {
          console.error("L'utilisateur n'existe pas.");
        }
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des données de l'utilisateur:",
          error
        );
      });
  }

  // Create Favorites Subcollection: Users/userId//favorites/announceId
  async addToFavorites(announce: IAnnounce, userId: string): Promise<void> {
    const usersCollectionRef = collection(this.firestore, 'Users');
    const usersDocRef = doc(usersCollectionRef, userId);
    const favoritesCollectionRef = collection(usersDocRef, 'Favorites');
    const favoritesDocRef = doc(favoritesCollectionRef, announce.id);
    return await setDoc(favoritesDocRef, announce);
  }

  getFavorites(userId: string): Observable<DocumentData> {
    const usersCollectionRef = collection(this.firestore, 'Users');
    const usersDocRef = doc(usersCollectionRef, userId);
    const favoritesCollectionRef = collection(usersDocRef, 'Favorites');
    return collectionData(favoritesCollectionRef);
  }

  async removeFavorite(announceId: string, userId: string) {
    const favoritesCollectionRef = collection(this.firestore, 'Favorites');
    const favoritesDocRef = doc(favoritesCollectionRef, userId);
    const favoritesDoc = await getDoc(favoritesDocRef);
    if (favoritesDoc.exists()) {
      const favoritesArray = favoritesDoc.data()['annonces'] || [];
      const indexToRemove = favoritesArray.indexOf(announceId);
      favoritesArray.splice(indexToRemove, 1);
      return updateDoc(favoritesDocRef, { annonces: favoritesArray });
    }
  }
}
