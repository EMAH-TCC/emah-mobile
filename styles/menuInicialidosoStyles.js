import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },

    header: {
        paddingTop: 20,
        position: 'absolute',
        top: 10,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    greetingText: { fontSize: 25, color: '#321904', fontWeight: 'bold' },

    topBox: {
        height: '37%',
        backgroundColor: '#F28B0C',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topImage: {
        width: '70%',
        height: '90%',
        marginTop: 40,
    },

    bottomBox: {
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 40,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuButton: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#f7eee5ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#321904',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginBottom: 18,
    },
    menuText: { marginTop: 8, fontSize: 20, color: '#321904', fontWeight: '500', textAlign: 'center' },
});
