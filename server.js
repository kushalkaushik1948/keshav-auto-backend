// 1. Zaroori packages ko la rahe hain
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Isse backend JSON data padh pata hai

// ==============================================================
// STEP 1: MONGODB DATABASE CONNECTION
// ==============================================================
// Yahan 'keshavAutoDB' tere database ka naam hai. Agar nahi bana hoga, to MongoDB khud bana dega.
mongoose.connect('mongodb://127.0.0.1:27017/keshavAutoDB')
    .then(() => console.log("🔥 MongoDB se connection SUCCESSFUL ho gaya!"))
    .catch((err) => console.log("❌ MongoDB connection me ERROR:", err));


// ==============================================================
// STEP 2: DATA KA STRUCTURE (SCHEMA) BANANA
// ==============================================================
// Hum define kar rahe hain ki Test Ride book karte time user se kya-kya details aayengi
const testRideSchema = new mongoose.Schema({
    customerName: String,
    phoneNumber: String,
    bikeModel: String,
    bookingDate: String,
    createdAt: { type: Date, default: Date.now } // Ye automatically time save kar lega
});

// Is schema se 'TestRide' naam ka model (table) bana rahe hain
const TestRide = mongoose.model('TestRide', testRideSchema);


// ==============================================================
// STEP 3: API BANANA (Frontend se data receive karne ke liye)
// ==============================================================
app.post('/api/book-test-ride', async (req, res) => {
    try {
        // req.body me frontend se aaya hua data hota hai
        console.log("Frontend se ye data aaya:", req.body); 

        // Naya data Database ke liye ready kar rahe hain
        const newBooking = new TestRide(req.body); 
        
        // Data ko MongoDB me save kar rahe hain
        await newBooking.save(); 

        // Frontend ko wapas message bhej rahe hain ki kaam ho gaya
        res.status(201).json({ success: true, message: "Bhai, Test Ride successfully book ho gayi!" });

    } catch (error) {
        console.log("Error aaya:", error);
        res.status(500).json({ success: false, message: "Server me kuch gadbad hai.", error });
    }
});
// ==============================================================
// ADMIN API: SAARI TEST RIDES DEKHNE KE LIYE
// ==============================================================
app.get('/api/admin/test-rides', async (req, res) => {
    try {
        // Database se saari test rides nikal rahe hain
        // .sort({ createdAt: -1 }) ka matlab hai jo naya form bhara gaya hai wo sabse upar aayega
        const allBookings = await TestRide.find().sort({ createdAt: -1 });
        
        // Data frontend (Admin page) ko bhej rahe hain
        res.status(200).json({ success: true, data: allBookings });
    } catch (error) {
        console.log("Admin Data Error:", error);
        res.status(500).json({ success: false, message: "Data laane me error aayi." });
    }
});
// ==============================================================
// SERVICE BOOKING SCHEMA & MODEL
// ==============================================================
const serviceSchema = new mongoose.Schema({
    regNumber: String,
    serviceType: String,
    prefDate: String,
    timeSlot: String,
    createdAt: { type: Date, default: Date.now }
});

const ServiceBooking = mongoose.model('ServiceBooking', serviceSchema);

// ==============================================================
// SERVICE API: Data Frontend se receive karne ke liye (POST)
// ==============================================================
app.post('/api/book-service', async (req, res) => {
    try {
        const newService = new ServiceBooking(req.body); 
        await newService.save(); 
        res.status(201).json({ success: true, message: "Gaadi ki Service successfully book ho gayi!" });
    } catch (error) {
        console.log("Service Booking Error:", error);
        res.status(500).json({ success: false, message: "Server me error hai.", error });
    }
});

// ==============================================================
// ADMIN API: Saari Services dekhne ke liye (GET)
// ==============================================================
app.get('/api/admin/services', async (req, res) => {
    try {
        const allServices = await ServiceBooking.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: allServices });
    } catch (error) {
        res.status(500).json({ success: false, message: "Data laane me error aayi." });
    }
});
app.get('/', (req, res) => {
    res.send("Keshav Auto ka Backend ekdum mast chal raha hai! Apni HTML files ko alag se browser me open karo.");
});
// ==============================================================
// ADMIN LOGIN API (Security)
// ==============================================================
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Yahan tera ID aur Password set hai (Tu ise change bhi kar sakta hai)
    if (username === 'keshav' && password === 'admin123') {
        // Agar password sahi hai, toh ek 'Secret Token' bhejenge
        res.status(200).json({ success: true, token: 'keshav_secure_token_999', message: 'Welcome Admin!' });
    } else {
        res.status(401).json({ success: false, message: 'Galat Username ya Password!' });
    }
});
// ==============================================================
// SERVER START KARNA
// ==============================================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});