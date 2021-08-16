import ReactNative from 'react-native';
import { Actions } from 'react-native-router-flux';
import React from 'react';
import {Text, TextInput, Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import ZoeyButton from '../component/ZoeyButton';
import {LoginFailMessage, ServerIP, uploadOption} from '../constants';
import {LoginStyles} from '../styles/LoginStyle';
import {ComponentStyle} from '../styles/Component';
import {LinearGradient} from 'expo-linear-gradient';
import globalContext from '../globalContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

export default class Login extends React.Component{
    static navigationOptions = { header: null };
    static contextType = globalContext;
    constructor(props){
        super(props)
        this.state={
            id: "",
            password: ""
        }
    }
    onIDChange = (text) => {
        this.setState({id: text})
    }
    onPasswordChange = (text) => {
        this.setState({password: text})
    }
    onLoginPressed = () => {
        var formdata = new FormData();
        formdata.append("id", this.state.id);
        formdata.append("pw", this.state.password);
        fetch(`${ServerIP}login`, uploadOption('POST', formdata))
        .then(response => response.json())
        .then(result => {
            if(result['result'] === "success"){
                this.context.id = result['id']
                Actions.main()
            }else{
                window.alert(LoginFailMessage)
                this.setState({id: "", password: ""})
            }
        })
        .catch(error => console.log('error', error));
    }
    // _scrollToInput = (reactNode) => {
    //     this.scroll.props.scrollToFocusedInput(reactNode)
    // }
    render(){
        console.log(this.context)
        return (
            <View
                style={{height: '100%'}}
            >
                <KeyboardAwareScrollView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                    contentContainerStyle={styles.container}
                    style={{width: "100%"}}
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                >
                    <View style={styles.img}>
                        <Image source={require("../img/logo.png")} style={styles.imageComponent}/>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder = "username"
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
                            onSubmitEditing ={this.onLoginPressed}
                            paddingLeft={13}
                            // onFocus={(event) => {
                            //     this._scrollToInput(ReactNative.findNodeHandle(event.target))
                            // }}
                        />
                        <TouchableOpacity style={styles.loginButton} onPress={this.onLoginPressed}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <View style={styles.bottomView}>
                    <Text onPress={()=>Actions.register()} style={styles.bottomViewText}>Don't have an account? Sign Up</Text>
                </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
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
    inputContainer:{
        width: '90%', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 19,
        paddingTop: '20%',
        paddingBottom: '20%',
        marginTop: '15%',
    },
    img: {
        height: '15%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageComponent: {
        resizeMode: 'contain',
        width: "45%",
        
    },
    bottomView:{
        position: 'absolute',
        bottom: 0,
        height: '7%',
        backgroundColor: '#B9D4FE',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomViewText:{
        fontSize: 15,
    },
    loginButtonText:{
        color: '#fff',
    },
    loginButton:{
        width: '80%',
        height: 60,
        backgroundColor: '#609EFF',
        borderRadius: 10,
        alignItems: 'center',        
        justifyContent: 'center',
    },
  });