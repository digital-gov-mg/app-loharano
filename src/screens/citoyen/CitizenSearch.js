import React from 'react';
import {Text, ScrollView, View, TextInput, Alert, Image, TouchableOpacity} from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';
import {TextInputMask} from 'react-native-masked-text';
import GLOBAL from '../../global.js';

import PouchDB from 'pouchdb-react-native';

PouchDB.plugin(require('pouchdb-find'));

export default class CitizenSearch extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      notebook_number:'',
      last_name:'',
      first_name:'',
      cin:'',
      citizens:[],
      localDB:new PouchDB('mydb'),
      remoteDB:new PouchDB(GLOBAL.remoteDB)
    }
  }

  launchSyncronisation() {
    this.state.localDB=new PouchDB('mydb',{}), this.state.remoteDB;
    this.state.localDB.sync(this.state.remoteDB, {
      live: true,
      retry: true,
      continuous: true
    }).on('change', function (change) {
      console.log('yo, something changed!');
      console.log(change);
    }).on('paused', function (info) {
      console.log('replication was paused, usually because of a lost connection ', info);
    }).on('active', function (info) {
      console.log('replication was resumed');
    }).on('error', function (err) {
      console.log("totally unhandled error (shouldn't happen)", err);
    });
	}

  editCitizen(index){
    const data = {};
    Object.assign(data, {citizen: this.state.citizens[index]});
    this.props.navigation.navigate('CitizenEdit', {data: data});
  }
  
  launchSearch() {
    this.setState({citizens:[]}) 

    var notebook_number = this.state.notebook_number.trim();
    var first_name      = this.state.first_name.trim();
    var last_name       = this.state.last_name.trim();
    var cin             = this.state.cin.trim();

    if(notebook_number == '' && first_name == '' && last_name == '' && cin == ''){
      Alert.alert('Critères requis','Veuillez remplir au moins l\'un des critères de recherche.');
      return false;
    }
  
    const _this = this;
    
    this.state.localDB.find({
      selector: {
        notebook_number: { $regex: RegExp(notebook_number, 'i') },
        citizens :{ $elemMatch : {
          last_name: {$regex : RegExp(last_name, 'i')},
          first_name: {$regex : RegExp(first_name, 'i')},
          cin: {$regex : RegExp(cin, 'i')}
        }}
      },
      sort: ['_id']
    }).then(function (result) {
      var tmp_citizens = []

      if(result.docs.length > 0){
        result.docs.map( (household) => {
          household.citizens.map ((citizen, index) => {
            citizen.localization = household.fokontany_name+', '+household.notebook_number
            citizen.household = household._id
            citizen.household_index = index
            tmp_citizens.push(citizen)
          })
        })
      }
      else Alert.alert('Résultat de recherche','Aucun ménage correspond aux critères');
      _this.setState({citizens:tmp_citizens});
    }).catch(function (err) {
      console.log(err)
      Alert.alert('Attention','Une erreur est survenue pendant la recherche. Veuillez réessayer ultérieurement.');
    });
  }

  componentWillReceiveProps()
  {
    this.launchSyncronisation();
    this.launchSearch()
  }

  render(){
    return (
      <View style={mainStylesheet.container_secondary}>
            <Text style={mainStylesheet.titleSection2}>Filtre</Text>
            <View style={mainStylesheet.formGroup}>
                <Text>Numéro</Text>
                <TextInput  
                style={mainStylesheet.inputText}
                placeholder="..." 
                onChangeText={text => this.setState({notebook_number:text})}/>
            </View>
            <View style={mainStylesheet.formGroup}>
                <Text>Nom</Text>
                <TextInput  
                style={mainStylesheet.inputText}
                placeholder="..."
                onChangeText={text => this.setState({last_name:text})}/>
            </View>
            <View style={mainStylesheet.formGroup}>
                <Text>Prénom(s)</Text>
                <TextInput  
                    style={mainStylesheet.inputText}
                    placeholder="..."
                    onChangeText={text => this.setState({first_name:text})}/>
            </View>
            <View style={mainStylesheet.formGroup}>
                <Text>Numéro CIN</Text>
                <TextInputMask
                    type={'custom'}
                    options={{
                        mask: '999 999 999 999'
                    }}
                    keyboardType='numeric'
                    value={this.state.cin}
                    placeholder="000 000 000 000"
                    style={mainStylesheet.inputText}
                    onChangeText={text => this.setState({cin:text})}
                />
            </View>
            <Text style={mainStylesheet.titleSection2}>Résultat de recherche :</Text>
            <ScrollView style={{marginVertical: 15}}>
                {this.state.citizens.map( (citizen, index) => (
                <View key={index} style={mainStylesheet.listItemCitizen}>
                <View>
                    <Text style={mainStylesheet.detailsLabel}>{citizen['last_name'] || ''} {citizen['first_name'] || ''}</Text>
                    <Text>{citizen['localization'] || ''}</Text>
                </View>
                <View style={{
                    flexDirection: 'row'
                    }}>
                    <TouchableOpacity onPress={() => this.editCitizen(index)}>
                    <Image style={mainStylesheet.listItemImageCitizen} source={require('../../../assets/edit-button.png')}/>
                    </TouchableOpacity>
                </View>
                </View>
                ))}
            </ScrollView>
            <View style={{
                flexDirection: 'row'
            }}>
            <CustomButton style={mainStylesheet.primaryButton} title="Rechercher" onPress={() => this.launchSearch()}/>
            </View>
        </View>
    );
  }
}
