import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/common';
import { RandomScreen } from './Random/RandomScreen';
import { PhotoModal } from '../components/PhotoModal';
import { CameraScreen } from '../components/CameraScreen';

export function HomeScreen() {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [hasTakenPhoto, setHasTakenPhoto] = useState(false);

  // ログイン後に写真撮影モーダルを表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhotoModal(true);
    }, 1000); // 1秒後にモーダルを表示

    return () => clearTimeout(timer);
  }, []);

  const handleTakePhoto = () => {
    setShowPhotoModal(false);
    setShowCamera(true);
  };

  const handlePhotoTaken = (uri: string) => {
    console.log('写真が撮影されました:', uri);
    setShowCamera(false);
    setHasTakenPhoto(true);
    // ここで写真を保存したり、次の処理を行ったりできます
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
      
      {showCamera && (
        <CameraScreen
          onPhotoTaken={handlePhotoTaken}
          onClose={handleCloseCamera}
        />
      )}
    </SafeAreaView>
  );
}
