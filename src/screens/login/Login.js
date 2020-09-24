import React from 'react';
import {Text, View, TextInput, Image, Linking, Picker, Alert} from 'react-native';
import {mainStylesheet, CustomButton, logoStylesheet, chooseLangStylesheet} from '../../../assets/stylesheet/Main';

import GLOBAL from '../../global.js';

import PouchDB from 'pouchdb-react-native';

let handlerSync = null

export default class Login extends React.Component {

  state={
    email:"",
    password:"",
    lang: 'fr-FR',
    fokontanys:{},
    pull_date:'...'
  }

  componentDidMount(){
    this.syncDb()
  }

  componentWillUnmount() {
    handlerSync.cancel()
  }
  
  syncDb = () => {
    userLocalDB  = new PouchDB('userdb',{});
    userRemoteDB = new PouchDB(GLOBAL.userRemoteDB);
    this.setState({isLoading: true})
    const _this = this
    handlerSync = PouchDB.sync(userRemoteDB, userLocalDB, {
      live: true,
      retry: true,
    })
    .on('change', (info) => {
      console.log( 'sync onChange', info)
    })
    .on('paused', (err) => {
      console.log('sync onPaused', err)
      if (this.isAtCurrentScreen) {
        this.getListNoteFromDb()
      }
    })
    .on('active', () => {
      console.log('sync onActive')
    })
    .on('denied', (err) => {
      console.log('sync onDenied', err)
    })
    .on('complete', (info) => {
      console.log('PULL DATE', info.end_time)
      if(info.end_time != null) _this.setState({pull_date:info.end_time})
    })
    .on('error', (err) => {
      console.log('sync onError', err)
    })
  }
  
  checklogin() {
    const _this = this;
    userLocalDB  = new PouchDB('userdb',{});
    console.log(_this.state.email)
    console.log(_this.state.password)
    userLocalDB.find({
        selector : {
          login : _this.state.email,
          password : _this.state.password
        },
        sort: ['_id']
    }).then(function (result) {
      console.log(result.docs.length)
      if(result.docs.length > 0) _this.props.navigation.navigate('Home', {fokontanies: result.docs[0].fokontany});
      else Alert.alert('Erreur de connexion','Veuillez vérifier votre login et votre mot de passe.');
    }).catch(function (err) {
        console.log(err)
        Alert.alert('Attention','Une erreur est survenue pendant la recherche. Veuillez réessayer ultérieurement.');
    })
  }

  render(){
    return (
      <View style={mainStylesheet.container}>
        <Image style={logoStylesheet.marginBottom}
          source={require('../../../assets/logo_loharano.png')}/>
        <View style={chooseLangStylesheet.picker}>
          <Picker
            selectedValue={this.state.lang}
            onValueChange={lang => this.setState({ lang })}
            itemStyle={{ backgroundColor: 'lightgrey', marginLeft: 0, paddingLeft: 15 }}
            itemTextStyle={{ fontSize: 18, color: 'white' }}
            style={{width: 140, height: 35, color: '#ffffff'}}
            mode="dropdown">
            <Picker.Item label="Français" value="fr-FR" />
            <Picker.Item label="Malagasy" value="mg-MG" />
          </Picker>
        </View>
        <TextInput
          style={mainStylesheet.inputText}
          placeholder="Identifiant ..."
          onChangeText={text => this.setState({email:text})}/>
        <TextInput
          style={mainStylesheet.inputText}
          secureTextEntry
          placeholder="Mot de passe ..." 
          onChangeText={text => this.setState({password:text})}/>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
        <CustomButton
          style={mainStylesheet.primaryButton}
          title="Se connecter"
          onPress={() => this.checklogin()}/></View>

        <Text style={mainStylesheet.marginTop}>Dernière synchronisation {this.state.pull_date}.</Text>
        <Text>Application version 1.5.0</Text>
        <View style={mainStylesheet.bottom}>
          <Text
            style={mainStylesheet.digitalgovmg}
            onPress={()=>Linking.openURL('https://digital.gov.mg/')}>DIGITAL.GOV.MG</Text>
        </View>
      </View>
    );
  }
}
