import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,    
    },

    containerImg:{
        marginVertical: 1,
        height: "auto",
        alignItems: "center",
        justifyContent: 'flex-start',
    },
    containerForm: {
        width: "100%",
        height: "auto",
        justifyContent: "space-around",
    },
    containerInput: {
        width: "100%",
        marginVertical: 10,
        height: "auto",
        justifyContent: "space-between",
    },
    containerFooter: {
        width: "100%",
        paddingTop: 10,
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    containerCheckForgot: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 50,  
      marginBottom: 10,
    }, 
    image: {
        width: 150,
        height: 180,
        objectFit: "contain",
        borderRadius: 30
    },
    row: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowMarginVertical: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 2,
        marginBottom:100,
    },
    column: {
        flexDirection: "column",
        alignItems: "baseline",
        justifyContent: "space-between",
    },
    divider: { 
        backgroundColor: 'black', 
        width: '22%',
        height: 2
    }, 
    title: {
        marginBottom: 15,
      },
      buttonFAB: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: 50,
        color: "white",
    
      },
      text: {
        fontSize: 18,
        marginBottom: 15,
      },
      icon: {
        width: 32,
        height: 32,
      },

    sectionDataAthlete: {
        flexDirection: "row",
        gap: 10,
        width: "100%",
        marginBottom: 20,
    },
});

export default styles