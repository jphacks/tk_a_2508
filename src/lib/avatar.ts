// lib/avatar.ts
import { supabase } from "./supabase";

/** 写真ライブラリから画像を選択してアップロード */
export async function pickImageFromLibrary(): Promise<string | null> {
  try {
    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("ユーザー認証が必要です");
    }

    // Web版ではファイル選択ダイアログを使用
    if (typeof window !== 'undefined' && window.document) {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        
        input.onchange = async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          try {
            // ファイルをArrayBufferに変換
            const arrayBuffer = await file.arrayBuffer();
            const fileExt = file.name.split('.').pop() || 'jpg';
            const fileName = `${user.id}/avatar.${fileExt}`;

            // Supabase Storageにアップロード
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('avatar')
              .upload(fileName, arrayBuffer, {
                contentType: file.type,
                upsert: true
              });

            if (uploadError) {
              throw uploadError;
            }

            // 公開URLを取得
            const { data: urlData } = supabase.storage
              .from('avatar')
              .getPublicUrl(fileName);

            // profilesテーブルを更新
            console.log('Updating profile with avatar_url:', urlData.publicUrl);
            
            // まず既存のレコードを確認
            const { data: existingProfile, error: selectError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', user.id)
              .single();

            if (selectError && selectError.code !== 'PGRST116') {
              console.error('Profile select error:', selectError);
              throw selectError;
            }

            let updateError;
            if (existingProfile) {
              // 既存のレコードを更新
              const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: urlData.publicUrl })
                .eq('id', user.id);
              updateError = error;
            } else {
              // 新しいレコードを作成
              const { error } = await supabase
                .from('profiles')
                .insert({
                  id: user.id,
                  name: '名前未設定',
                  status: 'よろしく！',
                  avatar_url: urlData.publicUrl
                });
              updateError = error;
            }

            if (updateError) {
              console.error('Profile update error:', updateError);
              throw updateError;
            }
            
            console.log('Profile updated successfully');

            resolve(urlData.publicUrl);
          } catch (error) {
            reject(error);
          } finally {
            document.body.removeChild(input);
          }
        };

        input.oncancel = () => {
          document.body.removeChild(input);
          resolve(null);
        };

        document.body.appendChild(input);
        input.click();
      });
    }

    // モバイル版ではexpo-image-pickerを使用
    try {
      const { ImagePicker } = await import('expo-image-picker');
      
      // 権限をリクエスト
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('写真ライブラリへのアクセス権限が必要です');
      }

      // 画像を選択
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      const fileExt = asset.fileName?.split('.').pop() || 'jpg';
      const fileName = `${user.id}/avatar.${fileExt}`;

      // ファイルをArrayBufferに変換
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();

      // Supabase Storageにアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(fileName, arrayBuffer, {
          contentType: asset.mimeType || 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // 公開URLを取得
      const { data: urlData } = supabase.storage
        .from('avatar')
        .getPublicUrl(fileName);

      // profilesテーブルを更新
      console.log('Updating profile with avatar_url:', urlData.publicUrl);
      
      // まず既存のレコードを確認
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Profile select error:', selectError);
        throw selectError;
      }

      let updateError;
      if (existingProfile) {
        // 既存のレコードを更新
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', user.id);
        updateError = error;
      } else {
        // 新しいレコードを作成
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: '名前未設定',
            status: 'よろしく！',
            avatar_url: urlData.publicUrl
          });
        updateError = error;
      }

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }
      
      console.log('Profile updated successfully');
      return urlData.publicUrl;
    } catch (importError) {
      console.log("expo-image-picker not available, using placeholder");
      return "https://via.placeholder.com/150/42A5F5/FFFFFF?text=Library";
    }
  } catch (error) {
    console.error("ライブラリからの画像選択エラー:", error);
    throw error;
  }
}

/** カメラで撮影してアップロード */
export async function takePhotoWithCamera(): Promise<string | null> {
  try {
    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("ユーザー認証が必要です");
    }

    // モバイル版ではexpo-cameraを使用
    try {
      const { ImagePicker } = await import('expo-image-picker');
      
      // カメラの権限をリクエスト
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('カメラへのアクセス権限が必要です');
      }

      // カメラで撮影
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      const fileExt = asset.fileName?.split('.').pop() || 'jpg';
      const fileName = `${user.id}/avatar.${fileExt}`;

      // ファイルをArrayBufferに変換
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();

      // Supabase Storageにアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(fileName, arrayBuffer, {
          contentType: asset.mimeType || 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // 公開URLを取得
      const { data: urlData } = supabase.storage
        .from('avatar')
        .getPublicUrl(fileName);

      // profilesテーブルを更新
      console.log('Updating profile with avatar_url:', urlData.publicUrl);
      
      // まず既存のレコードを確認
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Profile select error:', selectError);
        throw selectError;
      }

      let updateError;
      if (existingProfile) {
        // 既存のレコードを更新
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', user.id);
        updateError = error;
      } else {
        // 新しいレコードを作成
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: '名前未設定',
            status: 'よろしく！',
            avatar_url: urlData.publicUrl
          });
        updateError = error;
      }

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }
      
      console.log('Profile updated successfully');
      return urlData.publicUrl;
    } catch (importError) {
      console.log("expo-image-picker not available, using placeholder");
      return "https://via.placeholder.com/150/42A5F5/FFFFFF?text=Camera";
    }
  } catch (error) {
    console.error("カメラ撮影エラー:", error);
    throw error;
  }
}

/** アイコンを選んでアップロード → 公開URLを返す（Public バケット前提） */
export async function pickAndUploadAvatar(): Promise<string | null> {
  // 既存の関数との互換性のため
  return pickImageFromLibrary();
}
