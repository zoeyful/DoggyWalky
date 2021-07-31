import React from 'react';
import { View, Text } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { ComponentStyle } from '../styles/Component';
import {ServerIP, uploadOption} from '../constants';
import ZoeyButton from '../component/ZoeyButton';
import createGpx from 'gps-to-gpx';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';

const LOCATION_SETTINGS = {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 5000,
}

export default class DuringWalk extends React.Component{
    constructor(props){
        super(props)
        this.state={
            gpsOn: false,
            gpsData: [],
        }
    }

    startGPS = async () => {
        // this.location = await Location.watchPositionAsync(LOCATION_SETTINGS, location => {
        //     console.log(location.coords.longitude, location.coords.latitude, location.timestamp)
        //     let newelem = {"lat": location.coords.longitude, "long":location.coords.latitude, "time":location.timestamp}
        //     this.setState(prevState =>({
        //         location: [...prevState.location, newelem ]
        //     }))
        // })
        this.interval = setInterval(() => navigator.geolocation.getCurrentPosition(info =>  this.setState({gpsData: 
            [...this.state.gpsData, {elevation: info.coords.altitude, longitude: info.coords.longitude, 
                latitude: info.coords.latitude, time: new Date(info.timestamp)}]})) , 2000);
        this.setState({gpsOn: true})
    }

    stopGPS = async () => {
        // this.location.remove()
        clearInterval(this.interval)
        console.log(this.state.gpsData)
        const gpx = createGpx(this.state.gpsData, {activityName: "Running"});
        let response = await fetch(`${ServerIP}detail/activity/test`, uploadOption('POST', gpx))
        this.setState({gpsOn: false, gpsData: []})
        Actions.walkfinish()
    }

    async componentDidMount(){
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted"){
            console.log('not grated')
        }
        this.startGPS()
    }

    render(){
        return (
            <View style={ComponentStyle.container}>
                <TouchableOpacity onPress={()=>this.stopGPS()}>
                    <Text>finish</Text>
                </TouchableOpacity>
            </View>
            );
    }
}