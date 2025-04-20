import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ExpoImageManipulator } from 'react-native-expo-image-cropper';

export default function ReceiptSplitter() {
  const [photoUri,    setPhotoUri]    = useState(null);
  const [croppedUri,  setCroppedUri]  = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  //Ask & pick
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission required', 'We need access to your photos.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (result.canceled) return;
    const [{ uri }] = result.assets;
    setPhotoUri(uri);
    setShowCropper(true);
  }

  // 2️⃣ Snap & crop
  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission required', 'We need access to your camera.');
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (result.canceled) return;
    const [{ uri }] = result.assets;
    setPhotoUri(uri);
    setShowCropper(true);
  }

  return (
    <View style={styles.container}>
      <Button onPress={pickImage} title="Pick from Library" />
      <Button onPress={takePhoto} title="Take a Photo" />

      {croppedUri && (
        <>
          <Image source={{ uri: croppedUri }} style={styles.image} />
          <Button title="Use This Crop" onPress={() => /* send to OCR */ null} />
        </>
      )}

      {/*Cropper modal */}
      <ExpoImageManipulator
        isVisible={showCropper}
        photo={{ uri: photoUri }}
        onPictureChoosed={(data) => {
          setShowCropper(false);
          setCroppedUri(data.uri);
        }}
        onToggleModal={() => setShowCropper(false)}
        saveOptions={{
          compress: 1,
          format: 'jpeg',
          base64: false,
        }}
        // you can pass props like initialAspect, minAspect, etc.
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  image:     { width: width * 0.8, height: width * 0.8, marginTop: 20, alignSelf: 'center' },
});
