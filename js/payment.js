document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Ambil data dari form
    const givenNames = document.getElementById('given_names').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const mobileNumber = document.getElementById('mobile_number').value;
    const address = document.getElementById('address').value;

    // Ambil data keranjang dari localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Hitung total harga dari semua item di keranjang
    let totalAmount = 0;
    cart.forEach(item => {
        totalAmount += parseFloat(item.price); // Pastikan item.price adalah number
    });

    if (totalAmount === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    // Ganti dengan Sandbox API Key Anda
    const apiKey = 'xnd_development_VfUoAyn8jViJ4tdAtYn7IDktq7kHEPuIkBUs7AYV0zoHbFWgxxcDv4Y6SBHER4e';
  
    // Buat pesan WhatsApp untuk pembayaran berhasil
    const productNames = cart.map(item => item.name).join(', ');
    const whatsappMessage = `Halo, saya sudah membayar untuk ${productNames}. Berikut detail saya:\n\nNama: ${givenNames} ${surname}\nEmail: ${email}\nNomor Telepon: ${mobileNumber}\nAlamat: ${address}\n\nTerima kasih!`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
  
    // Data untuk dikirim ke Xendit API
    const data = {
        external_id: `demo-${Date.now()}`, // ID unik untuk transaksi
        amount: totalAmount, // FIX: Tidak dikalikan 100
        description: `Pembayaran untuk ${productNames}`,
        invoice_duration: 3600, // Durasi invoice (dalam detik)
        customer: {
            given_names: givenNames,
            surname: surname,
            email: email,
            mobile_number: mobileNumber
        },
        success_redirect_url: `https://api.whatsapp.com/send?phone=6285156230199&text=${encodedMessage}`, // Redirect ke WA setelah pembayaran berhasil
        failure_redirect_url: window.location.href // Redirect kembali ke halaman ini jika pembayaran gagal
    };
  
    try {
        const response = await fetch('https://api.xendit.co/v2/invoices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(apiKey + ':')}` // Basic Auth dengan API Key
            },
            body: JSON.stringify(data)
        });
  
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Gagal membuat payment link: ${errorResponse.message || 'Unknown error'}`);
        }
  
        const result = await response.json();
  
        if (result.invoice_url) {
            window.open(result.invoice_url, '_blank');
        } else {
            throw new Error('Respons API tidak valid: invoice_url tidak ditemukan');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Terjadi kesalahan saat menghubungi Xendit API.');
    }
});
