import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface PhotoModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
}

export function PhotoModal({ visible, onClose, onTakePhoto }: PhotoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>写真を投稿して始めよう</Text>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.cameraButton} onPress={onTakePhoto}>
              <LinearGradient
                colors={['rgba(183, 230, 255, 1)', 'rgba(83, 69, 236, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0.5 }}
                style={styles.buttonOuterGradient}
              >
                <LinearGradient
                  colors={['rgba(55, 134, 238, 1)', 'rgba(183, 230, 255, 1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0.5 }}
                  style={styles.buttonInnerGradient}
                >
                  <Text style={styles.buttonText}>撮影</Text>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 699,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: 'rgba(24, 19, 99, 0.7)',
    shadowOffset: { width: 4.16, height: 4.16 },
    shadowOpacity: 1,
    shadowRadius: 33.26,
    elevation: 20,
  },
  modalContent: {
    paddingLeft: 84,
    paddingRight: 84,
    paddingTop: 77,
    paddingBottom: 77,
    alignItems: 'center',
    gap: 35,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 32.25,
    lineHeight: 44.67,
    textAlign: 'center',
    color: '#121212',
    width: '100%',
  },
  divider: {
    width: '100%',
    height: 2,
    borderStyle: 'dashed',
    borderColor: '#b0b0b0',
    borderTopWidth: 2.5,
  },
  cameraButton: {
    width: 214, // 357 * 0.6
    height: 72, // 120 * 0.6
    borderRadius: 15.38, // 25.64 * 0.6
    overflow: 'hidden',
    borderWidth: 1.81, // 3.02 * 0.6
    borderColor: '#36369B',
  },
  buttonOuterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15.38, // 25.64 * 0.6
  },
  buttonInnerGradient: {
    width: 203, // 339 * 0.6
    height: 59, // 98 * 0.6
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.67, // 21.11 * 0.6
    margin: 5.4, // 9 * 0.6
  },
  buttonText: {
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 27.14, // 45.24 * 0.6
    textAlign: 'center',
    color: '#FFFFFF',
    width: 110.14, // 183.56 * 0.6
  },
});
