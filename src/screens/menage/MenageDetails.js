import React from 'react';
import {Text, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';

import PouchDB from 'pouchdb-react-native';

export default class MenageDetails extends React.Component {
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
      chiefFields:[
        {label:'Nom', value:'last_name'},
        {label:'Prénom(s)', value:'first_name'},
        {label:'Sexe', value:'sexe'},
        {label:'Date de naissance', value:'birth'},
        {label:'Lieu de naissance', value:'birth_place'},
        {label:'Numéro CIN', value:'cin'},
        {label:'Téléphone(s)', value:'phone'},
        {label:'Nationalité', value:'nationality_id'},
        {label:'Profession', value:'job'}
      ],
      name:'',
      address:'',
      notebook_number:'',
      chief_reference:'',
      notebook_reference:'',
    };
  }

  getHouseHoldReceivedAid(){
    const myThis = this;
    
    this.props.navigation.navigate('AideAdd', {
      data: this.state.menage,
      name: myThis.state.name,
      address: myThis.state.address,
      notebook_number: myThis.state.notebook_number,
      chief_reference:myThis.state.chief_reference,
      notebook_reference:myThis.state.notebook_reference,
    });
  }

  editChief(){
    this.props.navigation.navigate('ChiefEdit', {data:this.state.menage})
  }

  editCitizen(index){
    const data = {};
    Object.assign(data, {houseHold: this.state.menage});
    Object.assign(data, {citizens: this.state.menage.citizens});
    Object.assign(data, {index: index});
    Object.assign(data, {title: 'Modification membre'});
   
    this.props.navigation.navigate('CitoyenAdd', {data: data});
  }

  removeFromList(index) {
    this.state.citizens.splice(index, 1);
    this.setState(this.state.citizens);
  }

  addingMember() {
    const data = {};
    Object.assign(data, {citizens: this.state.menage.citizens});
    delete this.state.menage.citizens;
    Object.assign(data, {houseHold: this.state.menage});

    this.props.navigation.navigate('CitoyenAdd', {data: data});
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

  render(){
    const { params } = this.props.navigation.state;
    if(params && params.data){
      this.state.menage =JSON.parse(params.data);

      this.state.name               = this.state.menage.citizens[0].last_name+" "+this.state.menage.citizens[0].first_name;
      this.state.chief_reference    = this.state.menage.reference;
      this.state.notebook_reference = this.state.menage.notebook_reference;
      
      this.state.notebook_number = this.state.menage.notebook_number;
      this.state.address = this.state.menage.address;

      if(this.state.menage.aids ===null){
        Object.assign(this.state.menage, {aids: {}});
      }
    }

    return (
      <View style={mainStylesheet.container_secondary}>
        <ScrollView >
          <View style={mainStylesheet.row}>
            <Text style={mainStylesheet.titleSection1}>Localisation</Text>
            <TouchableOpacity>
              
            </TouchableOpacity>
          </View>
          {this.state.localisationFields.map((item, index) => (
            <View key={index} style={mainStylesheet.detailsGroup}>
              <Text style={mainStylesheet.detailsLabel}>{item.label}</Text>
              <Text style={mainStylesheet.detailsValue}>{this.state.menage[item.value]}</Text> 
            </View>
          ))}

        <Text style={mainStylesheet.titleSection1}>Membre(s) du ménage</Text>
        {((this.state.menage.citizens!=null) && (this.state.menage.citizens!=undefined))?        
          <ScrollView style={{marginVertical: 15}}>
          {this.state.menage.citizens.map( (citizenData, index) => (
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
                <TouchableOpacity>
                  
                </TouchableOpacity>}
            </View>
          </View>
          ))}
        </ScrollView>
        :
        <View>
          <Text style={mainStylesheet.detailsLabel}>Pas de membres</Text>
        </View>
        }


        <Text style={mainStylesheet.titleSection1}>Aide(s)</Text>
          {((this.state.menage.aids!=null) && (this.state.menage.aids!=undefined))?
            <ScrollView style={{marginVertical: 15}}>
            {this.state.menage.aids.map( (aid, index) => (
           <View key={index} style={mainStylesheet.listItemCitizen}>
             <View>
               <Text style={mainStylesheet.detailsLabel}>{aid.name || ''}</Text>
               <Text style={mainStylesheet.detailsLabel}>{aid.received || ''}</Text>
             </View>
           </View>
           ))}
         </ScrollView>
          :
          <View>
              <Text style={mainStylesheet.detailsLabel}>Aucune aide</Text>
          </View>
          }
         
        </ScrollView>
        <View style={mainStylesheet.row}>
          <CustomButton style={mainStylesheet.primaryButton} title="Ajout membre" onPress={() => this.addingMember()}/>          
        </View>
      </View>
    );
  }
}
