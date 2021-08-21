import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView} from 'react-native';
import {RegisterFailMessage, PasswordMatchingFailedMessage, ServerIP, getOption, uploadOption} from '../constants'
import {ComponentStyle} from '../styles/Component';
import { LoginStyles } from '../styles/LoginStyle';
import {Profile} from '../styles/Profile';
import {DietStyles} from '../styles/DietStyles';

export default class DietDetail extends React.Component{
    static navigationOptions = { header: null };
    static contextType = globalContext;
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
        fetch(`${ServerIP}list/meal/${this.context.id}`, getOption)
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
        fetch(`${ServerIP}list/meal/${this.context.id}`, uploadOption('DELETE', formdata))
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
        if(/^\+?\d+$/.test(text) || text.length === 0){
            this.setState({foodAmount: text})
        }
    }
    onMealSaveClicked = () => {
        if(this.state.foodName.length > 0 & this.state.foodAmount.length > 0){
            var formdata = new FormData();
            formdata.append("item", this.state.foodName);
            formdata.append("weight", this.state.foodAmount);
            fetch(`${ServerIP}list/meal/${this.context.id}`, uploadOption('POST', formdata))
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
            window.alert("Type in information")
        }
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
                                <Text style={styles.modalText}>Are you sure?</Text>
                                <View style={styles.modalInnerContainer}>
                                    <TouchableOpacity style={styles.modalButton} onPress={() => this.onDeleteConfirmClicked()}>
                                        <Text>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton} onPress={() => this.setState({modalVisible: false})}>
                                        <Text>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.headerContainer}>
                        <View style={Profile.backButton}>
                            <TouchableOpacity onPress={() => Actions.petprofile()}>
                                <Text>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={DietStyles.scrollView}>
                        <View style={styles.titleTextContainer}>
                            <Text style={styles.longTitleText}>Food</Text>
                            <Text style={styles.shortTitleText}>Amount</Text>
                            <Text style={styles.shortTitleText}>Delete</Text>
                        </View>
                        <ScrollView style={{width: '100%', height: '87%'}}>
                            {this.state.mealList.map( (item, index) =>{
                                return(
                                    <View style={{flexDirection: 'row', paddingTop: 15}} key={index}>
                                            <Text style={{width: '50%', textAlign: 'center'}}>{item.item}</Text>
                                            <Text style={{width: '25%', textAlign: 'center'}}>{item.weight}</Text>
                                            <View style={styles.deleteButtonContainer}>
                                                <TouchableOpacity style={styles.deleteButton} onPress={() => this.onMealItemDeleteClicked(item)}>
                                                    <Text>X</Text>
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <View style={DietStyles.inputContainer}>
                        <View style={styles.whiteBackgroundContainer}>
                            <View style={styles.innerInputContainer}>
                                <TextInput
                                    placeholder = "Enter Food Name"
                                    autoCapitalize = "none"
                                    style={styles.textInputStyle}
                                    value={this.state.foodName}
                                    onChangeText={text => this.onFoodNameChange(text)}
                                    paddingLeft={15}
                                    />
                                <TextInput
                                    placeholder = "Enter Food Amount"
                                    autoCapitalize = "none"
                                    style={styles.textInputStyle}
                                    value={this.state.foodAmount}
                                    onChangeText={text => this.onFoodAmountChange(text)}
                                    paddingLeft={15}
                                    />
                            </View>
                            <View style={styles.innerButtonContainer}>
                                <TouchableOpacity style={styles.addButton} onPress={() => this.onMealSaveClicked()}>
                                    <Text>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                </View>
                );
        }
    }
}

export const styles = StyleSheet.create({
    innerInputContainer:{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    modalInnerContainer:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButton:{
        width: '50%',
        marginBottom: '10%',
        backgroundColor: '#609EFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 3,
        paddingTop: 3,
    },
    modalText:{
        fontWeight: 'bold',
        marginBottom: '10%',
    },
    addButton: {
        width: '30%',
        height: 40,
        marginTop: '10%',
        backgroundColor: '#609EFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerButtonContainer:{
        width: '100%',
        alignItems: 'center',
    },
    textInputStyle: {
        height: 40, 
        width: '80%', 
        marginBottom: '5%',
        borderColor: 'gray', 
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
    },
    whiteBackgroundContainer:{
        width: '80%',
        marginTop: '10%',
        backgroundColor: '#fff',
        borderRadius: 19,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70%',
        
    },
    headerContainer:{
        flex: 0.15,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: "100%",
    },
    deleteButton:{
        width: '40%',
        backgroundColor: '#609EFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonContainer:{
        width: '25%', 
        justifyContent: 'center', 
        flexDirection: 'row',
        alignItems: 'center',
    },
    longTitleText:{
        width: '50%', 
        textAlign: 'center', 
        fontWeight: 'bold',
    },
    shortTitleText:{
        width: '25%', 
        textAlign: 'center', 
        fontWeight: 'bold',
    },
    titleTextContainer:{
        flexDirection: 'row', 
        height: '13%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
})