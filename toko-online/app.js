const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const path = require('path');

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, 'public')));

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Ganti dengan password MySQL-mu
  database: 'toko-online'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Koneksi ke database berhasil.');
});

// Rute untuk menampilkan daftar produk
app.get('/', (req, res) => {
  db.query('SELECT * FROM produk', (err, results) => {
    if (err) throw err;
    res.render('index', { produk: results });
  });
});

// Rute untuk menampilkan keranjang belanja
app.get('/keranjang', (req, res) => {
    const query = `SELECT k.id, p.nama, p.harga, k.jumlah, p.foto, (p.harga * k.jumlah) AS total
                   FROM keranjang k
                   JOIN produk p ON k.produk_id = p.id`;
    
    db.query(query, (err, results) => {
      if (err) throw err;
  
      // Hitung total harga keseluruhan
      const totalHargaKeseluruhan = results.reduce((total, item) => total + item.total, 0);
  
      // Kirim data keranjang dan total harga ke halaman keranjang.ejs
      res.render('keranjang', { keranjang: results, totalHarga: totalHargaKeseluruhan });
    });
  });  

// Rute untuk menambahkan produk ke keranjang
app.post('/add-to-cart', (req, res) => {
  const { produkId, jumlah } = req.body;
  db.query('INSERT INTO keranjang (produk_id, jumlah) VALUES (?, ?)', [produkId, jumlah], (err) => {
    if (err) throw err;
    res.redirect('/keranjang');
  });
});

// Rute untuk menghapus produk dari keranjang
app.post('/remove-from-cart', (req, res) => {
  const { keranjangId } = req.body;
  db.query('DELETE FROM keranjang WHERE id = ?', [keranjangId], (err) => {
    if (err) throw err;
    res.redirect('/keranjang');
  });
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
