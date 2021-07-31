import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, TextInput, Button, StyleSheet} from 'react-native';
import {RegisterFailMessage, PasswordMatchingFailedMessage, ServerIP, getOption, uploadOption} from '../constants'
import {ComponentStyle} from '../styles/Component';
import {LoginStyles} from '../styles/LoginStyle';
import globalContext from '../globalContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export default class Register extends React.Component{
    static contextType = globalContext;
    constructor(props){
        super(props)
        this.state={
            id: "",
            newpassword: "",
            newrepassword: "",
            name: "",
            gender: "",
            phone_number: "",
            number: ""
        }
        this.onUpdatePressed = this.onUpdatePressed.bind(this)
    }
    onUpdatePressed(){
        console.log(this.state)
        if(this.state.newpassword === this.state.newrepassword){
            var formdata = new FormData();
            formdata.append("id", this.context.id);
            formdata.append("pw", this.state.newpassword);
            fetch(`${ServerIP}register`, uploadOption('PUT', formdata))
            .then(response => response.json())
            .then(result => {
                if(result['status']  === "okay"){
                    Actions.main()
                }else{
                    window.alert(RegisterFailMessage)
                }
            })
            .catch(error => console.log('error', error));
        }else{
            window.alert(PasswordMatchingFailedMessage)
        }
    }
        
    componentDidMount(){
        fetch(`${ServerIP}detail/account?id=${this.context.id}`, getOption)
        .then(response => response.json())
        .then(result => {this.setState(result.data)})
    }

    render(){
        if(this.state.id === ""){
            return(
                <View style={ComponentStyle.container}>
                    <Text>Loading...</Text>
                </View>
            )
        }else{
            return (
                <KeyboardAwareScrollView
                    contentContainerStyle={LoginStyles.container}
                >
                    <View style={ComponentStyle.container}>
                        <Text>Welcome to DoggyWalky!</Text>
                        <Text>ID: {this.state.id}</Text>
                        <Text>Name: {this.state.name}</Text>
                        <Text>Phone Number: {this.state.phone_number}</Text>
                        <Text>Gender: {this.state.gender}</Text>
                        <Text>New Password</Text>
                        
                        
                        <Text>New Password</Text>
                        <TextInput
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={ComponentStyle.textInputStyle}
                            value={this.state.newpassword}
                            onChangeText={text => this.setState({newpassword: text})}/>
                        <Text>New Re-Password</Text>
                        <TextInput
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={this.state.newpassword === this.state.newrepassword ? styles.textInputStyle : styles.missMatchTextInputStyle}
                            value={this.state.newrepassword}
                            onChangeText={text => this.setState({newrepassword: text})}/>
                        
                        <Button title="Update" onPress={()=> this.onUpdatePressed()}/>
                        <Button title="Back" onPress={()=>Actions.pop()}/>
                    </View>
                </KeyboardAwareScrollView>
                );
        }
    }
}
const styles = StyleSheet.create({
    genderButtonView: {
        flexDirection: 'row',

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