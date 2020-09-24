import React from 'react';
import {Text, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';
import GLOBAL from '../../global.js';

import PouchDB from 'pouchdb-react-native';

let handlerSync = null
PouchDB.plugin(require('pouchdb-find'));

export default class AssignHouseholdDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      household:{},
      localisationFields: [
        {label:'Numéro carnet',value:'notebook_number'},
        {label:'Fokontany',value:'fokontany_name'},
        {label:'Adresse',value:'address'},
        {label:'Secteur/Localité',value:'sector_locality'},
        {label:'Date d\'arrivée',value:'date_arrived'}
      ],
      members:[],
      aids:[],
      members_status: '',
      aids_status: '',
      localDB:new PouchDB('mydb'),
      remoteDB:new PouchDB(GLOBAL.remoteDB)
    };

    const { params } = this.props.navigation.state

    if(params && params.data){
      this.state.household = params.data.household
      this.state.members = params.data.household.citizens || []
      this.state.aids = params.data.household.aids || []
      this.state.members_status = (this.state.members.length == 0) ? 'Aucun membre' : ''
      this.state.aids_status = (this.state.aids.length == 0) ? 'Aucun aide reçue' : ''
    }
  }

  componentDidMount(){
    const _this = this
    this.syncDb()
    this.state.localDB.get(this.state.household._id).then(function (doc) {
      _this.setState({household:doc})
      console.log('HOUSEHOLD AFTER UP', this.state.household)
    });
    console.log('HOUSEHOLD UP', this.state.household)
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

  assignAid(){
    var data = {};
    Object.assign(data, {household: this.state.household});
    this.props.navigation.navigate('AssignAid', {data: data});
  }

  render(){
    return (
      <View style={mainStylesheet.container_secondary}>
        <ScrollView >
    <Text style={mainStylesheet.titleSection1}>Localisation {this.state.household.sector_locality}</Text>
            {this.state.localisationFields.map((item, index) => (
                <View key={index} style={mainStylesheet.detailsGroup}>
                <Text style={mainStylesheet.detailsLabel}>{item.label}</Text>
                <Text style={mainStylesheet.detailsValue}>{this.state.household[item.value]}</Text> 
                </View>
            ))}
            <Text style={mainStylesheet.titleSection1}>Membres</Text>
            <Text>{this.state.members_status}</Text>
            {this.state.members.map( (citizen, index) => (
                <View key={index} style={mainStylesheet.listItemCitizen}>
                <View>
                    <Text style={mainStylesheet.detailsLabel}>{citizen['last_name'] || ''}</Text>
                    <Text>{citizen['first_name'] || ''}</Text>
                </View>
                </View>
            ))}
            <Text style={mainStylesheet.titleSection1}>Aides reçues</Text>
            <Text>{this.state.aids_status}</Text>
            {this.state.aids.map( (aid, index) => (
                <View key={index} style={mainStylesheet.listItemCitizen}>
                <View>
                    <Text style={mainStylesheet.detailsLabel}>{aid['name'] || ''}</Text>
                    <Text>{aid['received'] || ''}</Text>
                </View>
                </View>
            ))}
        </ScrollView>
        <View style={{
            flexDirection: 'row'
          }}>
        <CustomButton  style={mainStylesheet.primaryButton} title="Attribuer une aide" onPress={() => this.assignAid()}/>
        </View>
      </View>
    );
  }
}
