import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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
  return (
    <View style={styles.card}>
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
    </View>
  );
}

// フレンドカード: 1人分のカードに複数のタスク（縦スクロール）を内包できるようにする
function FriendCard({ tasks, name }: { tasks: Task[]; name: string }) {
  const width = Dimensions.get('window').width * 0.72;
  return (
    <View style={[styles.friendCard, { width }]}>
      <Text style={styles.friendName}>{name}</Text>
      <FlatList
        data={tasks}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <TaskCard item={item} />}
        showsVerticalScrollIndicator={false}
        style={styles.friendTaskList}
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

  return (
    <View style={HomeStyles.contentArea}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>自分のタスク</Text>
        <FlatList
          data={myTasks}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.8} onPress={() => { /* TODO: 詳細画面へ */ }}>
              <TaskCard item={item} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={[styles.section, styles.sectionLower]}>
        <Text style={styles.sectionTitle}>Friend task</Text>
        <FlatList
          data={groupFriendTasks(friendTasks)}
          keyExtractor={(i) => i[0].id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9}>
              <FriendCard tasks={item} name={item[0].author} />
            </TouchableOpacity>
          )}
        />
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
  },
  card: {
    width: 220,
    marginRight: 14,
    backgroundColor: '#F6E8C7',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
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
    backgroundColor: '#F7E8C9',
    borderRadius: 12,
    padding: 10,
    marginRight: 14,
    height: 360,
  },
  friendName: {
    fontWeight: '700',
    marginBottom: 8,
  },
  friendTaskList: {
    flex: 1,
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

