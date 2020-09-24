import React from 'react';
import { StyleSheet, Text, ScrollView,SafeAreaView, View, TextInput, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';

import { Camera } from 'expo-camera';

export default class Picture extends React.Component {
  // Component State
  state = {
    hasCameraPermission: null, // if app has permissions to acess camera
    isScanned: false, // scanned
    cameraRef: null,
    type : null,
    base64: null
  }
  async componentDidMount() {
    // ask for camera permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" ? true : false });
    
    this.setState({ type: Camera.Constants.Type.backe });
  }

  setCameraRef(ref){
   this.setState({ cameraRef: ref });
  }

  setType(type){
   this.setState({ type: type });
  }

  render(){
    const { hasCameraPermission, isScanned } = this.state;
    if(hasCameraPermission === null){
      // requesting permission
      return (
        <Text>Requesting for camera permission</Text>
      );
    }
    if(hasCameraPermission === false){
        //permission denied
      return ( 
        <View>
         <Text>Please grant Camera permission</Text>
        </View> 
      )
    }
    if(hasCameraPermission === true && !isScanned && this.props.navigation.isFocused() ){
      // we have permission and this screen is under focus
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => {
            this.state.cameraRef=ref ;}}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'flex-end'
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end'
                }}
                onPress={() => {
                  this.setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}>
              </TouchableOpacity>
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={async() => {
                if(this.state.cameraRef){
                  let photo = await this.state.cameraRef.takePictureAsync({
                    base64: true,
                    skipProcessing : true,
                    quality : 0,
                    mute: false
                  }).then(data => {
                          this.setState({base64:data.base64})
                          });
                  this.props.navigation.navigate('MenageAddChief',{base64:this.state.base64});
                }
              }}>
                <View style={{ 
                   borderWidth: 2,
                   borderRadius:5,
                   borderColor: 'white',
                   height: 50,
                   width:50,
                   display: 'flex',
                   justifyContent: 'center',
                   alignItems: 'center'}}
                >
                  <View style={{
                     borderWidth: 2,
                     borderRadius:5,
                     borderColor: 'white',
                     height: 40,
                     width:40,
                     backgroundColor: 'white'}} >
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    else{
      return <Text>L'application Loharano n'arrive pas à acceder à votre caméra.</Text>;
    }
  }
}