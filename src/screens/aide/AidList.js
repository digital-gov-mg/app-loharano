import React from 'react';
import {Text, ScrollView, View, TextInput, Alert, Image, TouchableOpacity} from 'react-native';
import {mainStylesheet, CustomButton} from '../../../assets/stylesheet/Main';
import {TextInputMask} from 'react-native-masked-text';
import GLOBAL from '../../global.js';

import PouchDB from 'pouchdb-react-native';

let handlerSync = null
PouchDB.plugin(require('pouchdb-find'));

export default class AidList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            notebook_number:'',
            last_name:'',
            first_name:'',
            cin:'',
            households:[],
            localDB:new PouchDB('mydb'),
            remoteDB:new PouchDB(GLOBAL.remoteDB)
        }
    }

    componentDidMount(){
        this.getHouseholds()
        this.syncDb()
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

    getHouseholds(){
        const _this = this
        this.state.localDB.find({
            selector : {fokontany_name : {$gt: null}},
            sort: ['_id']
        }).then(function (result) {
            if(result.docs.length == 0) Alert.alert('Base locale','Aucun ménage trouvé dans la base locale');
            
            _this.setState({households: result.docs})
        }).catch(function (err) {
            console.log(err)
            Alert.alert('Attention','Une erreur est survenue pendant la recherche. Veuillez réessayer ultérieurement.');
        })
    }

    launchSyncronisation() {
        this.state.localDB=new PouchDB('mydb',{}), this.state.remoteDB;
        this.state.localDB.sync(this.state.remoteDB, {
            live: true,
            retry: true,
            continuous: true
        }).on('change', function (change) {
            console.log('yo, something changed!', change);
        }).on('paused', function (info) {
            console.log('replication was paused, usually because of a lost connection ', info);
        }).on('active', function (info) {
            console.log('replication was resumed', info);
        }).on('error', function (err) {
            console.log("totally unhandled error (shouldn't happen)", err);
        });
    }

    editCitizen(index){
        const data = {};
        Object.assign(data, {household: this.state.households[index]});
        this.props.navigation.navigate('AidHouseholdDetails', {data: data});
    }
  
    launchSearch() {
        this.setState({households:[]}) 

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
            var tmp_households = []

            console.log('HOUSEHOLD FILTRED', result.docs)

            if(result.docs.length > 0) _this.setState({households: result.docs})
            else Alert.alert('Résultat de recherche','Aucun ménage correspond aux critères');
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
                    <Text>Numéro carnet</Text>
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
                        options={{mask: '999 999 999 999'}}
                        keyboardType='numeric'
                        value={this.state.cin}
                        placeholder="000 000 000 000"
                        style={mainStylesheet.inputText}
                        onChangeText={text => this.setState({cin:text})}
                    />
                </View>
                <Text style={mainStylesheet.titleSection2}>Liste des ménages :</Text>
                <ScrollView style={{marginVertical: 15}}>
                    {this.state.households.map( (household, index) => (
                    <TouchableOpacity onPress={() => this.editCitizen(index)}>
                    <View key={index} style={mainStylesheet.listItemCitizen}>
                        <View>
                            <Text style={mainStylesheet.detailsLabel}>{household.citizens[0].last_name || ''} {household.citizens[0].first_name || ''}</Text>
                            <Text>{household.fokontany_name || ''}, {household.notebook_number || ''}</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={{flexDirection: 'row'}}>
                <CustomButton style={mainStylesheet.primaryButton} title="Rechercher" onPress={() => this.launchSearch()}/>
                </View>
            </View>
        );
    }
}
