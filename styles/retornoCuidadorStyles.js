import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f7eee5ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageLabel: {
        color: '#321904',
        fontSize: 14,
        marginTop: 4,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    infoText: {
        color: '#321904',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        maxWidth: 300,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
        maxWidth: 300,
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
