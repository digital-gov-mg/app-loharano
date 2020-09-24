import React from 'react';
import {Text, ScrollView, View, TextInput, Alert } from 'react-native';
import {mainStylesheet, CustomButton, picker} from '../../../assets/stylesheet/Main';
import DropDownPicker from 'react-native-dropdown-picker';
import Moment from 'moment';
import SyncStorage from 'sync-storage';
import GLOBAL from '../../global.js';
import {TextInputMask} from 'react-native-masked-text';

import Household from "../../bo/household/Household.js";

import PouchDB from 'pouchdb-react-native';

export default class MenageAdd extends React.Component {
  constructor(props){
    super(props)
    //set value in state for initial date
    this.state = {
      fokontany_id:0,
      fokontany_name:'',
      address:'',
      sector_locality:'',
      selected_date:new Date(),
      show_datepicker:false,
      shown_datepicker:0,
      notebook_number:'',
      notebook_date: '',
      date_arrived:'',
      date_leaved:'',
      referencement_ref:''
    }
  }

  goToMenageAddChief() {
    const date_arrivedIsValid = this.date_arrivedField.isValid()
    const notebook_dateIsValid = this.notebook_dateField.isValid()
    const date_leavedIsValid = this.date_leavedField.isValid()

    if(this.state.fokontany_id == 0){
      Alert.alert('Fokontany', 'Champs obligatoire');
      return false;
    }
    if(this.state.address == ''){
      Alert.alert('Adresse', 'Champs obligatoire');
      return false;
    }
    if(this.state.sector_locality == ''){
      Alert.alert('Secteur/Localité', 'Champs obligatoire');
      return false;
    }
    if(this.state.notebook_number == ''){
      Alert.alert('Numéro carnet', 'Champs obligatoire');
      return false;
    }
    if(this.state.notebook_date == '' || !notebook_dateIsValid){
      Alert.alert('Date création du carnet', 'Champs obligatoire. Mettez le bon format de la date jour/mois/année.');
      return false;
    }
    if(this.state.date_arrived == '' || !date_arrivedIsValid){
      Alert.alert('Date d\'arrivée', 'Champs obligatoire. Mettez le bon format de la date jour/mois/année.');
      return false;
    }
    if(this.state.date_leaved != '' && !date_leavedIsValid){
      Alert.alert('Date de sortie', 'Champs obligatoire. Mettez le bon format de la date jour/mois/année.');
      return false;
    }

    const household = new Household(this.state);

    this.props.navigation.navigate('MenageAddChief', {
      data: household,
    })
  }
  
  render(){
    return (
      <View style={mainStylesheet.container_secondary}>
      <Text style={mainStylesheet.titleSection2}>Informations sur le ménage (1/3)</Text>
        <ScrollView style={{marginVertical: 15}}>
          <View style={mainStylesheet.formGroup}>
            <Text>Fokontany *</Text>
            <DropDownPicker
              items={SyncStorage.get('fokontanies')}
              searchable={true}
              searchablePlaceholder="Recherche de Fokontany"
              searchablePlaceholderTextColor="gray"
              seachableStyle={{}}
              searchableError={() => <Text>Nationalité introuvable</Text>}
              min={0}
              max={5}
              itemStyle={{justifyContent: 'flex-start'}}
              style={picker.search}
              onChangeItem={item => this.setState({fokontany_id: item.value, fokontany_name:item.label})}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Adresse *</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              onChangeText={text => this.setState({address:text})}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Secteur/Localité *</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..."
              onChangeText={text => this.setState({sector_locality:text})}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Numéro Carnet *</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..."
              onChangeText={text => this.setState({notebook_number:text})}/>
          </View>
          <View style={mainStylesheet.formGroup}>
              <Text>Date création carnet *</Text>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY'
                }}
                ref={(ref) => this.notebook_dateField = ref}
                value={this.state.notebook_date}
                placeholder="jj/mm/aaaa"
                style={mainStylesheet.inputText}
                onChangeText={notebook_date => this.setState({notebook_date})}
              />
          </View>
          <View style={mainStylesheet.formGroup}>
              <Text>Date d'arrivée *</Text>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY'
                }}
                ref={(ref) => this.date_arrivedField = ref}
                value={this.state.date_arrived}
                placeholder="jj/mm/aaaa"
                style={mainStylesheet.inputText}
                onChangeText={date_arrived => this.setState({date_arrived})}
              />
          </View>
          <View style={mainStylesheet.formGroup}>
              <Text>Date de sortie</Text>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY'
                }}
                ref={(ref) => this.date_leavedField = ref}
                value={this.state.date_leaved}
                placeholder="jj/mm/aaaa"
                style={mainStylesheet.inputText}
                onChangeText={date_leaved => this.setState({date_leaved})}
              />
          </View>
          <View style={mainStylesheet.formGroupDate}>
            <Text>Référence fiche de récensement</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..."
              onChangeText={text => this.setState({notebook_reference:text})}/>
          </View>
        </ScrollView>
        <View style={{
            flexDirection: 'row'
          }}>
          <CustomButton style={mainStylesheet.primaryButton} title="Etape suivante" onPress={() => this.goToMenageAddChief()}/>
        </View>
      </View>
    );
  }
}
