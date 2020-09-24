import React from 'react';
import { Text, View, Image,Alert } from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';
import { ListItem, CheckBox, List, Body } from 'native-base';

import PouchDB from 'pouchdb-react-native';

export default class AideAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {houseHoldAids:{}, name:'',
      tosika_fameno:false,
      vatsy_tsinjo:false,
      enableModif: false,
      chief_reference: '',
      notebook_reference: '',
      aid_id: ''
    };

    const { params } = this.props.navigation.state;
    if(params && params.name){
      this.state.houseHoldAids            = params.data;
      this.state.household                = params.data;
      this.state.name                     = params.name;
      this.state.chief_reference          = params.chief_reference;
      this.state.notebook_number          = params.notebook_number;
      this.state.address                  = params.address;

      if((this.state.household.aids!= null) && (Object.keys(this.state.household.aids).length !== 0) && (this.state.household.aids.constructor === Object)){
        this.state.tosika_fameno = this.state.household.aids.aid_id===1?true:false;
        this.state.vatsy_tsinjo  = this.state.household.aids.aid_id===2?true:false;   
      }
      this.state.enableModif = !(this.state.tosika_fameno || this.state.vatsy_tsinjo);
    }
  }

  tosika_fameno_check(){
    if(this.state.enableModif){
      this.state.tosika_fameno    = !this.state.tosika_fameno;
      this.state.vatsy_tsinjo     = !this.state.tosika_fameno;
      
      if(this.state.tosika_fameno)
        this.state.aid_id = 1;
      if(!this.state.tosika_fameno)
        this.state.aid_id = 2;
        
      this.setState({aid_id : this.state.aid_id});
    }
    
  }
  vatsy_tsinjo_check(){
    if(this.state.enableModif){
      this.state.vatsy_tsinjo     = !this.state.vatsy_tsinjo;
      this.state.tosika_fameno    = !this.state.vatsy_tsinjo;

      if(this.state.tosika_fameno)
        this.state.aid_id = 1;
      if(!this.state.tosika_fameno)
        this.state.aid_id = 2;
               
      this.setState({aid_id : this.state.aid_id});
    }
  }
  
  validerChoixAids(){
    var date = new Date();
    var dateToJson = (date.getUTCMonth()+1)+"/"+date.getUTCDate()+"/"+date.getFullYear();
    
    if((this.state.aid_id===1) || (this.state.aid_id===2)){
      this.state.household.aids= {
        'received' : dateToJson,
        'aid_id': this.state.aid_id,
        'aid_label':this.state.aid_id===1?'Tosika fameno':'Vatsy tsinjo',
        'Description':this.state.aid_id===1?'Tosika fameno':'Vatsy tsinjo',
      };

    const localDB  = new PouchDB('mydb');
    const props = this.state.household;
    const myThis = this;
    localDB.post(props).then(function (response) {
      Alert.alert("Enregistrement terminé", "L'aide a bien été octroyé à ce ménage !!!", [{ text: "OK", onPress: () => myThis.props.navigation.navigate('Home')}]);
    }).catch(function (err) {
      alert(err);
    });
    }
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
            <Text style={{fontSize:18}}> - Adresse : <Text style={mainStylesheet.textBold}>{this.state.address}</Text></Text>
            <Text style={{fontSize:18}}> - Numéro carnet : <Text style={mainStylesheet.textBold}>{this.state.notebook_number}</Text></Text>
          </View>
        </View>
        <Text style={mainStylesheet.titleSection1}>Programme</Text>
        <List>
          <ListItem>
          </ListItem>
          <ListItem onPress={() => this.tosika_fameno_check()}>
            <CheckBox checked={this.state.tosika_fameno}  
            onPress={() => this.tosika_fameno_check()}
            />
            <Body>
              <Text style={mainStylesheet.textOrange}> TOSIKA FAMENO </Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox checked={this.state.vatsy_tsinjo}
              onPress={() => this.vatsy_tsinjo_check()}
            />
            <Body>
              <Text style={mainStylesheet.textOrange}> VATSY TSINJO </Text>
            </Body>
          </ListItem>
        </List>
        <View style={{
            flexDirection: 'row'
          }}>
        <CustomButton  style={mainStylesheet.primaryButton} title="Annuler" onPress={() => this.props.navigation.navigate('Home')}/>
        <CustomButton  style={mainStylesheet.primaryButton} title="Valider" onPress={() => this.validerChoixAids()}/>
        </View>
      </View>
    );
  }
}