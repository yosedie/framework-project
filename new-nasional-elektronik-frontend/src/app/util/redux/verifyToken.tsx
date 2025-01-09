'use client';

import axios from '../../util/axios/axios';
import { VerifyTokenData, ApiResponse } from '../../types/types'
import { execToast, ToastStatus } from '../../util/toastify/toast';
import { changeRole, UserState, changeUserData } from '../../util/redux/Features/user/userSlice';

import React, { ReactNode } from 'react';
import { Provider } from "react-redux";
import store from "./store";
import type { RootState } from '../../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';

interface ProvidersProps {
    children: ReactNode;
}

export function VerifyToken({ children }: ProvidersProps) {
    const dispatch = useDispatch()
    const jwt_token = useSelector((state: RootState) => state.user.jwt_token)
    async function tokenHandler(): Promise<VerifyTokenData> {
      try {
        const response = await axios.post<ApiResponse<VerifyTokenData>>('/verifyToken', {jwt_token: jwt_token});
        if (response.data.status) {
          const role = response.data.data.role;
          dispatch(changeRole(role));
          dispatch(changeUserData({...response.data.data}));
        } else {
          dispatch(changeRole(""));
        }
        return response.data.data;
      } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error));
        throw error;
      }
    }

    React.useEffect(() => {
      tokenHandler();
      const intervalId = setInterval(() => {
        tokenHandler();
      }, 10000);
  
      return () => clearInterval(intervalId);
    }, [jwt_token]);

    // React.useEffect(() => {
    //     tokenHandler()
    // })

    return (
      <>
        {children}
      </>
    )
}