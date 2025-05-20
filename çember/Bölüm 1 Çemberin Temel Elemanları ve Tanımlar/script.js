const canvas = document.getElementById('circleCanvas');
const ctx = canvas.getContext('2d');
const infoTitle = document.getElementById('elementTitle');
const infoDescription = document.getElementById('elementDescription');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 100; // Sabit bir yarıçap

let currentElement = null;

// --- Temel Çizim Fonksiyonları ---
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircleBase() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPoint(x, y, label = '', color = 'red') {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    if (label) {
        ctx.fillStyle = 'black';
        ctx.font = "12px Arial";
        ctx.fillText(label, x + 8, y + 4);
    }
}

function drawLine(x1, y1, x2, y2, color = 'blue', lineWidth = 2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function drawArcSegment(startAngleRad, endAngleRad, color = 'orange', lineWidth = 3) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function fillShape(points, color = 'rgba(0, 128, 0, 0.3)') {
    if (points.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function fillArcShape(startAngleRad, endAngleRad, color = 'rgba(255, 165, 0, 0.3)') {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// --- Eleman Gösterme Fonksiyonları ---
function showElement(elementType) {
    currentElement = elementType;
    drawCurrentElement();
}

function drawCurrentElement() {
    clearCanvas();
    drawCircleBase(); // Her zaman ana çemberi çiz

    switch (currentElement) {
        case 'cember_temel':
            drawPoint(centerX, centerY, 'M (Merkez)');
            infoTitle.textContent = "Çember";
            infoDescription.textContent = "Düzlemde sabit bir noktaya (Merkez - M) eşit uzaklıkta bulunan noktaların geometrik yeridir.";
            break;

        case 'yaricap':
            drawPoint(centerX, centerY, 'M');
            const angleR = degreesToRadians(30); // Örnek bir açı
            const xR = centerX + radius * Math.cos(angleR);
            const yR = centerY + radius * Math.sin(angleR);
            drawLine(centerX, centerY, xR, yR, 'red');
            drawPoint(xR, yR, 'P');
            infoTitle.textContent = "Yarıçap (r)";
            infoDescription.textContent = "Merkezin çember üzerindeki herhangi bir noktaya olan uzaklığıdır. MP doğru parçası bir yarıçaptır.";
            break;

        case 'cap':
            drawPoint(centerX, centerY, 'M');
            const angleD1 = degreesToRadians(0);
            const angleD2 = degreesToRadians(180);
            const xD1 = centerX + radius * Math.cos(angleD1);
            const yD1 = centerY + radius * Math.sin(angleD1);
            const xD2 = centerX + radius * Math.cos(angleD2);
            const yD2 = centerY + radius * Math.sin(angleD2);
            drawLine(xD1, yD1, xD2, yD2, 'green');
            drawPoint(xD1, yD1, 'A');
            drawPoint(xD2, yD2, 'B');
            infoTitle.textContent = "Çap (2r veya R)";
            infoDescription.textContent = "Merkezden geçen ve çemberin iki noktasını birleştiren doğru parçasıdır (AB). En uzun kiriştir ve yarıçapın iki katıdır.";
            break;

        case 'kiris':
        case 'yay':
        case 'cember_parcasi':
            const kirisYPos = parseInt(document.getElementById('kirisY').value);
            if (Math.abs(kirisYPos) < radius) {
                const halfChordLength = Math.sqrt(radius * radius - kirisYPos * kirisYPos);
                const xK1 = centerX - halfChordLength;
                const yK = centerY + kirisYPos;
                const xK2 = centerX + halfChordLength;

                drawLine(xK1, yK, xK2, yK, 'purple'); // Kiriş
                drawPoint(xK1, yK, 'A');
                drawPoint(xK2, yK, 'B');
                
                const startAngleK = Math.atan2(yK - centerY, xK1 - centerX);
                const endAngleK = Math.atan2(yK - centerY, xK2 - centerX);

                if (currentElement === 'yay' || currentElement === 'cember_parcasi') {
                    // Minör yayı çiz
                    drawArcSegment(startAngleK, endAngleK, 'orange', 4);
                    infoTitle.textContent = "Yay";
                    infoDescription.textContent = "Çember üzerindeki iki nokta (A, B) arasında kalan çember parçasıdır. Turuncu ile gösterilen minör yaydır.";
                    
                    if (currentElement === 'cember_parcasi') {
                         // Çember parçasını doldurmak için arc metoduyla path oluştur
                        ctx.beginPath();
                        ctx.moveTo(xK1, yK);
                        ctx.arc(centerX, centerY, radius, startAngleK, endAngleK, false); // false for clockwise to match chord
                        ctx.closePath();
                        ctx.fillStyle = 'rgba(128, 0, 128, 0.3)'; // Morumsu bir dolgu
                        ctx.fill();
                        infoTitle.textContent = "Çember Parçası (Daire Kesmesi)";
                        infoDescription.textContent = "Bir kiriş (AB) ile bu kirişin ayırdığı yay arasında kalan bölgedir.";
                    }
                } else {
                    infoTitle.textContent = "Kiriş";
                    infoDescription.textContent = "Çember üzerinde farklı iki noktayı (A, B) birleştiren doğru parçasıdır. Merkeze yaklaştıkça uzunluğu artar.";
                }
            } else {
                infoTitle.textContent = "Kiriş";
                infoDescription.textContent = "Kiriş Y konumu çemberin dışına çıktı. Lütfen değeri düşürün.";
            }
            break;

        case 'kesen':
            const kesenYPos = parseInt(document.getElementById('kesenY').value);
            drawLine(0, centerY + kesenYPos, canvas.width, centerY + kesenYPos, 'teal', 2);
             // Kesişim noktalarını bul (basit yatay kesen için)
            if (Math.abs(kesenYPos) < radius) {
                const halfIntersectLength = Math.sqrt(radius*radius - kesenYPos*kesenYPos);
                drawPoint(centerX - halfIntersectLength, centerY + kesenYPos, 'P1');
                drawPoint(centerX + halfIntersectLength, centerY + kesenYPos, 'P2');
            }
            infoTitle.textContent = "Kesen";
            infoDescription.textContent = "Çemberi farklı iki noktada (P1, P2) kesen doğrudur. Kiriş, kesenin çember içinde kalan parçasıdır.";
            break;
            
        case 'teget':
        case 'normal':
            const tegetAngleDeg = parseInt(document.getElementById('tegetAci').value);
            const tegetAngleRad = degreesToRadians(tegetAngleDeg);
            
            const touchX = centerX + radius * Math.cos(tegetAngleRad);
            const touchY = centerY + radius * Math.sin(tegetAngleRad);
            
            drawPoint(touchX, touchY, 'T (Değme N.)', 'darkred');

            // Teğet doğrusu için: yarıçapa dik
            // Yarıçapın eğimi m_r = (touchY - centerY) / (touchX - centerX)
            // Teğetin eğimi m_t = -1 / m_r
            // Basitleştirilmiş: teğet çizgisi (-sin, cos) yön vektörüne sahiptir
            const tegetX1 = touchX - 50 * Math.sin(tegetAngleRad); // Uzunluk 50 birim
            const tegetY1 = touchY + 50 * Math.cos(tegetAngleRad);
            const tegetX2 = touchX + 50 * Math.sin(tegetAngleRad);
            const tegetY2 = touchY - 50 * Math.cos(tegetAngleRad);
            drawLine(tegetX1, tegetY1, tegetX2, tegetY2, 'darkgreen', 2);
            
            if (currentElement === 'normal') {
                // Normal, yarıçapın uzantısıdır
                const normalX1 = centerX;
                const normalY1 = centerY;
                // Yarıçapın dışına doğru biraz uzatalım
                const normalX2 = touchX + 30 * Math.cos(tegetAngleRad); 
                const normalY2 = touchY + 30 * Math.sin(tegetAngleRad);
                drawLine(normalX1, normalY1, normalX2, normalY2, 'blue', 1.5); // Yarıçapı da çizerek normali göster
                drawPoint(centerX,centerY,'M');
                infoTitle.textContent = "Normal";
                infoDescription.textContent = "Teğetin değme noktasında (T) teğete dik olan doğrudur. Çemberin normali her zaman merkezden (M) geçer.";
            } else {
                 infoTitle.textContent = "Teğet";
                 infoDescription.textContent = "Çemberi yalnızca bir noktada (T - değme noktası) kesen doğrudur. Yarıçap, değme noktasında teğete diktir.";
            }
            break;

        case 'daire_dilimi':
            const sektorAci1Deg = parseInt(document.getElementById('sektorAci1').value);
            const sektorAci2Deg = parseInt(document.getElementById('sektorAci2').value);
            let startRad = degreesToRadians(sektorAci1Deg);
            let endRad = degreesToRadians(sektorAci2Deg);

            if (startRad > endRad) { // Açıların doğru sırada olmasını sağla
                 [startRad, endRad] = [endRad, startRad];
            }
            
            fillArcShape(startRad, endRad, 'rgba(255, 193, 7, 0.5)'); // Sarımsı bir dolgu
            
            // Sektörün kenarlarını oluşturan yarıçapları çiz
            const xS1 = centerX + radius * Math.cos(startRad);
            const yS1 = centerY + radius * Math.sin(startRad);
            const xS2 = centerX + radius * Math.cos(endRad);
            const yS2 = centerY + radius * Math.sin(endRad);

            drawLine(centerX, centerY, xS1, yS1, 'maroon');
            drawLine(centerX, centerY, xS2, yS2, 'maroon');
            drawPoint(centerX, centerY, 'M');
            drawPoint(xS1, yS1, 'A');
            drawPoint(xS2, yS2, 'B');

            infoTitle.textContent = "Daire Dilimi (Sektör)";
            infoDescription.textContent = "İki yarıçap (MA, MB) ve bu yarıçapların uçları arasındaki yay (AB yayı) ile sınırlanan bölgedir.";
            break;
    }
}

function resetCanvas() {
    currentElement = null;
    clearCanvas();
    drawCircleBase();
    infoTitle.textContent = "Bilgi";
    infoDescription.textContent = "Göstermek istediğiniz bir eleman seçin.";
    // Sliderları varsayılan değerlerine döndürebilirsiniz isterseniz
    document.getElementById('kirisY').value = 0;
    document.getElementById('kesenY').value = 30;
    document.getElementById('tegetAci').value = 45;
    document.getElementById('sektorAci1').value = 0;
    document.getElementById('sektorAci2').value = 90;
}

// Başlangıçta temel çemberi çiz
window.onload = () => {
    showElement('cember_temel');
};