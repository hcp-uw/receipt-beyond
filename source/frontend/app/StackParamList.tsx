// Define param lists for each stack if they have unique parameters

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

// Param list for the User Validation stack
export type UserValidStackParamList = {
  UserValidation: undefined;
  // Add other screens and their params in User Validation Stack if necessary
};

// Param list for the History stack
export type HistoryStackParamList = {
  History: undefined;
  DetailedHistory: { year_month: string };
  // Add other screens and their params in History Stack if necessary
};

// Param list for the Account stack
export type AccountStackParamList = {
  Account: undefined;
  // Add other screens and their params in Account Stack if necessary
};
