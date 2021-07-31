import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { ServerIP, getOption, ImageIP, chartOption, uploadOption} from '../constants';
import { ComponentStyle } from '../styles/Component';
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from 'react-native-dropdown-picker';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import ZoeyButton from '../component/ZoeyButton';
import * as ImagePicker from 'expo-image-picker';
import globalContext from '../globalContext';

export default class PetProfile extends React.Component{
    static contextType = globalContext;
    constructor(props){
        super(props)
        this.state={
            name: "",
            gender: "",
            age: "",
            breed: "",
            size: "",
            weight_list: [],
            loading: true,
        }
    }

    componentDidMount(){
        console.log(this.context)
        fetch(`${ServerIP}detail/pet?id=${this.context.pet.id}`, getOption)
        .then(response => response.json())
        .then(result => {
            result.data["loading"] = false
            this.setState(result.data)})
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
    onDietAddPressed = () =>{
        var formdata = new FormData();
        formdata.append("pet", "d8dbfd7d-4ea1-49ba-9fca-1ffbe67b9828");
        formdata.append("meal", this.state.selectedMeal.value);
        fetch(`${ServerIP}detail/mealrecord`, uploadOption('POST', formdata))
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
    mealSelected = (item) =>{
        this.setState({selectedMeal: item})
        console.log(item)
    }
    onPetWeightAddPressed(){
        var formdata = new FormData();
        formdata.append("pet", this.state.currentPet.id);
        formdata.append("weight", this.state.petWeight);
        fetch(`${ServerIP}detail/weight`, uploadOption('POST', formdata))
        .then(response => response.json())
        .then(result => {
            if(result['status']  === "okay"){
                window.alert("Weight was added successfully")
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
    render(){
        if(this.state.loading === true){
            return(
                <View style={ComponentStyle.container}>
                    <Text>Loading...</Text>
                </View>
            )
        }
        else{
            let datelist = []
            let weightlist = []
            for(let i = 0; i < this.state.weight_list.length; i++){
                weightlist[i] = parseFloat(this.state.weight_list[i].weight)
                datelist[i] = this.state.weight_list[i].created_date.split("T")[0]
            }
            return (
                <View style={ComponentStyle.container}>
                    <Image 
                        style={ComponentStyle.imageStyle}
                        source={{
                            uri: `${ImageIP}${this.state.profile_img}`
                        }}
                    />
                    <View style={ComponentStyle.cameraRowView}>
                        <ZoeyButton title="Change Profile Picture" onPress={() => this.onGalleryPressed()} />
                        <TouchableOpacity style={styles.button} onPress={()=>this.removePictureButtonClicked()}>
                            <Text>Remove Picture</Text>
                        </TouchableOpacity>
                    </View>
                    <Text>Name: {this.state.name}</Text>
                    <Text>Age: {this.state.age}</Text>
                    <Text>Breed: {this.state.breed}</Text>
                    <Text>Gender: {this.state.gender}</Text>
                    <Text>Size: {this.state.size}</Text>

                    <View style={ComponentStyle.dropDownRowView2}>
                        <DropDownPicker
                            items={
                                this.state.mealList
                            }
                            defaultValue={this.state.country}
                            containerStyle={ComponentStyle.dropDownContainer}
                            style={ComponentStyle.dropDownStyle}
                            itemStyle={ComponentStyle.dropDownItemStyle}
                            dropDownStyle={ComponentStyle.dropDownStyle}
                            onChangeItem={item => this.mealSelected(item)}
                        />
                        <ZoeyButton title ="+" onPress={()=> this.onDietAddPressed()} />
                        <ZoeyButton title ="Diet Detail" onPress={()=>Actions.dietdetail()} />

                    </View>
                    <View style={ComponentStyle.rowView}>
                        <Text style = {ComponentStyle.textStyle}>Weight</Text>
                        <TextInput
                            autoCapitalize = "none"
                            style={ComponentStyle.weightInputStyle}
                            value={this.state.petWeight}
                            onChangeText={text => this.setState({petWeight: text})}/>
                        <ZoeyButton title ="+" onPress={() => this.onPetWeightAddPressed()} />
                    </View>
                    
                    {weightlist.length === 0 ?
                        <Text>No Data</Text> 
                        :
                        <LineChart
                        data={{
                            labels: datelist,
                            datasets: [{
                                data: weightlist}
                            ]
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={220}
                        yAxisSuffix=" kg"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={chartOption}
                        bezier
                        style={ComponentStyle.chartStyle}
                    />}
                </View>
                );
        }
    }
}
const styles = StyleSheet.create({
    genderButtonView: {
        flexDirection: 'row',
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