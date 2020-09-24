import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import global from '../../src/global';
import theme from '../theme.style';

const CustomButton = (props) => {
    const { title = 'Enter', style = {}, textStyle = {}, onPress } = props;

    return (
        <TouchableOpacity onPress={props.onPress} style={style}>
            <Text style={[mainStylesheet.text, textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    );
};

export const tiny = 11;
export const smallest = 12;
export const smaller = 13;
export const small = 15;
export const medium = 17;
export const large = 19;
export const larger = 22;
export const largest = 28;
export const huge = 52;

const mainStylesheet = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:'10%'
    },
    container_primary: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal:16,
        paddingTop:15,
        marginTop:35
    },
    container_secondary: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16
    },
    titleSection1: {
        color: theme.PRIMARY_TEXT_COLOR,
        fontWeight: 'bold',
        fontSize: largest,
        marginTop: 20
    },
    titleSection2: {
        color: theme.SECONDARY_COLOR,
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 20
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    textOrange: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.PRIMARY_COLOR
    },
    textGrey: {
        fontWeight: 'bold',
        color: '#D3D3D3'
    },
    textBold: {
        fontWeight: 'bold',
        color: theme.PRIMARY_COLOR
    },
    inputDate:{
        width: '100%',marginTop:5
    },
    inputDateInput:{
        height: 50,
        fontWeight: 'bold',
        borderColor: theme.PRIMARY_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        alignItems:'flex-start'
    },
    inputText:{
        borderColor: theme.PRIMARY_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        fontWeight: 'bold',
        width: '100%',
        marginBottom: 25,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    inputShowDate:{
        borderColor: theme.PRIMARY_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 25
    },
    primaryButton:{
        flex:1,
        backgroundColor:theme.PRIMARY_COLOR,
        borderRadius:5,
        alignItems:"center",
        justifyContent:"center",
        fontSize: 20,
        height:45,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical:10,
        marginHorizontal:5
    },
    secondaryButton:{
        flex:1,
        borderColor: theme.PRIMARY_COLOR,
        borderWidth:1,
        borderRadius:5,
        alignItems:"center",
        justifyContent:"center",
        fontSize: 20,
        height:45,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical:10,
        marginHorizontal:5
    },
    marginTop:{
        marginTop: 35
    },
    bottom: {
        position: 'absolute',
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 36
    },
    digitalgovmg:{
        fontWeight: 'bold'
    },
    containerMenuBox:{
        alignItems: 'center'
    },
    menuBox:{
        marginTop: 25
    },
    menuImageBox:{
        width: 70,
        height: 70,
        margin: 15
    },
    menuImageContainerBox: {
        backgroundColor: theme.SECONDARY_COLOR,
        borderRadius: 5,
        padding: 16,
        justifyContent:'center'
    },
    menuTextBox: {
        color: theme.PRIMARY_TEXT_COLOR,
        fontWeight: 'bold'
    },
    detailsGroup:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    detailsLabel:{
        color: theme.SECONDARY_COLOR,
        fontWeight:'bold'
    },
    detailsValue:{
        color: theme.PRIMARY_TEXT_COLOR,
        fontWeight:'bold',
        fontSize: 18
    },
    inputView:{
        backgroundColor: theme.SECONDARY_COLOR
    },
    listItemCitizen: {
        backgroundColor: '#F6F6F6',
        flexDirection: 'row',
        justifyContent:'space-between',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15
    },
    listItemImageCitizen:{
        width: 36,
        height:36,
        marginLeft:20
    },
    paragraph:{
        fontSize: medium,
        textAlign:'center'
    },
    formGroup:{
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginHorizontal: 5
    },
    formGroupDate:{
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginBottom:25,
        marginHorizontal: 5
    },
    switchSelector:{
        marginBottom:25
    },
    btnEdit:{
        marginTop: 20,
        width: 25,
        height:25,
        marginLeft:20
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    animatedBox: {
        flex: 1,
        backgroundColor: "#dadada",
        padding: 10
    },
    closeSideMenu:{
        alignSelf:'flex-end',
        marginRight: 15,
        marginBottom: 20,
        width:20
    },
    bodySideMenu: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        color:'#fff',
        backgroundColor:'#fff',
        top:0,
        bottom:0,
        right:0,
        left:0
    },
    itemSideMenu:{
        marginLeft:10,
        marginBottom:10,
        fontSize:18,
        fontWeight:'bold',
        color:'#3b3939'
    }
})

const logoStylesheet = StyleSheet.create({
    marginBottom:{
        marginBottom: 65
    }
})

const chooseLangStylesheet = StyleSheet.create({
    picker:{
        backgroundColor: theme.PRIMARY_COLOR,
        borderRadius: 50,
        marginBottom: 15,
        width:180,
        alignItems: 'center'
    }
})

const picker = StyleSheet.create({
    primary:{
        borderColor:theme.PRIMARY_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 25,
        flex: 1,
        padding: 5,
        alignItems: 'center'
    },
    item:{
        width: '100%',
        height: 40,
        color:theme.PRIMARY_TEXT_COLOR,
        fontWeight: 'bold'
    },
    search:{
        borderColor:theme.PRIMARY_COLOR,
        marginBottom:25,
        paddingVertical:9,
        fontWeight:'bold'
    }
})

export {mainStylesheet, CustomButton, logoStylesheet, chooseLangStylesheet, picker}
  