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
                style={styles.container}
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
                    <TextInput
                        placeholder = "username"
                        autoCapitalize = "none"
                        style={ComponentStyle.textInputStyle}
                        value={this.state.id}
                        onChangeText={text => this.onIDChange(text)}
                        paddingLeft={13}/>
                    <TextInput
                        placeholder = "password"
                        autoCapitalize = "none"
                        secureTextEntry = {true}
                        style={ComponentStyle.textInputStyle}
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: "10%",

    },
    img: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    imageComponent: {
        resizeMode: 'contain',
        width: "45%",
        
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