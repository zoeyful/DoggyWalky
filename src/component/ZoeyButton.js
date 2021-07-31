import React from 'react';
import { Text, TouchableOpacity} from 'react-native';
import {ComponentStyle} from '../styles/Component'


export default function ZoeyButton(props){
    return(
        <TouchableOpacity style={ComponentStyle.button} onPress={props.onPress}>
            <Text>{props.title}</Text>
        </TouchableOpacity>
    )
}