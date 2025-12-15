import { api } from "./api";

export const driverApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // 🔐 DRIVER LOGIN
        driverLogin: builder.mutation({
            query: (body) => ({
                url: "/driver/login",
                method: "POST",
                body,
            }),
        }),

        // ➕ CREATE DRIVER
        createDriver: builder.mutation({
            query: (body) => ({
                url: "/driver",
                method: "POST",
                body,
            }),
        }),

        // 📋 GET ALL DRIVERS
        getDrivers: builder.query({
            query: () => "/driver",
        }),

        // 👤 GET DRIVER BY ID
        getDriverById: builder.query({
            query: (id) => `/driver/${id}`,
        }),

        // ✏️ UPDATE DRIVER
        updateDriver: builder.mutation({
            query: ({ id, body }) => ({
                url: `/driver/${id}`,
                method: "PUT",
                body,
            }),
        }),

        // ❌ DELETE DRIVER
        deleteDriver: builder.mutation({
            query: (id) => ({
                url: `/driver/${id}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: false,
});

// EXPORT HOOKS
export const {
    useDriverLoginMutation,
    useCreateDriverMutation,
    useGetDriversQuery,
    useGetDriverByIdQuery,
    useUpdateDriverMutation,
    useDeleteDriverMutation,
} = driverApi;
