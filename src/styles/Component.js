import {StyleSheet} from "react-native"

export const ComponentStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
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
    input: {

    },
    title: {

    },
    rowView: {
        width: "100%",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
    },
    cameraRowView: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
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
        justifyContent: "center"
    },
    textStyle: {
        alignSelf: 'center'
    },
    textInputStyle: {
        height: 40, 
        width: "70%", 
        borderColor: 'gray', 
        borderWidth: 2,
        backgroundColor: "white",
        marginBottom: 20,
    },
    weightInputStyle: {
        height: 40, 
        width: 120, 
        borderColor: 'gray', 
        borderWidth: 1,
        marginLeft: 5,
    },
    imageStyle: {
        height: 200,
        width: 200
    },
    dropDownContainer:{
        height: 40, 
        width: 150
    },
    dropDownStyle: {
        backgroundColor: '#fafafa',
        textAlign: 'center',
    },
    dropDownItemStyle: {
        justifyContent: 'center',
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16
    },
});