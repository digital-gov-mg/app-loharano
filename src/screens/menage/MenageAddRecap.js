import React from 'react';
import {Text, ScrollView, Image, View, TouchableOpacity, Alert } from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';

import Household from "../../bo/household/Household.js";
import Citizen from '../../bo/citoyen/Citizen.js';
import GLOBAL from '../../global.js';

import NetInfo from '@react-native-community/netinfo';

import PouchDB from 'pouchdb-react-native';

let handlerSync = null
export default class MenageAddRecap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      houseHold:{},
      citizens:[],
      localisationFields: [
        {label:'Numéro carnet',value:'notebook_ref'},
        {label:'Fokontany',value:'fokontany_name'},
        {label:'Adresse',value:'address'},
        {label:'Secteur/Localité',value:'sector'},
        {label:'Création carnet',value:'notebook_date_creation'},
        {label:'Date d\'arrivée',value:'arrived_date'},
        {label:'Date de sortie',value:'out_date'}
      ]
    };

    const { params } = this.props.navigation.state;
    if(params && params.data){
      this.state.houseHold = params.data.houseHold;
      this.state.citizens  = params.data.citizens;

      if(this.state.houseHold.aids ===null){
        Object.assign(this.state.houseHold, {aids: {}});
      }
    }
  }

  saveMenageAndMembers(){
    const urlHost = process.env.urlHost;
    const postHouseHoldAndMembers = process.env.postHouseHoldAndMembers;

    const requestString = urlHost + postHouseHoldAndMembers;

    Object.assign(this.state.houseHold, {citizens: this.state.citizens});

    delete this.state.houseHold.id;

    this.state.houseHold.citizens.forEach(function (citizen) {
      delete citizen.id;
    });

    const dataToSend = JSON.stringify(this.state.houseHold);

    NetInfo.fetch().then(state => {
      if(!state.isConnected){
        fetch(requestString, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: dataToSend
        })
        .then(response => {
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]);
        })
        .then((res, data) => {
          if(res[0] === 200){
            Alert.alert("Enregistrement terminé", "Le ménage a bien été enregistré dans la base centrale", [{ text: "OK", onPress: () => this.props.navigation.navigate('Home')}]);
          }
          else Alert.alert("Information incomplète",res[1]);
        })
        .catch((error) => {
          Alert.alert("Erreur sur la validation"," Vérifier vos informations !!!");
        });
      }
      else{
        this.saveHouseholdAnMembersInPouchDB();
      }
    });  

  }

  componentDidMount(){
    this.syncDb()
  }
  componentWillUnmount() {
    handlerSync.cancel()
  }
  
  syncDb = () => {
    localDB  = new PouchDB('mydb');
    remoteDB = new PouchDB(GLOBAL.remoteDB);
    this.setState({isLoading: true})
    handlerSync = PouchDB.sync(remoteDB, localDB, {
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
      console.log('sync onComplete', info)
    })
    .on('error', (err) => {
      console.log('sync onError', err)
    })
  }

  saveHouseholdAnMembersInPouchDB(){
    Object.assign(this.state.houseHold, {citizens: this.state.citizens});
    
    const localDB  = new PouchDB('mydb');
    const props = this.state.houseHold;
    const myThis = this;
    localDB.post(props).then(function (response) {
      Alert.alert("Enregistrement terminé", "Le ménage a bien été enregistré dans la base locale", [{ text: "OK", onPress: () => myThis.props.navigation.navigate('Home')}]);
    }).catch(function (err) {
      alert(err);
    });   
}
  
saveHouseholdInLocal(){
  Household.createTable();
  
  const props = this.state.houseHold;
  const household = new Household(props);
    
  household.save();
}

saveCitizenInLocal(data){
  Citizen.createTable();
  const citizen = new Citizen(data);
  citizen.save();
}

  addingMember() {
    const data = {};
    Object.assign(data, {houseHold: this.state.houseHold});
    Object.assign(data, {citizens: this.state.citizens});

    this.props.navigation.navigate('CitoyenAdd', {data: data});
  }
  
  editCitizen(index){
    const data = {};
    Object.assign(data, {houseHold: this.state.houseHold});
    Object.assign(data, {citizens: this.state.citizens});
    Object.assign(data, {index: index});
    Object.assign(data, {title: 'Modification membre'});
   
    this.props.navigation.navigate('CitoyenAdd', {data: data});
  }

  removeFromList(index) {
    this.state.citizens.splice(index, 1);
    this.setState(this.state.citizens);
  }

  render(){
    return (
      <View style={mainStylesheet.container_secondary}>
        <ScrollView >
        <Text style={mainStylesheet.titleSection2}>Récapitulation (3/3)</Text>
        <Text style={mainStylesheet.titleSection1}>Localisation</Text>
        <View style={mainStylesheet.detailsGroup}>
            <Text style={mainStylesheet.detailsLabel}>Numéro carnet</Text>
            <Text style={mainStylesheet.detailsValue}>{this.state.houseHold.notebook_number}</Text> 
        </View>
        <View style={mainStylesheet.detailsGroup}>
            <Text style={mainStylesheet.detailsLabel}>Fokontany</Text>
            <Text style={mainStylesheet.detailsValue}>{this.state.houseHold.fokontany_name}</Text> 
        </View>
        <View style={mainStylesheet.detailsGroup}>
            <Text style={mainStylesheet.detailsLabel}>Adresse</Text>
            <Text style={mainStylesheet.detailsValue}>{this.state.houseHold.address}</Text> 
        </View>
        <View style={mainStylesheet.detailsGroup}>
            <Text style={mainStylesheet.detailsLabel}>Secteur/Localité</Text>
            <Text style={mainStylesheet.detailsValue}>{this.state.houseHold.sector_locality}</Text> 
        </View>
        <View style={mainStylesheet.detailsGroup}>
            <Text style={mainStylesheet.detailsLabel}>Création carnet</Text>
            <Text style={mainStylesheet.detailsValue}>{this.state.houseHold.notebook_date}</Text> 
        </View>
        <View style={mainStylesheet.detailsGroup}>
            <Text style={mainStylesheet.detailsLabel}>Date d'arrivée</Text>
            <Text style={mainStylesheet.detailsValue}>{this.state.houseHold.date_arrived}</Text> 
        </View>
        <View style={mainStylesheet.detailsGroup}>
            <Text style={mainStylesheet.detailsLabel}>Date de sortie</Text>
            <Text style={mainStylesheet.detailsValue}>{this.state.houseHold.date_leaved}</Text> 
        </View>

          <Text style={mainStylesheet.titleSection1}>Membre(s) du ménage</Text>
            <ScrollView style={{marginVertical: 15}}>
              {this.state.citizens.map( (citizenData, index) => (
              <View key={index} style={mainStylesheet.listItemCitizen}>
                <View>
                  <Text style={mainStylesheet.detailsLabel}>{citizenData.last_name || ''}</Text>
                  <Text style={mainStylesheet.detailsLabel}>{citizenData.first_name || ''}</Text>
                </View>
                <View style={{
                    flexDirection: 'row'
                  }}>
                  <TouchableOpacity onPress={() => this.editCitizen(index)}>
                    <Image style={mainStylesheet.listItemImageCitizen} source={require('../../../assets/edit-button.png')}/>
                  </TouchableOpacity>
                  {index != 0 &&
                    <TouchableOpacity onPress={() => this.removeFromList(index)}><Image style={mainStylesheet.listItemImageCitizen} source={require('../../../assets/stop.png')} /></TouchableOpacity>}
                </View>
              </View>
              ))}
            </ScrollView>

          {((this.state.houseHold.aids!= null) && (Object.keys(this.state.houseHold.aids).length !== 0) && (this.state.houseHold.aids != undefined))?
            <View>
            <Text style={mainStylesheet.titleSection1}>Aide(s)</Text>
            <ScrollView style={{marginVertical: 15}}>
              {this.state.houseHold.aids.map( (aid, index) => (
              <View key={index} style={mainStylesheet.listItemCitizen}>
                <View>
                  <Text style={mainStylesheet.detailsLabel}>{aid.name || ''}</Text>
                  <Text>{aid.received || ''}</Text>
                </View>
              </View>
              ))}
            </ScrollView>

            </View>
            :
            <View>
              <Text style={mainStylesheet.titleSection1}>Aide(s)</Text>
            </View>
          }
        </ScrollView>
        
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
          <CustomButton style={mainStylesheet.secondaryButton} textStyle={mainStylesheet.textOrange} title="Ajout membre" onPress={() => this.addingMember()}/>
          <CustomButton style={mainStylesheet.primaryButton} title="Valider" onPress={() => this.saveHouseholdAnMembersInPouchDB()}/>
        </View>
      </View>
    );
  }
}
