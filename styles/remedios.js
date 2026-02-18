import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { flexGrow: 1 },
    container: { flex: 1, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'flex-start' },

    header: {
        height: 60,
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
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
        top: 10,
    },
    headerTitle: {
        fontSize: 25,
        color: '#321904',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        top: 10,
    },

    listContent: { paddingBottom: 20 },
    card: {
        backgroundColor: '#f5dfc8ff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        position: 'relative',
    },
    cardText: { color: '#321904', fontSize: 20, marginBottom: 4 },
    optionsButton: { position: 'absolute', top: 10, right: 10 },

    addButton: {
        backgroundColor: '#F28B0C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 50,
    },
    addButtonText: { color: '#321904', fontWeight: 'bold', fontSize: 20 },

    modalOverlay: { flex: 1, backgroundColor: 'transparent' },
    menuContainer: {
        position: 'absolute',
        backgroundColor: '#F7F2FA',
        borderRadius: 8,
        paddingVertical: 10,
        width: 180,
        elevation: 5,
    },
    menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
    menuText: { fontSize: 20, color: '#321904' },
});
