document.addEventListener('DOMContentLoaded', () => {
    const navigationGrid = document.querySelector('.navigation-grid');

    const sites = [
        {
            name: "Bölüm 0: Hazırlık",
            folder: "Bölüm 0 Öncelikle Çemberi Anlamak İçin Gerekli Temel Konular (Hazırlık)",
            icon: "fas fa-drafting-compass" // Font Awesome ikonu
        },
        {
            name: "Bölüm 1: Temel Elemanlar",
            folder: "Bölüm 1 Çemberin Temel Elemanları ve Tanımlar",
            icon: "fas fa-ruler-combined"
        },
        {
            name: "Bölüm 2: Çemberde Açılar",
            folder: "Bölüm 2 Çemberde Açılar",
            icon: "fas fa-angle-double-right"
        },
        {
            name: "Bölüm 3: Uzunluk Bağıntıları",
            folder: "Bölüm 3 Çemberde Uzunluk Bağıntıları",
            icon: "fas fa-vector-square"
        },
        {
            name: "Bölüm 4: Çevre ve Alan",
            folder: "Bölüm 4 Çemberin Çevresi ve Dairenin Alanı",
            icon: "fas fa-calculator"
        },
        {
            name: "Öğrenme Stratejileri",
            folder: "Öğrenme Stratejileri ve İpuçları",
            icon: "fas fa-lightbulb"
        }
        // İhtiyaç duydukça buraya yeni bölümler ekleyebilirsiniz
    ];

    sites.forEach((site, index) => {
        const button = document.createElement('a');
        button.classList.add('nav-button');
        
        // DÜZELTİLMİŞ URL OLUŞTURMA:
        // Ana index.html dosyası /Cember/ dizinindeyse ve hedef
        // /Cember/çember/Bölüm X/index.html ise, göreceli yol aşağıdaki gibi olmalıdır.
        button.href = `./çember/${encodeURIComponent(site.folder)}/index.html`;
        
        const iconElement = document.createElement('i');
        iconElement.className = site.icon; // Font Awesome class'larını ata

        const textNode = document.createTextNode(site.name);

        button.appendChild(iconElement);
        button.appendChild(textNode);
        
        navigationGrid.appendChild(button);

        // Animasyonlu giriş için gecikme
        setTimeout(() => {
            button.classList.add('visible');
        }, 150 * (index + 1)); // Her buton biraz gecikmeli olarak belirir
    });

    // İsteğe bağlı: Fare imleci takibi için basit bir efekt (çok abartılı olmamalı)
    const container = document.querySelector('.container');
    if (container) { // Sadece container varsa çalışsın
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Çok hafif bir tilt efekti
            const tiltX = (y / rect.height) * 10; // Max 10 derece
            const tiltY = -(x / rect.width) * 10; // Max 10 derece

            container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
});