import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, TextInput, Modal, StyleSheet, ScrollView} from 'react-native';
import {RegisterFailMessage, PasswordMatchingFailedMessage, ServerIP, getOption, uploadOption} from '../constants'
import {ComponentStyle} from '../styles/Component';
import { LoginStyles } from '../styles/LoginStyle';
import ZoeyButton from '../component/ZoeyButton';
import {DietStyles} from '../styles/DietStyles';
const sampleData = [ { id: 0, portion: "500", name: "연어" },
{ id: 1, portion: "700", name: "닭"},
{ id: 2, portion: "650", name: "모노프로틴"},
{ id: 3, portion: "650", name: "모노프로틴"}, 
{ id: 4, portion: "650", name: "모노프로틴"}, 
{ id: 5, portion: "650", name: "모노프로틴"}, 
{ id: 6, portion: "650", name: "모노프로틴"}, 
{ id: 7, portion: "650", name: "모노프로틴"}, 
{ id: 8, portion: "650", name: "모노프로틴"},
{ id: 9, portion: "650", name: "모노프로틴"}, 
{ id: 10, portion: "650", name: "모노프로틴"}, 
{ id: 11, portion: "650", name: "모노프로틴"}, 
{ id: 12, portion: "650", name: "모노프로틴"}]

export default class DietDetail extends React.Component{
    constructor(props){
        super(props)
        this.state={
            mealList: [],
            initial: true,
            modalVisible: false,
            foodName: "",
            foodAmount: "",

        }
    }
       
    componentDidMount(){
        fetch(`${ServerIP}list/meal/test`, getOption)
        .then(response => response.json())
        .then(result => {
            this.setState({mealList: result.data, initial: false, foodName: "", foodAmount: "", modalVisible: false})
        })
    }
    onMealItemDeleteClicked = (item) =>{
        // console.log(item)
        this.setState({modalVisible: true, deleteClicked: item})
    }
    onDeleteConfirmClicked = () =>{
        var formdata = new FormData();
        formdata.append("id", this.state.deleteClicked.id);
        fetch(`${ServerIP}list/meal/test`, uploadOption('DELETE', formdata))
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
    onFoodNameChange(text){
        this.setState({foodName: text})
    }
    onFoodAmountChange(text){
        this.setState({foodAmount: text})
    }
    onMealSaveClicked = () =>{
        var formdata = new FormData();
        formdata.append("item", this.state.foodName);
        formdata.append("weight", this.state.foodAmount);
        fetch(`${ServerIP}list/meal/test`, uploadOption('POST', formdata))
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
        if(this.state.initial === true){
            return(
                <View style={ComponentStyle.container}>
                    <Text>Loading...</Text>
                </View>
            )
        }else{
            console.log(this.state)
            return (
                <View style={LoginStyles.container}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                    >
                        <View style={DietStyles.centeredView}>
                            <View style={DietStyles.modalView}>
                                <Text>Are you sure?</Text>
                                <View>
                                    <ZoeyButton title = "Yes" onPress={() => this.onDeleteConfirmClicked()}/>
                                    <ZoeyButton title = "No" onPress={() => this.setState({modalVisible: false})}/>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={DietStyles.scrollView}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{width: '33%', textAlign: 'center'}}>Food</Text>
                            <Text style={{width: '33%', textAlign: 'center'}}>Amount</Text>
                            <Text style={{width: '33%', textAlign: 'center'}}>Delete</Text>
                        </View>
                        <ScrollView>
                            {this.state.mealList.map( (item, index) =>{
                                return(
                                    <View style={{flexDirection: 'row', marginBottom: 5, marginTop: 5}} key={index}>
                                            <Text style={{width: '33%', textAlign: 'center'}}>{item.item}</Text>
                                            <Text style={{width: '33%', textAlign: 'center'}}>{item.weight}</Text>
                                            <View style={{width: '33%', justifyContent: 'center', flexDirection: 'row'}}>
                                                <ZoeyButton title = "X" onPress={() => this.onMealItemDeleteClicked(item)} />
                                            </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <View style={DietStyles.inputContainer}>
                        <Text>Food Name</Text>
                        <TextInput
                            autoCapitalize = "none"
                            style={DietStyles.textInputStyle}
                            value={this.state.foodName}
                            onChangeText={text => this.onFoodNameChange(text)}/>
                        <Text>Amount</Text>
                        <TextInput
                            autoCapitalize = "none"
                            style={DietStyles.textInputStyle}
                            value={this.state.foodAmount}
                            onChangeText={text => this.onFoodAmountChange(text)}/>
                    </View>
                    <View>
                        <ZoeyButton title="Submit" onPress={() => this.onMealSaveClicked()}/>
                    </View>
                </View>
                );
        }
    }
}

