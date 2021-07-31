import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { ComponentStyle } from '../styles/Component';
import {ServerIP, uploadOption, getOption} from '../constants';
import ZoeyButton from '../component/ZoeyButton';
import globalContext from '../globalContext';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';

export default class NewWalk extends React.Component{
    static contextType = globalContext;
    constructor(props){
        super(props)
        this.state={
            petList: [],
            selectedDog: "",
        }
    }
    dogNameButtonClicked = (text) => {
        if(text === this.state.selectedDog){
            this.setState({selectedDog: ""})
        }else{
            this.setState({selectedDog: text})
        }
    }
    async componentDidMount(){
        let response = await fetch(`${ServerIP}list/pet/${this.context.id}`, getOption)
        let responseData = await response.json()
        console.log(responseData)
        this.setState({petList : responseData.data})
    }
    onStartButtonClicked = () => {
        Actions.duringwalk()
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.img}>
                    <Image source={require("../img/logo.png")} style={styles.imageComponent}/>
                </View>
                <View style={{height: '20%'}}>
                    <Text>Select a dog</Text>
                    <ScrollView style={styles.scrollViewStyle}>
                        {this.state.petList.map( (item, index) =>{
                            return(
                                <TouchableOpacity style={this.state.selectedDog === item.name ? styles.activeButton : styles.button} onPress={()=>this.dogNameButtonClicked(item.name)}>
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={{height: '10%'}}>
                    <Text>Select a device</Text>
                </View>
                <TouchableOpacity style={styles.img} onPress = {this.onStartButtonClicked}>
                    <Image source={require("../img/start.png")} style={styles.imageComponent}/>
                </TouchableOpacity>
            </View>
            );
    }
}
const styles = StyleSheet.create({
    scrollViewStyle: {
        backgroundColor: 'pink',
    },
    button: {
        width: "100%",
        backgroundColor: '#ADABAB',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        margin: "2%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeButton: {
        width: "100%",
        backgroundColor: 'pink',
        borderWidth: 1,
        borderColor: "pink",
        borderRadius: 10,
        margin: "2%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        height: '80%',
        backgroundColor: '#fff',
    },
    img: {
        width: '50%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 30,
    },
    imageComponent: {
        resizeMode: 'contain',
        width: '100%',
    },
    bottomView:{
        position: 'absolute',
        bottom: 0,
        height: 65,
        backgroundColor: '#7DFDFE',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomViewText:{
        fontSize: 15,
    },
    loginButton:{
        backgroundColor: '#4BA7E2',
        width: '70%',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 2,
        paddingTop: 9,
        paddingBottom: 9,
    },
    loginText:{
        color: "white",
        fontWeight: 'bold',
    }
  });