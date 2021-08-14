import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {RegisterFailMessage, PasswordMatchingFailedMessage, RegisterIDFailMessage, getOption, ServerIP, uploadOption} from '../constants'
import ZoeyButton from '../component/ZoeyButton';
import {LoginStyles} from '../styles/LoginStyle';
import {ComponentStyle} from '../styles/Component';
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
    removePictureButtonClicked = () => {
        this.setState({selectedImage: {uri : ""}})
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
    async componentDidMount(){
        await ImagePicker.requestCameraPermissionsAsync()
    }
    render(){
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={LoginStyles.container}
            >
                <View style={styles.headerContainer}>
                    <View style={{paddingTop: 50}}>
                        {this.state.selectedImage.uri === "" ? 
                            <View style={styles.circleContainer}></View>
                            :
                            <View style={styles.circleContainer}>
                                <Image source={{uri: this.state.selectedImage.uri}} style={styles.imageStyle} />
                            </View>
                        }
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={this.onCameraPressed}>
                            <Text style={styles.buttonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.onGalleryPressed}>
                            <Text style={styles.buttonText}>Add Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.removePictureButtonClicked}>
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder = "ID"
                            autoCapitalize = "none"
                            style={styles.textInputStyle}
                            value={this.state.id}
                            onChangeText={text => this.onIDChange(text)}
                            paddingLeft={13}/>
                        <TextInput
                            placeholder = "password"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={styles.textInputStyle}
                            value={this.state.password}
                            onChangeText={text => this.onPasswordChange(text)}
                            paddingLeft={13}
                        />
                        <TextInput
                            placeholder = "re-password"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={this.state.password === this.state.repassword ? styles.textInputStyle : styles.missMatchTextInputStyle}
                            value={this.state.repassword}
                            onChangeText={text => this.onRepasswordChange(text)}
                            paddingLeft={13}
                        />
                        <TextInput
                            placeholder = "name"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={styles.textInputStyle}
                            value={this.state.name}
                            onChangeText={text => this.setState({name: text})}
                            paddingLeft={13}
                        />
                        <TextInput
                            placeholder = "phone number"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={styles.textInputStyle}
                            value={this.state.phonenumber}
                            onChangeText={text => this.setState({phonenumber: text})}
                            paddingLeft={13}
                        />
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
                        
                        <TouchableOpacity style={styles.registerButton} onPress={this.onRegisterPressed}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}
const styles = StyleSheet.create({
    headerContainer: {
        flex: 0.3,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: "100%",
    },
    container: {
        flex: 0.7,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    buttonContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    genderButtonView: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },
    registerButton:{
        width: '80%',
        height: 60,
        backgroundColor: '#609EFF',
        borderRadius: 10,
        alignItems: 'center',        
        marginTop: 40,
        justifyContent: 'center',
    },
    registerButtonText:{
        color: '#fff',
    },
    button: {
        width: "25%",
        height: 35,
        backgroundColor: '#C4C4C4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle:{
        borderRadius: 60,
        height: 120,
        width: 120,
    },
    buttonText: {
        color: '#3A3A3A',
    },
    activeButton: {
        width: "25%",
        height: 30,
        backgroundColor: 'pink',
        borderColor: "pink",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer:{
        width: '90%', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 19,
        height: '90%',
    },
    textInputStyle: {
        height: 40, 
        width: "80%", 
        borderColor: 'gray', 
        borderWidth: 2,
        backgroundColor: "white",
        marginBottom: 20,
    },
    missMatchTextInputStyle: {
        height: 40, 
        width: "80%", 
        borderColor: 'red', 
        borderWidth: 2,
        backgroundColor: "white",
        marginBottom: 20,
    },
    circle: {
        textAlign: 'center',
        fontSize:20 - 2 * 10, //... One for top and one for bottom alignment
        lineHeight:20 - (Platform.OS === 'ios' ? 2 * 10 : 10), //... One for top and one for bottom alignment

    },
    circleContainer: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#C4C4C4',
        borderColor: '#C4C4C4',
        width: 120,	
        height: 120,
        borderRadius: 100,
        borderWidth: 10,
    },
})