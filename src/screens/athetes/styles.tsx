import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingHorizontal: 16,
        paddingTop: 14,
        gap: 4,
    },
    formScrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    formHero: {
        width: "100%",
        minHeight: 164,
        borderWidth: 1,
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    formHeroIcon: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 38,
        height: 38,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    formHeroImage: {
        width: 96,
        height: 118,
        objectFit: "cover",
        borderRadius: 18,
    },
    formHeroContent: {
        flex: 1,
        gap: 8,
        paddingRight: 8,
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
        marginVertical: 7,
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
        marginTop: 14,
        marginBottom: 110,
        gap: 12,
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
