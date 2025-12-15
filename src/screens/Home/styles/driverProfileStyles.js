import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: "#101820",
        padding: 16,
        paddingTop: 0,
    },
    title: {
        color: "#00ff7f",
        fontSize: 18,
        fontWeight: "bold",
    },
    sectionTitle: {
        color: "#00ff7f",
        marginTop: 20,
        marginBottom: 10,
        fontWeight: "bold",
    },
    label: {
        color: "#aaa",
        fontSize: 12,
    },
    input: {
        backgroundColor: "#1a1f25",
        color: "#00ff7f",
        borderRadius: 8,
        padding: 10,
        marginTop: 4,
    },
    readonly: {
        color: "#ccc",
        padding: 10,
        backgroundColor: "#1a1f25",
        borderRadius: 8,
        marginTop: 4,
    },
    serviceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#1a1f25",
        borderRadius: 8,
        marginBottom: 6,
    },
    serviceText: {
        color: "#00ff7f",
    },
    remove: {
        color: "#ff4444",
    },
    saveBtn: {
        backgroundColor: "#00ff7f",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 30,
    },
    saveText: {
        fontWeight: "bold",
        color: "#101820",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    inputBox: {
        flex: 1,
        marginBottom: 10,
    },
    inputBoxHalf: {
        flex: 1,
        marginBottom: 12,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inactiveService: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
    },
    activeService: {
        backgroundColor: '#e6f7ff16',  // Och ko'k fon
        borderColor: 'rgb(0, 255, 127)',      // Ko'k chegara
        shadowOpacity: 0.2,
    },
    serviceText: {
        fontSize: 16,
        color: '#989898',
        flex: 1,
    },
    serviceIcon: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
