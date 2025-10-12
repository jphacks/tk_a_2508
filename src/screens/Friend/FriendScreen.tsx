import React, { useRef, useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, Animated, PanResponder, SectionList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { HomeStyles } from '../HomeScreen.styles';
import { FriendStyles as styles } from './FriendScreen.styles';
import { TaskModal } from '../../components/TaskModal';

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
  async addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    MY_TASKS.unshift(newTask);
    return Promise.resolve(newTask);
  },
  async updateTask(task: Task): Promise<Task> {
    const index = MY_TASKS.findIndex(t => t.id === task.id);
    if (index !== -1) {
      MY_TASKS[index] = task;
    }
    return Promise.resolve(task);
  },
  async deleteTask(taskId: string): Promise<void> {
    const index = MY_TASKS.findIndex(t => t.id === taskId);
    if (index !== -1) {
      MY_TASKS.splice(index, 1);
    }
    return Promise.resolve();
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

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await TaskService.addTask(task);
      setMyTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const updatedTask = await TaskService.updateTask(task);
      setMyTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      setMyTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  return { myTasks, friendTasks, addTask, updateTask, deleteTask };
}

// --- プレゼン用カードコンポーネント ---
function TaskCard({ 
  item, 
  onEdit, 
  onDelete 
}: { 
  item: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}) {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'タスクを削除',
      'このタスクを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(item.id);
            }
          }
        },
      ]
    );
  };

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
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {(onEdit || onDelete) && (
            <View style={styles.cardActions}>
              {onEdit && (
                <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>編集</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, styles.deleteButton]}>
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>削除</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
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
  const { myTasks, friendTasks, addTask, updateTask, deleteTask } = useTasks();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const windowWidth = Dimensions.get('window').width;

  // build sections: first section is my tasks, subsequent sections are per-friend
  const friendGroups = groupFriendTasks(friendTasks);
  const sections = [
    { title: '自分のタスク', data: myTasks, type: 'mine' as const },
    ...friendGroups.map((g) => ({ title: g[0].author || 'Friend', data: g, type: 'friend' as const })),
  ];


  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      if (editingTask) {
        await updateTask({ ...editingTask, ...taskData });
      } else {
        await addTask(taskData);
      }
    } catch (error) {
      Alert.alert('エラー', 'タスクの保存に失敗しました');
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await updateTask(task);
    } catch (error) {
      Alert.alert('エラー', 'タスクの更新に失敗しました');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      Alert.alert('エラー', 'タスクの削除に失敗しました');
    }
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  return (
    <>
      <ScrollView 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[styles.contentArea, { paddingBottom: 20 }]}
      >
        {/* 自分のタスクセクション */}
        <View style={styles.myTasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>自分のタスク</Text>
            <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ 追加</Text>
            </TouchableOpacity>
          </View>
          
          {/* 自分のタスク一覧（横スクロール） */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScroll}
          >
            {myTasks.map((item, index) => (
              <View key={item.id} style={styles.horizontalTaskCard}>
                <TaskCard 
                  item={item} 
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </View>
            ))}
            
            {/* タスクが空の場合の追加ボタン */}
            {myTasks.length === 0 && (
              <TouchableOpacity 
                style={styles.addTaskButton}
                onPress={handleAddTask}
              >
                <Text style={styles.addTaskButtonText}>+ タスクを追加</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* フレンドのタスクセクション */}
        {friendGroups.map((group, groupIndex) => (
          <View key={groupIndex}>
            <View style={[styles.section, styles.sectionLower]}>
              <Text style={styles.sectionTitle}>{group[0].author || 'Friend'}</Text>
            </View>
            {group.map((item) => (
              <View key={item.id} style={{ marginBottom: 18, alignItems: 'center', width: '100%' }}>
                <View style={styles.threeColRow}>
                  <View style={styles.placeholderPanel} />
                  <View style={styles.centerWrapper}>
                    <TaskCard 
                      item={item} 
                      onEdit={undefined}
                      onDelete={undefined}
                    />
                  </View>
                  <View style={styles.placeholderPanel} />
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <TaskModal
        visible={showTaskModal}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
    </>
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

