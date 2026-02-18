import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#321904',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 40,
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
    },
    input: {
        backgroundColor: '#f7eee5ff',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 16,
        fontSize: 20,
        color: '#321904',
        marginBottom: 20,
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7eee5ff',
        borderRadius: 6,
        paddingRight: 8,
        width: '100%',
    },
    eyeIcon: {
        paddingHorizontal: 5,
    },
    forgotPasswordText: {
        color: '#321904',
        fontSize: 20,
        marginTop: 8,
        textAlign: 'right',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
        marginTop: 'auto',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 36,
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#F28B0C',
    },
    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 20,
    },
});