import React, { useState, useEffect } from 'react';
import { SafeAreaView, Modal } from 'react-native';
import { commonStyles } from '../styles/common';
import { RandomScreen } from './Random/RandomScreen';
import { PhotoModal } from '../components/PhotoModal';
import { CameraScreen } from '../components/CameraScreen';
import { PhotoService, Photo } from '../services/photoService';

export function HomeScreen() {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [hasTakenPhoto, setHasTakenPhoto] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  // 写真一覧を取得する関数
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const photosData = await PhotoService.getAllPhotos();
      setPhotos(photosData);
    } catch (error) {
      console.error('写真の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // ログイン後に写真撮影モーダルを表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhotoModal(true);
    }, 1000); // 1秒後にモーダルを表示

    return () => clearTimeout(timer);
  }, []);

  // コンポーネントマウント時に写真を取得
  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleTakePhoto = () => {
    setShowPhotoModal(false);
    setShowCamera(true);
  };

  const handlePhotoTaken = (uri: string) => {
    console.log('写真が撮影されました:', uri);
    setShowCamera(false);
    setHasTakenPhoto(true);
    // 写真撮影後に一覧を更新
    fetchPhotos();
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setShowPhotoModal(true);
  };

  const handleCloseModal = () => {
    if (hasTakenPhoto) {
      setShowPhotoModal(false);
    }
    // 写真を撮影していない場合は閉じられない
  };


  return (
    <SafeAreaView style={commonStyles.container}>
      <RandomScreen isCameraOpen={showCamera} />
      
      <PhotoModal
        visible={showPhotoModal}
        onClose={handleCloseModal}
        onTakePhoto={handleTakePhoto}
      />
      
  <Modal visible={showCamera} animationType="slide" presentationStyle="fullScreen">
        <CameraScreen
          onPhotoTaken={handlePhotoTaken}
          onClose={handleCloseCamera}
        />
      </Modal>
    </SafeAreaView>
  );
}

