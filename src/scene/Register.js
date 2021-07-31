import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {RegisterFailMessage, PasswordMatchingFailedMessage, RegisterIDFailMessage, getOption, ServerIP, uploadOption} from '../constants'
import ZoeyButton from '../component/ZoeyButton';
import {LoginStyles} from '../styles/LoginStyle';
import {ComponentStyle} from '../styles/Component';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Register extends React.Component{
    static navigationOptions = { header: null };
    constructor(props){
        super(props)
        this.state={
            id: "",
            password: "",
            repassword: "",
            name: "",
            gender: "",
            phonenumber: ""
        }
        this.onIDChange = this.onIDChange.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onRepasswordChange = this.onRepasswordChange.bind(this)
        this.onRegisterPressed = this.onRegisterPressed.bind(this)
    }
    onIDChange(text){
        this.setState({id: text})
    }
    onPasswordChange(text){
        this.setState({password: text})
    }
    onRepasswordChange(text){
        this.setState({repassword: text})
    }
    onRegisterPressed(){
        fetch(`${ServerIP}register?id=` + this.state.id, getOption)
        .then(response => response.json())
        .then(result => {
            if(result['status'] === "okay"){
                if(this.state.password === this.state.repassword){
                    var formdata = new FormData();
                    formdata.append("id", this.state.id);
                    formdata.append("pw", this.state.password);
                    formdata.append("name", this.state.name);
                    formdata.append("gender", this.state.gender);
                    formdata.append("phone_number", this.state.phonenumber);
                    fetch(`${ServerIP}register`, uploadOption('POST', formdata))
                    .then(response => response.json())
                    .then(result => {
                        if(result['status']  === "okay"){
                            Actions.login()
                        }else{
                            window.alert(RegisterFailMessage)
                        }
                    })
                    .catch(error => console.log('error', error));
                }else{
                    window.alert(PasswordMatchingFailedMessage)
                }
            }else{
                window.alert(RegisterIDFailMessage)
            }
        })
        .catch(error => console.log('error', error));
    }
    genderButtonClicked = (text)=> {
        this.setState({gender: text})
    }
    render(){
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={LoginStyles.container}
            >
                <View style={ComponentStyle.container}>
                    <Text>Welcome to DoggyWalky!</Text>
                    <Text>ID</Text>
                    <TextInput
                        autoCapitalize = "none"
                        style={ComponentStyle.textInputStyle}
                        value={this.state.id}
                        onChangeText={text => this.onIDChange(text)}/>
                    <Text>Password</Text>
                    <TextInput
                        autoCapitalize = "none"
                        secureTextEntry = {true}
                        style={ComponentStyle.textInputStyle}
                        value={this.state.password}
                        onChangeText={text => this.onPasswordChange(text)}/>
                    <Text>Re-Password</Text>
                    <TextInput
                        autoCapitalize = "none"
                        secureTextEntry = {true}
                        style={this.state.password === this.state.repassword ? styles.textInputStyle : styles.missMatchTextInputStyle}
                        value={this.state.repassword}
                        onChangeText={text => this.onRepasswordChange(text)}/>
                    <Text>Name</Text>
                    <TextInput
                        style={ComponentStyle.textInputStyle}
                        value={this.state.name}
                        onChangeText={text => this.setState({name: text})}/>
                    <Text>Gender</Text>
                    <View style={styles.genderButtonView}>
                        <TouchableOpacity style={this.state.gender === "F" ? styles.activeButton : styles.button} onPress={()=>this.genderButtonClicked("F")}>
                            <Text>Female</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.gender === "M" ? styles.activeButton : styles.button} onPress={()=>this.genderButtonClicked("M")}>
                            <Text>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.gender === "O" ? styles.activeButton : styles.button} onPress={()=>this.genderButtonClicked("O")}>
                            <Text>Others</Text>
                        </TouchableOpacity>
                    </View>
                    <Text>Phone Number</Text>
                    <TextInput
                        style={ComponentStyle.textInputStyle}
                        value={this.state.phonenumber}
                        onChangeText={text => this.setState({phonenumber: text})}/>
                    <ZoeyButton title="Register" onPress={this.onRegisterPressed}/>
                    <ZoeyButton title="Back to Login Page" onPress={()=>Actions.login()}/>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}
const styles = StyleSheet.create({
    genderButtonView: {
        flexDirection: 'row',

    },
    button: {
        width: "25%",
        backgroundColor: '#ADABAB',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        margin: "2%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeButton: {
        width: "25%",
        backgroundColor: 'pink',
        borderWidth: 1,
        borderColor: "pink",
        borderRadius: 10,
        margin: "2%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputStyle: {
        height: 40, 
        width: "70%", 
        borderColor: 'gray', 
        borderWidth: 2,
        backgroundColor: "white",
        marginBottom: 20,
    },
    missMatchTextInputStyle: {
        height: 40, 
        width: "70%", 
        borderColor: 'red', 
        borderWidth: 2,
        backgroundColor: "white",
        marginBottom: 20,
    },
})