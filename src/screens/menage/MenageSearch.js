import React from 'react';
import {Text, ScrollView, View, TextInput, Alert, Image, TouchableOpacity} from 'react-native';
import {mainStylesheet, CustomButton, picker} from '../../../assets/stylesheet/Main';
import {TextInputMask} from 'react-native-masked-text';
import GLOBAL from '../../global.js';

import PouchDB from 'pouchdb-react-native';

export default class MenageSearch extends React.Component {
  constructor(props){
    super(props)
    PouchDB.plugin(require('pouchdb-find'));
    this.state = {
      notebook_number:'',
      last_name:'',
      first_name:'',
      cin:'',
      household:{},
      households:[],
      localDB:new PouchDB('mydb',{}), remoteDB:new PouchDB(GLOBAL.remoteDB)
    }
  }

  launchSyncronisation() {
    const host = process.env.couchdbHost;
    PouchDB.plugin(require('pouchdb-find'));
    this.state.localDB=new PouchDB('mydb',{}), this.state.remoteDB=new PouchDB(host);
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
      if(result.docs.length > 0){
        _this.setState({household:result.docs[0]});
        _this.setState({households:result.docs});
       
      }
      else 
      {
        Alert.alert('Résultat de recherche','Aucun ménage correspond aux critères');
       _this.setState({household:{}});
       _this.setState({households:[]});
      
     }
    }).catch(function (err) {
      console.log(err)
      Alert.alert('Attention','Une erreur est survenue pendant la recherche. Veuillez réessayer ultérieurement.');
    });
  }

  componentWillReceiveProps()
  {
    const { params } = this.props.navigation.state;
    if(params && params.data){
    }
    this.launchSyncronisation();
  }

  createHousehold(){
    this.props.navigation.navigate('MenageAdd');
  }

  goToRecap(index){
    const data = {};
    const citizens = [];
    Object.assign(data, {citizens: this.state.households[index].citizens});
    console.log(JSON.stringify(this.state.households[index].citizens));
    delete this.state.households[index].citizens;
    Object.assign(data, {houseHold: this.state.households[index]});
    
    this.props.navigation.navigate('MenageAddRecap', {
      data: data,
    })
  }

  render(){
    return (
      
      <View style={mainStylesheet.container_secondary}>
      {this.state.show_datepicker && <DateTimePicker
        testID="dateTimePicker"
        value={this.state.selected_date}
        mode='date'
        maximumDate={new Date()}
        is24Hour={true}
        display="spinner"
        locale="fr-FR"
        onChange={this.setDate}
      />}
       <ScrollView >     
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
      <Text style={mainStylesheet.titleSection2}>Ménage(s)</Text>
        <ScrollView style={{marginVertical: 15}}>
          {this.state.households.map( (household, index) => (
            /*if(household['citizens'][0] != null){
              
            }*/
          <View key={index} style={mainStylesheet.listItemCitizen}>
            <View>
              <Text style={mainStylesheet.detailsLabel}>{household['citizens'][0]['last_name'] || ''} {household['citizens'][0]['first_name'] || ''}</Text>
              <Text>{household['fokontany_name'] || ''}, {household['notebook_number'] || ''}</Text>
            </View>
            <View style={{
                flexDirection: 'row'
              }}>
              <TouchableOpacity onPress={() => this.goToRecap(index)}>
                <Image style={mainStylesheet.listItemImageCitizen} source={require('../../../assets/edit-button.png')}/>
              </TouchableOpacity>
            </View>
          </View>
          ))}
        </ScrollView>
      </ScrollView>
        <View style={{
            flexDirection: 'row'
          }}>
          <CustomButton style={mainStylesheet.primaryButton} title="Créer Ménage" onPress={() => this.createHousehold()}/>
          <CustomButton style={mainStylesheet.primaryButton} title="Rechercher" onPress={() => this.launchSearch()}/>
        </View>
      </View>
    );
  }
}
