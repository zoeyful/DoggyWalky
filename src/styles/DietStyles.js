import {StyleSheet} from "react-native"

export const DietStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: '50%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    mealItem: {
        flexDirection: "row",
    },
    rowView: {
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",

    },
    inputContainer: {
        flex: 0.45,
        width: "100%",
        flexDirection: 'column',
        alignItems: "center",
    },
    textInputStyle: {
        height: 40, 
        width: '65%', 
        marginRight: '5%',
        marginBottom: '10%',
        borderColor: 'gray', 
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
    },
    scrollView: {
        flex: 0.4,
        backgroundColor: '#fff',
        borderRadius: 19,
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
    }
  });