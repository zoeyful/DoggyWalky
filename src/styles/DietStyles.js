import {StyleSheet} from "react-native"

export const DietStyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
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
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textInputStyle: {
        width: "10%",
        borderWidth: 1,
        borderColor: "black",
        marginLeft: 10,
        marginRight: 20,
    },
    scrollView: {
        borderWidth: 1,
        borderColor: "black",
        height: "10%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    }
  });