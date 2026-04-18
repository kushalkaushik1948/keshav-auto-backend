// 1. Zaroori packages ko la rahe hain
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Isse backend JSON data padh pata hai

// ==============================================================
// STEP 1: MONGODB DATABASE CONNECTION (Updated for Cloud)
// ==============================================================
// ⚠️ KANHA: Niche wale link me <db_password> hata kar apna asli password likhna!
const DB_URI = 'mongodb+srv://keshav:admin123@cluster0.qmbyxhp.mongodb.net/keshavAutoDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB_URI)
    .then(() => console.log("🔥 MongoDB se connection SUCCESSFUL ho gaya (Cloud Atlas)!"))
    .catch((err) => console.log("❌ MongoDB connection me ERROR:", err));


// ==============================================================
// STEP 2: DATA KA STRUCTURE (SCHEMA) BANANA
// ==============================================================
const testRideSchema = new mongoose.Schema({
    customerName: String,
    phoneNumber: String,
    bikeModel: String,
    bookingDate: String,
    createdAt: { type: Date, default: Date.now }
});

const TestRide = mongoose.model('TestRide', testRideSchema);

// ==============================================================
// STEP 3: API BANANA (Frontend se data receive karne ke liye)
// ==============================================================
app.post('/api/book-test-ride', async (req, res) => {
    try {
        console.log("Frontend se ye data aaya:", req.body); 
        const newBooking = new TestRide(req.body); 
        await newBooking.save(); 
        res.status(201).json({ success: true, message: "Bhai, Test Ride successfully book ho gayi!" });
    } catch (error) {
        console.log("Error aaya:", error);
        res.status(500).json({ success: false, message: "Server me kuch gadbad hai.", error });
    }
});

// ADMIN API: SAARI TEST RIDES DEKHNE KE LIYE
app.get('/api/admin/test-rides', async (req, res) => {
    try {
        const allBookings = await TestRide.find().sort({ createdAt: -1 });
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

// SERVICE API: POST
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

// ADMIN API: GET
app.get('/api/admin/services', async (req, res) => {
    try {
        const allServices = await ServiceBooking.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: allServices });
    } catch (error) {
        res.status(500).json({ success: false, message: "Data laane me error aayi." });
    }
});

app.get('/', (req, res) => {
    res.send("Keshav Auto ka Backend ekdum mast chal raha hai Render par! 🚀");
});

// ADMIN LOGIN API
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'keshav' && password === 'admin123') {
        res.status(200).json({ success: true, token: 'keshav_secure_token_999', message: 'Welcome Admin!' });
    } else {
        res.status(401).json({ success: false, message: 'Galat Username ya Password!' });
    }
});

// ==============================================================
// SERVER START KARNA (Updated for Render)
// ==============================================================
// Render environment variable PORT use karta hai, default 5000 rakha hai local ke liye
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
});