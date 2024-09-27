// Define param lists for each stack if they have unique parameters
export type AuthStackParamList = {
  Start: undefined;
  SignUp: undefined;
  Login: undefined;
  Main: undefined;
};

// Param list for the Summary stack
export type SummaryStackParamList = {
  Summary: undefined;
  // Add other screens and their params in Summary Stack if necessary
};

// Param list for the Price Watch stack
export type PriceWatchStackParamList = {
  PriceWatch: undefined;
  // Add other screens and their params in Price Watch Stack if necessary
};

// // Param list for the User Validation stack
// export type UserValidStackParamList = {
//   UserValid: { receiptData: any }; // Accepting receiptData from Capture
// };

// Param list for the History stack
export type HistoryStackParamList = {
  History: undefined;
  DetailedHistory: { year_month: string };
  // Add other screens and their params in History Stack if necessary
};

// Param list for the Account stack
export type AccountStackParamList = {
  Account: undefined;
  EditProfile: { view: "email" | "password" };
  // Add other screens and their params in Account Stack if necessary
};

// Param list for the Account stack
export type CaptureStackParamList = {
  Capture: undefined;
  UserValid: {
    receiptData: any;
    onReturnToCamera: () => void;
  }; // Define the type of data passed
  // Add other screens and their params in Account Stack if necessary
};
