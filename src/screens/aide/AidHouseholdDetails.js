import React from 'react';
import {Text, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';

export default class AidHouseholdDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menage:{},
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
      aids_status: ''
    };

    console.log('MEMBERS', this.state.members)
    console.log('AIDS', this.state.aids)

    const { params } = this.props.navigation.state
    if(params && params.data){
      this.state.household = params.data.household
      this.state.members = params.data.household.citizens || []
      this.state.aids = params.data.household.aids || []

      this.state.members_status = (this.state.members.length > 0) ? '' : 'Aucun member'
      this.state.aids_status = (this.state.aids.length > 0) ? '' : 'Aucune aide reçue'

      console.log('MEMBERS AFTER', this.state.household)
      console.log('MEMBERS AFTER', this.state.members)
      console.log('AIDS AFTER', this.state.aids)
    }
  }

  render(){
    return (
      <View style={mainStylesheet.container_secondary}>
        <ScrollView >
            <Text style={mainStylesheet.titleSection1}>Localisation</Text>
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
                    <Text style={mainStylesheet.detailsLabel}>{aid['aid_label'] || ''}</Text>
                    <Text>{aid['received'] || ''}</Text>
                </View>
                </View>
            ))}
        </ScrollView>
      </View>
    );
  }
}
