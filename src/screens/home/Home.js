import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {mainStylesheet} from '../../../assets/stylesheet/Main';
import SyncStorage from 'sync-storage';
import PouchDB from 'pouchdb-react-native';
import MenuDrawer from 'react-native-side-drawer';
import GLOBAL from '../../global.js';

let handlerSync = null

export default class Home extends React.Component {

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

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    const { params } = this.props.navigation.state;

    if(params && params.fokontanies){
      const _fokontanies = params.fokontanies;
      var fokontanies = []
      for (const key in _fokontanies) {
        if (_fokontanies.hasOwnProperty(key)) {
          const fokontany_id = _fokontanies[key].fokontany_id;
          const fokontany_name = _fokontanies[key].fokontany_name;
          fokontanies.push({label:fokontany_name, value:fokontany_id})
        }
      }
      SyncStorage.set('fokontanies', fokontanies);
    }
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  drawerContent = () => {
    return (
      <View style={mainStylesheet.animatedBox}>
        <TouchableOpacity style={mainStylesheet.closeSideMenu} onPress={this.toggleOpen}>
          <Image
            source={require('../../../assets/close.png')}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={mainStylesheet.itemSideMenu}>Tableau de bord</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={mainStylesheet.itemSideMenu}>Informations</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AssignList')}>
          <Text style={mainStylesheet.itemSideMenu}>Attribution aide</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render(){
    return (
      <View style={mainStylesheet.container_primary}>
        <MenuDrawer
          open={this.state.open} 
          drawerContent={this.drawerContent()}
          drawerPercentage={80}
          animationTime={250}
          overlay={true}
          opacity={0.2}
        ><TouchableOpacity style={mainStylesheet.bodySideMenu}>
        <Text>.</Text>
      </TouchableOpacity></MenuDrawer>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <TouchableOpacity onPress={this.toggleOpen}>
          <Image
            source={require('../../../assets/menu.png')}/></TouchableOpacity>
          <Image
            style={mainStylesheet.logout}
            source={require('../../../assets/logout.png')}/>
        </View>
        <Text style={mainStylesheet.titleSection1}>Que voulez-vous faire ?</Text>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
          <View style={mainStylesheet.containerMenuBox} >
            <TouchableOpacity style={mainStylesheet.menuBox} onPress={() => this.props.navigation.navigate('MenageSearch')}>
              <View style={mainStylesheet.menuImageContainerBox}>
              <Image
                style={mainStylesheet.menuImageBox}
                source={require('../../../assets/group.png')}/>
              </View>
              <Text style={mainStylesheet.menuTextBox}>
              MENAGES
              </Text>
            </TouchableOpacity>
          </View>
          <View style={mainStylesheet.containerMenuBox} >
            <TouchableOpacity style={mainStylesheet.menuBox} onPress={() => this.props.navigation.navigate('CitizenSearch')}>
              <View style={mainStylesheet.menuImageContainerBox}>
              <Image
                style={mainStylesheet.menuImageBox}
                source={require('../../../assets/add.png')}/>
              </View>
              <Text style={mainStylesheet.menuTextBox}>
              CITOYENS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
          <View style={mainStylesheet.containerMenuBox}>
            <TouchableOpacity style={mainStylesheet.menuBox} onPress={() => this.props.navigation.navigate('AidList')}>
              <View style={mainStylesheet.menuImageContainerBox}>
              <Image
                style={mainStylesheet.menuImageBox}
                source={require('../../../assets/money.png')}/>
              </View>
              <Text style={mainStylesheet.menuTextBox}>
              GESTION SOCIALE
              </Text>
            </TouchableOpacity>
          </View>
          <View style={mainStylesheet.containerMenuBox}>
            <TouchableOpacity style={mainStylesheet.menuBox} onPress={() => this.props.navigation.navigate('Qrcode')}>
              <View style={mainStylesheet.menuImageContainerBox}>
              <Image
                style={mainStylesheet.menuImageBox}
                source={require('../../../assets/qr-code.png')}/>
              </View>
              <Text style={mainStylesheet.menuTextBox}>
              Scan QR Code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
