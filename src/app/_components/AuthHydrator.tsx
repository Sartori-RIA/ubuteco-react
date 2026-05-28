"use client";

import {ReactNode, useLayoutEffect} from "react";
import {getAuthToken, getAuthUser, setAuthUser} from "@/app/_lib/auth-storage";
import {useAppDispatch} from "@/app/_store/hooks";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {fetchCurrentUser} from "@/app/_store/features/auth/authThunks";

export default function AuthHydrator({children}: {children: ReactNode}) {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const cachedUser = getAuthUser();
    if (cachedUser) {
      dispatch(setAuthenticatedUser(cachedUser));
    }

    void dispatch(fetchCurrentUser())
      .unwrap()
      .then((user) => setAuthUser(user))
      .catch(() => {
        // Keep cached user if refresh fails; apiFetch handles 401 globally
      });
  }, [dispatch]);

  return <>{children}</>;
}
