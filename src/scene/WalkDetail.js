import { Actions } from 'react-native-router-flux';
import React from 'react';
import {Text, View, TextInput, StyleSheet, Dimensions} from 'react-native';
import ZoeyButton from '../component/ZoeyButton';
import {LoginFailMessage, ServerIP, getOption} from '../constants';
import {LoginStyles} from '../styles/LoginStyle';
import {ComponentStyle} from '../styles/Component';
import MapView, {Polyline} from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.12;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const parseString = require('react-native-xml2js').parseString;

export default class WalkDetail extends React.Component{
    constructor(props){
        super(props)
        this.state={
            coordinate: 
                [
                    {latitude: 37.5760, longitude: 126.9769,},
                    {latitude: 37.8025259, longitude: -122.4351431}
                ],
            loading: true,

        }
    }
    
    componentDidMount(){
        fetch(`${ServerIP}detail/route/demo`, getOption)
        .then(response => response.json())
        .then(result => {
            let coordinates = []
            let self = this
            parseString(result.data, function (err, result) {
                let pointList = result.gpx.trk[0].trkseg[0].trkpt
                for(let i = 0; i < pointList.length; i++){
                    let point = pointList[i]["$"]
                    console.log(point)
                    let newItem = {
                        latitude: point.lat,
                        longitude: point.lon,
                    }
                    coordinates.push(newItem)
                }
                self.setState({coordinate: coordinates, loading: false})
            });
        })
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
            let regionView = {
                latitude: this.state.coordinate[0].latitude,
                longitude: this.state.coordinate[0].longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA}
            return (
                <View style={styles.container}>
                    <MapView style={styles.map}
                        region={regionView}
                    >
                        <Polyline 
                            coordinates = {this.state.coordinate}
                            strokeColor="red"
                            strokeWidth={2}
                        />
                    </MapView>
                </View>

            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height*0.75,
    },
  });