import React from 'react';
import {Text, ScrollView, View, TextInput, Alert, Picker} from 'react-native';
import Citizen from "../../bo/citoyen/Citizen.js";
import {mainStylesheet, CustomButton, picker} from '../../../assets/stylesheet/Main'
import {TextInputMask} from 'react-native-masked-text';
import DropDownPicker from 'react-native-dropdown-picker';
import SwitchSelector from "react-native-switch-selector";
import GLOBAL from '../../global.js';
import PouchDB from 'pouchdb-react-native';

let handlerSync = null

export default class CitizenEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      household: '',
      index:0,
      citizen:new Citizen(),
      job:10,
      nationality:1,
      parent_link:1,
      phone:'',
      cin:'',
      cin_date:'',
      selected_date:new Date(),
      show_datepicker:false,
      shown_datepicker:0,
      parent_links:[
        {id:1, label:'Père'},
        {id:2, label:'Mère'},
        {id:3, label:'Fils'},
        {id:4, label:'Fille'},
        {id:5, label:'Autre'}
      ],
    };
    const { params } = this.props.navigation.state;

    if(params && params.data){
      this.state.citizen  = params.data.citizen;
      this.state.cin  = params.data.citizen.cin;
      this.state.household  = params.data.citizen.household;
      this.state.index  = params.data.citizen.household_index;
    }
  }

  componentDidMount(){
    this.syncDb()
  }

  componentWillUnmount() {
    handlerSync.cancel()
  }
  
  syncDb = () => {
    localDB  = new PouchDB('mydb',{});
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
    if(sexe.sexe == 1){
      this.setState({
        parent_links:[
          {id:1, label:'Père'},
          {id:3, label:'Fils'},
          {id:5, label:'Autre'}
        ]
      })
    }else if(sexe.sexe == 0){
      this.setState({
        parent_links:[
          {id:2, label:'Mère'},
          {id:4, label:'Fille'},
          {id:5, label:'Autre'}
        ]
      })
    }
  }
  setLien_parente(parent_link){
    this.setState({parent_link: parent_link.parent_link})
    this.state.citizen.parent_link = parent_link.parent_link;
  }
  setCin(cin){
    this.state.cin = cin;
    this.setState({cin});
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
    const birthField = this.birthField.isValid()
    const cin_dateField = this.cin_dateField.isValid()
    if(this.state.citizen.last_name == null){
      Alert.alert('Nom du citoyen', 'Champs obligatoire');
      return false;
    }
    if(this.state.citizen.birth == null || !birthField){
      Alert.alert('Date de naissance', 'Champs obligatoire. Mettez le bon format de la date jour/mois/année.');
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
    if(this.state.citizen.cin_date != null && !cin_dateField){
      Alert.alert('Date de délivrance CIN', 'Champs obligatoire. Mettez le bon format de la date jour/mois/année.');
      return false;
    }
    
    const localDB = new PouchDB('mydb')

    delete this.state.citizen.househould_id
    delete this.state.citizen.localization
    delete this.state.citizen.household
    delete this.state.citizen.household_index
    delete this.state.citizen.id

    const doc_id = this.state.household
    const citizen_index = this.state.index
    const citizen_edited = this.state.citizen
    const _this = this
    localDB.get(doc_id).then(function(doc) {

      console.log(citizen_index)
      doc.citizens[citizen_index] = citizen_edited
      console.log(doc.citizens)

      return localDB.put(doc);
    }).then(function (response) {
      Alert.alert('Modicifation terminée','Les données du citoyen ont bien été modifiées.', [{ text: "OK", onPress: () => _this.props.navigation.navigate('CitizenSearch')}])
    }).catch(function (err) {
      console.log(err);
    });
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
              value={this.state.citizen.last_name || ''}
              onChangeText={last_name => this.setLast_name(last_name)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Prénom(s)</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              value={this.state.citizen.first_name || ''}
              onChangeText={first_name => this.setFirst_name(first_name)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
              <Text>Date de naissance *</Text>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY'
                }}
                ref={(ref) => this.birthField = ref}
                value={this.state.citizen.birth}
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
              value={this.state.citizen.birth_place || ''}
              onChangeText={birth_place => this.setBirth(birth_place)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
          <Text>Sexe * </Text>
            <SwitchSelector
              initial={(this.state.citizen.sexe == null) ? -1 : (this.state.citizen.sexe == 1 ? 1 : 0)}
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
                selectedValue={this.state.parent_link}
                onValueChange={parent_link => this.setLien_parente({parent_link})}
                style={picker.item}
                mode="dialog">
                  {this.state.parent_links.map( (parent_link, index) => (
                    <Picker.Item key={index} label={parent_link.label} value={parent_link.id} />
                  ))}
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
              value={this.state.cin}
              placeholder="000 000 000 000"
              style={mainStylesheet.inputText}
              onChangeText={cin => this.setCin(cin)}
            />
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Date délivrance CIN</Text>
            <TextInputMask
              type={'datetime'}
              options={{
                format: 'DD/MM/YYYY'
              }}
              ref={(ref) => this.cin_dateField = ref}
              value={this.state.citizen.cin_date}
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
              value={this.state.citizen.cin_place || ''}
              onChangeText={cin_place => this.setCin_location(cin_place)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Père</Text>
            <TextInput  
              style={mainStylesheet.inputText}
              placeholder="..." 
              value={this.state.citizen.father || ''}
              onChangeText={father => this.setFather(father)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Mention du père</Text>
            <SwitchSelector
              initial={(this.state.citizen.father_status == null) ? -1 : (this.state.citizen.father_status == 1 ? 0 : 1)}
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
              value={this.state.citizen.mother || ''}
              onChangeText={mother => this.setMother(mother)}/>
          </View>
          <View style={mainStylesheet.formGroup}>
            <Text>Mention de la mère</Text>
            <SwitchSelector
              initial={(this.state.citizen.mother_status == null) ? -1 : (this.state.citizen.mother_status == 1 ? 0 : 1)}
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
              value={this.state.phone}
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
              defaultValue={this.state.nationality}
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
              defaultValue={this.state.job}
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
              value={this.state.citizen.observation || ''}
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
