import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { paddingHorizontal: 20, paddingVertical: 20, alignItems: 'center' },
    backButton: {
        alignSelf: 'flex-start',
        width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#321904',
        justifyContent: 'center', alignItems: 'center', marginBottom: 20
    },
    centeredContent: { width: '100%', alignItems: 'center' },
    profileContainer: { alignItems: 'center', marginBottom: 20 },
    profileImage: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#f7eee5ff',
        justifyContent: 'center', alignItems: 'center', marginBottom: 8
    },
    profileText: { fontSize: 20, color: '#321904' },
    inputContainer: { marginBottom: 20, width: '100%', maxWidth: 300, alignItems: 'center' },
    input: {
        backgroundColor: '#f7eee5ff', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 16,
        fontSize: 20, color: '#321904', marginBottom: 20, width: '100%'
    },
    inputPassword: {
        backgroundColor: '#f7eee5ff', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 16,
        fontSize: 20, color: '#321904'
    },
    passwordContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7eee5ff',
        borderRadius: 6, paddingRight: 8, marginBottom: 20, width: '100%'
    },
    eyeIcon: { paddingHorizontal: 5 },
    radioContainer: { marginTop: 10, alignSelf: 'flex-start' },
    radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    radioText: { marginLeft: 8, color: '#321904', fontSize: 20 },
    buttonContainer: { width: '100%', maxWidth: 300, marginTop: 20 },
    button: { paddingVertical: 14, borderRadius: 6, alignItems: 'center', marginBottom: 36, width: '100%' },
    primaryButton: { backgroundColor: '#F28B0C' },
    buttonText: { color: '#321904', fontWeight: 'bold', fontSize: 20 },
});
