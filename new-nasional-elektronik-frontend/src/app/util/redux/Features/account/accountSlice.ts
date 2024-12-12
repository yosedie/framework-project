import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AccountStruct {
  jwt_token: string;
}

export interface AccountState {
  account: AccountStruct;
}

const initialState: AccountState = {
  account: {
    jwt_token: ""
  },
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    loginAccount: (state, action: PayloadAction<AccountStruct>) => {
      state.account = action.payload;
    },
    logoutAccount: (state, _) => {
      state.account = {
        jwt_token: ""
      };
    },
  },
});

export const { loginAccount, logoutAccount } = accountSlice.actions;
export default accountSlice.reducer;