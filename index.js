const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Config
const dbConfig = {
    host: 'your-tidb-hostname.tidbcloud.com', 
    port: 4000,
    user: 'your_username.root',
    password: 'your_password',
    database: 'campus_finder',
    ssl: { rejectUnauthorized: true }
};

// 2. This route MUST work for Render to stay "Live"
app.get('/', (req, res) => {
    res.send("Server is running! Database will connect on request.");
});

// 3. Get Items
app.get('/items', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.query('SELECT * FROM lost_items ORDER BY created_at DESC', (err, results) => {
        connection.end(); 
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Add Item
app.post('/add', (req, res) => {
    const { item_name, category, location, contact } = req.body;
    const connection = mysql.createConnection(dbConfig);
    const sql = "INSERT INTO lost_items (item_name, category, location_found, finder_contact) VALUES (?, ?, ?, ?)";
    connection.query(sql, [item_name, category, location, contact], (err, result) => {
        connection.end();
        if (err) return res.status(500).json({ error: err.message });
        res.send("Success");
    });
});

// 5. Port Binding
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Live on port ${PORT}`);
});
