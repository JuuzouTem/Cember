document.addEventListener('DOMContentLoaded', () => {
    // Genel Göster/Gizle Butonları
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        const targetId = button.getAttribute('data-target');
        const contentWrapper = document.getElementById(targetId);

        if (!contentWrapper) {
            console.warn(`Target element with ID '${targetId}' not found for a button.`);
            return;
        }

        const header = button.closest('.tip-header');

        const toggleContent = () => {
            contentWrapper.classList.toggle('open');
            if (contentWrapper.classList.contains('open')) {
                button.textContent = 'GİZLE';
            } else {
                button.textContent = 'GÖSTER';
            }
        };

        button.addEventListener('click', toggleContent);

        if (header) {
            header.addEventListener('click', (e) => {
                if (e.target !== button && !button.contains(e.target)) {
                    toggleContent();
                }
            });
        }
    });

    // Tip 1: Çizin!
    const cizimGosterBtn = document.getElementById('cizimGosterBtn');
    const cizimAlani = document.getElementById('cizimAlani');
    if (cizimGosterBtn && cizimAlani) {
        cizimGosterBtn.addEventListener('click', () => {
            cizimAlani.classList.toggle('hidden');
        });
    } else if (cizimGosterBtn && !cizimAlani) {
        console.warn("Button 'cizimGosterBtn' found, but target 'cizimAlani' not found.");
    }


    // Tip 2: Yardımcı Çizgiler
    const yardimciCizgiBtn = document.getElementById('yardimciCizgiBtn');
    const yardimciCizgiAlani = document.getElementById('yardimciCizgiAlani');
    if (yardimciCizgiBtn && yardimciCizgiAlani) {
        yardimciCizgiBtn.addEventListener('click', () => {
            yardimciCizgiAlani.classList.toggle('hidden');
        });
    }

    // Tip 3: Üçgenleri Arayın
    const ucgenButtons = document.querySelectorAll('.ucgen-btn');
    const ucgenCevap = document.getElementById('ucgenCevap');
    if (ucgenButtons.length > 0 && ucgenCevap) {
        ucgenButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tur = button.getAttribute('data-ucgen');
                let mesaj = '';
                switch (tur) {
                    case 'dik':
                        mesaj = "Evet! Çapı gören çevre açı 90° olduğundan veya merkezden teğete çizilen yarıçap dik olduğundan dik üçgenler oluşabilir.";
                        break;
                    case 'ikizkenar':
                        mesaj = "Kesinlikle! İki yarıçap ve bir kirişten oluşan üçgenler (merkez açı üçgeni) ikizkenardır. Veya dışarıdan çizilen iki teğetin oluşturduğu üçgen...";
                        break;
                    case 'benzer':
                        mesaj = "Çok doğru! Açı-Açı benzerliği çember sorularında sıkça karşımıza çıkar (örn: kesişen kirişler, teğet-kesen durumu).";
                        break;
                }
                ucgenCevap.textContent = mesaj;
                ucgenCevap.className = 'feedback success';
            });
        });
    }
    
    // Tip 4: Temel Özellikleri Kullanın
    const ozellikKontrolBtn = document.getElementById('ozellikKontrolBtn');
    const temelOzellikSecimi = document.getElementById('temelOzellikSecimi');
    const ozellikCevap = document.getElementById('ozellikCevap');
    if (ozellikKontrolBtn && temelOzellikSecimi && ozellikCevap) {
        ozellikKontrolBtn.addEventListener('click', () => {
            if (temelOzellikSecimi.value === "dogru") {
                ozellikCevap.textContent = "Doğru! Yarıçap, teğete değme noktasında diktir.";
                ozellikCevap.className = 'feedback success';
            } else if (temelOzellikSecimi.value === "") {
                 ozellikCevap.textContent = "Lütfen bir seçim yapın.";
                ozellikCevap.className = 'feedback error';
            }
            else {
                ozellikCevap.textContent = "Tekrar dene. Resimdeki durum için en uygun özellik bu değil.";
                ozellikCevap.className = 'feedback error';
            }
        });
    }
    
    // Tip 5: "Neden?" Diye Sorun
    const nedenBtn = document.getElementById('nedenBtn');
    const nedenAlani = document.getElementById('nedenAlani');
    if (nedenBtn && nedenAlani) {
        nedenBtn.addEventListener('click', () => {
            nedenAlani.classList.toggle('hidden');
        });
    }

    // Tip 6: Bol Soru Çözün
    const soruSayisiInput = document.getElementById('soruSayisi');
    const soruMotivasyon = document.getElementById('soruMotivasyon');
    if (soruSayisiInput && soruMotivasyon) {
        soruSayisiInput.addEventListener('input', () => {
            const sayi = parseInt(soruSayisiInput.value);
             if (isNaN(sayi)) { 
                 soruMotivasyon.textContent = ""; 
                 return;
            }
            if (sayi < 0) soruSayisiInput.value = 0; 

            if (sayi === 0) {
                soruMotivasyon.textContent = "Haydi ilk sorunu çözerek başla!";
                soruMotivasyon.className = 'feedback';
            } else if (sayi > 0 && sayi <= 5) {
                soruMotivasyon.textContent = "Harika başlangıç! Devam et.";
                soruMotivasyon.className = 'feedback success';
            } else if (sayi > 5 && sayi <= 10) {
                soruMotivasyon.textContent = "Çok iyi gidiyorsun! Bu azimle başarı gelir.";
                soruMotivasyon.className = 'feedback success';
            } else if (sayi > 10) {
                soruMotivasyon.textContent = "Süpersin! Çember uzmanı olma yolundasın!";
                soruMotivasyon.className = 'feedback success';
            }
        });
    }
    
    // Tip 7: Bağlantı Kurun
    const baglantiBtn = document.getElementById('baglantiBtn');
    const baglantiCevap = document.getElementById('baglantiCevap');
    if (baglantiBtn && baglantiCevap) {
        baglantiBtn.addEventListener('click', () => {
            baglantiCevap.classList.toggle('hidden');
            // Sadece toggle yeterli, .success class'ı zaten HTML'de var veya CSS'den direkt atanabilir.
            // Eğer dinamik olarak eklenecekse:
            // if (!baglantiCevap.classList.contains('hidden')) {
            //     baglantiCevap.classList.add('success');
            // } else {
            //     baglantiCevap.classList.remove('success'); // Gizlenince class'ı kaldır
            // }
        });
    }
});