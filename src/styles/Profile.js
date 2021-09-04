import {StyleSheet} from "react-native"

export const Profile = StyleSheet.create({
    headerContainer: {
        flex: 0.3,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: "100%",
    },
    container: {
        flex: 0.7,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    buttonContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    backButton:{
        position: 'absolute', 
        left: 20, 
        top: 60
    },
    genderButtonView: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },
    registerButton:{
        width: '80%',
        height: 60,
        backgroundColor: '#609EFF',
        borderRadius: 10,
        alignItems: 'center',        
        marginTop: 50,
        justifyContent: 'center',
    },
    registerButtonText:{
        color: '#fff',
    },
    button: {
        width: "25%",
        height: 35,
        backgroundColor: '#C4C4C4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle:{
        borderRadius: 60,
        height: 120,
        width: 120,
    },
    buttonText: {
        color: '#3A3A3A',
    },
    activeButton: {
        width: "25%",
        height: 35,
        backgroundColor: 'pink',
        borderColor: "pink",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer:{
        width: '90%', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 19,
        height: '90%',
    },
    textInputStyle: {
        height: 40, 
        width: "80%", 
        borderColor: 'gray', 
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: "white",
        marginBottom: 20,
    },
    missMatchTextInputStyle: {
        height: 40, 
        width: "80%", 
        borderColor: 'red', 
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: "white",
        marginBottom: 20,
    },
    circle: {
        textAlign: 'center',
        fontSize:20 - 2 * 10, //... One for top and one for bottom alignment
        lineHeight:20 - (Platform.OS === 'ios' ? 2 * 10 : 10), //... One for top and one for bottom alignment

    },
    circleContainer: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#C4C4C4',
        borderColor: '#C4C4C4',
        width: 120,	
        height: 120,
        borderRadius: 100,
        borderWidth: 10,
    },
})