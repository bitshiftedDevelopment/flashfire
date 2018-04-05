export interface Roles { // add roles using this pattern
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

export interface PrivacyFlags { // used to control public visibility of fields
  email: boolean;
  firstName?: boolean;
  lastName?: boolean;
  photoURL?: boolean;
  favoriteColor?: boolean; // example of adding additional user information - remove me if not wanted
}

//NOTE fields added here must also be added to auth.service.updateUserData()
export interface User { // add additional user profile data here
  uid: string; // unique user id on Firebase
  email: string; // email address used for Firebase mailing or app mailing
  displayName?: string; // publicly displayed username
  firstName?: string; // optional first name field that could come from a form
  lastName?: string; // optional last name field that could come from a form
  photoURL?: string; // avatar url location
  roles: Roles; // stores user permissions
  privFlags: PrivacyFlags; // profile display flags
  favoriteColor?: string;  // example of adding additional user information - remove me if not wanted
}
