const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Backend is Live");
});

const connection = mysql.createConnection({
    host: 'YOUR_TIDB_HOST', 
    port: 4000,
    user: 'YOUR_TIDB_USER',
    password: 'YOUR_TIDB_PASSWORD',
    database: 'campus_finder',
    ssl: {
        rejectUnauthorized: true
    }
});

app.get('/items', (req, res) => {
    connection.query('SELECT * FROM lost_items ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/add', (req, res) => {
    const { item_name, category, location, contact } = req.body;
    const sql = "INSERT INTO lost_items (item_name, category, location_found, finder_contact) VALUES (?, ?, ?, ?)";
    connection.query(sql, [item_name, category, location, contact], (err, result) => {
        if (err) return res.status(500).json(err);
        res.send("Success");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
