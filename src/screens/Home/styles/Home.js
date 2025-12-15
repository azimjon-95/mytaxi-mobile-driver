import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        backgroundColor: 'rgb(16, 24, 32)',
    },

    // Inactive Banner Styles
    inactiveBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 77, 77, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 12,
        marginTop: 10,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#ff4d4d',
    },
    inactiveIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    inactiveText: {
        flex: 1,
        color: '#ff6b6b',
        fontSize: 11,
        fontWeight: '600',
    },

    // Waiting State Styles
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    waitingIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    waitingText: {
        fontSize: 13,
        color: '#8e9aaf',
        fontWeight: '500',
    },

    // ScrollView Styles
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
        paddingBottom: 24,
    },

    // Order Card Styles - COMPACT
    orderCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(71, 85, 105, 0.3)',
    },


    // Order Header - COMPACT
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    customerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        flex: 1,
        marginRight: 6,
    },
    customerIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    customerName: {
        fontSize: 13,
        marginLeft: 3,
        fontWeight: '700',
        color: '#ffffff',
    },
    priceBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    priceText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#4ade80',
    },

    // Route Container - COMPACT
    routeContainer: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderRadius: 8,
        padding: 8,
    },
    routePoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    fromDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
        marginRight: 8,
        borderWidth: 1.5,
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    toDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        marginRight: 8,
        borderWidth: 1.5,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    routeLine: {
        width: 1.5,
        height: 12,
        backgroundColor: 'rgba(148, 163, 184, 0.3)',
        marginLeft: 3,
        marginVertical: 1,
    },
    locationText: {
        fontSize: 11,
        color: '#cbd5e1',
        fontWeight: '500',
        flex: 1,
    },

    // Order Footer - COMPACT
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 183, 0, 0.15)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 183, 0, 0.3)',
    },
    distanceIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    distanceText: {
        fontSize: 12,
        marginLeft: 2,
        fontWeight: '600',
        color: '#fbbf24',
    },

    // Accept Button - COMPACT
    acceptButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 14,
    },
    acceptButtonText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },


    acceptBtn: {
        paddingVertical: 2,
        borderColor: 'rgba(255, 183, 0, 0.3)',
        backgroundColor: 'rgba(255, 183, 0, 0.15)',
        borderWidth: 1,
        marginLeft: 5,
        paddingHorizontal: 8,
        borderRadius: 12,
        // marginRight: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    routeBtn: {
        backgroundColor: "rgb(0, 255, 127)",
        paddingVertical: 4,
        paddingHorizontal: 9,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    disabledBtn: {
        opacity: 0.4,
    },

    btnText: {
        color: "#1e293be2",
        fontWeight: "600",
        marginLeft: 6,
        fontSize: 14,
    },
    mapPreview: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 14,
    },



});