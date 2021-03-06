import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Button,
  Alert,
  TextInput,
  Image
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LOCAL_IP } from '@env';
import md5 from 'md5';

/*
*   userInfo is a variable which is mentioned in the SignInScreen.js and stores the basic information
*   of the user that has logged in.
*/
import {userInfo} from './SignInScreen.js';
import Users from '../model/users';
import '../global.js';

//  source is the location of the selected images, that needs to be sent.
const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

const SendScreen = () => {

/*
*   info is a React-Hook, which is responsible to store and update information
*   needed while sending image. Since the user who has logged in will be responsible
*   for sending a message/image, therefore, info.sender is initialized to userInfo.address
*   info.receiver stores the address of the receiver and info.hash stores the md5 hash of image/asset
*/

    const [info, setInfo] = React.useState({
        sender: userInfo.address,
        receiver: '',
        hash: '',
    });

  const sendAsset = () => {
    fetch(`http://${LOCAL_IP}:3001/contracts/sendAsset`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        person: userInfo.address,
        to: info.receiver,
        hash: info.hash
      })
    })
    .then((response) => response.json())
    .then((json) => {
      console.log("Send Asset Response : ", JSON.stringify(json, null, 2));
      showAlert("You have sent the asset to ", json.event.args[1]);
    })
    .catch(error => {
      console.log(error)
    })
  }

//  handleSendTo updates the info.receiver of the image.
   handleSendTo = (text) => {
        setInfo({
            ...info,
            receiver: text
        });
   }

    const showAlert = (title, message) => {
      Alert.alert(
        title,
        message,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      );
    }   

/*
*   chooseFile manages the ImagePicker and updates the info.message
*   with the location of the selected image.
*/
    chooseFile = () => {
        let options = {title: "Select a File"};
        let source = '';
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                source = response.uri;
                var assetHash = md5(response.data);
                setInfo({
                    ...info,
                    hash: assetHash
                });
                console.log('Source is ', source);
                // showAlert('Your Asset Hash (md5) ', assetHash);
                console.log("assetHash : ", assetHash);
            }
        });
    };

/*
*   handleSend updates the global variables, which will be necessary when the other person logs in.
*   RECEIVE is the primary variable that we would focus on.
*/
   const handleSend = (sender, receiver, message) => {
      console.log(RECEIVE);
      SEND[sender]++;
      RECEIVE[receiver].sender = sender;
      RECEIVE[receiver].message = message;
      RECEIVE[receiver].paid = -1;
      console.log(RECEIVE);
   }

   return (
      <View style={styles.MainContainer}>
        <TextInput
              placeholder="Enter Receiver's Address here"
              placeholderTextColor="white"
              underlineColorAndroid = "#FF6347"
              style={styles.TextInputStyle}
              onChangeText = {handleSendTo}
        />

            <View style={styles.container}>
                { 
                  info.sending ?
                <Image
                    source={{ uri: info.message }}
                    style={{ width: 350, height: 300, alignItems: 'center', margin: 5 }}
                />
                : null
                }
                <Text style={{ alignItems: 'center' }}>
                    {info.filePath}
                </Text>
            </View>

                <TouchableOpacity
                    onPress={chooseFile.bind(this)}
                    style={[styles.signIn, {
                        borderColor: '#FF6347',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#FF6347'
                    }]}>CHOOSE FILE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signIn}
                    onPress ={() => {
                        sendAsset();
                        console.log(info);
                    }}
                >
                    <LinearGradient
                        colors={['#FFA07A', '#FF6347']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Send</Text>
                    </LinearGradient>
                </TouchableOpacity>
         </View>
        )
};

export default SendScreen;

const styles = StyleSheet.create({
   container: {
      paddingTop: 23,
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1
   },
   sendButton: {
      backgroundColor: '#7a42f4',
      borderRadius: 10,
      padding: 10,
      margin: 30,
      height: 40,
      width: 80,
      alignItems: 'center',
   },
   sendButtonText:{
      color: 'white'
   },
   MainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   TextInputStyle:{
      textAlign: 'center',
      height: 60,
      width: '93%',
      color: 'white',
      fontSize: 20
   },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '60%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }   
});
