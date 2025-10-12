import React, { useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { HomeStyles } from '../HomeScreen.styles';

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
function FriendCard({ tasks, name }: { tasks: Task[]; name: string }) {
  const width = Math.min(360, Dimensions.get('window').width - 48);
  return (
    <View style={[styles.friendCard, { width, overflow: 'visible', paddingHorizontal: 8 }]}> 
      <Text style={styles.friendName}>{name}</Text>
      <FlatList
        data={tasks}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <View style={{ width: '100%' }}><TaskCard item={item} /></View>}
        showsVerticalScrollIndicator={false}
        style={styles.friendTaskList}
        nestedScrollEnabled={false}
        scrollEnabled={false}
      />
    </View>
  );
}

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

  return (
    <View style={HomeStyles.contentArea}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>自分のタスク</Text>
        <View style={[styles.listRow, styles.listContent]}>
          {myTasks.map((item) => (
            <View key={item.id}>
              <TaskCard item={item} />
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.sectionLower]}>
        <Text style={styles.sectionTitle}>Friend task</Text>
        {/* Vertical centered list to match design */}
        <View style={styles.friendListColumn}>
          {groupFriendTasks(friendTasks).map((item) => (
            <View key={item[0].id} style={{ marginBottom: 18, alignItems: 'center', width: '100%' }}>
              <View style={styles.threeColRow}>
                <View style={styles.placeholderPanel} />
                <View style={styles.centerWrapper}>
                  <View style={styles.arrowLeft}>
                    <Text style={styles.arrowText}>{'‹'}</Text>
                  </View>
                  <FriendCard tasks={item} name={item[0].author} />
                  <View style={styles.arrowRight}>
                    <Text style={styles.arrowText}>{'›'}</Text>
                  </View>
                </View>
                <View style={styles.placeholderPanel} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
  },
  sectionLower: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    marginRight: 0,
    backgroundColor: '#F6E8C7',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    alignSelf: 'center',
    marginVertical: 10,
  },
  cardImage: {
    width: '100%',
     height: 160,
     borderTopLeftRadius: 12,
     borderTopRightRadius: 12,
  },
  cardImagePlaceholder: {
    backgroundColor: '#E8D3A8',
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    marginTop: 6,
    color: '#666',
  },
  cardFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardAuthor: {
    fontSize: 12,
    color: '#444',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  friendCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    // make it visually similar to RandomStyles.mainCard
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  friendName: {
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 18,
  },
  friendTaskList: {
    flex: 1,
    width: '100%',
    // ensure inner list can scroll independently
    paddingBottom: 8,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  friendListColumn: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
  },
  threeColRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderPanel: {
    width: '12%',
    aspectRatio: 0.75,
    backgroundColor: '#F6E8C7',
    borderRadius: 8,
  },
  centerWrapper: {
    width: '74%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arrowLeft: {
    position: 'absolute',
    left: -18,
    top: '45%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  arrowRight: {
    position: 'absolute',
    right: -18,
    top: '45%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  arrowText: {
    fontSize: 18,
    color: '#444',
    fontWeight: '700',
  },
});

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

