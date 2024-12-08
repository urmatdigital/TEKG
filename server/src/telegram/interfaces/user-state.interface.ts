export interface UserState {
  awaitingPassword?: boolean;
  registrationStep?: 'contact' | 'password' | 'complete';
  referralCode?: string;
  tempData?: {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
  };
}
