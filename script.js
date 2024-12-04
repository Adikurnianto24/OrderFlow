document.addEventListener('DOMContentLoaded', function() {
    console.log('App started');
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            console.log('Card clicked');
        });
    });
});

let selectedProduct = {
    id: '',
    name: '',
    price: 0
};

function selectProduct(id, name, price) {
    selectedProduct = { id, name, price };
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    console.log(`Produk dipilih: ${name}`);
}

function nextStep(currentStep) {
    if (currentStep === 1 && !selectedProduct.id) {
        alert('Silakan pilih baju terlebih dahulu!');
        return;
    }
    if (currentStep === 2 && !document.getElementById('size').value) {
        alert('Silakan pilih ukuran!');
        return;
    }
    if (currentStep === 3) {
        const nama = document.getElementById('nama').value.trim();
        const telepon = document.getElementById('telepon').value.trim();
        const alamat = document.getElementById('alamat').value.trim();
        
        if (!nama || !telepon || !alamat) {
            alert('Silakan lengkapi data pengiriman!');
            return;
        }
        
        if (!/^[0-9]{10,13}$/.test(telepon)) {
            alert('Nomor telepon tidak valid!');
            return;
        }
        showOrderSummary();
    }

    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep + 1}`).classList.add('active');
}

function prevStep(currentStep) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep - 1}`).classList.add('active');
}

function showOrderSummary() {
    const size = document.getElementById('size').value;
    const nama = document.getElementById('nama').value;
    const telepon = document.getElementById('telepon').value;
    const alamat = document.getElementById('alamat').value;
    const ongkir = 20000;
    const totalHarga = selectedProduct.price + ongkir;

    const summary = `
        <div class="order-summary">
            <h3>Detail Produk:</h3>
            <p>${selectedProduct.name}</p>
            <p>Ukuran: ${size}</p>
            <p>Harga: Rp ${selectedProduct.price.toLocaleString()}</p>
            
            <h3>Pengiriman:</h3>
            <p>Nama: ${nama}</p>
            <p>Telepon: ${telepon}</p>
            <p>Alamat: ${alamat}</p>
            <p>Ongkos Kirim: Rp ${ongkir.toLocaleString()}</p>
            
            <h3>Total Pembayaran:</h3>
            <p class="total-price">Rp ${totalHarga.toLocaleString()}</p>

            <h3>Metode Pembayaran:</h3>
            <select id="paymentMethod">
                <option value="">Pilih metode pembayaran...</option>
                <option value="transfer">Transfer Bank</option>
                <option value="ewallet">E-Wallet</option>
                <option value="va">Virtual Account</option>
            </select>

            <div class="button-group">
                <button onclick="prevStep(4)" class="back-btn">Kembali</button>
                <button onclick="processPayment()" class="pay-btn">Bayar Sekarang</button>
            </div>
        </div>
    `;

    document.getElementById('step4').innerHTML = summary;
}

async function processPayment() {
    try {
        // Ambil nilai input
        const nama = document.getElementById('nama').value.trim();
        const telepon = document.getElementById('telepon').value.trim();
        const alamat = document.getElementById('alamat').value.trim();

        // Validasi input
        if (!nama || !telepon || !alamat) {
            throw new Error('Mohon lengkapi semua data');
        }

        // Tampilkan halaman sukses dengan logo keranjang
        const successHtml = `
            <div class="success-page">
                <div class="logo-container">
                    <svg class="cart-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <div class="logo-text">OrderFlow</div>
                </div>
                <h2>Pembayaran Berhasil!</h2>
                <div class="success-details">
                    <p>Terima kasih telah berbelanja di OrderFlow</p>
                    <p>Nomor Order: #${generateOrderNumber()}</p>
                    <p>Status: Pesanan akan diproses</p>
                </div>
                <div class="next-steps">
                    <h3>Langkah selanjutnya:</h3>
                    <ol>
                        <li>Tim kami akan memproses pesanan Anda</li>
                        <li>Anda akan menerima email konfirmasi</li>
                        <li>Pesanan akan dikirim dalam 1-2 hari kerja</li>
                    </ol>
                </div>
                <button onclick="backToHome()" class="home-button">Kembali ke Beranda</button>
            </div>
        `;

        document.getElementById('step4').innerHTML = successHtml;

    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan: ' + error.message);
    }
}

async function saveOrder(orderId, status) {
    try {
        const response = await fetch('save_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: orderId,
                status: status
            })
        });
        const result = await response.json();
        console.log('Order saved:', result);
    } catch (error) {
        console.error('Error saving order:', error);
    }
}

function showPaymentPage(paymentMethod) {
    const totalHarga = selectedProduct.price + 20000;
    let paymentContent = '';

    switch(paymentMethod) {
        case 'transfer':
            paymentContent = `
                <div class="payment-page">
                    <h2>Pembayaran Transfer Bank</h2>
                    <div class="payment-amount">
                        <p>Total yang harus dibayar:</p>
                        <h3>Rp ${totalHarga.toLocaleString()}</h3>
                    </div>
                    
                    <div class="bank-list">
                        <div class="bank-item">
                            <img src="assets/bca.png" alt="BCA" class="bank-logo">
                            <div class="bank-info">
                                <p class="bank-name">Bank BCA</p>
                                <p class="account-number">1234567890</p>
                                <p class="account-name">OrderFlow</p>
                            </div>
                            <button onclick="copyToClipboard('1234567890')" class="copy-btn">Salin</button>
                        </div>
                    </div>

                    <div class="payment-instruction">
                        <h4>Cara Pembayaran:</h4>
                        <ol>
                            <li>Salin nomor rekening yang tersedia</li>
                            <li>Buka aplikasi m-banking atau internet banking Anda</li>
                            <li>Pilih menu transfer</li>
                            <li>Masukkan nominal: Rp ${totalHarga.toLocaleString()}</li>
                            <li>Selesaikan pembayaran Anda</li>
                        </ol>
                    </div>

                    <div class="payment-timer">
                        <p>Selesaikan pembayaran dalam:</p>
                        <div id="countdown">23:59:59</div>
                    </div>

                    <button onclick="confirmPayment()" class="confirm-btn">Saya Sudah Bayar</button>
                </div>
            `;
            break;

        case 'ewallet':
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DummyPayment${Date.now()}`;
            paymentContent = `
                <div class="payment-page">
                    <h2>Pembayaran E-Wallet</h2>
                    <div class="payment-amount">
                        <p>Total yang harus dibayar:</p>
                        <h3>Rp ${totalHarga.toLocaleString()}</h3>
                    </div>
                    
                    <div class="qr-section">
                        <img src="${qrUrl}" alt="QR Code" class="qr-code">
                        <p>Scan QR Code di atas menggunakan e-wallet Anda</p>
                    </div>

                    <div class="payment-instruction">
                        <h4>Cara Pembayaran:</h4>
                        <ol>
                            <li>Buka aplikasi e-wallet Anda</li>
                            <li>Pilih menu Scan QR</li>
                            <li>Scan QR Code di atas</li>
                            <li>Periksa detail pembayaran</li>
                            <li>Selesaikan pembayaran Anda</li>
                        </ol>
                    </div>

                    <div class="payment-timer">
                        <p>Selesaikan pembayaran dalam:</p>
                        <div id="countdown">23:59:59</div>
                    </div>

                    <button onclick="confirmPayment()" class="confirm-btn">Saya Sudah Bayar</button>
                </div>
            `;
            break;

        case 'va':
            const vaNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
            paymentContent = `
                <div class="payment-page">
                    <h2>Pembayaran Virtual Account</h2>
                    <div class="payment-amount">
                        <p>Total yang harus dibayar:</p>
                        <h3>Rp ${totalHarga.toLocaleString()}</h3>
                    </div>
                    
                    <div class="va-info">
                        <p>Nomor Virtual Account:</p>
                        <div class="va-number">
                            <span>${vaNumber}</span>
                            <button onclick="copyToClipboard('${vaNumber}')" class="copy-btn">Salin</button>
                        </div>
                    </div>

                    <div class="payment-instruction">
                        <h4>Cara Pembayaran:</h4>
                        <ol>
                            <li>Salin nomor Virtual Account</li>
                            <li>Buka aplikasi m-banking Anda</li>
                            <li>Pilih menu Pembayaran Virtual Account</li>
                            <li>Masukkan nomor Virtual Account</li>
                            <li>Selesaikan pembayaran Anda</li>
                        </ol>
                    </div>

                    <div class="payment-timer">
                        <p>Selesaikan pembayaran dalam:</p>
                        <div id="countdown">23:59:59</div>
                    </div>

                    <button onclick="confirmPayment()" class="confirm-btn">Saya Sudah Bayar</button>
                </div>
            `;
            break;
    }

    document.getElementById('step4').innerHTML = paymentContent;
    startPaymentTimer();
}

function confirmPayment() {
    const loadingHtml = `
        <div class="payment-loading">
            <div class="spinner"></div>
            <p>Memverifikasi pembayaran Anda...</p>
        </div>
    `;
    document.getElementById('step4').innerHTML = loadingHtml;
    
    setTimeout(() => {
        showSuccessPage();
    }, 3000);
}

function showSuccessPage() {
    const successHtml = `
        <div class="success-page">
            <div class="logo-container">
                <svg class="logo-circle" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="#4CAF50"/>
                    <!-- Shopping cart icon -->
                    <path d="M25 40 h10 l10 30 h30 l10 -30 h-40" 
                          stroke="white" 
                          stroke-width="4" 
                          fill="none"/>
                    <!-- Cart handle -->
                    <path d="M45 45 l-5 -10" 
                          stroke="white" 
                          stroke-width="4" 
                          fill="none"/>
                </svg>
                <div class="logo-text">OrderFlow</div>
            </div>
            <h2>Pembayaran Berhasil!</h2>
            <div class="success-details">
                <p>Terima kasih telah berbelanja di OrderFlow</p>
                <p>Nomor Order: #${generateOrderNumber()}</p>
                <p>Status: Pesanan akan diproses</p>
            </div>
            <div class="next-steps">
                <h3>Langkah selanjutnya:</h3>
                <ol>
                    <li>Tim kami akan memproses pesanan Anda</li>
                    <li>Anda akan menerima email konfirmasi</li>
                    <li>Pesanan akan dikirim dalam 1-2 hari kerja</li>
                </ol>
            </div>
            <button onclick="backToHome()" class="home-button">Kembali ke Beranda</button>
        </div>
    `;
    document.getElementById('step4').innerHTML = successHtml;
}

function startPaymentTimer() {
    let time = 24 * 60 * 60; // 24 jam dalam detik
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        
        countdownElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (time <= 0) {
            clearInterval(timer);
            alert('Waktu pembayaran habis!');
            window.location.reload();
        }
        time--;
    }, 1000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Nomor berhasil disalin!');
    });
}

function generateOrderNumber() {
    return 'ORD' + Date.now().toString().slice(-8);
}

function backToHome() {
    window.location.reload();
}

// Inisialisasi wishlist dari localStorage
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Data produk
const products = {
    'kaos1': {
        id: 'kaos1',
        name: 'Kaos Polos Hitam',
        price: 79000,
        desc: '100% Cotton Combed 30s'
    },
    'kaos2': {
        id: 'kaos2',
        name: 'Kaos Polos Putih',
        price: 79000,
        desc: '100% Cotton Combed 30s'
    }
};

// Initialize wishlist when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateWishlistUI();
    
    // Event listener untuk toggle popup
    document.getElementById('cartLogo').addEventListener('click', function(event) {
        event.stopPropagation();
        document.getElementById('wishlistPopup').classList.toggle('show');
    });
    
    // Event listener untuk menutup popup saat klik di luar
    document.addEventListener('click', function(event) {
        const popup = document.getElementById('wishlistPopup');
        const cartLogo = document.getElementById('cartLogo');
        if (!popup.contains(event.target) && !cartLogo.contains(event.target)) {
            popup.classList.remove('show');
        }
    });
});

function toggleWishlist(productId, event) {
    event.stopPropagation();
    
    const index = wishlist.indexOf(productId);
    const button = event.currentTarget;
    const cartLogo = document.getElementById('cartLogo');
    
    if (index === -1) {
        // Tambah ke wishlist
        wishlist.push(productId);
        button.classList.add('active');
        showNotification('Produk ditambahkan ke wishlist!');
        
        // Tambah animasi shake pada cart
        cartLogo.classList.add('cart-shake');
        setTimeout(() => {
            cartLogo.classList.remove('cart-shake');
        }, 500);
    } else {
        // Hapus dari wishlist
        wishlist.splice(index, 1);
        button.classList.remove('active');
        showNotification('Produk dihapus dari wishlist!');
        
        // Tambah animasi shake pada cart
        cartLogo.classList.add('cart-shake');
        setTimeout(() => {
            cartLogo.classList.remove('cart-shake');
        }, 500);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    // Update counter
    const counter = document.getElementById('wishlistCounter');
    counter.textContent = wishlist.length;
    
    // Update wishlist popup
    const wishlistItems = document.getElementById('wishlistItems');
    wishlistItems.innerHTML = '';
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p class="empty-wishlist">Wishlist Anda kosong</p>';
        return;
    }
    
    wishlist.forEach(productId => {
        const product = products[productId];
        const item = document.createElement('div');
        item.className = 'wishlist-item';
        item.innerHTML = `
            <div class="wishlist-item-info">
                <h4>${product.name}</h4>
                <p>Rp ${product.price.toLocaleString()}</p>
            </div>
            <button class="icon-button wishlist active" onclick="toggleWishlist('${productId}', event)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
        `;
        wishlistItems.appendChild(item);
    });
    
    // Update semua icon wishlist
    document.querySelectorAll('.icon-button.wishlist').forEach(button => {
        const productId = button.closest('.product-card').dataset.id;
        if (wishlist.includes(productId)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.classList.add('show');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Update fungsi untuk marquee yang lebih interaktif
document.addEventListener('DOMContentLoaded', function() {
    const marqueeContent = document.querySelector('.marquee-content');
    const originalItems = marqueeContent.innerHTML;
    
    // Duplikasi item untuk scrolling yang mulus
    marqueeContent.innerHTML = originalItems + originalItems;
    
    // Tambahkan interaksi klik dengan animasi
    const marqueeItems = document.querySelectorAll('.marquee-item');
    marqueeItems.forEach(item => {
        item.addEventListener('click', function() {
            // Tambah efek klik
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            const promoText = this.querySelector('span').textContent;
            showPromoDetail(promoText);
        });
    });
});

function showPromoDetail(promoText) {
    const notification = document.createElement('div');
    notification.className = 'promo-notification';
    notification.innerHTML = `
        <div class="promo-detail">
            <div class="promo-header">
                <i class="promo-icon">🎉</i>
                <h4>Special Promo</h4>
            </div>
            <p>${promoText}</p>
            <div class="promo-footer">
                <small>*Syarat dan ketentuan berlaku</small>
                <button class="promo-btn">Gunakan Sekarang</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animasi masuk
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hapus notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Tambahkan style untuk notifikasi yang lebih menarik
const style = document.createElement('style');
style.textContent = `
    .promo-notification {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        min-width: 300px;
        max-width: 400px;
    }

    .promo-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    .promo-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        gap: 10px;
    }

    .promo-icon {
        font-size: 24px;
    }

    .promo-detail h4 {
        margin: 0;
        color: #2193b0;
        font-size: 18px;
    }

    .promo-detail p {
        margin: 10px 0;
        color: #333;
        font-size: 16px;
    }

    .promo-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

    .promo-btn {
        background: linear-gradient(45deg, #2193b0, #6dd5ed);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .promo-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(33, 147, 176, 0.3);
    }

    .promo-detail small {
        color: #666;
        font-size: 0.8em;
    }
`;
document.head.appendChild(style); 