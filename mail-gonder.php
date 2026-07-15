<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// PHPMailer kütüphane dosyalarını dahil edelim
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// ==========================================
// 🛠️ SMTP E-POSTA AYARLARI
// ==========================================
// Buradaki bilgileri kendi SMTP e-posta hesap bilgilerinize göre doldurmalısınız.
define('SMTP_HOST', 'mail.ozturkormanmuhendislik.com.tr'); // Örn: mail.alanadiniz.com veya smtp.yandex.com
define('SMTP_USER', 'iletisim@ozturkormanmuhendislik.com.tr'); // Gönderici e-posta adresi
define('SMTP_PASS', 'BURAYA_SMTP_EPOSTA_SIFRENIZI_YAZIN'); // E-posta şifreniz
define('SMTP_PORT', 587); // Genellikle 587 (TLS/STARTTLS) veya 465 (SSL) kullanılır
define('SMTP_SECURE', PHPMailer::ENCRYPTION_STARTTLS); // TLS için: PHPMailer::ENCRYPTION_STARTTLS, SSL için: PHPMailer::ENCRYPTION_SMTPS

// Alıcı E-posta adresi (Mesajların gönderileceği adres)
define('TO_EMAIL', 'imecemirac7@gmail.com');
// ==========================================

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Form verilerini alalım ve temizleyelim
    $fullname = strip_tags(trim($_POST["fullname"] ?? ''));
    $phone = strip_tags(trim($_POST["phone"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST["subject"] ?? ''));
    $message = trim($_POST["message"] ?? '');

    $is_ajax = isset($_POST['ajax']) || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest');

    // Boş alan kontrolü
    if (empty($fullname) || empty($phone) || empty($email) || empty($subject) || empty($message)) {
        $error_msg = "Lütfen formdaki tüm alanları doldurun.";
        if ($is_ajax) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(["status" => "error", "message" => $error_msg]);
            exit;
        } else {
            echo "<script>alert('$error_msg'); window.history.back();</script>";
            exit;
        }
    }

    // E-posta başlığı
    $email_subject = "Web Sitesi Test Mesajı: " . $subject;

    // E-posta içeriği (Düz metin formatında)
    $email_content = "Web sitenizin iletişim formundan yeni bir mesaj gönderildi:\n\n";
    $email_content .= "Ad Soyad: $fullname\n";
    $email_content .= "Telefon: $phone\n";
    $email_content .= "E-posta: $email\n";
    $email_content .= "Hizmet Konusu: $subject\n\n";
    $email_content .= "Mesaj:\n$message\n";

    // SMTP ile Gönderim
    $mail = new PHPMailer(true);

    try {
        // Sunucu Ayarları
        $mail->SMTPDebug = SMTP::DEBUG_OFF;                      // SMTP hata çıktılarını kapatıyoruz (aktif etmek için SMTP::DEBUG_SERVER)
        $mail->isSMTP();                                         // SMTP kullanarak gönder
        $mail->Host       = SMTP_HOST;                           // SMTP sunucusu
        $mail->SMTPAuth   = true;                                // SMTP kimlik doğrulamayı aç
        $mail->Username   = SMTP_USER;                           // SMTP kullanıcı adı
        $mail->Password   = SMTP_PASS;                           // SMTP şifresi
        $mail->SMTPSecure = SMTP_SECURE;                         // Şifreleme yöntemi
        $mail->Port       = SMTP_PORT;                           // SMTP portu
        $mail->CharSet    = 'UTF-8';                             // Türkçe karakter desteği

        // Alıcılar
        $mail->setFrom(SMTP_USER, 'Ozturk Orman Muh. Formu');
        $mail->addAddress(TO_EMAIL);                             // Mesajı alacak adres
        $mail->addReplyTo($email, $fullname);                    // Kullanıcı yanıtla dediğinde form sahibine yanıt dönsün

        // İçerik
        $mail->isHTML(false);                                    // HTML mail olmasın düz metin olsun
        $mail->Subject = $email_subject;
        $mail->Body    = $email_content;

        $mail->send();

        // Başarılı gönderim yanıtı
        $success_msg = "Mesajınız başarıyla gönderildi!";
        if ($is_ajax) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(["status" => "success", "message" => $success_msg]);
            exit;
        } else {
            echo "<script>
                    alert('$success_msg');
                    window.location.href='index.html';
                  </script>";
        }

    } catch (Exception $e) {
        // Hata yanıtı
        $error_msg = "Mail gönderilemedi. Hata: " . $mail->ErrorInfo;
        if ($is_ajax) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(["status" => "error", "message" => $error_msg]);
            exit;
        } else {
            echo "<script>
                    alert('Mail gönderilemedi. Lütfen sunucu ayarlarını kontrol edin.');
                    window.location.href='index.html';
                  </script>";
        }
    }
} else {
    header("Location: index.html");
}
?>