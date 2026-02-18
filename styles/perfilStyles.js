import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#321904",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        zIndex: 10,
        position: 'absolute',
        top: 20,
    },

    container: {
        flex: 1,
        justifyContent: 'space-between'
    },

    topBox: {
        backgroundColor: '#fdba62ff',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingVertical: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingTop: 60,
    },

    greetingText: {
        fontSize: 25,
        color: '#321904',
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: -20,
    },

    profileName: {
        fontSize: 20,
        color: '#321904',
        marginTop: 10,
        fontWeight: "600"
    },

    middleButtons: {
        width: "100%",
        alignItems: "center",
        marginTop: 0,
        gap: 20
    },

    buttonContainer: {
        width: '100%',
        maxWidth: 370,
        alignSelf: 'center',
        marginBottom: 50,
    },

    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        width: '85%',
        alignSelf: "center"
    },

    primaryButton: {
        backgroundColor: '#F28B0C',
    },

    signOutButton: {
        backgroundColor: '#FBB65A',
    },

    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 20,
    },
});
