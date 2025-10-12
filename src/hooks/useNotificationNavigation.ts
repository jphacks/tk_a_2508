import * as React from "react";
import * as Notifications from "expo-notifications";
import { NavigationContainerRef } from "@react-navigation/native";

export function useNotificationNavigation(navRef: React.RefObject<NavigationContainerRef<any>>) {
  React.useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const screen = resp.notification.request.content.data?.screen as string | undefined;
      if (screen) navRef.current?.navigate(screen as never);
    });
    return () => sub.remove();
  }, [navRef]);
}
