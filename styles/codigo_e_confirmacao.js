import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#321904',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        top: 10,
    },
    content: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 100,
    },
    infoText: {
        color: '#321904',
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '500',
        maxWidth: 320,
        lineHeight: 30,
    },
    input: {
        backgroundColor: '#f7eee5ff',
        color: '#321904',
        fontSize: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 6,
        textAlign: 'center',
        width: '100%',
        maxWidth: 300,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    inputError: {
        color: 'red',
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 16,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
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
