import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        height: 60,
        justifyContent: 'center',
        marginBottom: 25,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 10,
    },
    backCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#321904',
        justifyContent: 'center',
        alignItems: 'center',
        top: 20,
    },
    headerTitle: {
        fontSize: 25,
        color: '#321904',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        top: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    input: {
        backgroundColor: '#f7eee5ff',
        padding: 14,
        borderRadius: 6,
        marginBottom: 16,
        color: '#321904',
        fontSize: 20,
    },
    text: {
        padding: 14,
        color: '#321904',
        fontSize: 20,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
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
    radioContainer: { marginTop: 10, alignSelf: 'flex-start' },
    radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    radioText: { marginLeft: 8, color: '#321904', fontSize: 20 },
    inputTime: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#322323ff",
        padding: 15,
        width: 100,
        textAlign: "center",
        borderRadius: 5,
        fontSize: 20,
        marginBottom: 10,
    },
});
