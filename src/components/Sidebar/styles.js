import { StyleSheet } from "react-native";

export default StyleSheet.create({
    sidebarOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    sidebar: {
        width: 300,
        height: "100%",
        backgroundColor: "#101820",
        borderRightWidth: 2,
        borderRightColor: "#00ff7f",
    },
    userSection: {
        padding: 20,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 40,
        backgroundColor: "#00ff7f",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#101820",
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#00ff7f",
    },
    userPhone: {
        color: "#ccc",
        marginBottom: 6,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    menuIcon: {
        fontSize: 22,
        marginRight: 14,
    },
    menuText: {
        color: "#00ff7f",
        fontSize: 16,
        fontWeight: "600",
    },
    cashbackAmount: {
        color: "#aaa",
        fontSize: 14,
    },
    historySection: {
        paddingVertical: 10,
    },
    historyTitle: {
        color: "#00ff7f",
        fontWeight: "bold",
        padding: 16,
    },
    logoutItem: {
        marginTop: 20,
    },
    logoutText: {
        color: "#ff4444",
    },
    menuSubtext: {
        fontSize: 12,
        color: "#aaa",
    },
});
