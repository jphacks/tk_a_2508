import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const handler:Notifications.NotificationHandler={
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // 👇 SDK 54 で必要になった iOS 用の表示指定
    shouldShowBanner: true, // iOSでバナー表示
    shouldShowList: true,   // 通知センターにも表示
    }),
};

export async function initNotifications() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  const granted = status === "granted";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 200, 150, 200],
      lightColor: "#3177FF",
    });
  }

  const token = granted ? (await Notifications.getExpoPushTokenAsync()).data : null;
  return { granted, token };
}
