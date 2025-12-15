import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#101820",
        justifyContent: "center",
        padding: 24,
    },

    headerContainer: {
        marginBottom: 40,
        alignItems: "center",
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "rgb(0,255,127)",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        color: "#00ff8097",
        textAlign: "center",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgb(0,255,127)",
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 18,
        backgroundColor: "rgba(255,255,255,0.03)",
    },

    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "rgb(0,255,127)",
    },

    btn: {
        backgroundColor: "rgb(0,255,127)",
        padding: 18,
        borderRadius: 12,
        marginTop: 10,
    },

    btnDisabled: {
        opacity: 0.5,
    },

    btnText: {
        textAlign: "center",
        color: "#101820",
        fontSize: 18,
        fontWeight: "bold",
    },

    disclaimer: {
        marginTop: 22,
        fontSize: 13,
        color: "#00ff8097",
        textAlign: "center",
    },
});
