import { Actions } from 'react-native-router-flux';
import React from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { ServerIP, uploadOption, ImageIP} from '../constants';
import {LoginStyles} from '../styles/LoginStyle';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import {Profile} from '../styles/Profile';
import globalContext from '../globalContext';
const ageList = 
[
    {value: 0, label:'0'} ,{value: 1, label:'1'} ,{value: 2, label:'2'}
    ,{value: 3, label:'3'}
    ,{value: 4, label:'4'}
    ,{value: 5, label:'5'}
    ,{value: 6, label:'6'}
    ,{value: 7, label:'7'}
    ,{value: 8, label:"8"}
    ,{value: 9, label:'9'}
    ,{value: 10, label:"10"}
    ,{value: 11, label:"11"}
    ,{value: 12, label:'12'}
    ,{value: 13, label:'13'}
    ,{value: 14, label:'14'}
    ,{value: 15, label:'15'}
    ,{value: "15+", label:"15+"}
]

export default class PetAdd extends React.Component{
    static navigationOptions = { header: null };
    static contextType = globalContext;
    constructor(props){
        super(props)
        this.state={
            petname: "",
            breed: "",
            age: "",
            gender: "",
            size: "",
            selectedImage: {uri : ""}
        }
    }
    setPickerSelected = (item) =>{
        if(item.value === "+"){
            Actions.petadd()
        }else{
            this.setState({currentPet: item})
        }
    }
    onPetAddPressed(){
        if(this.state.petname === ''){
            window.alert("You need to provide your pet name")
        }
        else if(this.state.breed === ''){
            window.alert("You need to provide your pet name")
        }
        else if(this.state.age === ''){
            window.alert("You need to provide your pet name")
        }
        else if(this.state.gender === ''){
            window.alert("You need to provide your pet name")
        }
        else if(this.state.size === ''){
            window.alert("You need to provide your pet name")
        }
        else{
            var formdata = new FormData();
            formdata.append("name", this.state.petname);
            formdata.append("breed", this.state.breed);
            formdata.append("age", this.state.age);
            formdata.append("gender", this.state.gender);
            formdata.append("size", this.state.size);
            formdata.append("account", this.context.id);
            if(this.state.selectedImage.uri !== ""){
                formdata.append("image", {uri: this.state.selectedImage.uri, name: this.state.selectedImage.uri.replace(/^.*[\\\/]/, ''), type: "image"});
            }
            fetch(`${ServerIP}detail/pet`, uploadOption('POST', formdata))
            .then(response => response.json())
            .then(result => {
                if(result['status']  === "okay"){
                    Actions.main()
                }else{
                    window.alert(RegisterFailMessage)
                }
            })
            .catch(error => console.log('error', error));
        }
    }
    onGalleryPressed = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        var formdata = new FormData();
        formdata.append("image", {uri: result.uri, name: result.uri.replace(/^.*[\\\/]/, ''), type: "image"});
        fetch(`${ServerIP}detail/pet?id=${this.context.pet.id}`, uploadOption('PUT', formdata))
        .then(response => response.json())
        .then(result => {
            if(result['status']  === "okay"){
                this.componentDidMount()
            }else{
                window.alert(RegisterFailMessage)
            }
        })
        .catch(error => console.log('error', error));
    }
    onCameraPressed = async () =>{
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        var formdata = new FormData();
        formdata.append("image", {uri: result.uri, name: result.uri.replace(/^.*[\\\/]/, ''), type: "image"});
        fetch(`${ServerIP}detail/pet?id=${this.context.pet.id}`, uploadOption('PUT', formdata))
        .then(response => response.json())
        .then(result => {
            if(result['status']  === "okay"){
                this.componentDidMount()
            }else{
                window.alert(RegisterFailMessage)
            }
        })
        .catch(error => console.log('error', error));
    }
    removePictureButtonClicked = () => {
        var formdata = new FormData();
        fetch(`${ServerIP}detail/pet?id=${this.context.pet.id}&delete=True`, uploadOption('PUT', formdata))
        .then(response => response.json())
        .then(result => {
            if(result['status']  === "okay"){
                this.componentDidMount()
            }else{
                window.alert(RegisterFailMessage)
            }
        })
        .catch(error => console.log('error', error));
    }
    onResetInfoPressed = () => {
        this.setState({
            petname: "",
            breed: "",
            age: "",
            gender: "",
            size: "",
        })
    }
    genderButtonClicked = (text)=> {
        this.setState({gender: text})
    }
    sizeButtonClicked = (text)=> {
        this.setState({size: text})
    }
    render(){
        return (
            <View style={LoginStyles.container}>
                <View style={Profile.headerContainer}>
                    <View style={Profile.backButton}>
                        <TouchableOpacity onPress={() => Actions.main()}>
                            <Text>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingTop: 50}}>
                        <View style={Profile.circleContainer}>
                            <Image source={{uri: `${ImageIP}${this.state.profile_img}`}} style={Profile.imageStyle} />
                        </View>
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
                <View style={styles.infoInputContainer}>
                    <View style={styles.infoInputWrapperContainer}>
                        <View style={styles.rowView}>
                            <TextInput
                                placeholder='pet name'
                                style={Profile.textInputStyle}
                                value={this.state.petname}
                                onChangeText={text => this.setState({petname: text})}
                                paddingLeft={13}
                            />
                        </View>
                        <View style={styles.rowView}>
                            <TextInput
                                placeholder = 'breed'
                                autoCapitalize = "none"
                                style={Profile.textInputStyle}
                                value={this.state.breed}
                                onChangeText={text => this.setState({breed: text})}
                                paddingLeft={13}
                            />
                        </View>
                        <View style={styles.dropDownRowView1}>
                            <DropDownPicker
                                items={
                                    ageList
                                }
                                placeholder = "Choose your pet's age"
                                value={this.state.age}
                                containerStyle={styles.dropDownContainer}
                                style={styles.dropDownStyle}
                                itemStyle={styles.dropDownItemStyle}
                                dropDownStyle={styles.dropDownStyle}
                                labelStyle={{textAlign: 'center'}}
                                onChangeItem={item => this.setPickerSelected(item)}
                            />
                        </View>
                        <View style={styles.buttonContainerView}>
                            <Text style={{marginBottom: 5}}>Choose your pet's gender</Text>
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
                        </View>
                        <View style={styles.buttonContainerView}>
                            <Text style={{marginBottom: 5}}>Choose your pet's size</Text>
                            <View style={Profile.genderButtonView}>
                                <TouchableOpacity style={this.state.size === "S" ? styles.activeButton : styles.button} onPress={()=>this.sizeButtonClicked("S")}>
                                    <Text>S</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.size === "M" ? styles.activeButton : styles.button} onPress={()=>this.sizeButtonClicked("M")}>
                                    <Text>M</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.size === "L" ? styles.activeButton : styles.button} onPress={()=>this.sizeButtonClicked("L")}>
                                    <Text>L</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.size === "XL" ? styles.activeButton : styles.button} onPress={()=>this.sizeButtonClicked("XL")}>
                                    <Text>XL</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.registerButton} onPress={this.onPetAddPressed}>
                            <Text style={Profile.registerButtonText}>Add</Text>
                        </TouchableOpacity>
                        <View style={{marginTop: 25, alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.onResetInfoPressed}>
                                <Text>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    activeButton: {
        width: "20%",
        height: 35,
        backgroundColor: 'pink',
        borderColor: "pink",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButton:{
        width: '80%',
        height: 60,
        backgroundColor: '#609EFF',
        borderRadius: 10,
        alignItems: 'center',        
        marginTop: 20,
        justifyContent: 'center',
    },
    button: {
        width: "20%",
        height: 35,
        backgroundColor: '#C4C4C4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDownStyle: {
        backgroundColor: '#fafafa',
        textAlign: 'center',
        width: '80%',
    },
    rowView: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
    },
    buttonContainerView:{
        width: '100%',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 20,
    },
    textInputStyle: {
        height: 40, 
        width: "100%", 
        borderColor: 'gray', 
        borderWidth: 2,
        backgroundColor: "white",
        marginBottom: 20,
    },
    genderButtonView: {
        flexDirection: 'row',
    },
    infoInputContainer:{
        flex: 0.7,
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoInputWrapperContainer:{
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 19,
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDownRowView1: {
        zIndex: 101,
        width: "100%",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 20,
    },
    dropDownContainer:{
        height: 40, 
        width: '80%',
    },
    dropDownStyle: {
        backgroundColor: '#fafafa'
    },
    dropDownItemStyle: {
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