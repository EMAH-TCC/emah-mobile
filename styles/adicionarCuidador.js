import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        color: '#321904',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
        borderWidth: 1,
        borderColor: '#F28B0C',
    },
    primaryButton: {
        backgroundColor: '#F28B0C',
    },
    secondaryButton: {
        backgroundColor: '#fff',
    },
    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 20,
    },
    infoText: {
        color: '#321904',
        fontSize: 20,
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 25,
        top: 30,
    },
    backCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#321904',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
});
