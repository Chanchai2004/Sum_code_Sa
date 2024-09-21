const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); 

// ตั้งค่า multer สำหรับการอัปโหลดไฟล์
const upload = multer({ dest: 'uploads/' });

app.post('/proxy/slipok', upload.single('file'), async (req, res) => {
  try {
    const { log, amount } = req.body; // ดึงค่า log และ amount จาก req.body

    const formData = new FormData();
    if (req.file) {  // ใช้ req.file ในกรณีที่อัปโหลดไฟล์
      formData.append("files", fs.createReadStream(req.file.path));
    }

    // เพิ่มฟิลด์ log และ amount ใน formData
    formData.append("log", log || false);
    if (amount) {
      formData.append("amount", amount);
    }

    const response = await axios.post('https://api.slipok.com/api/line/apikey/27555', formData, {
      headers: {
        "x-authorization": "SLIPOKM0Z75J5", // ใส่ API key ที่นี่
        ...formData.getHeaders(),
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error during API request:", error);
    res.status(error.response?.status || 500).json({ error: error.message });
  } finally {
    if (req.file) {  // ลบไฟล์หลังจากใช้งานเสร็จ
      fs.unlinkSync(req.file.path);
    }
  }
});

app.listen(3000, () => console.log('Proxy server is running on port 3000'));
