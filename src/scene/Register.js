import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {RegisterFailMessage, PasswordMatchingFailedMessage, RegisterIDFailMessage, getOption, ServerIP, uploadOption} from '../constants'
import ZoeyButton from '../component/ZoeyButton';
import {LoginStyles} from '../styles/LoginStyle';
import {Profile} from '../styles/Profile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';

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
            phonenumber: "",
            selectedImage: {uri : ""},
        }
    }
    onIDChange = (text) => {
        this.setState({id: text})
    }
    onPasswordChange = (text) => {
        this.setState({password: text})
    }
    onRepasswordChange = (text) => {
        this.setState({repassword: text})
    }
    removePictureButtonClicked = () => {
        this.setState({selectedImage: {uri : ""}})
    }
    onPhoneNumberChange = (text) => {
        if(/^\+?\d+$/.test(text) || text.length === 0){
            this.setState({phonenumber: text})
        }
    }
    onCameraPressed = async () =>{
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if(result.cancelled){}else{
            this.setState({selectedImage: result})
        }
        console.log(result)
    }
    onGalleryPressed = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if(result.cancelled){}else{
            this.setState({selectedImage: result})
        }
        console.log(result)
    }
    onResetInfoPressed = () => {
        this.setState({
            id: '',
            password: "",
            repassword: "",
            name: "",
            gender: "",
            phonenumber: "",
        })
    }
    onRegisterPressed = () => {
        if(this.state.id === ''){
            window.alert("You need to provide ID")
        }
        else if(this.state.password === ''){
            window.alert("You need to provide a password")
        }
        else if(this.state.name === ''){
            window.alert("You need to provide your name")
        }
        else if(this.state.gender === ''){
            window.alert("You need to provide your gender")
        }
        else if(this.state.phonenumber === ''){
            window.alert("You need to provide your phone number")
        }
        else{
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
    }
    genderButtonClicked = (text)=> {
        this.setState({gender: text})
    }
    async componentDidMount(){
        await ImagePicker.requestCameraPermissionsAsync()
    }
    render(){
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={LoginStyles.container}
            >
                <View style={Profile.headerContainer}>
                    <View style={Profile.backButton}>
                        <TouchableOpacity onPress={() => Actions.login()}>
                            <Text>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingTop: 50}}>
                        {this.state.selectedImage.uri === "" ? 
                            <View style={Profile.circleContainer}></View>
                            :
                            <View style={Profile.circleContainer}>
                                <Image source={{uri: this.state.selectedImage.uri}} style={Profile.imageStyle} />
                            </View>
                        }
                    </View>
                    <View style={Profile.buttonContainer}>
                        <TouchableOpacity style={Profile.button} onPress={this.onCameraPressed}>
                            <Text style={Profile.buttonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Profile.button} onPress={this.onGalleryPressed}>
                            <Text style={Profile.buttonText}>Add Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Profile.button} onPress={this.removePictureButtonClicked}>
                            <Text style={Profile.buttonText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={Profile.container}>
                    <View style={Profile.inputContainer}>
                        <View style={{height: '92%', width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 25}}>
                            <TextInput
                                placeholder = "ID"
                                autoCapitalize = "none"
                                style={Profile.textInputStyle}
                                value={this.state.id}
                                onChangeText={text => this.onIDChange(text)}
                                paddingLeft={13}
                            />
                            <TextInput
                                placeholder = "password"
                                autoCapitalize = "none"
                                secureTextEntry = {true}
                                style={Profile.textInputStyle}
                                value={this.state.password}
                                onChangeText={text => this.onPasswordChange(text)}
                                paddingLeft={13}
                            />
                            <TextInput
                                placeholder = "re-password"
                                autoCapitalize = "none"
                                secureTextEntry = {true}
                                style={this.state.password === this.state.repassword ? Profile.textInputStyle : Profile.missMatchTextInputStyle}
                                value={this.state.repassword}
                                onChangeText={text => this.onRepasswordChange(text)}
                                paddingLeft={13}
                            />
                            <TextInput
                                placeholder = "name"
                                style={Profile.textInputStyle}
                                value={this.state.name}
                                onChangeText={text => this.setState({name: text})}
                                paddingLeft={13}
                            />
                            <TextInput
                                placeholder = "phone number"
                                autoCapitalize = "none"
                                style={Profile.textInputStyle}
                                value={this.state.phonenumber}
                                onChangeText={text => this.onPhoneNumberChange(text)}
                                paddingLeft={13}
                            />
                            <View style={Profile.genderButtonView}>
                                <TouchableOpacity style={this.state.gender === "F" ? Profile.activeButton : Profile.button} onPress={()=>this.genderButtonClicked("F")}>
                                    <Text>Female</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.gender === "M" ? Profile.activeButton : Profile.button} onPress={()=>this.genderButtonClicked("M")}>
                                    <Text>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.gender === "O" ? Profile.activeButton : Profile.button} onPress={()=>this.genderButtonClicked("O")}>
                                    <Text>Others</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={Profile.registerButton} onPress={this.onRegisterPressed}>
                                <Text style={Profile.registerButtonText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{height: '8%', alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.onResetInfoPressed}>
                                <Text>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}
