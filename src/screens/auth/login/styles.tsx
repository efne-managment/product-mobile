import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 48,
        alignItems: "center",
        justifyContent: "space-between",       
    },
    containerImg:{
        width: "100%",
        height: "30%",
        alignItems: "center",
        justifyContent: 'flex-start',
    },
    containerForm: {
        flexDirection: 'column',
        width: "100%",
        height: 350,
        justifyContent: "space-between",
        alignItems: 'center'
    },
    containerInput: {
        marginBottom: 20,
        width:"100%"
    },
    containerFooter: {
        width: "100%",
        paddingVertical: 15,
        borderTopWidth: 1,
        alignItems: 'center',
        borderColor: "#ccc",
    },
    containerCheckForgot: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 50,  
      marginBottom: 10,
    },
    button: {
        borderRadius: 20,
        marginBottom: 20,
    },  
    image: {
        width: "70%",
        height: "100%",
        resizeMode: "contain",
    },
});

export default styles