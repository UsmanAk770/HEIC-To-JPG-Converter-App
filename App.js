import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform,Text, ActivityIndicator, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'react-native';

const App = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonText, setButtonText] = useState('Choose an Image');
  const [hideButton, setHideButton] = useState(false);

  const pickImage = async () => {
    // Request permission to access the media library
    // const { status } = await MediaLibrary.requestPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert('Permission Denied', 'Please grant permission to access the media library.');
    //   return;
    // }
    const { status } = await MediaLibrary.requestPermissionsAsync();
    //const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  if (status !== 'granted') {
    Alert.alert(
      'Permission Denied',
      'You need to grant permission to access the media library in order to save images.'
    );
  }


    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // We're only interested in images
      allowsEditing: false,
      quality: 1, // 
      // base64: false, // Convert the image to base64 so we can send it to the server
      // exif: true, // We don't need the EXIF data
      selectionLimit: 1, // Allow only 1 image to be selected
    });
    
    if (!result.canceled) {
      setLoading(true);
      setHideButton(true);
      setTimeout(() => {
        setLoading(false);
        setButtonText('Download JPG Image')
      }, 2000);
      const fileUri = result.assets[0].uri;
      const mimeType = result.assets[0].type;
      // console.log(fileUri);
      setImage(fileUri);
    }
  };

  // const handleDownloadImage = async () => {
  //   try {
  //     // Read the local image data
  //     const imageInfo = await FileSystem.getInfoAsync(localImageUri);
  //     const imageBase64 = await FileSystem.readAsStringAsync(localImageUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Convert the image to JPG format
  //     const jpgImageBase64 = `data:image/jpeg;base64,${imageBase64}`;
      
  //     // Save the JPG image to the user's photo gallery
  //     const asset = await MediaLibrary.createAssetAsync(jpgImageBase64);
  //     await MediaLibrary.createAlbumAsync('YourAppAlbum', asset, false);

  //     Alert.alert('Success', 'Image saved to gallery successfully.');
  //   } catch (error) {
  //     console.error('Error saving image to gallery:', error);
  //     Alert.alert('Error', 'Failed to save the image to gallery.');
  //   }
  // };

  const downloadAndSaveImage = async () => {
    
    if (image) {
      try {
        // Save the local image to the user's photo gallery
        
        const asset = await MediaLibrary.createAssetAsync(image);
        // console.log('Asset:', asset);
        //await MediaLibrary.createAlbumAsync('YourAppAlbum', asset, false);
        // console.log('Image saved to gallery successfully.');
        Alert.alert('Success', 'Image saved to gallery successfully.');
        setImage(null);
        setHideButton(false);
        setButtonText('Choose an Image');
      } catch (error) {
        // console.error('Error saving image to gallery:', error);
        Alert.alert('Error', 'Failed to save the image to gallery.');
      }
    } else {
      Alert.alert('No Image', 'Please choose an image to download.');
    }
  };
  


  const handlePress = async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const url = 'https://www.facebook.com/heicinjpg?mibextid=9R9pXO';
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" or "https" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };


  const handlePressWebApp = async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const url = 'https://www.heicinjpg.de/';
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" or "https" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const removeImage = () => {
    setImage(null);
    setButtonText('Choose an Image');
    setHideButton(false);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#6a51ae" /> */}
        <Image source={require('./assets/Logo.png')} style={styles.logo} />
        <Text style={styles.HeadingText}>Convert HEIC to JPG</Text>
      </View>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      {image && (<View> 
      {loading ? (
          <View style={{marginBottom: 40}}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            size="large"
            //Text with the Spinner
            textContent={'Loading...'}
            color="#0000ff"
            //Text style of the Spinner Text
          />
        </View>) : 
        (<Image source={{ uri: image }} style={{ width: 300, height: 300, borderRadius: 5 }} />)}
        </View>)}
      {/* <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Choose an Image</Text>
      </TouchableOpacity> */}
      {}{buttonText === 'Choose an Image' ? (hideButton ? null :
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <FontAwesome name="image" size={20} color="white" />
        <Text style={styles.buttonText}>   {buttonText}</Text>
      </TouchableOpacity>):
      <View> 
      <TouchableOpacity style={styles.button} onPress={downloadAndSaveImage}>
        <FontAwesome name="download" size={20} color="white" />
        <Text style={styles.buttonText}>   {buttonText}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Removebutton} onPress={removeImage}>
      <FontAwesome name="remove" size={20} color="white" />
      <Text style={styles.buttonText}>    Remove Image</Text>
    </TouchableOpacity></View>}
    </View>
    <View style={styles.footer}>
      <Text style={styles.footerText1}>© 2024 HeicInJpg. All rights reserved.</Text>
      <Text style={styles.footerText2}>Visit our website, Also follow us on Facebook! </Text>
      <View style={styles.socialMediaContainer}>
      <TouchableOpacity onPress={handlePressWebApp}>
          <FontAwesome name="globe" size={25} color="blue" style={{marginRight:30}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePress}>
          <FontAwesome name="facebook" size={25} color="blue" style={{marginRight:30}} />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <FontAwesome name="instagram" size={25} color="#C13584" style={{marginRight:30}} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="twitter" size={25} color="#1DA1F2" style={{marginRight:30}} />
        </TouchableOpacity> */}
      </View>
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#087E8B',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : StatusBar.currentHeight,
    paddingTop: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // Add more styling that matches your web app header
  },
  HeadingText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  footer: {
    backgroundColor: '#FF5A5F',
    padding: 15,
    //paddingBottom:10,
    justifyContent: 'center',
    // Add more styling that matches your web app footer
  },
  logo: {
    width: 100,
    height: 70,
    resizeMode: 'contain',
  },
  Removebutton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5A5F',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5A5F',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreview: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    margin: 20,
  },
  footerText1: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    // Add more styling that matches your web app footer text
  },
  footerText2: {
    marginTop: 5,
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    // Add more styling that matches your web app footer text
  },
  socialMediaContainer: {
    flexDirection: 'row', // Align icons horizontally
    justifyContent: 'center', // Center the icons
    marginTop: 10, // Space between text and icons
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

export default App;


