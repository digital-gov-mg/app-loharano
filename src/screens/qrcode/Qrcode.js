import React from 'react';
import { StyleSheet, Text, ScrollView,SafeAreaView, View, TextInput, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import MenageDetails from "../menage/MenageDetails";

import NetInfo from '@react-native-community/netinfo';

import PouchDB from 'pouchdb-react-native';

export default class Qrcode extends React.Component {
  // Component State
  state = {
    hasCameraPermission: null, // if app has permissions to acess camera
    isScanned: false, // scanned
    household:{},
  }
  async componentDidMount() {
    // ask for camera permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" ? true : false });
  }

  handleBarCodeScanned = ({ type, data }) => {
    const urlHost = process.env.urlHost;
    const getHouseHoldDetails = process.env.getHouseHoldDetails;//"784984dsf89498?notebook_reference="

    var menageObject = JSON.parse(data);
    
    this.launchSearch(menageObject);
    
   /*
    NetInfo.fetch().then(state => {
      if(state.isConnected){
        const requestString = urlHost+getHouseHoldDetails+menageObject.notebook_reference;

        fetch(requestString, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.navigation.navigate('MenageDetails', {
              data: JSON.stringify(responseJson),
              type:type 
            });
          })
          .catch((error) => {
            alert("Error:"+JSON.stringify(params.data));
        });
      }
      else{
        this.props.navigation.navigate('MenageDetails', {
          data: JSON.stringify(menageObject),
          type:type 
        });
      }
    });
*/
  }

  launchSearch(menageObject) {    
    PouchDB.plugin(require('pouchdb-find'));

    const localDB  = new PouchDB('mydb',{});
    var notebook_number = 1;
    notebook_number = menageObject.notebook_number.trim()==""?null:menageObject.notebook_number;
    localDB.createIndex({
      index: 
      {fields: ['notebook_number',]}
    }).then(function (result) {
      console.log(JSON.stringify(result));
    }).catch(function (err) {
      console.log(JSON.stringify(err)); 
    });
  
    const myThis = this;
    var households = null;
    if(notebook_number!=null)
     {
      /*localDB.createIndex({
        index: 
        {fields: [
          'notebook_number'
        ]}
      }).then(function (result) {
        console.log(JSON.stringify(result));
      }).catch(function (err) {
        console.log(JSON.stringify(err)); 
      }); 
       */
      localDB.find({
          selector: {
              notebook_number: notebook_number,
        },
        sort: ['_id']
        }).then(function (result) {
            myThis.props.navigation.navigate('MenageDetails',{
              data: JSON.stringify(result.docs[0]),
            });
      }).catch(function (err) {});
     
     }
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
      return <View style = {{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'

      }}>
        <Text>Scan code inside window</Text>
        <BarCodeScanner
          onBarCodeScanned = { isScanned ? undefined : this.handleBarCodeScanned }
          style = {StyleSheet.absoluteFillObject}
        >
        </BarCodeScanner>
      </View>
    }
    else{
      return <Text>L'application Loharano n'arrive pas à acceder à votre caméra.</Text>;
    }
  }
}