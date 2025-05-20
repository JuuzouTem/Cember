document.addEventListener('DOMContentLoaded', () => {
    const radiusInput = document.getElementById('radius');
    const angleInput = document.getElementById('angle');
    const calculateButton = document.getElementById('calculateButton');

    const circumferenceResultSpan = document.getElementById('circumferenceResult');
    const areaResultSpan = document.getElementById('areaResult');
    const arcLengthResultSpan = document.getElementById('arcLengthResult');
    const sectorAreaAngleResultSpan = document.getElementById('sectorAreaAngleResult');
    const sectorAreaArcLengthResultSpan = document.getElementById('sectorAreaArcLengthResult');

    const PI = Math.PI;

    calculateButton.addEventListener('click', () => {
        const r = parseFloat(radiusInput.value);
        const alphaDegrees = parseFloat(angleInput.value); // Açı derece cinsinden

        // Girdi kontrolü
        if (isNaN(r) || r <= 0) {
            alert("Lütfen geçerli bir pozitif yarıçap değeri girin.");
            clearResults();
            return;
        }

        // 1. Çemberin Çevresi
        const circumference = 2 * PI * r;
        circumferenceResultSpan.textContent = circumference.toFixed(3);

        // 2. Dairenin Alanı
        const area = PI * Math.pow(r, 2);
        areaResultSpan.textContent = area.toFixed(3);

        // Açı girdisi kontrolü (yay ve dilim için)
        if (isNaN(alphaDegrees) || alphaDegrees < 0 || alphaDegrees > 360) {
            arcLengthResultSpan.textContent = "- (Geçerli açı girin)";
            sectorAreaAngleResultSpan.textContent = "- (Geçerli açı girin)";
            sectorAreaArcLengthResultSpan.textContent = "-";
            // Açı olmadan daire dilimi için yay uzunluğu ile hesaplama yapılamaz
            if (!(isNaN(alphaDegrees) || alphaDegrees < 0 || alphaDegrees > 360)) { // Sadece açı geçerli değilse
                 sectorAreaArcLengthResultSpan.textContent = "- (Önce yay uzunluğu hesaplanmalı)";
            }
            return; // Sadece açısal hesaplamaları etkiler, çevre ve alan yine gösterilir
        }


        // 3. Yay Uzunluğu
        // Formül: L = (α / 360) * 2 * π * r
        const arcLength = (alphaDegrees / 360) * 2 * PI * r;
        arcLengthResultSpan.textContent = arcLength.toFixed(3);

        // 4. Daire Diliminin Alanı
        // Formül (Açı ile): A_dilim = (α / 360) * π * r²
        const sectorAreaAngle = (alphaDegrees / 360) * PI * Math.pow(r, 2);
        sectorAreaAngleResultSpan.textContent = sectorAreaAngle.toFixed(3);

        // Formül (Yay Uzunluğu ile): A_dilim = (L * r) / 2
        // Yukarıda hesapladığımız arcLength'i kullanıyoruz.
        if (arcLength > 0) { // Yay uzunluğu hesaplandıysa
             const sectorAreaArc = (arcLength * r) / 2;
             sectorAreaArcLengthResultSpan.textContent = sectorAreaArc.toFixed(3);
        } else {
             sectorAreaArcLengthResultSpan.textContent = "- (Yay uzunluğu 0 veya hesaplanamadı)";
        }

    });

    function clearResults() {
        circumferenceResultSpan.textContent = "-";
        areaResultSpan.textContent = "-";
        arcLengthResultSpan.textContent = "-";
        sectorAreaAngleResultSpan.textContent = "-";
        sectorAreaArcLengthResultSpan.textContent = "-";
    }

    // Girdiler değiştiğinde sonuçları temizle (opsiyonel, kullanıcı deneyimi için)
    radiusInput.addEventListener('input', clearResultsIfInvalid);
    angleInput.addEventListener('input', clearResultsIfInvalid);

    function clearResultsIfInvalid() {
        const r = parseFloat(radiusInput.value);
        const alphaDegrees = parseFloat(angleInput.value);
        if (isNaN(r) || r <= 0 || isNaN(alphaDegrees) || alphaDegrees < 0 || alphaDegrees > 360) {
            // Eğer bir girdi geçersizse tümünü temizleyebilir veya sadece ilgili olanları
            // Şimdilik tümünü temizleyelim ki kullanıcı yeni hesaplama yapsın
            clearResults();
        }
    }
});