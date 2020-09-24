import React from 'react';
import { Text, View, Image,Alert } from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';
import { ListItem, CheckBox, List, Body } from 'native-base';
import Moment from 'moment';
import GLOBAL from '../../global.js';

import PouchDB from 'pouchdb-react-native';

let handlerSync = null

export default class AssignAid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      household:{},
      name:'',
      aid_id:0,
      aid_name:'',
      localDB:new PouchDB('mydb'),
      remoteDB:new PouchDB(GLOBAL.remoteDB)
    };

    const { params } = this.props.navigation.state;
    if(params && params.data){
      this.state.household = params.data.household
      this.state.name = params.data.household.citizens[0].last_name+' '+params.data.household.citizens[0].first_name
    }
  }

  componentDidMount(){
      this.syncDb()
  }

  componentWillUnmount() {
    handlerSync.cancel()
  }
  
  syncDb = () => {
    this.setState({isLoading: true})
    handlerSync = PouchDB.sync(this.state.remoteDB, this.state.localDB, {
      live: true,
      retry: true,
    })
    .on('change', (info) => {
      console.log( 'sync onChange', info)
    })
    .on('paused', (err) => {
      console.log('sync onPaused', err)
    })
    .on('active', () => {
      console.log('sync onActive')
    })
    .on('denied', (err) => {
      console.log('sync onDenied', err)
    })
    .on('complete', (info) => {
      console.log('sync onComplete', info)
    })
    .on('error', (err) => {
      console.log('sync onError', err)
    })
  }

  chooseAid(index){
    if(this.state.aid_id != 0 && this.state.aid_id == index)
      this.setState({aid_id:0, aid_name:''})
    else{
      var chosen_aid = aidList.filter(aidList => aidList.id == index)[0]
      if(chosen_aid)
        this.setState({aid_id:chosen_aid.id, aid_name:chosen_aid.name})
      else
        this.setState({aid_id:0, aid_name:''})
    }
  }

  checkBoxState(index){
    return (this.state.aid_id == index) ? true : false
  }

  validAidChoose(){
    const date = new Date()
    if(this.state.aid_id !== 0){
      this.state.household.aids.push({
        'received' : Moment(date).format('DD/MM/YYYY'),
        'at': Moment(date).format('hh:mm:ss'),
        'id': this.state.aid_id,
        'name':this.state.aid_name,
        'description':this.state.aid_name,
      });

      const localDB  = new PouchDB('mydb');
      const props = this.state.household;
      
      localDB.post(props).then(function (response) {
        Alert.alert("Enregistrement terminé", "L'aide a bien été octroyé à ce ménage !!!");
      }).catch(function (err) {
        Alert.alert("Erreur d'enregistrement", "Une erreur est survenue lors de l'attribution d'aide. Veuillez réessayer ultérieurement.");
        console.log(error)
      });
    }
    else Alert.alert("Attention", "Veuillez choisir le programme d'aide avant de valider.");
  }

  render(){
    return (
      <View style={mainStylesheet.container_secondary}>
        <View style={{
            flexDirection: 'row',
            justifyContent:'space-evenly',
            marginTop:25
          }}>
          <Image source={require('../../../assets/money_orange.png')}/>
          <View style={{flex:1}}>
            <Text style={{fontSize:18}}>Choisissez le programme d'aide à octroyer à la famille de <Text style={mainStylesheet.textBold}>{this.state.name}</Text>.</Text>
            <Text style={{fontSize:18}}> - Fokonntany : <Text style={mainStylesheet.textBold}>{this.state.household.fokontany_name}</Text></Text>
            <Text style={{fontSize:18}}> - Adresse : <Text style={mainStylesheet.textBold}>{this.state.household.address}</Text></Text>
            <Text style={{fontSize:18}}> - Numéro carnet : <Text style={mainStylesheet.textBold}>{this.state.household.notebook_number}</Text></Text>
          </View>
        </View>
        <Text style={mainStylesheet.titleSection1}>Programme</Text>
        <List>
          <ListItem>
          </ListItem>
          <ListItem onPress={()=> this.chooseAid(1)}>
            <CheckBox checked={this.checkBoxState(1)}/>
            <Body>
              <Text style={mainStylesheet.textOrange}> TOSIKA FAMENO </Text>
            </Body>
          </ListItem>
          <ListItem onPress={()=> this.chooseAid(2)}>
            <CheckBox checked={this.checkBoxState(2)}/>
            <Body>
              <Text style={mainStylesheet.textOrange}> VATSY TSINJO </Text>
            </Body>
          </ListItem>
        </List>
        <View style={{
            flexDirection: 'row'
          }}>
        <CustomButton  style={mainStylesheet.primaryButton} title="Annuler" onPress={() => this.props.navigation.navigate('Home')}/>
        <CustomButton  style={mainStylesheet.primaryButton} title="Valider" onPress={() => this.validAidChoose()}/>
        </View>
      </View>
    );
  }
}

const aidList = [
  {id:1, name:'Tosika Fameno'},
  {id:2, name:'Vatsy Tsinjo'}
]