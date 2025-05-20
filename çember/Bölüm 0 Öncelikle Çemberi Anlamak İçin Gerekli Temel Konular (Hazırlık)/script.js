document.addEventListener('DOMContentLoaded', function() {
    const konuAlani = document.getElementById('konuAlani');

    // PDF'ten alacağın bilgileri bu diziye ekle.
    // Her bir konu bir obje olmalı: { baslik: "...", aciklama: "..." }
    const konular = [
        {
            baslik: "1. Nokta, Doğru, Düzlem ve Uzay Kavramları",
            aciklama: "<p><strong>Nokta:</strong> Boyutsuz, tanımsız bir geometrik terimdir. Kalemin ucunun kağıtta bıraktığı iz gibi düşünülebilir. Büyük harflerle (A, B, C...) gösterilir.</p>" +
                      "<p><strong>Doğru:</strong> İki yönde sonsuza kadar uzanan, aynı hizada bulunan noktalar kümesidir. Genellikle küçük harflerle (d, k, l...) veya üzerindeki iki nokta ile (AB doğrusu) gösterilir.</p>" +
                      "<p><strong>Düzlem:</strong> Her yönde sonsuza kadar uzanan, iki boyutlu (eni ve boyu olan ama kalınlığı olmayan) yüzeydir. Genellikle P, Q, E gibi büyük harflerle gösterilir.</p>" +
                      "<p><strong>Uzay:</strong> Tüm noktaların kümesidir. Üç boyutludur (en, boy, yükseklik).</p>"
        },
        {
            baslik: "2. Açı Kavramı ve Açı Çeşitleri",
            aciklama: "<p><strong>Açı:</strong> Başlangıç noktaları ortak olan iki ışının birleşim kümesidir. Işınlara açının kolları, ortak başlangıç noktasına açının köşesi denir.</p>" +
                      "<p><strong>Açı Çeşitleri:</strong></p>" +
                      "<ul>" +
                      "<li><strong>Dar Açı:</strong> Ölçüsü 0° ile 90° arasında olan açıdır.</li>" +
                      "<li><strong>Dik Açı:</strong> Ölçüsü tam olarak 90° olan açıdır.</li>" +
                      "<li><strong>Geniş Açı:</strong> Ölçüsü 90° ile 180° arasında olan açıdır.</li>" +
                      "<li><strong>Doğru Açı:</strong> Ölçüsü tam olarak 180° olan açıdır.</li>" +
                      "<li><strong>Tam Açı:</strong> Ölçüsü tam olarak 360° olan açıdır.</li>" +
                      "</ul>"
        },
        {
            baslik: "3. Üçgenler ve Temel Elemanları",
            aciklama: "<p><strong>Üçgen:</strong> Doğrusal olmayan üç noktanın ikişer ikişer birleştirilmesiyle oluşan kapalı geometrik şekildir.</p>" +
                      "<p><strong>Temel Elemanları:</strong></p>" +
                      "<ul>" +
                      "<li><strong>Köşeler:</strong> A, B, C gibi noktalar.</li>" +
                      "<li><strong>Kenarlar:</strong> [AB], [BC], [CA] doğru parçaları. Kenar uzunlukları a, b, c ile gösterilir.</li>" +
                      "<li><strong>İç Açılar:</strong> Üçgenin içinde kalan açılar. Toplamları 180°'dir.</li>" +
                      "<li><strong>Dış Açılar:</strong> İç açıların bütünleri olan açılar.</li>" +
                      "</ul>"
        },
        {
            baslik: "4. Pisagor Teoremi",
            aciklama: "<p><strong>Pisagor Teoremi:</strong> Bir dik üçgende, dik kenarların uzunluklarının karelerinin toplamı, hipotenüsün (dik açının karşısındaki kenar) uzunluğunun karesine eşittir.</p>" +
                      "<p>Eğer dik kenarlar 'a' ve 'b', hipotenüs 'c' ise, teorem şu şekilde ifade edilir: <strong>a² + b² = c²</strong></p>" +
                      "<p>Bu teorem, dik üçgenlerde kenar uzunlukları arasında ilişki kurmak için çok önemlidir.</p>"
        },
        {
            baslik: "5. Temel Geometrik Şekillerin (Kare, Dikdörtgen) Alan ve Çevre Hesapları",
            aciklama: "<p><strong>Kare:</strong></p>" +
                      "<ul>" +
                      "<li>Bütün kenarları eşit uzunlukta ve bütün iç açıları 90° olan dörtgendir.</li>" +
                      "<li>Bir kenar uzunluğu 'a' ise: Çevre = 4a, Alan = a²</li>" +
                      "</ul>" +
                      "<p><strong>Dikdörtgen:</strong></p>" +
                      "<ul>" +
                      "<li>Karşılıklı kenarları eşit uzunlukta ve bütün iç açıları 90° olan dörtgendir.</li>" +
                      "<li>Kısa kenarı 'a', uzun kenarı 'b' ise: Çevre = 2(a+b), Alan = a * b</li>" +
                      "</ul>"
        }
        // ... PDF'teki diğer konuları buraya ekleyebilirsin
    ];

    konular.forEach(konu => {
        const konuItem = document.createElement('div');
        konuItem.classList.add('konu-item');

        const konuBaslik = document.createElement('div');
        konuBaslik.classList.add('konu-baslik');
        konuBaslik.innerHTML = `<span>${konu.baslik}</span><span class="isaret">▶</span>`; // Veya istersen '+' kullanabilirsin

        const konuIcerik = document.createElement('div');
        konuIcerik.classList.add('konu-icerik');
        konuIcerik.innerHTML = konu.aciklama; // HTML içeriği doğrudan atıyoruz

        konuItem.appendChild(konuBaslik);
        konuItem.appendChild(konuIcerik);
        konuAlani.appendChild(konuItem);

        konuBaslik.addEventListener('click', function() {
            // Eğer zaten aktifse kapat, değilse aç ve diğerlerini kapat (akordiyon etkisi)
            const suAnAktifMi = konuItem.classList.contains('aktif');

            // Tüm aktifleri kapat
            document.querySelectorAll('.konu-item.aktif').forEach(aktifOge => {
                if (aktifOge !== konuItem) { // Tıklanan hariç diğerlerini kapat
                    aktifOge.classList.remove('aktif');
                }
            });
            
            // Tıklananı aç/kapat
            if (suAnAktifMi) {
                konuItem.classList.remove('aktif');
            } else {
                konuItem.classList.add('aktif');
            }
        });
    });
});