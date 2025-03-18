const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const FLASK_API_URL = process.env.FLASK_API_URL || "http://127.0.0.1:5001"; 
console.log(`✅ Kết nối Flask API tại: ${FLASK_API_URL}`);

app.post("/predict", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Lỗi kết nối đến Flask API:", error.message);
        res.json({ error: "Lỗi kết nối đến Flask API" });
    }
});

app.listen(3001, () => console.log("✅ Frontend chạy tại http://localhost:3001"));