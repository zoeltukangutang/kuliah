const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'toko-online'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Koneksi ke database berhasil!');
});

module.exports = connection;