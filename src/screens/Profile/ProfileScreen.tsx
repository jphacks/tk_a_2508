import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  ensureProfileRow,
  fetchMyProfile,
  updateMyProfile,
} from "../../lib/profile";
import { pickImageFromLibrary, takePhotoWithCamera } from "../../lib/avatar";
import { AvatarSelectionModal } from "../../components/AvatarSelectionModal";
import avatarGirl from "../../../assets/images/image 110708.png";
import penPhoto from "../../../assets/images/Group 1000006540.png";

const { width } = Dimensions.get("window");
const GALLERY_MARGIN = 5;
const GALLERY_COLUMNS = 3;
const GALLERY_SIZE =
  (width - 40 - GALLERY_MARGIN * 2 * GALLERY_COLUMNS) / GALLERY_COLUMNS;

const COLOR_BLUE = "#42A5F5";
const COLOR_ORANGE = "#FFA726";
const COLOR_BG = "#e6f0ff";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: "Lazy太郎",
    status: "TOEICに向けて勉強中！！",
    avatarUrl: "https://via.placeholder.com/150/42A5F5/FFFFFF?text=P",
    friends: 64,
    posts: 105,
  });

  const [activeFilter, setActiveFilter] = useState<"random" | "task">("random");
  const [name, setName] = useState("Lazy太郎");
  const [status, setStatus] = useState("TOEICに向けて勉強中！！");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [friendsCount, setFriendsCount] = useState(64);
  const [postsCount, setPostsCount] = useState(105);

  // 初期ロード
  useEffect(() => {
    (async () => {
      await ensureProfileRow();
      const p = await fetchMyProfile();
      if (p) {
        setName(p.name ?? "");
        setStatus(p.status ?? "");
        setAvatarUrl(p.avatar_url ?? null);
        setFriendsCount(p.friends_count ?? 64);
        setPostsCount(p.posts_count ?? 105);
      }
    })();
  }, []);

  //アイコン変更ハンドラ
  function onChangeAvatar() {
    setShowAvatarModal(true);
  }

  // 写真ライブラリから選択
  async function handleSelectFromLibrary() {
    try {
      const newAvatarUrl = await pickImageFromLibrary();
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);
        // プロフィール情報を再取得
        const p = await fetchMyProfile();
        if (p) {
          setAvatarUrl(p.avatar_url ?? null);
        }
        Alert.alert("アップロード完了", "プロフィール写真を更新しました！");
      }
    } catch (error: any) {
      Alert.alert("アップロード失敗", error?.message || "エラーが発生しました");
    }
  }

  // カメラで撮影
  async function handleTakePhoto() {
    try {
      const newAvatarUrl = await takePhotoWithCamera();
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);
        // プロフィール情報を再取得
        const p = await fetchMyProfile();
        if (p) {
          setAvatarUrl(p.avatar_url ?? null);
        }
        Alert.alert("アップロード完了", "プロフィール写真を更新しました！");
      }
    } catch (error: any) {
      Alert.alert("アップロード失敗", error?.message || "エラーが発生しました");
    }
  }

  //名前／一言の保存
  async function onSaveProfile(newName: string, newStatus: string) {
    try {
      await updateMyProfile({ name: newName, status: newStatus });
      setName(newName);
      setStatus(newStatus);
      Alert.alert("保存しました");
    } catch (e: any) {
      console.log("update error:", e);
      Alert.alert("保存に失敗", e?.message ?? JSON.stringify(e));
    }
  }

  const taskImages = Array(9)
    .fill(null)
    .map((_, i) => ({
      id: i,
      uri: null, // ← URLを入れない（DBの写真が入ったらここにURLを入れる）
      date: "2025.10.11",
    }));

  const handleStatusEdit = () => {
    Alert.prompt(
      "ステータスを編集",
      "新しいステータスを入力してください",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "OK",
          onPress: async (newText?: string) => {
            if (!newText) return;
            setStatus(newText); // 画面の state を更新
            try {
              await updateMyProfile({ status: newText }); // すぐDBにも反映（または保存ボタンでもOK）
              Alert.alert("更新しました");
            } catch (e: any) {
              console.log("update error:", e);
              Alert.alert("保存に失敗", e?.message ?? JSON.stringify(e));
            }
          },
        },
      ],
      "plain-text",
      status
    );
  };

  const handleNameEdit = () => {
    Alert.prompt(
      "名前を編集",
      "新しい名前を入力してください",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "OK",
          onPress: async (newText?: string) => {
            if (!newText) return;
            setName(newText);
            try {
              await updateMyProfile({ name: newText });
              Alert.alert("更新しました");
            } catch (e: any) {
              console.log("update error:", e);
              Alert.alert("保存に失敗", e?.message ?? JSON.stringify(e));
            }
          },
        },
      ],
      "plain-text",
      name
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* プロフィールカード */}
          <View style={styles.profileCard}>
            <TouchableOpacity
              onPress={onChangeAvatar}
              style={{ alignSelf: "center" }}
            >
              {/* 外側の青いリング */}
              <View
                style={{
                  width: 124,
                  height: 124,
                  borderRadius: 62,
                  borderWidth: 4,
                  borderColor: "#2D8CFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* 画像を丸く切り抜く */}
                <Image
                  source={avatarUrl ? { uri: avatarUrl } : avatarGirl}
                  style={{
                    width: 116,
                    height: 116,
                    borderRadius: 58,
                    overflow: "hidden",
                  }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNameEdit}>
              <Text style={styles.userName}>{name}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleStatusEdit}>
              <Text style={styles.statusMessage}>{status}</Text>
            </TouchableOpacity>

            {/* 設定アイコン */}
            <TouchableOpacity style={styles.settingsIcon}>
              <Ionicons name="settings-outline" size={24} color="#888" />
            </TouchableOpacity>

            {/* 統計情報 */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <FontAwesome name="users" size={20} color="#666" />
                <Text style={styles.statValue}>{friendsCount}</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome name="file-text-o" size={20} color="#666" />
                <Text style={styles.statValue}>{postsCount}</Text>
                <Text style={styles.statLabel}>投稿</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onSaveProfile(name, status)}
              style={{
                backgroundColor: COLOR_BLUE,
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                marginTop: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>保存</Text>
            </TouchableOpacity>
          </View>

          {/* タスクフィルターボタン */}
          <View style={styles.filterButtons}>
            {/* ランダムボタン */}
            <TouchableOpacity
              onPress={() => setActiveFilter("random")}
              style={[
                styles.filterButton,
                activeFilter === "random"
                  ? styles.filterButtonBlueActive
                  : styles.filterButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter !== "random" && { color: "#666" },
                ]}
              >
                ランダム
              </Text>
            </TouchableOpacity>

            {/* タスクボタン */}
            <TouchableOpacity
              onPress={() => setActiveFilter("task")}
              style={[
                styles.filterButton,
                activeFilter === "task"
                  ? styles.filterButtonOrangeActive
                  : styles.filterButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter !== "task" && { color: "#666" },
                ]}
              >
                タスク
              </Text>
            </TouchableOpacity>
          </View>

          {/* タスク履歴ギャラリー */}
          {/* タスク履歴ギャラリー */}
          <View style={styles.taskGallery}>
            {taskImages.map((task) => (
              <View key={task.id} style={styles.taskImageContainer}>
                <Image
                  source={task.uri ? { uri: task.uri } : penPhoto}
                  style={styles.taskImage}
                  resizeMode="cover"
                />
                <Text style={styles.taskImageDate}>{task.date}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {/* アバター選択モーダル */}
      <AvatarSelectionModal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelectFromLibrary={handleSelectFromLibrary}
        onTakePhoto={handleTakePhoto}
      />
    </SafeAreaView>
  );
};

// StyleSheetの定義はProfileScreen関数の外側に必要です
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  backgroundContainer: {
    flex: 1,
    backgroundColor: COLOR_BG,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: { padding: 5 },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLOR_BLUE,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 10,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    width: "95%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLOR_BLUE,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  statusMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  settingsIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
  },

  filterButtons: {
    flexDirection: "row",
    marginTop: 25,
    marginBottom: 15,
    width: "95%",
    justifyContent: "center",
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonBlueActive: {
    backgroundColor: COLOR_BLUE,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  filterButtonOrangeActive: {
    backgroundColor: COLOR_ORANGE,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  filterButtonInactive: {
    backgroundColor: "#f0f0f0",
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  taskGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    width: "100%",
  },
  taskImageContainer: {
    margin: GALLERY_MARGIN,
    width: GALLERY_SIZE,
    height: GALLERY_SIZE, // ← 高さを追加
    borderRadius: 12, // ← 角丸は親に
    overflow: "hidden", // ← これでハミ出し/白縁をカット
    backgroundColor: "#fff",
  },
  taskImage: {
    width: "120%", // ← 親にフィット
    height: "100%",
    borderRadius: 0, // ← 角丸は親でやるので0
    backgroundColor: "transparent",
    left: 0,
    top: 0,
  },
  taskImageDate: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
});

export default ProfileScreen;
