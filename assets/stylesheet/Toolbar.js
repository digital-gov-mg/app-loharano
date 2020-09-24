import React from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

import theme from '../theme.style';

const DashboardToolbar = (props) => {
    return (
        <View>
        <Image
            source={require('../menu.png')}/>
        <Image
            style={main.logout}
            source={require('../logout.png')}/></View>
    );
}

const BasicToolbar = (props) => {
    const { title = '...', onPress} = props;
    return (
        <View style={main.container}>
        <TouchableOpacity onPress={onPress}>
        <Image
            source={require('../back.png')} /></TouchableOpacity>
        <Text style={main.title}>{props.title}</Text></View>
    );
}

const pressHandler = () => {
    props.navigation.goBack();
}

const main = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    title: {
        color:theme.PRIMARY_TEXT_COLOR,
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 20
    },
    logout:{
        position: 'absolute',
        right:0,
    }
})

export {DashboardToolbar, BasicToolbar}