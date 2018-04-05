import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'

// Extend the user profile data in this file as well as in updateUserData()
import { User } from './user';

interface errMsg {
  errorCode: string;
  errorMessage: string;
  email: string;
  credential: string;
}

@Injectable()
export class AuthService {
  error: errMsg;
  user: Observable<User>; // Holds the currently authenticated user object
  /* The constructor will set the Observable.
   * First it receives the current Firebase auth state.
   * If present, it will hit up Firestore for the user’s saved custom data.
   * If not, it will return an Observable.of(null).
   */
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user = this.afAuth.authState // Get auth data
      .switchMap(user => { //TODO not 100% what switchMap does, read up on it
        if (user) { // If user is authenticated
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges() // Return user document from Firestore
        } else { // If user is not authenticated
          return Observable.of(null) // Return null
        }
      })
  }

  /* facebookLogin()
   * This method triggers the popup window that authenticates the user with their Facebook account.
   * It returns a Promise that resolves with the auth credential.
   */
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthLogin(provider);
  }

  /* githubLogin()
   * This method triggers the popup window that authenticates the user with their Github account.
   * It returns a Promise that resolves with the auth credential.
   */
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.oAuthLogin(provider);
  }

  /* googleLogin()
   * This method triggers the popup window that authenticates the user with their Google account.
   * It returns a Promise that resolves with the auth credential.
   */
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  /* twitterLogin()
   * This method triggers the popup window that authenticates the user with their Twitter account.
   * It returns a Promise that resolves with the auth credential.
   */
  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.oAuthLogin(provider);
  }

  /* oAuthLogin(provider)
   * The oAuthLogin() method is useful if you have multiple OAuth options because
   * it can be reused with different providers.
   */
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      }).catch((error) => {
        // Handle Errors here.
        this.error.errorCode = error.code;
        this.error.errorMessage = error.message;
        // The email of the user's account used.
        this.error.email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        this.error.credential = error.credential;
        // ...
      }).then(() => {
        this.router.navigate(['/home']);
      });
  }

  /* updateUserData(user)
   * This private method runs after the user authenticates and sets their information to the Firestore database.
   * We pass the { merge: true } option to make this a non-destructive set.
   * NOTE: fields are in data are published to Firestore at users/user.uid
   */
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = { // any additional data to be saved must be added here and to the imported interface
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      photoURL: user.photoURL || '',
      roles: user.roles || { // roles is either the stored roles on the document or a new object
        subscriber: true // we add the subscriber role on registration
      },
      privFlags: user.privFlags || {
        email: false,
        firstName: false,
        lastName: false,
        photoURL: false,
        favoriteColor: false // example of adding additional user information - remove me if not wanted
      },
      favoriteColor: user.favoriteColor || '' // example of adding additional user information - remove me if not wanted
    }
    //FIXME overwrites user doc if admin role is set
    return userRef.set(data, { merge: true })
  }

  /* signOut()
   * signs out the authenticated user and returns them home
   */
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(function(error) {
      this.error = error
    });
  }

  getUserName() {
    return this.afAuth.auth.currentUser.displayName
  }

  // ROLE FUNCTIONS
  // Add functions here for additional user priviledges
  // Note that creation is handled within Firestore security

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }
  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }
  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }
  /* checkAuthorization(user,roles[])
   * compares the user's role against an array of
   * allowed roles to see if they are authorized for
   * the functions above
   */
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true
      }
    }
    return false
  }
}
