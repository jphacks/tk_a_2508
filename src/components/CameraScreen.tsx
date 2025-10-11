import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, StatusBar } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { PhotoService } from '../services/photoService';

const { width, height } = Dimensions.get('window');

interface CameraScreenProps {
  onPhotoTaken: (uri: string) => void;
  onClose: () => void;
}

export function CameraScreen({ onPhotoTaken, onClose }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // フルスクリーン表示のためステータスバーを隠す
  useEffect(() => {
    StatusBar.setHidden(true, 'fade');
    
    // コンポーネントがアンマウントされた時にステータスバーを復元
    return () => {
      StatusBar.setHidden(false, 'fade');
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラの許可が必要です</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>許可する</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1.0,
          base64: false,
          skipProcessing: false,
          exif: true,
        });
        
        if (photo?.uri) {
          // 現在のユーザーを取得
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            Alert.alert('エラー', 'ユーザー認証が必要です');
            return;
          }

          // 写真をSupabaseにアップロード
          try {
            const uploadedPhoto = await PhotoService.uploadPhoto(photo.uri, user.id);
            console.log('写真がアップロードされました:', uploadedPhoto);
            onPhotoTaken(uploadedPhoto.url);
          } catch (uploadError) {
            console.error('アップロードエラー:', uploadError);
            Alert.alert('エラー', '写真のアップロードに失敗しました');
            // アップロードに失敗してもローカルのURIを返す
            onPhotoTaken(photo.uri);
          }
        }
      } catch (error) {
        console.error('撮影エラー:', error);
        Alert.alert('エラー', '写真の撮影に失敗しました');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        ref={cameraRef}
        mode="picture"
        pictureSize="max"
      >
        <View style={styles.overlay}>
          {/* 上部コントロール */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* 下部コントロール */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Text style={styles.flipButtonText}>🔄</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <LinearGradient
                colors={['rgba(55, 134, 238, 1)', 'rgba(183, 230, 255, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.captureButtonGradient}
              >
                <View style={styles.captureButtonInner} />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 60, // ステータスバー分を考慮して調整
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 60, // ホームインジケーター分を考慮して調整
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  placeholder: {
    width: 60,
    height: 60,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
