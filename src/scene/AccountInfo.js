import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, TextInput, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {RegisterFailMessage, PasswordMatchingFailedMessage, ServerIP, getOption, uploadOption} from '../constants'
import {ComponentStyle} from '../styles/Component';
import {LoginStyles} from '../styles/LoginStyle';
import {Profile} from '../styles/Profile';
import * as ImagePicker from 'expo-image-picker';
import globalContext from '../globalContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Register extends React.Component{
    static navigationOptions = { header: null };
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
            number: "",
            profileImage: {uri: ""},
        }
        this.onUpdatePressed = this.onUpdatePressed.bind(this)
    }
    removePictureButtonClicked = () => {
        this.setState({profileImage: {uri : ""}})
    }
    onCameraPressed = async () =>{
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if(result.cancelled){}else{
            this.setState({profileImage: result})
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
            this.setState({profileImage: result})
        }
        console.log(result)
    }
    onUpdatePressed(){
        console.log(this.state)
        if(this.state.newpassword === ""){
            window.alert("Provide new password.")
        }
        else if(this.state.newpassword === this.state.newrepassword){
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
                    contentContainerStyle={styles.container}
                >
                    <View style={Profile.headerContainer}>
                        <View style={Profile.backButton}>
                            <TouchableOpacity onPress={() => Actions.main()}>
                                <Text>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.logOutButton}>
                            <TouchableOpacity onPress={() => Actions.login()}>
                                <Text>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingTop: 50}}>
                            {this.state.profileImage.uri === "" ? 
                                <View style={Profile.circleContainer}></View>
                                :
                                <View style={Profile.circleContainer}>
                                    <Image source={{uri: this.state.profileImage.uri}} style={Profile.imageStyle} />
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
                                <Text style={Profile.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.titleText}>Account Information</Text>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>ID</Text>
                                <Text style={styles.bodyText}>{this.state.id}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Name</Text>
                                <Text style={styles.bodyText}>{this.state.name}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Phone Number</Text>
                                <Text style={styles.bodyText}>{this.state.phone_number}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Gender</Text>
                                <Text style={styles.bodyText}>{this.state.gender}</Text>
                            </View>
                        </View>
                    </View>                     
                    <View style={styles.changePasswordContainer}>
                        <TextInput
                            placeholder = "new password"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={Profile.textInputStyle}
                            value={this.state.newpassword}
                            onChangeText={text => this.setState({newpassword: text})}
                            paddingLeft={13}
                        />
                        <TextInput
                            placeholder = "new re-password"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            style={this.state.newpassword === this.state.newrepassword ? Profile.textInputStyle : Profile.missMatchTextInputStyle}
                            value={this.state.newrepassword}
                            onChangeText={text => this.setState({newrepassword: text})}
                            paddingLeft={13}
                        />
                        <TouchableOpacity style={Profile.registerButton} onPress={()=> this.onUpdatePressed()}>
                            <Text style={Profile.registerButtonText}>Submit</Text>
                        </TouchableOpacity>
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
    logOutButton: {
        position: 'absolute',
        right: 20, 
        top: 60
    },
    changePasswordContainer:{
        flex: 0.4,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '15%',
    },
    container:{
        height: '100%',
        backgroundColor: '#F0F0F0',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer:{
        marginTop: 30,
        marginLeft: 30,
        justifyContent: 'space-between',
        height: '50%',
    },
    infoContainer:{
        marginTop: '15%',
        width: '80%',
        backgroundColor: '#B9D4FE',
        borderRadius: 19,
        flex: 0.3,
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
    titleText:{
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: '5%',
    },
    bodyText:{
        fontSize: 14,
    },
    bodyTextTitle:{
        width: '40%',
    },
    textRow:{
        flexDirection: 'row',
    },

})