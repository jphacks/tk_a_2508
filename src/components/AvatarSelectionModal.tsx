import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFromLibrary: () => void;
  onTakePhoto: () => void;
}

export function AvatarSelectionModal({ 
  visible, 
  onClose, 
  onSelectFromLibrary, 
  onTakePhoto 
}: AvatarSelectionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>アバターを選択</Text>
          
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => {
              onSelectFromLibrary();
              onClose();
            }}
          >
            <Ionicons name="images-outline" size={24} color="#007AFF" />
            <Text style={styles.optionText}>写真ライブラリから選択</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => {
              onTakePhoto();
              onClose();
            }}
          >
            <Ionicons name="camera-outline" size={24} color="#007AFF" />
            <Text style={styles.optionText}>カメラで撮影</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
          >
            <Text style={styles.cancelText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
});

