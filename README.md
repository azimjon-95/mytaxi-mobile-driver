🚖 GoTaxi Driver App

A modern React Native (Expo) mobile application for taxi drivers.
Drivers can receive ride requests in real-time, accept or reject orders, track trip status, and manage their profile and balance.

🚀 Features

🚗 Real-time order receiving (Socket.IO)
✅ Accept / Reject ride requests
📍 Driver live location tracking
🧭 Distance & ETA calculation
📜 Active & completed orders
💰 Balance & earnings tracking
🟢 Driver active / inactive status
🔔 Push notifications (new order, cancel, status update)
🔐 Secure login with phone number & PIN
⚡ Global state management using Redux Toolkit

🛠️ Tech Stack
React Native 0.81
Expo 54
React Navigation 7
Redux Toolkit (RTK Query)
Socket.IO Client
Expo Location
Expo Notifications
Async Storage

📁 Project Structure
mytaxi-driver-app/
│── assets/
│── src/
│   ├── api/            # RTK Query APIs
│   ├── components/     # Reusable UI components
│   ├── screens/        # Driver screens
│   │   ├── Home
│   │   ├── Orders
│   │   ├── ActiveOrder
│   │   ├── Profile
│   ├── redux/          # Store & slices
│   ├── hooks/
│   └── utils/
│── App.js
│── package.json
│── README.md

📦 Installation
1️⃣ Clone the repository
git clone https://github.com/azimjon-95/mytaxi-driver-mobile.git
cd mytaxi-driver-app

2️⃣ Install dependencies
npm install

3️⃣ Start the app
npm start


Run on Android:
npm run android

Run on iOS:
npm run ios

🔧 Environment Variables

Create a .env file in the root directory:

API_URL=https://your-api.com
EXPO_PUBLIC_SOCKET_URL=ws://your-socket-url
GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_KEY

🔄 Real-time Orders (Socket Flow)
Driver connects to socket
Joins room: driver:{driverId}
Server sends events:
driver:{driverId} → new orders
status updates
inactive warnings

Example:

socket.on(`driver:${driverId}`, (payload) => {
  if (!payload.isActive) {
    Alert.alert("Ogohlantirish", payload.message);
  } else {
    setOrders(payload.orders);
  }
});

📦 Main Dependencies
{
  "@react-navigation/native": "^7.1.22",
  "@react-navigation/native-stack": "^7.8.3",
  "@reduxjs/toolkit": "^2.11.0",
  "react-redux": "^9.2.0",
  "socket.io-client": "^4.7.5",
  "expo-location": "~19.0.7",
  "expo-notifications": "~0.31.0"
}

📸 Screenshots (optional)

Place screenshots inside:

/screenshots
   driver-home.png
   incoming-order.png
   active-trip.png
   profile.png

🧠 App Logic (Driver Side)
Only active drivers receive orders
Orders filtered by:
car type
service type
distance
Orders cached with Redis (backend)
Socket updates override cache instantly

🤝 Contributing

Contributions are welcome!
Please follow clean code, modular architecture, and standard Git workflow.

📄 License

MIT License

Agar xohlasangiz, keyingi bosqichda men sizga:

🧭 Driver location → nearest order logic
🟢 Active / Inactive toggle real-time
💰 Driver balance & commission system
🔐 Driver-only auth guard

ham to‘liq qilib beraman.