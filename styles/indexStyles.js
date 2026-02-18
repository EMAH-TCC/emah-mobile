import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F28B0C',
    },
    subtitle: {
        fontSize: 19,
        color: '#321904',
        marginTop: 8,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButton: {
        backgroundColor: '#F28B0C',
    },
    secondaryButton: {
        backgroundColor: '#FBB65A',
    },
    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 20,
    },
});