import { Actions } from 'react-native-router-flux';
import React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import ZoeyButton from '../component/ZoeyButton';
import {getOption, ServerIP, uploadOption, activityDot, weightDot} from '../constants';
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
        }
    }
    onPetItemButtonClicked = (item) =>{
        // console.log(item)
        if(item.name === "-"){
            alert("Pick a pet")
        }else{
            this.context.pet = this.state.currentPet
            Actions.petprofile()
        }
    }
    setPickerSelected = (item) =>{
        // console.log(item)
        if(item.value === "+"){
            Actions.petadd()
        }else{
            this.setState({currentPet: item})
        }
    }
    componentDidMount(){
        // console.log(`${ServerIP}list/pet/${this.props.id}`)
        fetch(`${ServerIP}list/pet/${this.context.id}`, getOption)
        .then(response => response.json())
        .then(result => {
            if(result.data.length === 0){
                Actions.petadd()
            }
            for(let i = 0; i < result.data.length; i++){
                result.data[i].label = result.data[i].name
                result.data[i].value = result.data[i].name
            }
            result.data.push({label: "+", value:"+"})
            this.setState({ 
                pet_list: result.data, currentPet: result.data[0]})
            fetch(`${ServerIP}list/activity/${this.context.id}`, getOption)
            .then(response => response.json())
            .then(result => {
                let mealList = []
                let calendarActivityList = {}
                for(let i = 0; i < result.data.length; i++){
                    let date = result.data[i].created_date.split("T")[0]
                    calendarActivityList[date] = {dots: [activityDot]}
                }
                let activitylist = result.data
                // calendarActivityList["2021-05-11"] = {dots:[activityDot, weightDot]}
                // calendarActivityList["2021-05-10"] = {dots:[weightDot]}
                fetch(`${ServerIP}list/meal/${this.context.id}`, getOption)
                .then(response => response.json())
                .then(result => {
                    for(let i = 0; i < result.data.length; i++){
                        let item = {value: result.data[i].id, label: `Food: ${result.data[i].item}, Amount: ${result.data[i].weight}`}
                        mealList.push(item)
                    }
                    this.setState({activitylist: activitylist, loading: false, mealList: mealList})
                    fetch(`${ServerIP}detail/pet?id=d8dbfd7d-4ea1-49ba-9fca-1ffbe67b9828`, getOption)
                    .then(response => response.json())
                    .then(result => {
                        result.data["loading"] = false
                        for(let i = 0; i < result.data.weight_list.length; i++){
                            let date = result.data.weight_list[i].created_date.split("T")[0]
                            if(calendarActivityList[date] === undefined){
                                calendarActivityList[date] = {dots: [weightDot]} 
                            } else {
                                let itemCheck = _.find( calendarActivityList[date].dots, function(item){ return item.key === "weight"} )
                                if( itemCheck === undefined){
                                    calendarActivityList[date].dots.push(weightDot)
                                }
                            }
                        }
                    this.setState({weightList : result.data.weight_list, calendarActivityList: calendarActivityList})})
                    fetch(`${ServerIP}detail/mealrecord?id=d8dbfd7d-4ea1-49ba-9fca-1ffbe67b9828`, getOption)
                    .then(response => response.json())
                    .then(result => {
                        this.setState({mealrecord: result.data})
                    })
                })
                
               
            })
        })
    }
    render(){
        console.log(this.context)
        if(this.state.loading === true){
            return(
                <View style={LoginStyles.container}>
                    <Text>Loading...</Text>
                </View>
            )
        }else{ 
            let self = this
            let weightItem = _.findLast(this.state.weightList, function(item){return item.created_date.split("T")[0] === self.state.clickedDateString})
            console.log(this.state.pet_list)
            return (
                <View style={LoginStyles.container}>
                    <View style={ComponentStyle.dropDownRowView1}>
                        <ZoeyButton title={this.state.currentPet.name} onPress={() => this.onPetItemButtonClicked(this.state.currentPet)}/>
                        <DropDownPicker
                            items={
                                this.state.pet_list
                            }
                            placeholder = "Choose your pet"
                            defaultValue={this.state.country}
                            containerStyle={ComponentStyle.dropDownContainer}
                            style={ComponentStyle.dropDownStyle}
                            itemStyle={ComponentStyle.dropDownItemStyle}
                            labelStyle={{textAlign: 'center'}}
                            dropDownStyle={ComponentStyle.dropDownStyle}
                            onChangeItem={item => this.setPickerSelected(item)}
                        />
                        <ZoeyButton title="Account Info" onPress={()=>Actions.accountinfo()} />
                    </View>
                    <View>
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
                            style={{width: windowWidth}} // height: windowHeight/2
                            selected={this.state.clickedDateString}
                            onDayPress={(day) => {this.setState({clickedDateString: day.dateString})}}
                            enableSwipeMonths={true}
                        />
                    </View>
                    <View>
                        {weightItem === undefined ?
                        null
                        :
                        <Text>Weight: {weightItem.weight}kg</Text>
                        }
                    </View>
                    <View style={DietStyles.scrollView}>
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
                    </View>
                    <View style={DietStyles.scrollView}>
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
                        <TouchableOpacity onPress={()=>Actions.duringwalk()} style={styles.circleContainer}>
                            <Text style={styles.circle}>Start</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View> 
            );
        }
    }
}
const styles = StyleSheet.create({
    bottomView:{
        position: 'absolute',
        bottom: 0,
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomViewText:{
        fontSize: 15,
    },
    circle: {
        textAlign: 'center',
        fontSize:20 - 2 * 10, //... One for top and one for bottom alignment
        lineHeight:20 - (Platform.OS === 'ios' ? 2 * 10 : 10), //... One for top and one for bottom alignment

    },
    circleContainer: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#7DFDFE',
        borderColor: '#7DFDFE',
        width: 80,	
        height: 80,
        borderRadius: 80,
        borderWidth: 10,
    }
})