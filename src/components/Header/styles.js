import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 19,
        backgroundColor: "#101820",
        elevation: 3,
    },

    hamburgerBtn: {
        width: 27,
        height: 20,
        justifyContent: "space-between",
    },

    hamburgerLine: {
        height: 3,
        backgroundColor: "#00ff7f",
        borderRadius: 2,
    },

    workBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    workText: {
        color: "#00ff7f",
        fontSize: 14,
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        width: "80%",
        backgroundColor: "#101820",
        borderRadius: 14,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#00ff7f",
    },

    modalTitle: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 12,
        fontWeight: "600",
    },

    gpsText: {
        color: "#ccc",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 15,
    },

    modalActions: {
        flexDirection: "row",
        gap: 15,
    },

    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#777",
    },

    cancelText: {
        color: "#aaa",
        fontWeight: "600",
    },

    okBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: "#00ff7f",
    },

    okText: {
        color: "#101820",
        fontWeight: "700",
    },
});

export default styles;
