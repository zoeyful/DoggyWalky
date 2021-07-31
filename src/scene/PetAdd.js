import { Actions } from 'react-native-router-flux';
import React from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import ZoeyButton from '../component/ZoeyButton';
import { ServerIP, uploadOption} from '../constants';
import {LoginStyles} from '../styles/LoginStyle';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import {ComponentStyle} from '../styles/Component';
import * as ImagePicker from 'expo-image-picker';
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
    genderButtonClicked = (text)=> {
        this.setState({gender: text})
    }
    sizeButtonClicked = (text)=> {
        this.setState({size: text})
    }
    removePictureButtonClicked = () => {
        this.setState({selectedImage: {uri : ""}})
    }
    render(){
        return (
            <View style={LoginStyles.container}>
                <View style={ComponentStyle.rowView}>
                    <Text style = {ComponentStyle.textStyle}>Name</Text>
                    <TextInput
                    style={ComponentStyle.textInputStyle}
                    value={this.state.petname}
                    onChangeText={text => this.setState({petname: text})}/>
                </View>
                <View style={ComponentStyle.rowView}>
                    <Text style = {ComponentStyle.textStyle}>Breed</Text>
                    <TextInput
                    autoCapitalize = "none"
                    style={ComponentStyle.textInputStyle}
                    value={this.state.breed}
                    onChangeText={text => this.setState({breed: text})}/>
                </View>
                <View style={styles.dropDownRowView1}>
                    <Text style = {ComponentStyle.textStyle}>Age</Text>
                    <DropDownPicker
                            items={
                                ageList
                            }
                            placeholder = "Choose your pet's age"
                            containerStyle={styles.dropDownContainer}
                            style={ComponentStyle.dropDownStyle}
                            itemStyle={styles.dropDownItemStyle}
                            dropDownStyle={ComponentStyle.dropDownStyle}
                            labelStyle={{textAlign: 'center'}}
                            onChangeItem={item => this.setPickerSelected(item)}
                    />
                </View>
                <View style={ComponentStyle.rowView}>
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
                </View>
                <View style={ComponentStyle.rowView}>
                    <Text>Size</Text>
                    <View style={styles.genderButtonView}>
                        <TouchableOpacity style={this.state.size === "S" ? styles.activeSizeButton : styles.sizeButton} onPress={()=>this.sizeButtonClicked("S")}>
                            <Text>S</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.size === "M" ? styles.activeSizeButton : styles.sizeButton} onPress={()=>this.sizeButtonClicked("M")}>
                            <Text>M</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.size === "L" ? styles.activeSizeButton : styles.sizeButton} onPress={()=>this.sizeButtonClicked("L")}>
                            <Text>L</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.size === "XL" ? styles.activeSizeButton : styles.sizeButton} onPress={()=>this.sizeButtonClicked("XL")}>
                            <Text>XL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.selectedImage.uri !== "" && 
                    <View style={ComponentStyle.rowView}>
                        <Image 
                        style={ComponentStyle.imageStyle}
                        source={{
                            uri: this.state.selectedImage.uri,
                        }}
                        />
                        <TouchableOpacity style={styles.removeButton} onPress={()=>this.removePictureButtonClicked()}>
                                <Text>Remove Picture</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View>
                    <Text>Take a picture or choose from the gallery</Text>
                </View>
                <View style={ComponentStyle.cameraRowView}>
                    <ZoeyButton title="camera" onPress={() => window.alert("camera button pressed")} />
                    <ZoeyButton title="gallery" onPress={() => this.onGalleryPressed()} />
                </View>
                <View style={ComponentStyle.rowView}>
                    <ZoeyButton title="Submit" onPress={() => this.onPetAddPressed()} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    genderButtonView: {
        flexDirection: 'row',
    },
    dropDownRowView1: {
        zIndex: 101,
        width: "100%",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
    },
    dropDownContainer:{
        height: 40, 
        width: 300
    },
    dropDownStyle: {
        backgroundColor: '#fafafa'
    },
    dropDownItemStyle: {
        justifyContent: 'center',
    },
    sizeButton: {
        width: "15%",
        backgroundColor: '#ADABAB',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        margin: "2%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeSizeButton: {
        width: "15%",
        backgroundColor: 'pink',
        borderWidth: 1,
        borderColor: "pink",
        borderRadius: 10,
        margin: "2%",
        alignItems: 'center',
        justifyContent: 'center',
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
    removeButton: {
        width: '30%',
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