import { Actions } from 'react-native-router-flux';
import React from 'react';
import {Text, View, StyleSheet, Dimensions, Image} from 'react-native';
import ZoeyButton from '../component/ZoeyButton';
import {getOption, ServerIP, uploadOption, activityDot, weightDot, ImageIP} from '../constants';
import {LoginStyles} from '../styles/LoginStyle';
import {ScrollView, TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {ComponentStyle} from '../styles/Component';
import DropDownPicker from 'react-native-dropdown-picker';
import {DietStyles} from '../styles/DietStyles';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import _ from 'lodash';
import globalContext from '../globalContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Main extends React.Component{
    static navigationOptions = { header: null };
    static contextType = globalContext;
    constructor(props){
        super(props)
        this.state={
            isExpand: false,
            petWeight: "",
            pickerValue: "",
            currentPet: {id: 0, name: "-", },
            loading: true,
            clickedDateString: new Date().toISOString().slice(0, 10),
            weightList: [],
            mealrecord: [],
            activitylist: [],
        }
    }
    onPetItemButtonClicked = (item) =>{
        if(item.name === "-"){
            alert("Pick a pet")
        }else{
            this.context.pet = this.state.currentPet
            Actions.petprofile()
        }
    }
    setPickerSelected = (item) =>{
        if(item.value === "+"){
            Actions.petadd()
        }else{
            this.setState({currentPet: item})
        }
    }
    async componentDidMount(){
        const petList = await fetch(`${ServerIP}list/pet/${this.context.id}`, getOption)
        const petListJson = await petList.json()
        if(petListJson.data.length === 0){
            Actions.petadd()
        }
        for(let i = 0; i < petListJson.data.length; i++){
            petListJson.data[i].label = petListJson.data[i].name
            petListJson.data[i].value = petListJson.data[i].name
        }
        petListJson.data.push({label: "+", value:"+"})
        let currentPet = petListJson.data[0]

        const activityList = await fetch(`${ServerIP}list/activity/${this.context.id}`, getOption)
        const activityJson = await activityList.json()
        let calendarActivityList = {}
        for(let i = 0; i < activityJson.data.length; i++){
            let date = activityJson.data[i].created_date.split("T")[0]
            calendarActivityList[date] = {dots: [activityDot]}
        }

        const petDetail = await fetch(`${ServerIP}detail/pet?id=${currentPet.id}`, getOption)
        const petDetailJson = await petDetail.json()
        petDetailJson.data["loading"] = false
        for(let i = 0; i < petDetailJson.data.weight_list.length; i++){
            let date = petDetailJson.data.weight_list[i].created_date.split("T")[0]
            if(calendarActivityList[date] === undefined){
                calendarActivityList[date] = {dots: [weightDot]} 
            } else {
                let itemCheck = _.find(calendarActivityList[date].dots, function(item){return item.key === "weight"})
                if(itemCheck === undefined){
                    calendarActivityList[date].dots.push(weightDot)
                } 
            }
        }

        const mealRecord = await fetch(`${ServerIP}detail/mealrecord?id=${currentPet.id}`, getOption)
        const mealRecordJson = await mealRecord.json()
        
        this.setState({
            pet_list: petListJson.data, 
            currentPet: currentPet,
            activitylist: activityJson.data,
            loading: false,
            weightList : petDetailJson.data.weight_list,
            calendarActivityList: calendarActivityList,
            mealrecord: mealRecordJson.data,
        })
    }
    render(){
        if(this.state.loading === true){
            return(
                <View style={LoginStyles.container}>
                    <Text>Loading...</Text>
                </View>
            )
        }else{ 
            let self = this
            let weightItem = _.findLast(this.state.weightList, function(item){return item.created_date.split("T")[0] === self.state.clickedDateString})
            console.log(this.state.currentPet)
            return (
                <View style={LoginStyles.container}>
                    <View style={styles.mainHeader}>
                        <TouchableOpacity style={styles.petProfileBackground} onPress={() => this.onPetItemButtonClicked(this.state.currentPet)}>
                            <Image 
                                source={
                                    this.state.currentPet.profile_img === 'no image' ?
                                    require('../img/dogProfile.png')
                                    :
                                    {uri: `${ImageIP}${this.state.currentPet.profile_img}`}
                                } 
                                style={styles.petProfileBackground}
                            />
                        </TouchableOpacity>
                        <DropDownPicker
                            items={
                                this.state.pet_list
                            }
                            placeholder = "Choose your pet"
                            defaultValue={this.state.country}
                            containerStyle={styles.dropDownContainer}
                            style={ComponentStyle.dropDownStyle}
                            itemStyle={ComponentStyle.dropDownItemStyle}
                            labelStyle={{textAlign: 'center'}}
                            dropDownStyle={ComponentStyle.dropDownStyle}
                            onChangeItem={item => this.setPickerSelected(item)}
                        />
                        <TouchableOpacity style={styles.petProfileBackground} onPress={()=>Actions.accountinfo()}>
                            <Image 
                                source={
                                    this.state.currentPet.profile_img === 'no image' ?
                                    require('../img/personProfile.png')
                                    :
                                    {uri: `${ImageIP}${this.state.currentPet.profile_img}`}
                                } 
                                style={styles.petProfileBackground}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.calendarContainer}>
                        <Calendar
                            markedDates={
                                this.state.calendarActivityList
                            }
                            markingType = "multi-dot"
                            theme={{
                                selectedDayBackgroundColor: 'yellow',
                                selectedDayTextColor: 'red',
                                todayTextColor: '#00adf5',
                            }}
                            style={{width: windowWidth, height: '100%'}} // height: windowHeight/2
                            selected={this.state.clickedDateString}
                            onDayPress={(day) => {this.setState({clickedDateString: day.dateString})}}
                            enableSwipeMonths={true}
                        />
                    </View>
                    <View style={styles.weightContainer}>
                        {weightItem === undefined ?
                        <Text>No Weight Recorded</Text>
                        :
                        <Text>Weight: {weightItem.weight}kg</Text>
                        }
                    </View>
                    {/* <View style={DietStyles.scrollView}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{width: '25%', textAlign: 'center'}}>Time</Text>
                                <Text style={{width: '25%', textAlign: 'center'}}>Duration</Text>
                                <Text style={{width: '25%', textAlign: 'center'}}>Distance</Text>
                                <Text style={{width: '25%', textAlign: 'center'}}>Detail</Text>
                            </View>
                            <ScrollView>
                                {this.state.activitylist.map( (item, index) =>{
                                    if(item.created_date.split("T")[0] === this.state.clickedDateString){
                                        return(
                                            <View style={{flexDirection: 'row', marginBottom: 5, marginTop: 5}} key={index}>
                                                <Text style={{width: '25%', textAlign: 'center'}}>{item.created_date.split("T")[1]}</Text>
                                                <Text style={{width: '25%', textAlign: 'center'}}>{item.activity_duration}</Text>
                                                <Text style={{width: '25%', textAlign: 'center'}}>{parseFloat(item.total_distnace).toFixed(2)}</Text>
                                                <Text style={{width: '25%', textAlign: 'center'}} onPress={()=> Actions.walkdetail()}>View</Text>
                                            </View>
                                        )
                                    }
                                    
                                })}
                            </ScrollView>
                    </View> */}
                    <View style={styles.scrollView}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{width: '33%', textAlign: 'center'}}>Time</Text>
                            <Text style={{width: '33%', textAlign: 'center'}}>Food Name</Text>
                            <Text style={{width: '33%', textAlign: 'center'}}>Amount</Text>
                        </View>
                        <ScrollView>
                            {/* {this.state.mealrecord.map( (item, index) =>{
                                if(item.created_date.split("T")[0] === this.state.clickedDateString){
                                    return(
                                        <View style={{flexDirection: 'row', marginBottom: 5, marginTop: 5}} key={index}>
                                            <Text style={{width: '33%', textAlign: 'center'}}>{item.created_date.split("T")[1]}</Text>
                                            <Text style={{width: '33%', textAlign: 'center'}}>{item.item}</Text>
                                            <Text style={{width: '33%', textAlign: 'center'}}>{item.weight}</Text>
                                        </View>
                                    )
                                }
                                
                            })} */}
                        </ScrollView>
                    </View>
                    <View style={styles.bottomView}>
                        <TouchableOpacity onPress={()=>Actions.duringwalk()} style={styles.startRunningButton}>
                            <Text>Start Running</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View> 
            );
        }
    }
}
const styles = StyleSheet.create({
    bottomView:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.1,
        flexDirection: 'row',
        backgroundColor: 'pink',
    },
    weightContainer:{
        flex: 0.05,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainHeader: {
        zIndex: 101,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 0.1,
        paddingTop: '8%',
    },
    calendarContainer:{
        flex: 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
    },
    scrollView: {
        flex: 0.3,
        backgroundColor: '#fff',
        borderRadius: 19,
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
    },
    dropDownContainer:{
        height: 45, 
        width: '50%',
    },
    bottomViewText:{
        fontSize: 15,
    },
    // circle: {
    //     textAlign: 'center',
    //     fontSize:20 - 2 * 10, //... One for top and one for bottom alignment
    //     lineHeight:20 - (Platform.OS === 'ios' ? 2 * 10 : 10), //... One for top and one for bottom alignment
    // },
    startRunningButton: {
        // alignItems:'center',
        // justifyContent:'center',
        backgroundColor:'#7DFDFE',
        width: '100%',
    },
    petProfileBackground: {
        backgroundColor: '#C4C4C4',
        borderColor: 'black',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
})