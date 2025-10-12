import * as Notifications from "expo-notifications";

type Window = { startHour: number; endHour: number };

function randomTimesInWindow(day: Date, count: number, win: Window) {
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    const h = win.startHour + Math.random() * (win.endHour - win.startHour);
    const hour = Math.floor(h);
    const minute = Math.floor((h - hour) * 60);
    const d = new Date(day);
    d.setHours(hour, minute, Math.floor(Math.random() * 60), 0);
    if (d.getTime() > Date.now()) out.push(d);
  }
  return out.sort((a, b) => a.getTime() - b.getTime());
}

export async function scheduleTodayRandoms(opts?: { count?: number; window?: Window }) {
  const count = opts?.count ?? 3; // 1日3回
  const window = opts?.window ?? { startHour: 9, endHour: 22 };
  const times = randomTimesInWindow(new Date(), count, window);
  const ids: string[] = [];
  for (const at of times) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lazy Busters",
        body: "今のあなたをチェキでシェアしよう📸",
        sound: "default",
        data: { screen: "Camera" } // 押したらカメラ画面へ
      },
      trigger: at  as unknown as Notifications.NotificationTriggerInput,
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelAllScheduled() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
