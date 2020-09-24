import React from 'react';
import {Text, ScrollView, View, TextInput, Alert, Picker} from 'react-native';
import Citizen from "../../bo/citoyen/Citizen.js";
import {mainStylesheet, CustomButton, picker} from '../../../assets/stylesheet/Main'
import {TextInputMask} from 'react-native-masked-text';
import DropDownPicker from 'react-native-dropdown-picker';
import SwitchSelector from "react-native-switch-selector";
import Moment from 'moment';
import GLOBAL from '../../global.js';

export default class ChiefEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {household:{}, citizens:{}, index:'', citizen:new Citizen(), job:10, nationality:1,
     parent_link:1, phone:'', cin:'', birth:'', cin_date:'', selected_date:new Date(), show_datepicker:false,
     shown_datepicker:0, menage:{}};
    const { params } = this.props.navigation.state;

    if(params && params.data){
      this.state.household =params.data;
      /*
      this.state.houseHold = params.data.houseHold;
      this.state.citizens  = params.data.citizens;
      this.state.index = params.data.index;

      if(this.state.index >= 0){
        this.state.citizen = this.state.citizens[this.state.index];
        this.state.birth = this.state.citizen.birth || '';
        this.state.cin_date = this.state.citizen.cin_date || '';
        this.state.cin = this.state.citizen.cin || '';
        this.state.phone = this.state.citizen.phone || '';
        this.state.nationality = this.state.citizen.nationality_id || 1;
        this.state.job = this.state.citizen.job || 10;
        this.state.parent_link = this.state.citizen.parent_link || 1;
      }*/
    }
  }

  setFirst_name(first_name){
    this.state.citizen.first_name = first_name;
    this.setState({first_name});
  }
  setLast_name(last_name){
    this.state.citizen.last_name = last_name;
    this.setState({last_name});
  }
  setDate_birth(birth){
    this.state.citizen.birth = birth;
    this.setState({birth});
  }
  setBirth(birth_place){
    this.state.citizen.birth_place = birth_place;
    this.setState({birth_place});
  }
  setGender(sexe){
    this.state.citizen.sexe = sexe.sexe;
    this.setState({sexe});
  }
  setLien_parente(parent_link){
    this.setState({parent_link: parent_link.parent_link})
    this.state.citizen.parent_link = parent_link.parent_link;
  }
  setCin(cin){
    this.state.cin = cin;
    this.setState(cin);
    this.state.citizen.cin = cin;
  }
  setCin_date(cin_date){
    this.state.citizen.cin_date = cin_date;
    this.setState({cin_date});
  }
  setCin_location(cin_place){
    this.state.citizen.cin_place = cin_place;
    this.setState({cin_place});
  }
  setFather(father){
    this.state.citizen.father = father;
    this.setState({father});
  }
  setMother(mother){
    this.state.citizen.mother = mother;
    this.setState(this.state.citizen.mother);
  }
  setFather_mention(father_status){
    this.state.citizen.father_status = father_status;
    this.setState({father_status});
  }
  setMother_mention(mother_status){
    this.state.citizen.mother_status = mother_status;
    this.setState({mother_status});
  }
  setPhone(phone){
    this.state.phone = phone;
    this.setState(phone);
    this.state.citizen.phone = phone.phone;
  }
  setNationality(nationality){
    this.setState({nationality:nationality})
    this.state.citizen.nationality_id = nationality
  }
  setProfession(profession){
    this.setState({job:profession});
    this.state.citizen.job = profession;
  }
  setObservation(observation){
    this.state.citizen.observation = observation;
    this.setState({observation});
  }
  goToRecap(){
    if(this.state.citizen.last_name == null){
      Alert.alert('Nom du citoyen', 'Champs obligatoire');
      return false;
    }
    if(this.state.citizen.birth == null){
      Alert.alert('Date de naissance', 'Champs obligatoire');
      return false;
    }
    if(this.state.citizen.birth_place == null){
      Alert.alert('Lieu de naissance', 'Champs obligatoire');
      return false;
    }
    if(this.state.citizen.sexe == null || this.state.citizen.sexe == -1){
      Alert.alert('Sexe', 'Champs obligatoire');
      return false;
    }

    const data = {};
    
    delete this.state.citizen.id;
    const citizens = this.state.citizens;
    Object.assign(data, {household: this.state.household});

    this.state.citizen.nationality_id = this.state.nationality
    this.state.citizen.job = this.state.job
    if(this.state.index >= 0) citizens[this.state.index] = this.state.citizen
    else citizens.push(this.state.citizen);
    Object.assign(data, {citizens: citizens});

    this.props.navigation.navigate('MenageAddRecap', {data: data})
  }

  render(){
    return (
      <View style={mainStylesheet.container_secondary}>
        <Text style={mainStylesheet.titleSection2}>Veuillez remplir le formulaire</Text>
        <ScrollView style={{marginVertical: 15}}>
          <View style={mainStylesheet.formGroup}>
            <Text>Nom *</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              autoCapitalize="characters"
              placeholder="..."
              value={this.state.household.citizens[0].last_name || ''}
              onChangeText={last_name => this.setLast_name(last_name)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Prénom(s)</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              value={this.state.household.citizens[0].first_name || ''}
              onChangeText={first_name => this.setFirst_name(first_name)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
              <Text>Date de naissance *</Text>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '99/99/9999'
                }}
                keyboardType='numeric'
                value={this.state.household.citizens[0].birth}
                placeholder="jj/mm/aaaa"
                style={mainStylesheet.inputText}
                onChangeText={birth => this.setDate_birth(birth)}
              />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Lieu de naissance *</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              value={this.state.household.citizens[0].birth_place || ''}
              onChangeText={birth_place => this.setBirth(birth_place)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
          <Text>Sexe * </Text>
            <SwitchSelector
              initial={(this.state.household.citizens[0].sexe == null) ? -1 : (this.state.household.citizens[0].sexe == 1 ? 1 : 0)}
              textColor='#f26122'
              selectedColor='#ffffff'
              buttonColor='#f26122'
              borderColor='#f26122'
              borderRadius={5}
              style={mainStylesheet.switchSelector}
              hasPadding
              bold
              options={[
                { label: "Femme", value: 0},
                { label: "Homme", value: 1} 
              ]}
              onPress={sexe => this.setGender({sexe})}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Lien de parenté *</Text>
            <View style={picker.primary}>
              <Picker
                selectedValue={this.state.household.citizens[0].parent_link}
                onValueChange={parent_link => this.setLien_parente({parent_link})}
                style={picker.item}
                mode="dialog">
                <Picker.Item label="Père" value={1} />
                <Picker.Item label="Mère" value={2} />
                <Picker.Item label="Fils" value={3} />
                <Picker.Item label="Fille" value={4} />
                <Picker.Item label="Autres" value={5} />
              </Picker>
            </View>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Numéro CIN</Text>
            <TextInputMask
              type={'custom'}
              options={{
                mask: '999 999 999 999'
              }}
              keyboardType='numeric'
              value={this.state.household.citizens[0].cin}
              placeholder="000 000 000 000"
              style={mainStylesheet.inputText}
              onChangeText={cin => this.setCin({cin})}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Date délivrance CIN</Text>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '99/99/9999'
                }}
                keyboardType='numeric'
                value={this.state.household.citizens[0].cin_date}
                placeholder="jj/mm/aaaa"
                style={mainStylesheet.inputText}
                onChangeText={cin_date => this.setCin_date(cin_date)}
              />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Lieu délivrance CIN</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              value={this.state.household.citizens[0].cin_place || ''}
              onChangeText={cin_place => this.setCin_location(cin_place)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Père</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              value={this.state.household.citizens[0].father || ''}
              onChangeText={father => this.setFather(father)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Mention du père</Text>
            <SwitchSelector
              initial={(this.state.household.citizens[0].father_status == null) ? -1 : (this.state.household.citizens[0].father_status == 1 ? 0 : 1)}
              textColor='#f26122'
              selectedColor='#ffffff'
              buttonColor='#f26122'
              borderColor='#f26122'
              borderRadius={5}
              style={mainStylesheet.switchSelector}
              hasPadding
              bold
              options={[
                { label: "Vivant", value: 1},
                { label: "Décédé", value: 0} 
              ]}
              onPress={father_status => this.setFather_mention({father_status})}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Mère</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              value={this.state.household.citizens[0].mother || ''}
              onChangeText={mother => this.setMother(mother)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Mention de la mère</Text>
            <SwitchSelector
              initial={(this.state.household.citizens[0].mother_status == null) ? -1 : (this.state.household.citizens[0].mother_status == 1 ? 0 : 1)}
              textColor='#f26122'
              selectedColor='#ffffff'
              buttonColor='#f26122'
              borderColor='#f26122'
              borderRadius={5}
              style={mainStylesheet.switchSelector}
              hasPadding
              bold
              options={[
                { label: "Vivante", value: 1},
                { label: "Décédée", value: 0} 
              ]}
              onPress={mother_status => this.setMother_mention({mother_status})}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Téléphone(s)</Text>
            <TextInputMask
              type={'custom'}
              options={{
                mask: '039 99 999 99; 039 99 999 99; 039 99 999 99'
              }}
              keyboardType='numeric'
              value={this.state.household.citizens[0].phone}
              placeholder="030 00 000 00; 030 00 000 00; 030 00 000 00"
              style={mainStylesheet.inputText}
              onChangeText={phone => this.setPhone({phone})}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Nationalité</Text>
            <DropDownPicker
              items={GLOBAL.nationalites}
              searchable={true}
              searchablePlaceholder="Recherche de nationalité"
              searchablePlaceholderTextColor="gray"
              seachableStyle={{}}
              searchableError={() => <Text>Nationalité introuvable</Text>}
              min={0}
              max={5}
              defaultValue={this.state.household.citizens[0].nationality}
              itemStyle={{justifyContent: 'flex-start'}}
              style={picker.search}
              onChangeItem={item => this.setNationality(item.value)}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Profession</Text>
            <DropDownPicker
              items={GLOBAL.jobs}
              searchable={true}
              searchablePlaceholder="Recherche de nationalité"
              searchablePlaceholderTextColor="gray"
              searchableError={() => <Text>Nationalité introuvable</Text>}
              min={0}
              max={5}
              defaultValue={this.state.household.citizens[0].job}
              itemStyle={{justifyContent: 'flex-start'}}
              style={picker.search}
              onChangeItem={item => this.setProfession(item.value)}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Observation</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..."
              numberOfLines={3}
              multiline={true}
              value={this.state.household.citizens[0].observation || ''}
              onChangeText={observation => this.setFirst_name(observation)}/>
          </View> 
        </ScrollView>
        <View style={{
            flexDirection: 'row'
          }}>
          <CustomButton style={mainStylesheet.primaryButton} title="Valider" onPress={() => this.goToRecap()}/>
        </View>
      </View>
    );
  }
}
