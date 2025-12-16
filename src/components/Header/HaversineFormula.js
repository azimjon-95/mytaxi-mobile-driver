// Haversine formula bilan masofa hisoblash
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Yer radiusi metrda
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // metrda masofa
}

// Mashina tezligini hisoblash
function getSpeed(distance, time) {
    // Distance in meters, time in seconds
    return (distance / time) * 3.6; // km/h
}

// Har 1 minutda yangi nuqtalarni yuboradigan loop
export function SimulateMachineMovement() {
    let points = [
        [40.8647187, 71.1608605], // Boshlang'ich nuqta
    ];

    let lastLat = points[0][0];
    let lastLon = points[0][1];

    // Loop: Har minutda mashina harakatlanadi
    setInterval(() => {
        // Tasodifiy tezlikni tanlash (8 dan 15 km/h)
        const speedKmh = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
        const speedMs = speedKmh * 1000 / 3600; // m/s ga o‘girish

        // Har bir yangi nuqtani tasodifiy tanlash (masofa 8-15 metr)
        const randomDistance = Math.floor(Math.random() * (15 - 8 + 1)) + 8; // 8-15 metr

        // Nuqtaning yangi joylashuvi (tasodifiy harakat)
        const randomLat = lastLat + (randomDistance / 100000); // Latitude o‘zgarishi
        const randomLon = lastLon + (randomDistance / 100000); // Longitude o‘zgarishi

        // Yangi nuqtani qo‘shish
        points.push([randomLat, randomLon]);

        // Yangi nuqta bilan avvalgi nuqta orasidagi masofani hisoblash
        const lastPoint = points[points.length - 2]; // Oldingi nuqta
        const distance = getDistance(lastPoint[0], lastPoint[1], randomLat, randomLon);

        // Tezlikni hisoblash
        const time = 60; // 1 minut (60 soniya)
        const speed = getSpeed(distance, time); // km/h

        // Yangi nuqta va tezlikni ko‘rsatish
        console.log(`Yangi nuqta: Lat: ${randomLat}, Lon: ${randomLon}`);
        console.log(`Mashina tezligi: ${speed.toFixed(2)} km/h`);

        // Yangi nuqtalar va tezlikni yuborish
        lastLat = randomLat;
        lastLon = randomLon;
    }, 60000); // Har 1 minutda yangi nuqta qo‘shiladi
}

