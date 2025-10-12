import React, { useRef } from 'react';
import { View, Text, Image, FlatList, Dimensions, Animated, PanResponder, SectionList } from 'react-native';
import { HomeStyles } from '../HomeScreen.styles';
import { FriendStyles as styles } from './FriendScreen.styles';

// Task 型宣言。将来SupabaseのRowに合わせて拡張しやすい形で定義しています。
export type Task = {
  id: string;
  title: string;
  description?: string;
  image?: any; // require() か URL を入れられるように any にしておく
  author: string;
  createdAt: string; // ISO string
};

// --- 簡易サービス層（将来 supabase client に差し替えられる） ---
const TaskService = {
  async fetchMyTasks(): Promise<Task[]> {
    // ここを supabase.from('tasks').select(...) に差し替える
    return Promise.resolve(MY_TASKS);
  },
  async fetchFriendTasks(): Promise<Task[]> {
    return Promise.resolve(FRIEND_TASKS);
  },
};

// --- カスタムフック ---
export function useTasks() {
  const [myTasks, setMyTasks] = React.useState<Task[]>([]);
  const [friendTasks, setFriendTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const [m, f] = await Promise.all([TaskService.fetchMyTasks(), TaskService.fetchFriendTasks()]);
      if (!mounted) return;
      setMyTasks(m);
      setFriendTasks(f);
    })();
    return () => { mounted = false; };
  }, []);

  return { myTasks, friendTasks };
}

// --- プレゼン用カードコンポーネント ---
function TaskCard({ item }: { item: Task }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
  // allow the card to claim responder on touch start so card swipes work
  onStartShouldSetPanResponder: () => true,
  // require a small horizontal move to start responding to avoid vertical scrolls
  onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 6,
      onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gs) => {
        const threshold = 80;
        if (Math.abs(gs.dx) > threshold) {
          // swipe action: slide out then back
          Animated.timing(translateX, {
            toValue: gs.dx > 0 ? 300 : -300,
            duration: 180,
            useNativeDriver: false,
          }).start(() => {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
          });
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.card, { transform: [{ translateX: translateX }] }]}
    >
      {item.image ? (
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]} />
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.description ? <Text style={styles.cardDescription}>{item.description}</Text> : null}
        <View style={styles.cardFooter}>
          <Text style={styles.cardAuthor}>{item.author}</Text>
          <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// フレンドカード: 1人分のカードに複数のタスク（縦スクロール）を内包できるようにする
// Note: We render friend tasks via SectionList below to avoid nesting VirtualizedLists inside a ScrollView.

// --- ダミーデータ ---
const MY_TASKS: Task[] = [
  {
    id: 'm1',
    title: 'UIデザインを作成する',
    description: 'トップカードのデザインを確定して画像を追加する',
  image: require('../../../assets/profile.webp'),
    author: 'me',
    createdAt: new Date().toISOString(),
  },
];

const FRIEND_TASKS: Task[] = [
  {
    id: 'f1',
    title: '微分のテスト勉強',
    description: '演習問題を5問解く',
  image: require('../../../assets/profile.webp'),
    author: 'koyu_10.17',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'f2',
    title: '英単語テスト',
    description: '50語を復習する',
  image: require('../../../assets/profile.webp'),
    author: 'yu_yu',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function FriendScreen() {
  const { myTasks, friendTasks } = useTasks();
  const windowWidth = Dimensions.get('window').width;

  // build sections: first section is my tasks, subsequent sections are per-friend
  const friendGroups = groupFriendTasks(friendTasks);
  const sections = [
    { title: '自分のタスク', data: myTasks, type: 'mine' as const },
    ...friendGroups.map((g) => ({ title: g[0].author || 'Friend', data: g, type: 'friend' as const })),
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentArea}
      showsVerticalScrollIndicator={true}
      renderSectionHeader={({ section }) => {
        if ((section as any).type === 'mine') {
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>自分のタスク</Text>
            </View>
          );
        }
        return (
          <View style={[styles.section, styles.sectionLower]}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        );
      }}
      renderItem={({ item, section }) => {
        // Display each task card centered to match previous layout
        return (
          <View style={{ marginBottom: 18, alignItems: 'center', width: '100%' }}>
            <View style={styles.threeColRow}>
              <View style={styles.placeholderPanel} />
              <View style={styles.centerWrapper}>
                <TaskCard item={item} />
              </View>
              <View style={styles.placeholderPanel} />
            </View>
          </View>
        );
      }}
    />
  );
}
// フレンドごとにタスクをグループ化（将来的にAPI側で grouped response を返す予定なら差し替え可能）
function groupFriendTasks(tasks: Task[]): Task[][] {
  const map = new Map<string, Task[]>();
  tasks.forEach((t) => {
    const key = t.author || 'unknown';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  });
  return Array.from(map.values());
}

