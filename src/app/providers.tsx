"use client";

import {ReactNode} from "react";
import {config} from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {Provider} from "react-redux";
import {store} from "@/app/_store";
import {AppearanceProvider} from "@/app/_components/AppearanceProvider";
import {ToastProvider} from "@/app/_components/Toast/ToastProvider";
import AuthHydrator from "@/app/_components/AuthHydrator";
import AuthGuard from "@/app/_components/AuthGuard";
import SidebarLayout from "@/app/_components/SidebarLayout";

config.autoAddCss = false;

export function Providers({children}: {children: ReactNode}) {
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <ToastProvider>
          <AuthHydrator>
            <AuthGuard>
              <SidebarLayout>{children}</SidebarLayout>
            </AuthGuard>
          </AuthHydrator>
        </ToastProvider>
      </AppearanceProvider>
    </Provider>
  );
}
