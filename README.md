
# Lazy Busters

<img width="1633" height="918" alt="image" src="https://github.com/user-attachments/assets/920b5c4c-48e0-4158-a665-1ec9c40c88c9" />


## 製品概要
「やる気ゼロでも、仲間とならできる！」
タスク共有型SNS「Lazy Busters（レイジー・バスターズ）」

このアプリは、「今日やる気が出ない…」そんな日でも、仲間とタスクを共有しながら少しずつ前に進めるSNSです。“見守り合うつながり”によって、モチベーションの波を穏やかに整え、誰もが前向きに行動できる新しい日常をつくります。

### 背景　(製品開発のきっかけ、課題等）
リモートワークや個人作業が増え、「誰かに見られていない」ことでモチベーションを保ちにくい状況が増えました。
SNSでは「映える投稿」が多く、一方で気分が沈む日や何もできない日は共有しづらい。
その結果、“やる気の波”を一人で抱え込み、
どのように乗り越えるかが現代人共通の課題となっています。
私たちはこの問題を社会全体のWell-being（心の健康）に関わるテーマと捉え、
「SNSのつながり」を比べ合う場ではなく、励まし合える場へと変えることを目指しました。

 - 主な課題
   - 「やる気が出ない日」に自分を責めてしまう人が多い
   - 1人では続けられないことも、誰かと共有すれば楽しくなる
   - SNSでは「できた報告」は多いが、「できない日」を共有ｓる文化がない

- サブ課題
   - 小さな達成感を積み重ねる仕組みが欲しい
   - メンタル負荷を減らし、自然に習慣化できる方法を探している
   
### 製品説明（具体的な製品の説明）
タスク共有型SNS「Lasy Busters」  
Berealのように”今この瞬間”を共有する構造を持ちながら、目的は「リアルを見せる」ことではなく、「やる気を引き出す」こと。

- タスク登録機能  
朝や前夜に「今日やること」「気が載らないけどやるタスク」等を登録。
仲間と共有することで、自然と前向きな意識が生まれる。


- ランダム通知＆写真投稿
1日数回、予測不能なタイミングで通知が届き、その瞬間の勉強している写真を投稿。
**ゆるい緊張感と“仲間の存在”**が、やる気をそっと後押しします。

- フレンド評価機能
=======

- ランダム通知＆写真投稿
   - 1日数回、予測不能なタイミングで通知が鳴り、その瞬間の勉強している写真を投稿
   - "ゆるい緊張感"と"仲間の存在"がやる気を後押し

- フレンド評価機能  


  
### 特長
#### 1. 能動性を必要としないモチベーション設計
自分から発信しなくても、アプリがランダム通知で行動を促します。
やる気が出ない日でも、自然に「小さな一歩」を踏み出す手助けとなります。

#### 2. 「できない日」も共有できる安心な文化
BeRealが“今を切り取るSNS”ならLazy Bustersは“今を一緒に乗り越えるSNS”。
完璧さではなく、人間らしさを共有し合えるあたたかな空間を作ります。

#### 3. 拡張性のあるスケーラブルな仕組み
学生や社会人の日常タスクだけでなく、企業のチームモチベーション支援やウェルビーイング施策にも応用可能です。将来的にはチャットツール連携などへの展開も視野に入れています。

### 解決出来ること
- 「やる気が出ない日」に対する罪悪感を部屋氏、小さな達成感を生み出す
- SNS上に前向きな支え合い文化を根付かせる
- 精神的な孤立や燃えつきを軽減し、心の余裕と安心感を生む
- 無理なく続けられる「ゆるい習慣化」を実現する

### 注力したこと（こだわり等）

#### 機能
- 能動的でも続けられる設計
やる気が出なくても、アプリが優しく背中を押してくれる仕組み
- “頑張らないデザイン”の追求
ポップでやわらかいUIで、心理的ハードルを下げる
- SNS疲れとは逆の体験
「完璧な投稿」ではなく、「ゆるい達成」を共有できる文化を重視

#### UI
<img width="1165" height="656" alt="image" src="https://github.com/user-attachments/assets/5ec9395b-f1bd-43bc-aa00-eab073e1ac0c" />


  
### 今後の展望
やる気が出ない日を。恥ずかしい日ではなく「**共感し合える日**」に変える。
Lazy Bustersは、日常の小さな頑張りが繋がり、支え合いとなる社会を目指します。木偶のロジーに“優しさ”を宿したこのSNSが、現代の素とれう社会における新しいウェルビーイングの形を提案します。



## 開発技術
### 活用した技術
#### API・データ
* Supabase(認証、データベース、ストレージ)
* Supabase Auth (ユーザー認証)

#### フレームワーク・ライブラリ・モジュール
* React Native
* Expo
* Typescript
* react-navigation/native (画面遷移)
* expo-camera (カメラ機能)
* expo-image-picker (画像選択)
* React Native Animated (アニメーション)

#### デバイス
* iOS 
* Android
* Web

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。
=======

# JP Hacks - Expo + Supabase (Docker)

## 必要環境

### 🐳 Docker で自動設定される部分（インストール不要）
- **Node.js** (v20) - JavaScript 実行環境
- **Expo CLI** - 開発サーバー・ビルドツール
- **EAS CLI** - クラウドビルド・デプロイ
- **TypeScript** - 型安全な JavaScript
- **Metro Bundler** - JavaScript バンドラー
- **npm/yarn** - パッケージ管理
- **Git** - バージョン管理（コンテナ内）

### 📱 自分で用意する部分（手動インストール必要）
- **Docker Desktop** (Windows) - コンテナ実行環境
- **Android Studio** - Android エミュレーター用のみ
- **Expo Go アプリ** - iPhone 実機用（App Store から）
- **GitHub アカウント** - コード管理・CI/CD用

## 前提インストールと初期設定（Windows）
1. Docker Desktop をインストール
   - https://www.docker.com/products/docker-desktop/
   - 初回起動後、Settings → General:
     - ✅ Use the WSL 2 based engine（WSL2 を使用）
     - ✅ Start Docker Desktop when you log in（任意）
   - 最新の書き方（推奨）: Linux コンテナで動作していることを確認（UI 文言はバージョンにより変わります）
   - 従来の書き方（参考）: 右下クジラメニューから Linux containers に切替
   - 前提: タスクトレイのクジラが緑（Docker Desktop がバックグラウンドで起動中）。ウィンドウを閉じてもOKですが、Quitすると停止します。
2. WSL2 を有効化（未有効の場合）
   - 管理者 PowerShell:
     ```powershell
     wsl --install
     wsl --set-default-version 2
     ```
   - 再起動後、`wsl --status` でバージョン 2 を確認
3. 確認コマンド
   ```powershell
   docker version
   docker info
   wsl --status
   ```
   いずれかがエラーの場合は Docker Desktop を再起動してください。
4. Android Studio をインストール（エミュレーター用）
   - https://developer.android.com/studio
   - SDK/AVD/Emulator のチェックを有効化

> ヒント: Node.js/Expo/EAS は Docker が用意するため、ホストOSへの個別インストールは不要です。

## 初回セットアップ

### 1. プロジェクトをダウンロード
```bash
git clone [リポジトリURL]
cd jp_hacks
```

### 2. 環境変数を設定（重要！）
**⚠️ 注意**: `git clone` しただけでは使えません。必ず `.env` ファイルを自分で作成・設定する必要があります。

#### 🐳 Docker で自動設定される部分
- 環境変数の読み込み機能
- `.env` ファイルの解析
- `app.config.js` での環境変数参照

#### 📝 自分で用意する部分
```bash
# .env ファイルを新規作成
notepad .env
```

`.env` ファイルに以下の内容を記入（値はチームメンバーに教えてもらってください）：
```env
# Supabase の設定（必須）
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Expo の設定（必須）
EXPO_PUBLIC_EXPO_PROJECT_ID=your-project-id
```

**🔑 環境変数の取得方法**:
- **Supabase の値**: チームリーダーまたは Supabase 管理者に問い合わせ
- **Expo Project ID**: チームメンバーに確認するか、`npx expo config --json` で確認
- **`.env.example` は提供しません**: セキュリティのため、各メンバーが個別に設定してください

**📁 設定ファイルの変更**:
- `app.json` → `app.config.js` に変更済み
- 環境変数が設定されていない場合は、デフォルト値が使用されます
- セキュリティのため、本番環境では必ず環境変数を設定してください

### 3. Docker コンテナを起動

#### 🐳 Docker で自動設定される部分
- コンテナのビルド・起動
- ポート設定（8081, 19000-19002）
- 依存関係のインストール
- Expo 開発サーバーの起動

#### 🚀 自分で実行する部分
```bash
# Docker Desktop が起動済み（クジラが緑）であることを確認
# 最新の書き方（推奨 / 2025-0）
docker compose up -d --build   # 初回はビルドあり（時間がかかります）
docker compose up -d           # 2回目以降は通常起動

# 従来の書き方（レガシー / 互換のため参考）
docker-compose up -d --build
docker-compose up -d
```

### 4. アプリを確認
1. **ブラウザで Expo DevTools を開く**
   - `http://localhost:19002` にアクセス
   - QRコードが表示されます

2. **Android エミュレーターで確認**
   - エミュレーター内で Expo Go アプリを開く
   - QRコードをスキャン

3. **iPhone 実機で確認**
   - iPhone の Expo Go アプリで QRコードをスキャン
   - 同じ Wi-Fi に接続していることを確認

## デバイス設定

### Android エミュレーター（Windows PC内）

#### 🐳 Docker で自動設定される部分
- 開発環境（Node.js、Expo CLI等）
- アプリのビルド・配信
- ホットリロード機能

#### 📱 自分で用意する部分
- **Android Studio** - エミュレーター用のみ必要
- **Android エミュレーター** - AVD の作成・起動
- **Expo Go アプリ** - エミュレーター内にインストール

1. **Android Studio をインストール**
   - https://developer.android.com/studio からダウンロード
   - **推奨**: 最新版の Android Studio
   - インストール時に以下を選択：
     - ✅ **Android SDK**
     - ✅ **Android Virtual Device (AVD)**
    - ✅ **Android Emulator**（最新版）
    - ✅ ハードウェア仮想化アクセラレーション（最新推奨）
      - Windows: Hyper-V または WSL2 ベース（推奨）
      - 旧来: Intel CPU 環境では HAXM（互換情報として参考）

2. **インストール時に選択し忘れた場合の対処**
   - Android Studio を起動
   - **「More Actions」** → **「SDK Manager」**
   - **「SDK Tools」** タブで以下にチェック：
     - Android SDK Build-Tools
     - Android Emulator
     - Android SDK Platform-Tools
   - **「SDK Platforms」** タブで **Android 14 (API 34)** または **Android 15 (API 35)** にチェック
   - **「Apply」** でダウンロード

3. **Android エミュレーターを作成**
   - Android Studio を起動
   - 「More Actions」→「Virtual Device Manager」
   - 「Create Device」をクリック
   - 推奨デバイス：**Pixel 8** または **Pixel 7**
   - システムイメージ：**API 34 (Android 14)** または **API 35 (Android 15)**
   - 「Finish」で作成

4. **エミュレーターを起動**
   ```bash
   # Android Studio から起動するか、コマンドラインで：
   emulator -avd Pixel_7_API_33
   ```

5. **Docker と連携**
   - プロジェクト起動後、ブラウザで `http://localhost:19002` を開く
   - 「Run on Android device/emulator」をクリック
   - または、エミュレーター内で Expo Go アプリを開き、QRコードをスキャン

### iPhone 実機

#### 🐳 Docker で自動設定される部分
- 開発環境（Node.js、Expo CLI等）
- アプリのビルド・配信
- ホットリロード機能

#### 📱 自分で用意する部分
- **iPhone 実機** - 物理デバイス
- **Expo Go アプリ** - App Store からインストール
- **同じ Wi-Fi ネットワーク** - PC と iPhone を同じネットワークに接続

1. **iPhone に Expo Go をインストール**
   - App Store で「Expo Go」を検索してインストール

2. **同じネットワークに接続**
   - PC と iPhone を同じ Wi-Fi に接続
   - Docker コンテナが起動したら、iPhone の Expo Go で QRコードをスキャン

### ホットリロードが遅い場合の解決方法

#### 問題：iPhone実機でコード変更が即座に反映されない
**原因**: Docker環境でのファイル監視が適切に設定されていない

#### 解決手順：
1. **`docker-compose.yml`に`WATCHPACK_POLLING=true`を追加**
   ```yaml
   services:
     app:
       environment:
         - REACT_NATIVE_PACKAGER_HOSTNAME=${HOST_IP} 
         - EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
         - WATCHPACK_POLLING=true  # ← この行を追加
   ```

2. **コンテナを再起動**
   ```bash
   docker compose down
   docker compose up -d --build
   ```

3. **確認**
   - コードを変更すると、iPhone実機でも数秒以内に反映される
   - 特にiPhone実機では`--lan`モード（`--tunnel`より高速）

### iPhone で接続できない場合の解決方法

#### 問題：Expo Goが「Home diagnostics settings」しか表示されない
**原因**: ExpoサーバーがDockerコンテナの内部IPアドレス（172.x.x.x）で起動し、iPhoneからアクセスできない

#### 解決手順：

1. **PCのローカルIPアドレスを確認**
   ```bash
   # Windows PowerShell
   ipconfig | findstr "IPv4"
   # 例: 192.168.3.5
   ```

2. **`.env`ファイルを作成・設定**
   ```bash
   # プロジェクトルートに.envファイルを作成
   notepad .env
   ```
   
   `.env`ファイルに以下を記述：
   ```env
   # Supabase の設定（必須）
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Expo の設定（必須）
   EXPO_PUBLIC_EXPO_PROJECT_ID=your-project-id
   
   # iPhone接続用（重要！）
   HOST_IP=192.168.3.5  # ← 上記で確認したIPアドレス
   ```

3. **Dockerコンテナを再起動**
   ```bash
   docker compose down
   docker compose up -d --build
   ```

4. **接続確認**
   - ブラウザで `http://localhost:19002` を開く
   - QRコードをiPhoneのカメラアプリでスキャン
   - または、Expo Goアプリで手動入力: `exp://192.168.3.5:8081`

#### 技術的説明
- `docker-compose.yml`で`REACT_NATIVE_PACKAGER_HOSTNAME=${HOST_IP}`を設定
- `.env`ファイルの`HOST_IP`でPCのローカルIPを指定
- これによりExpoサーバーが正しいIPアドレスで起動し、iPhoneからアクセス可能になる

## 開発フロー
- **日常開発**: Android エミュレーター（高速起動、ホットリロード）
- **実機確認**: iPhone 実機（定期的な動作確認、最終UI/UXテスト）

## ファイル構成（主要）
```
jp_hacks/
├─ App.tsx                 # 画面のエントリ（最初に表示される画面）
├─ index.js                # Metro 用エントリ（App.tsx を読み込む）
├─ app.json                # Expo の設定（アプリ名/識別子など）
├─ package.json            # 依存関係とスクリプト
├─ tsconfig.json           # TypeScript 設定
├─ babel.config.js         # Babel 設定
├─ Dockerfile              # コンテナのビルド手順
├─ docker-compose.yml      # コンテナ起動・ポート設定
├─ eas.json                # EAS（Expo Application Services）の設定
├─ LICENSE                 # ライセンス
├─ README.md               # ドキュメント（本ファイル）
├─ assets/                 # 画像・アイコン類
│  └─ README.md
├─ node_modules/           # 依存パッケージ（コミットしない）
├─ .github/                # CI/CD 設定（GitHub Actions 等）
├─ .expo/                  # Expo の開発設定・キャッシュ
└─ .env                    # 環境変数（各自作成。Gitにコミットしない）
```

## 編集ポイント（よく触る場所）
- `App.tsx`
  - 画面実装のスタート地点。まずはここを書き換えて動作確認
- `components/`（必要に応じて作成）
  - 複数画面で使う UI 部品やロジックを分割
- `app.json`
  - アプリ名、`android.package`、`ios.bundleIdentifier` の変更
- `package.json`
  - スクリプトの追加（例: Web 起動用に `"dev": "expo start --web"`）
- `.env`
  - `EXPO_PUBLIC_*` で始まる公開環境変数（Supabase URL/KEY など）
- `docker-compose.yml`
  - ポート設定（Web を使うなら `19006:19006` を追加）

## ナビゲーション（React Navigation）
- 追加済みパッケージ：`@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`
- 初期設定：`App.tsx` に `NavigationContainer` と `createNativeStackNavigator` を追加し、`Home`/`Details` の2画面を作成
- 使い方：
  - 画面遷移: `navigation.navigate('Details', { from: 'Home' })`
  - 画面登録: `Stack.Screen name="ScreenName" component={ScreenComponent}`


## Web 起動方法（React Native Web / Expo Web）
- 一時的に起動する場合（ポート開放なしでも可）
  ```bash
  docker compose exec app bash -lc "npx expo start --web"
  ```
  - ブラウザで `http://localhost:19006`

- よく使う場合（ポートを常時開放）
  1) `docker-compose.yml` にポートを追加
     ```yaml
     services:
       app:
         ports:
           - "19000:19000"
           - "19001:19001"
           - "19002:19002"
           - "8081:8081"
           - "19006:19006"  # ← 追加（Web）
     ```
  2) 再起動
     ```bash
     # 最新の書き方（推奨）
     docker compose down
     docker compose up -d --build
     ```
  3) スクリプトで起動（任意）
     - `package.json` に以下を追加しておくと `npm run dev` で Web 起動
       ```json
       {
         "scripts": {
           "start": "expo start --lan",
           "dev": "expo start --web"
         }
       }
       ```
     - 実行:
       ```bash
       docker compose exec app bash -lc "npm run dev"
       ```

## トラブルシューティング

### Docker: open //./pipe/dockerDesktopLinuxEngine が出る
- Docker Desktop を起動しているか確認
- 右下クジラ → Linux containers に切替
- Settings → General → Use the WSL 2 based engine を有効化
- 再実行: `docker compose down` → `docker compose up -d --build`

### Android エミュレーターが認識されない場合
```bash
# ADB でデバイス確認
adb devices

# エミュレーターが表示されない場合
adb kill-server
adb start-server
```

### iPhone で接続できない場合
- 同じ Wi-Fi ネットワークか確認
- ファイアウォール設定を確認
- `docker compose logs -f`（最新）または `docker-compose logs -f`（従来）でエラーログを確認

## よく使うコマンド

### コンテナの操作
```bash
# 最新の書き方（推奨）
docker compose up -d          # コンテナを起動
docker compose down           # コンテナを停止
docker compose restart        # 再起動（設定変更後など）
docker compose logs -f        # ログを確認
docker compose exec app bash  # コンテナ内シェルに入る

# 従来の書き方（参考）
docker-compose up -d
docker-compose down
docker-compose restart
docker-compose logs -f
docker-compose exec app bash
```

### 開発中の作業
```bash
# コードを変更した後、自動でリロードされます
# 手動でリロードしたい場合：
# ブラウザで http://localhost:19002 を開き直す

# コンテナを完全にリビルド（問題が起きた時）
# 最新の書き方（推奨）
docker compose down
docker compose up -d --build

# 従来の書き方（参考）
docker-compose down
docker-compose up -d --build
```

## GitHub Actions
- CI: `/.github/workflows/ci.yml`（push/PRで lint/typecheck/test）
- EAS Build: `/.github/workflows/eas-build.yml`（手動トリガー）
  - Secrets に `EXPO_TOKEN` を設定
  - 実行時に `platform` と `profile` を選択

## チーム開発の注意点

### 環境変数について
- **`.env` ファイルは個人で作成**: チームメンバーに値を教えてもらってください
- **`.env.example` は提供しません**: セキュリティのため、テンプレートファイルは作成していません
- **秘密情報の管理**: `.env` ファイルは絶対にGitにコミットしないでください（`.gitignore` で除外済み）

### .gitignore の設定について
**⚠️ 重要**: 以下のファイルは絶対にGitにコミットしないでください：
- `.env` ファイル（環境変数）
- `node_modules/` フォルダ（依存関係）
- `.expo/` フォルダ（Expoのキャッシュ）
- `android/` と `ios/` フォルダ（ビルド成果物）
- 秘密鍵ファイル（`.keystore`, `.jks`, `.p12`, `.mobileprovision`）

**`.gitignore` は既に設定済み**ですが、新しくファイルを追加する際は注意してください。

### 初回セットアップの流れ
1. `git clone` でプロジェクトをダウンロード
2. **必ず `.env` ファイルを自分で作成**（これがないと動きません）
3. チームメンバーに環境変数の値を教えてもらう
4. Docker コンテナを起動

### その他の注意
- iOS公開の最終申請のみMacが必要です（MacinCloud等で代替可能）
- 環境変数で困った場合は、チームリーダーに相談してください

