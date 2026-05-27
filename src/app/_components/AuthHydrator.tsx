"use client";

import {ReactNode, useEffect} from "react";
import {getAuthToken, getAuthUser} from "@/app/_lib/auth-storage";
import {useAppDispatch} from "@/app/_store/hooks";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";

export default function AuthHydrator({children}: {children: ReactNode}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();
    if (token && user) {
      dispatch(setAuthenticatedUser(user));
    }
  }, [dispatch]);

  return <>{children}</>;
}
