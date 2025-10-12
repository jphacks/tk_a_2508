import * as React from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigator } from "./src/navigation/AppNavigator";
import  { useEffect } from "react";
import { initNotifications } from "./src/lib/notifications";
import { scheduleTodayRandoms, cancelAllScheduled } from "./src/lib/scheduleRandom";
import { useNotificationNavigation } from "./src/hooks/useNotificationNavigation";
import "react-native-url-polyfill/auto";

const Stack = createNativeStackNavigator();
const navRef = React.createRef<any>();


// 通知の表示ポリシー（アプリ全体）
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {

  useNotificationNavigation(navRef);

  React.useEffect(() => {
    (async () => {
      

      // 当日分を毎回作り直すシンプル運用（起動時）
      await cancelAllScheduled();
      await scheduleTodayRandoms({ count: 3, window: { startHour: 9, endHour: 22 } });
    })();
  }, []);

  

  useEffect(() => {
    // 通知タップ → 任意の画面へ（ここではログだけ）
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const screen = resp.notification.request.content.data?.screen as string | undefined;
      if (screen) {
        console.log("Go to screen:", screen);
        // 例）グローバルnavRefがあるならここで navigate 可能
        // navRef.current?.navigate(screen as never);
      }
    });

    (async () => {
      // 1) 権限リクエスト
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("通知許可がされていません。");
        return;
      }
      console.log("通知が許可されました。");

      // 2) Androidは通知チャネルを作成
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 200, 150, 200],
          lightColor: "#3177FF",
        });
      }

      // Expo Push通知トークンの取得
      const { granted, token } = await initNotifications();
      console.log("Push granted:", granted, "ExpoToken:", token);


      //  当日分のランダム通知スケジュール
      await cancelAllScheduled();
      await scheduleTodayRandoms({ count: 3, window: { startHour: 9, endHour: 22 } });


      // 3) テスト通知（5秒後に一発）
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lazy Busters",
          body: "通知テスト：5秒後に届きました！",
          sound: "default",
          // data: { screen: "Camera" }, // 画面遷移させたい時はdataに画面名
        },
        trigger: { 
           type: 'timeInterval',
           seconds: 5,
          repeats: false,
          channelId: "default" 
        }as Notifications.TimeIntervalTriggerInput,
      });
    })();

    // リスナーのクリーンアップ
    return () => sub.remove();
  }, []);

  return <AppNavigator />;
}
