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
import {Profile} from '../styles/Profile';
import globalContext from '../globalContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class PetProfile extends React.Component{
    static navigationOptions = { header: null };
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
            petProfileImage: "",
        }
    }

    componentDidMount(){
        console.log(this.context)
        fetch(`${ServerIP}detail/pet?id=${this.context.pet.id}`, getOption)
        .then(response => response.json())
        .then(result => {
            result.data["loading"] = false
            this.setState(result.data)
            fetch(`${ServerIP}list/meal/${this.context.id}`, getOption)
                .then(response => response.json())
                .then(result => {
                    let mealList = []
                    for(let i = 0; i < result.data.length; i++){
                        let item = {value: result.data[i].id, label: `${result.data[i].item}: ${result.data[i].weight}g`}
                        mealList.push(item)
                    }
                    this.setState({mealList: mealList})})
            })
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
        if(this.state.selectedMeal){
            var formdata = new FormData();
            formdata.append("pet", this.context.pet.id);
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
        else{
            window.alert("Select your meal!")
        }
    }
    mealSelected = (item) =>{
        this.setState({selectedMeal: item})
        console.log(item)
    }
    onPetWeightAddPressed(){
        var formdata = new FormData();
        formdata.append("pet", this.context.pet.id);
        formdata.append("weight", this.state.petWeight);
        fetch(`${ServerIP}detail/weight`, uploadOption('POST', formdata))
        .then(response => response.json())
        .then(result => {
            if(result['status']  === "okay"){
                window.alert("Weight was added successfully")
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
                <KeyboardAwareScrollView
                    contentContainerStyle={ComponentStyle.container}
                >
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
                    <View style={styles.infoContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.titleText}>Pet Information</Text>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Name</Text>
                                <Text style={styles.bodyText}>{this.state.name}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Age</Text>
                                <Text style={styles.bodyText}>{this.state.age}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Breed</Text>
                                <Text style={styles.bodyText}>{this.state.breed}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Gender</Text>
                                <Text style={styles.bodyText}>{this.state.gender}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.bodyTextTitle}>Size</Text>
                                <Text style={styles.bodyText}>{this.state.size}</Text>
                            </View>
                        </View>
                    </View> 
                    <View style={styles.changePasswordContainer}>
                        <View style={styles.dropDownRowView2}>
                            <DropDownPicker
                                placeholder = "Select a food type"
                                items={
                                    this.state.mealList
                                }
                                defaultValue={this.state.country}
                                containerStyle={styles.dropDownContainer}
                                style={styles.dropDownStyle}
                                itemStyle={styles.dropDownItemStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.mealSelected(item)}
                            />
                            <View style={styles.dietButtonContainer}>
                                <TouchableOpacity style={styles.dietRecordButton} onPress={()=> this.onDietAddPressed()} >
                                    <Text style={{color: 'white'}}>Add</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.dietRecordButton} onPress={()=>Actions.dietdetail()} >
                                    <Text style={{color: 'white'}}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowView}>
                            <TextInput
                                placeholder = "Add pet weight"
                                autoCapitalize = "none"
                                style={styles.weightInputStyle}
                                value={this.state.petWeight}
                                onChangeText={text => this.setState({petWeight: text})}
                                paddingLeft={15}
                            />
                            <TouchableOpacity style={styles.weightRecordButton} onPress={() => this.onPetWeightAddPressed()}>
                                <Text style={{color: 'white'}}>Record</Text>
                            </TouchableOpacity>
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
                            width={Dimensions.get("window").width*0.8} // from react-native
                            height={210}
                            yAxisSuffix=" kg"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={chartOption}
                            bezier
                            style={ComponentStyle.chartStyle}
                        />}
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
    changePasswordContainer:{
        flex: 0.45,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '15%',
    },
    rowView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: '5%',
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
        flex: 0.25,
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
    weightRecordButton:{
        width: '30%',
        height: 40,
        backgroundColor: '#609EFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weightInputStyle: {
        height: 40, 
        width: '65%', 
        marginRight: '5%',
        borderColor: 'gray', 
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
    },
    dropDownRowView1: {
        zIndex: 101,
        width: "100%",
        flexDirection: 'row',
        justifyContent: "center"
    },
    dropDownRowView2: {
        zIndex: 100,
        width: "100%",
        flexDirection: 'row',
        justifyContent: "center",
        marginBottom: '5%',
    },
    dropDownContainer:{
        height: 40, 
        width: '65%',
        marginRight: '5%',
    },
    dropDownStyle: {
        backgroundColor: '#fafafa',
        textAlign: 'center',
    },
    dropDownItemStyle: {
        justifyContent: 'center',
    },
    dietRecordButton:{
        width: '45%',
        height: 40,
        backgroundColor: '#609EFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dietButtonContainer: {
        flexDirection: 'row',
        width: '30%',
        justifyContent: 'space-between',
        alignItems: 'center',
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