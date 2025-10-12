import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { RandomStyles } from '../screens/Random/RandomScreen.styles';
import { Photo } from '../services/photoService';
import { supabase } from '../lib/supabase';

interface PhotoCardProps {
  photo: Photo;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadName = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', photo.user_id)
          .maybeSingle();
        if (error) {
          console.warn('failed to load profile name', error);
          return;
        }
        if (mounted && data && (data as any).name) {
          setUserName((data as any).name);
        }
      } catch (e) {
        console.warn('error fetching profile name', e);
      }
    };
    loadName();
    return () => { mounted = false; };
  }, [photo.user_id]);

  return (
    <View style={RandomStyles.photoCard}>
      <View style={RandomStyles.photoHeader}>
        <Text style={RandomStyles.userName}>{userName || 'ユーザー'}</Text>
      </View>

      <Image source={{ uri: photo.url }} style={RandomStyles.photo} />

      <TouchableOpacity style={RandomStyles.likeButton} activeOpacity={0.7}>
        <Text style={RandomStyles.likeIcon}>❤️</Text>
      </TouchableOpacity>
    </View>
  );
};
