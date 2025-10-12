import { supabase } from "../lib/supabase";

export interface Photo {
  id: string;
  url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export class PhotoService {
  /**
   * 写真をSupabase Storageにアップロードし、photosテーブルに記録
   */
  static async uploadPhoto(photoUri: string, userId: string): Promise<Photo> {
    try {
      console.log('Starting photo upload for URI:', photoUri);
      console.log('User ID:', userId);
      
      // ファイル名を生成（ユニークにするため）
      const fileExt = photoUri.split('.').pop() || 'jpg';
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      console.log('Generated filename:', fileName);
      
      // MIMEタイプを正しく設定
      const getMimeType = (ext: string): string => {
        const mimeTypes: { [key: string]: string } = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp'
        };
        return mimeTypes[ext.toLowerCase()] || 'image/jpeg';
      };
      
      const mimeType = getMimeType(fileExt);
      console.log('MIME type:', mimeType);
      
      // React Native用のファイルアップロード方法
      // ファイルを読み込み
      console.log('Fetching file from URI...');
      const response = await fetch(photoUri);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      
      console.log('Converting to ArrayBuffer...');
      const arrayBuffer = await response.arrayBuffer();
      console.log('ArrayBuffer size:', arrayBuffer.byteLength);
      
      // Supabase Storageにアップロード
      console.log('Uploading to Supabase Storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, arrayBuffer, {
          contentType: mimeType,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      console.log('Upload successful:', uploadData);

      // 公開URLを取得
      console.log('Getting public URL...');
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
      console.log('Public URL:', urlData.publicUrl);

      // photosテーブルに記録
      console.log('Inserting into database...');
      const { data: photoData, error: insertError } = await supabase
        .from('photos')
        .insert({
          url: urlData.publicUrl,
          user_id: userId
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      console.log('Database insert successful:', photoData);
      return photoData;
    } catch (error) {
      console.error('Photo upload error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  /**
   * 全ての写真を取得
   */
  static async getAllPhotos(): Promise<Photo[]> {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch photos: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get photos error:', error);
      throw error;
    }
  }

  /**
   * 特定のユーザーの写真を取得
   */
  static async getUserPhotos(userId: string): Promise<Photo[]> {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch user photos: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get user photos error:', error);
      throw error;
    }
  }

  /**
   * 写真を削除
   */
  static async deletePhoto(photoId: string, userId: string): Promise<void> {
    try {
      // まず写真のURLを取得
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('url')
        .eq('id', photoId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch photo: ${fetchError.message}`);
      }

      // Storageからファイルを削除
      const fileName = photo.url.split('/').pop();
      if (fileName) {
        const { error: deleteError } = await supabase.storage
          .from('photos')
          .remove([`${userId}/${fileName}`]);
        
        if (deleteError) {
          console.warn('Storage delete error:', deleteError);
        }
      }

      // データベースからレコードを削除
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', userId);

      if (dbError) {
        throw new Error(`Database delete failed: ${dbError.message}`);
      }
    } catch (error) {
      console.error('Delete photo error:', error);
      throw error;
    }
  }

  /**
   * 写真の変更をリアルタイムで購読
   */
  static subscribeToPhotos(callback: (payload: any) => void) {
    return supabase
      .channel('photos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos'
        },
        callback
      )
      .subscribe();
  }
}
