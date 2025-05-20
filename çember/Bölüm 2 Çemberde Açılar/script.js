// --- Yardımcı Fonksiyonlar ---
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function drawCircle(ctx, x, y, radius, color = '#0056b3') {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawArc(ctx, x, y, radius, startAngleRad, endAngleRad, color = '#d9534f', lineWidth = 3, label = '', labelOffset = 15) {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngleRad, endAngleRad);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    if (label) {
        const midAngle = (startAngleRad + endAngleRad) / 2;
        // Ensure consistent labeling for full circle arcs or very small arcs
        let effectiveRadius = radius + labelOffset;
        if (Math.abs(endAngleRad - startAngleRad) >= 2 * Math.PI - 0.1) { // Almost full circle
            effectiveRadius = radius + labelOffset + 10; // Push label further out
        } else if (Math.abs(endAngleRad - startAngleRad) < 0.1 && Math.abs(endAngleRad - startAngleRad) > 0.01) { // very small arc
             effectiveRadius = radius + labelOffset - 5;
        }


        const labelX = x + effectiveRadius * Math.cos(midAngle);
        const labelY = y + effectiveRadius * Math.sin(midAngle);
        ctx.fillStyle = color;
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, labelX, labelY);
    }
}

function drawLine(ctx, x1, y1, x2, y2, color = '#333', lineWidth = 2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function drawText(ctx, text, x, y, color = '#333', size = "16px") {
    ctx.fillStyle = color;
    ctx.font = size + " Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; // More consistent vertical alignment
    ctx.fillText(text, x, y);
}

function drawAngleMarker(ctx, centerX, centerY, radius, startAngleRad, endAngleRad, angleLabel = '', color = 'rgba(0, 100, 0, 0.3)') {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    if (angleLabel) {
        // Ensure the angle for the label is correctly calculated
        let midAngle = (startAngleRad + endAngleRad) / 2;
        // Handle cases where the arc crosses the 0-radian line
        if (endAngleRad < startAngleRad) { // e.g. start=350deg, end=10deg
            midAngle = (startAngleRad + endAngleRad + 2 * Math.PI) / 2;
        }

        const labelRadius = radius * 0.6;
        const labelX = centerX + labelRadius * Math.cos(midAngle);
        const labelY = centerY + labelRadius * Math.sin(midAngle);
        ctx.fillStyle = '#000';
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(angleLabel, labelX, labelY);
    }
}


// --- Merkez Açı ---
const centralAngleCanvas = document.getElementById('centralAngleCanvas');
const centralAngleCtx = centralAngleCanvas.getContext('2d');
const centralAngleSlider = document.getElementById('centralAngleSlider');
const centralAngleValue = document.getElementById('centralAngleValue');
const centralAngleResult = document.getElementById('centralAngleResult');
const centralArcResult = document.getElementById('centralArcResult');

const cRadius = 80;
const cCenterX = centralAngleCanvas.width / 2;
const cCenterY = centralAngleCanvas.height / 2 - 10; // Make space for text

function drawCentralAngle() {
    const angleDeg = parseInt(centralAngleSlider.value);
    centralAngleValue.textContent = angleDeg + "°";
    centralAngleResult.textContent = angleDeg + "°";
    centralArcResult.textContent = angleDeg + "°";

    centralAngleCtx.clearRect(0, 0, centralAngleCanvas.width, centralAngleCanvas.height);
    drawCircle(centralAngleCtx, cCenterX, cCenterY, cRadius);
    drawText(centralAngleCtx, "Merkez (O)", cCenterX, cCenterY + 5, '#0056b3', "12px");


    const startAngle = degToRad(-angleDeg / 2); // Start from symmetric position
    const endAngle = degToRad(angleDeg / 2);

    const p1x = cCenterX + cRadius * Math.cos(startAngle);
    const p1y = cCenterY + cRadius * Math.sin(startAngle);
    const p2x = cCenterX + cRadius * Math.cos(endAngle);
    const p2y = cCenterY + cRadius * Math.sin(endAngle);

    drawLine(centralAngleCtx, cCenterX, cCenterY, p1x, p1y); // Radius 1
    drawLine(centralAngleCtx, cCenterX, cCenterY, p2x, p2y); // Radius 2
    drawText(centralAngleCtx, "A", p1x + 10 * Math.cos(startAngle), p1y + 10 * Math.sin(startAngle), '#333', "14px");
    drawText(centralAngleCtx, "B", p2x + 10 * Math.cos(endAngle), p2y + 10 * Math.sin(endAngle), '#333', "14px");


    drawArc(centralAngleCtx, cCenterX, cCenterY, cRadius, startAngle, endAngle, '#d9534f', 3, angleDeg + "° yay");
    drawAngleMarker(centralAngleCtx, cCenterX, cCenterY, cRadius * 0.3, startAngle, endAngle, angleDeg + "°");
}
centralAngleSlider.addEventListener('input', drawCentralAngle);
drawCentralAngle();

// --- Çevre Açı ---
const inscribedAngleCanvas = document.getElementById('inscribedAngleCanvas');
const inscribedAngleCtx = inscribedAngleCanvas.getContext('2d');
const inscribedArcSlider = document.getElementById('inscribedArcSlider');
const inscribedArcValue = document.getElementById('inscribedArcValue');
const inscribedAngleResult = document.getElementById('inscribedAngleResult');
const inscribedArcResult2 = document.getElementById('inscribedArcResult2');


const iRadius = 80;
const iCenterX = inscribedAngleCanvas.width / 2;
const iCenterY = inscribedAngleCanvas.height / 2;

function drawInscribedAngle() {
    const arcDeg = parseInt(inscribedArcSlider.value);
    const angleDeg = arcDeg / 2;
    inscribedArcValue.textContent = arcDeg + "°";
    inscribedAngleResult.textContent = angleDeg.toFixed(1) + "°";
    inscribedArcResult2.textContent = arcDeg + "°";

    inscribedAngleCtx.clearRect(0, 0, inscribedAngleCanvas.width, inscribedAngleCanvas.height);
    drawCircle(inscribedAngleCtx, iCenterX, iCenterY, iRadius);

    // Arc points (A and B)
    const arcStartAngleRad = degToRad(-arcDeg / 2 + 90); // Shifted for better visualization
    const arcEndAngleRad = degToRad(arcDeg / 2 + 90);
    const pAx = iCenterX + iRadius * Math.cos(arcStartAngleRad);
    const pAy = iCenterY + iRadius * Math.sin(arcStartAngleRad);
    const pBx = iCenterX + iRadius * Math.cos(arcEndAngleRad);
    const pBy = iCenterY + iRadius * Math.sin(arcEndAngleRad);

    // Vertex point (C) - fixed for simplicity, could be dynamic
    const pCx = iCenterX + iRadius * Math.cos(degToRad(270)); // Bottom of the circle
    const pCy = iCenterY + iRadius * Math.sin(degToRad(270));

    drawLine(inscribedAngleCtx, pCx, pCy, pAx, pAy); // Chord CA
    drawLine(inscribedAngleCtx, pCx, pCy, pBx, pBy); // Chord CB

    drawText(inscribedAngleCtx, "A", pAx - 15 * Math.cos(arcStartAngleRad), pAy - 15 * Math.sin(arcStartAngleRad), '#333', "14px");
    drawText(inscribedAngleCtx, "B", pBx - 15 * Math.cos(arcEndAngleRad), pBy - 15 * Math.sin(arcEndAngleRad), '#333', "14px");
    drawText(inscribedAngleCtx, "C", pCx, pCy + 15, '#333', "14px");


    drawArc(inscribedAngleCtx, iCenterX, iCenterY, iRadius, arcStartAngleRad, arcEndAngleRad, '#d9534f', 3, arcDeg + "° yay");
    
    // Angle marker at C
    const angleMarkerRadius = 20;
    let angleAtCStart = Math.atan2(pAy-pCy, pAx-pCx);
    let angleAtCEnd = Math.atan2(pBy-pCy, pBx-pCx);

    // Use the robust marker which handles angle direction
    drawRobustAngleMarker(inscribedAngleCtx, pCx, pCy, angleMarkerRadius, angleAtCStart, angleAtCEnd, angleDeg, angleDeg.toFixed(0) + "°");
}
inscribedArcSlider.addEventListener('input', drawInscribedAngle);
drawInscribedAngle();

// --- Teğet-Kiriş Açı ---
const tangentChordAngleCanvas = document.getElementById('tangentChordAngleCanvas');
const tangentChordCtx = tangentChordAngleCanvas.getContext('2d');
const tangentChordArcSlider = document.getElementById('tangentChordArcSlider');
const tangentChordArcValue = document.getElementById('tangentChordArcValue');
const tangentChordAngleResult = document.getElementById('tangentChordAngleResult');
const tangentChordArcResult2 = document.getElementById('tangentChordArcResult2');

const tcRadius = 80;
const tcCenterX = tangentChordAngleCanvas.width / 2;
const tcCenterY = tangentChordAngleCanvas.height / 2;

function drawTangentChordAngle() {
    const arcDeg = parseInt(tangentChordArcSlider.value);
    const angleDeg = arcDeg / 2;
    tangentChordArcValue.textContent = arcDeg + "°";
    tangentChordAngleResult.textContent = angleDeg.toFixed(1) + "°";
    tangentChordArcResult2.textContent = arcDeg + "°";

    tangentChordCtx.clearRect(0, 0, tangentChordAngleCanvas.width, tangentChordAngleCanvas.height);
    drawCircle(tangentChordCtx, tcCenterX, tcCenterY, tcRadius);

    // Tangent point A (fixed at the left for simplicity)
    const tangentPointAngleRad = degToRad(180);
    const pAx = tcCenterX + tcRadius * Math.cos(tangentPointAngleRad);
    const pAy = tcCenterY + tcRadius * Math.sin(tangentPointAngleRad);
    drawText(tangentChordCtx, "A (Teğet N.)", pAx - 40, pAy + 5, '#333', "12px");


    // Tangent line (perpendicular to radius OA)
    // Radius OA is horizontal, so tangent is vertical. One end is T.
    const tangentLineEndY = pAy - tcRadius * 0.7; // "Upward" T
    drawLine(tangentChordCtx, pAx, pAy, pAx, tangentLineEndY, '#FF8C00', 2); // Tangent segment AT
    drawText(tangentChordCtx, "T", pAx, tangentLineEndY - 10, '#FF8C00', "12px"); // Label for tangent line


    // Chord point B
    const chordEndAngleRad = tangentPointAngleRad - degToRad(arcDeg); // Arc AB, going "down" from A (left point)
    const pBx = tcCenterX + tcRadius * Math.cos(chordEndAngleRad);
    const pBy = tcCenterY + tcRadius * Math.sin(chordEndAngleRad);
    drawLine(tangentChordCtx, pAx, pAy, pBx, pBy); // Chord AB
    drawText(tangentChordCtx, "B", pBx + 10, pBy - 10, '#333', "14px");

    drawArc(tangentChordCtx, tcCenterX, tcCenterY, tcRadius, chordEndAngleRad, tangentPointAngleRad, '#d9534f', 3, arcDeg + "° yay");
    
    // Angle marker at A (between tangent AT and chord AB)
    const tangentVectorAngle = Math.atan2(tangentLineEndY - pAy, pAx - pAx); // Angle of vector AT (pointing upwards from A)
    const chordVectorAngle = Math.atan2(pBy - pAy, pBx - pAx);   // Angle of vector AB

    drawRobustAngleMarker(tangentChordCtx, pAx, pAy, 25, tangentVectorAngle, chordVectorAngle, angleDeg, angleDeg.toFixed(0) + "°");
}
tangentChordArcSlider.addEventListener('input', drawTangentChordAngle);
drawTangentChordAngle();

// --- İç Açı --- (GÜNCELLENMİŞ FONKSİYON)
const interiorAngleCanvas = document.getElementById('interiorAngleCanvas');
const interiorAngleCtx = interiorAngleCanvas.getContext('2d');
const interiorArc1Slider = document.getElementById('interiorArc1Slider');
const interiorArc2Slider = document.getElementById('interiorArc2Slider');
const interiorArc1Value = document.getElementById('interiorArc1Value');
const interiorArc2Value = document.getElementById('interiorArc2Value');
const interiorAngleResult = document.getElementById('interiorAngleResult');
const interiorArc1Result = document.getElementById('interiorArc1Result');
const interiorArc2Result = document.getElementById('interiorArc2Result');

const intRadius = 90;
const intCenterX = interiorAngleCanvas.width / 2; // Çemberin merkezi O
const intCenterY = interiorAngleCanvas.height / 2;

function drawInteriorAngle() {
    const arcAB_deg = parseInt(interiorArc1Slider.value); // Slider 1: arc AB'nin ölçüsü
    const arcCD_deg = parseInt(interiorArc2Slider.value); // Slider 2: arc CD'nin ölçüsü
    const angleAPB_deg = (arcAB_deg + arcCD_deg) / 2; // Hesaplanacak iç açı (∠APB veya ∠DPC)

    interiorArc1Value.textContent = arcAB_deg + "°";
    interiorArc2Value.textContent = arcCD_deg + "°";
    interiorAngleResult.textContent = angleAPB_deg.toFixed(1) + "°";
    interiorArc1Result.textContent = arcAB_deg + "°";
    interiorArc2Result.textContent = arcCD_deg + "°";

    interiorAngleCtx.clearRect(0, 0, interiorAngleCanvas.width, interiorAngleCanvas.height);
    drawCircle(interiorAngleCtx, intCenterX, intCenterY, intRadius);

    // A, B, C, D noktalarını çember üzerinde tanımla
    // arcAB yayınını alt kısımda, arcCD yayınını üst kısımda ortalayalım
    // Yay AB (PDF'deki gibi)
    const angleA_rad = degToRad(270 - arcAB_deg / 2); // Start from bottom center, spread arcAB
    const angleB_rad = degToRad(270 + arcAB_deg / 2);
    // Yay CD (PDF'deki gibi)
    const angleC_rad = degToRad(90 - arcCD_deg / 2); // Start from top center, spread arcCD
    const angleD_rad = degToRad(90 + arcCD_deg / 2);

    const pA = { x: intCenterX + intRadius * Math.cos(angleA_rad), y: intCenterY + intRadius * Math.sin(angleA_rad) };
    const pB = { x: intCenterX + intRadius * Math.cos(angleB_rad), y: intCenterY + intRadius * Math.sin(angleB_rad) };
    const pC_for_chord = { x: intCenterX + intRadius * Math.cos(angleC_rad), y: intCenterY + intRadius * Math.sin(angleC_rad) }; // Bu C, AC kirişindeki C
    const pD_for_chord = { x: intCenterX + intRadius * Math.cos(angleD_rad), y: intCenterY + intRadius * Math.sin(angleD_rad) }; // Bu D, BD kirişindeki D


    // Kirişleri çiz: AC ve BD
    // Noktaları PDF'e göre isimlendirelim: A, B, C, D çember üzerinde. Kirişler AC ve BD. Kesişim P.
    // pA (eski pA) - arcAB'nin bir ucu
    // pC_for_chord (eski pC_arc) - arcCD'nin bir ucu
    // pB (eski pB) - arcAB'nin diğer ucu
    // pD_for_chord (eski pD_arc) - arcCD'nin diğer ucu

    drawLine(interiorAngleCtx, pA.x, pA.y, pC_for_chord.x, pC_for_chord.y); // Kiriş AC
    drawLine(interiorAngleCtx, pB.x, pB.y, pD_for_chord.x, pD_for_chord.y); // Kiriş BD


    // AC ve BD kirişlerinin kesişim noktası P'yi hesapla
    let Px, Py;
    // Line AC: (pA.x, pA.y) to (pC_for_chord.x, pC_for_chord.y)
    // Line BD: (pB.x, pB.y) to (pD_for_chord.x, pD_for_chord.y)
    const den = (pA.x - pC_for_chord.x) * (pB.y - pD_for_chord.y) - (pA.y - pC_for_chord.y) * (pB.x - pD_for_chord.x);
    if (Math.abs(den) < 0.0001) { // Neredeyse paralel veya çakışık
        Px = intCenterX; // Güvenli bir değere ayarla
        Py = intCenterY;
    } else {
        const t_num = (pA.x - pB.x) * (pB.y - pD_for_chord.y) - (pA.y - pB.y) * (pB.x - pD_for_chord.x);
        const u_num = -((pA.x - pC_for_chord.x) * (pA.y - pB.y) - (pA.y - pC_for_chord.y) * (pA.x - pB.x)); // Bu Px, Py için u parametresi

        const t = t_num / den;
        // const u = u_num / den; // Diğer çizgi için parametre, P'yi bulmak için t yeterli

        Px = pA.x + t * (pC_for_chord.x - pA.x);
        Py = pA.y + t * (pC_for_chord.y - pA.y);
    }
    drawText(interiorAngleCtx, "P", Px, Py - 10, '#000', "14px");


    // Yayları çiz: AB ve CD
    // angleA_rad, angleB_rad => yay AB (alt)
    // angleC_rad, angleD_rad => yay CD (üst)
    drawArc(interiorAngleCtx, intCenterX, intCenterY, intRadius, angleA_rad, angleB_rad, '#d9534f', 3, arcAB_deg + "°");
    drawArc(interiorAngleCtx, intCenterX, intCenterY, intRadius, angleC_rad, angleD_rad, '#FF8C00', 3, arcCD_deg + "°");

    // Nokta etiketleri (PDF'teki gibi)
    // A ve B, arcAB'nin uçları
    // C ve D, arcCD'nin uçları
    drawText(interiorAngleCtx, "A", pA.x + 10 * Math.cos(angleA_rad), pA.y + 10 * Math.sin(angleA_rad), '#333', "12px");
    drawText(interiorAngleCtx, "B", pB.x + 10 * Math.cos(angleB_rad), pB.y + 10 * Math.sin(angleB_rad), '#333', "12px");
    drawText(interiorAngleCtx, "C", pC_for_chord.x + 10 * Math.cos(angleC_rad), pC_for_chord.y + 10 * Math.sin(angleC_rad), '#333', "12px");
    drawText(interiorAngleCtx, "D", pD_for_chord.x + 10 * Math.cos(angleD_rad), pD_for_chord.y + 10 * Math.sin(angleD_rad), '#333', "12px");


    // Açı işaretleyici: ∠APB
    const vecPA_angle = Math.atan2(pA.y - Py, pA.x - Px);
    const vecPB_angle = Math.atan2(pB.y - Py, pB.x - Px);
    drawRobustAngleMarker(interiorAngleCtx, Px, Py, 25, vecPA_angle, vecPB_angle, angleAPB_deg, angleAPB_deg.toFixed(0) + "°");

    // Açı işaretleyici: Dikey açı ∠DPC
    const vecPD_angle = Math.atan2(pD_for_chord.y - Py, pD_for_chord.x - Px);
    const vecPC_angle = Math.atan2(pC_for_chord.y - Py, pC_for_chord.x - Px);
    drawRobustAngleMarker(interiorAngleCtx, Px, Py, 25, vecPD_angle, vecPC_angle, angleAPB_deg, angleAPB_deg.toFixed(0) + "°");
}
interiorArc1Slider.addEventListener('input', drawInteriorAngle);
interiorArc2Slider.addEventListener('input', drawInteriorAngle);
drawInteriorAngle(); // İlk çizim


// --- Dış Açı ---
const exteriorAngleCanvas = document.getElementById('exteriorAngleCanvas');
const exteriorAngleCtx = exteriorAngleCanvas.getContext('2d');
const exteriorAngleTypeSelect = document.getElementById('exteriorAngleType');
const secantControls = document.getElementById('secantControls');
const tangentControls = document.getElementById('tangentControls');
const exteriorFarArcSlider = document.getElementById('exteriorFarArcSlider');
const exteriorNearArcSlider = document.getElementById('exteriorNearArcSlider');
const exteriorMinorArcSlider = document.getElementById('exteriorMinorArcSlider');
const exteriorFarArcValue = document.getElementById('exteriorFarArcValue');
const exteriorNearArcValue = document.getElementById('exteriorNearArcValue');
const exteriorMinorArcValue = document.getElementById('exteriorMinorArcValue');
const exteriorAngleResult = document.getElementById('exteriorAngleResult');
const exteriorAngleExtraInfo = document.getElementById('exteriorAngleExtraInfo');


const extRadius = 80;
const extCenterX = exteriorAngleCanvas.width / 2 + 30; // Shift for external point
const extCenterY = exteriorAngleCanvas.height / 2;
const extPointX = 50; // External point P
const extPointY = extCenterY;

function drawExteriorAngle() {
    exteriorAngleCtx.clearRect(0, 0, exteriorAngleCanvas.width, exteriorAngleCanvas.height);
    drawCircle(exteriorAngleCtx, extCenterX, extCenterY, extRadius);
    drawText(exteriorAngleCtx, "P", extPointX - 15, extPointY, '#000', "14px");

    const type = exteriorAngleTypeSelect.value;
    let farArcDeg, nearArcDeg, angleDeg, minorArcDeg, majorArcDeg;

    if (type === "tangents") {
        tangentControls.style.display = "block";
        secantControls.style.display = "none";
        minorArcDeg = parseInt(exteriorMinorArcSlider.value);
        majorArcDeg = 360 - minorArcDeg;
        
        if (majorArcDeg < minorArcDeg) { // Should not happen with slider limit but good practice
            [majorArcDeg, minorArcDeg] = [minorArcDeg, majorArcDeg];
        }

        angleDeg = (majorArcDeg - minorArcDeg) / 2;
        
        exteriorMinorArcValue.textContent = minorArcDeg + "°";
        exteriorAngleResult.textContent = angleDeg.toFixed(1) + "°";
        exteriorAngleExtraInfo.textContent = `Büyük Yay: ${majorArcDeg}°, Küçük Yay: ${minorArcDeg}°. Açı + Küçük Yay = ${angleDeg.toFixed(1)}° + ${minorArcDeg}° = ${(angleDeg + minorArcDeg).toFixed(1)}° (180° olmalı)`;

        // Visualization for two tangents
        // Tangency points angle separation is minorArcDeg. Center the minor arc around 180 deg (left side)
        const tangentAngle1Rad = degToRad(180 - minorArcDeg / 2);
        const tangentAngle2Rad = degToRad(180 + minorArcDeg / 2);
        const t1x = extCenterX + extRadius * Math.cos(tangentAngle1Rad);
        const t1y = extCenterY + extRadius * Math.sin(tangentAngle1Rad);
        const t2x = extCenterX + extRadius * Math.cos(tangentAngle2Rad);
        const t2y = extCenterY + extRadius * Math.sin(tangentAngle2Rad);

        drawLine(exteriorAngleCtx, extPointX, extPointY, t1x, t1y, '#FF8C00'); // Tangent 1
        drawLine(exteriorAngleCtx, extPointX, extPointY, t2x, t2y, '#FF8C00'); // Tangent 2
        drawText(exteriorAngleCtx, "A", t1x -15, t1y - (t1y > extCenterY ? -5: 5), '#333', "12px");
        drawText(exteriorAngleCtx, "B", t2x -15, t2y + (t2y > extCenterY ? 5: -5), '#333', "12px");


        drawArc(exteriorAngleCtx, extCenterX, extCenterY, extRadius, tangentAngle1Rad, tangentAngle2Rad, '#d9534f', 3, minorArcDeg + "°");
        drawArc(exteriorAngleCtx, extCenterX, extCenterY, extRadius, tangentAngle2Rad, tangentAngle1Rad + 2*Math.PI, '#4CAF50', 3, majorArcDeg + "°", -20);
         
        const angleMarkerStart = Math.atan2(t1y - extPointY, t1x - extPointX);
        const angleMarkerEnd = Math.atan2(t2y - extPointY, t2x - extPointX);
        drawRobustAngleMarker(exteriorAngleCtx, extPointX, extPointY, 30, angleMarkerStart, angleMarkerEnd, angleDeg, angleDeg.toFixed(0) + "°");


    } else { // secants or tangent_secant
        tangentControls.style.display = "none";
        secantControls.style.display = "block";
        farArcDeg = parseInt(exteriorFarArcSlider.value);
        nearArcDeg = parseInt(exteriorNearArcSlider.value);

        if (farArcDeg <= nearArcDeg) {
            farArcDeg = nearArcDeg + 10; // Ensure far is greater
            exteriorFarArcSlider.value = farArcDeg;
        }
        exteriorFarArcValue.textContent = farArcDeg + "°";
        exteriorNearArcValue.textContent = nearArcDeg + "°";
        
        angleDeg = (farArcDeg - nearArcDeg) / 2;
        exteriorAngleResult.textContent = angleDeg.toFixed(1) + "°";
        exteriorAngleExtraInfo.textContent = `Uzak Yay: ${farArcDeg}°, Yakın Yay: ${nearArcDeg}°`;

        // Center arcs around 180 deg (left side)
        // Near Arc (BD in PDF)
        const nearArcStartRad = degToRad(180 - nearArcDeg / 2); // B
        const nearArcEndRad = degToRad(180 + nearArcDeg / 2);   // D
        const n1x = extCenterX + extRadius * Math.cos(nearArcStartRad); // Point B
        const n1y = extCenterY + extRadius * Math.sin(nearArcStartRad);
        const n2x = extCenterX + extRadius * Math.cos(nearArcEndRad);   // Point D
        const n2y = extCenterY + extRadius * Math.sin(nearArcEndRad);
        drawArc(exteriorAngleCtx, extCenterX, extCenterY, extRadius, nearArcStartRad, nearArcEndRad, '#d9534f', 3, nearArcDeg + "°");

        // Far Arc (AC in PDF)
        const farArcStartRad = degToRad(180 - farArcDeg / 2);  // A
        const farArcEndRad = degToRad(180 + farArcDeg / 2);    // C
        const f1x = extCenterX + extRadius * Math.cos(farArcStartRad); // Point A
        const f1y = extCenterY + extRadius * Math.sin(farArcStartRad);
        const f2x = extCenterX + extRadius * Math.cos(farArcEndRad);   // Point C
        const f2y = extCenterY + extRadius * Math.sin(farArcEndRad);
        drawArc(exteriorAngleCtx, extCenterX, extCenterY, extRadius, farArcStartRad, farArcEndRad, '#4CAF50', 3, farArcDeg + "°", -20);

        // Lines from P (PAB and PCD in PDF)
        const line1Color = (type === "tangent_secant") ? '#FF8C00' : '#333'; // PAB is tangent
        drawLine(exteriorAngleCtx, extPointX, extPointY, f1x, f1y, line1Color); // Line P-A (extends to B if secant)
        drawLine(exteriorAngleCtx, extPointX, extPointY, f2x, f2y);      // Line P-C (extends to D if secant)

        drawText(exteriorAngleCtx, "A", f1x -15, f1y - (f1y > extCenterY ? -5: 5), '#333', "12px");
        if (type !== "tangent_secant" || line1Color !== '#FF8C00') { // If PAB is not a tangent, B is distinct from A
             drawText(exteriorAngleCtx, "B", n1x -15, n1y - (n1y > extCenterY ? -5: 5), '#333', "12px");
        } else { // PAB is tangent, so A is the tangent point (and B is not relevant on this line)
             drawText(exteriorAngleCtx, "A (Teğet)", f1x - 25, f1y - (f1y > extCenterY ? -5: 5), '#FF8C00', "11px");
        }
        drawText(exteriorAngleCtx, "C", f2x -15, f2y + (f2y > extCenterY ? 5: -5), '#333', "12px");
        drawText(exteriorAngleCtx, "D", n2x -15, n2y + (n2y > extCenterY ? 5: -5), '#333', "12px");
        
        const angleMarkerStart = Math.atan2(f1y - extPointY, f1x - extPointX);
        const angleMarkerEnd = Math.atan2(f2y - extPointY, f2x - extPointX);
        drawRobustAngleMarker(exteriorAngleCtx, extPointX, extPointY, 30, angleMarkerStart, angleMarkerEnd, angleDeg, angleDeg.toFixed(0) + "°");
    }
}

exteriorAngleTypeSelect.addEventListener('change', drawExteriorAngle);
exteriorFarArcSlider.addEventListener('input', () => {
    if (parseInt(exteriorFarArcSlider.value) <= parseInt(exteriorNearArcSlider.value)) {
        exteriorNearArcSlider.value = Math.max(0, parseInt(exteriorFarArcSlider.value) - 1);
    }
    drawExteriorAngle();
});
exteriorNearArcSlider.addEventListener('input', () => {
     if (parseInt(exteriorNearArcSlider.value) >= parseInt(exteriorFarArcSlider.value)) {
        exteriorFarArcSlider.value = Math.min(360, parseInt(exteriorNearArcSlider.value) + 1);
    }
    drawExteriorAngle();
});
exteriorMinorArcSlider.addEventListener('input', drawExteriorAngle);

drawExteriorAngle(); // Initial draw


// --- YENİ YARDIMCI FONKSİYON ---
function drawRobustAngleMarker(ctx, centerX, centerY, radius, angleRad1, angleRad2, targetAngleDeg, label) {
    let diff_ccw = (angleRad2 - angleRad1);
    while (diff_ccw < 0) diff_ccw += 2 * Math.PI;
    while (diff_ccw >= 2 * Math.PI) diff_ccw -= 2 * Math.PI;

    let diff_cw = (angleRad1 - angleRad2);
    while (diff_cw < 0) diff_cw += 2 * Math.PI;
    while (diff_cw >= 2 * Math.PI) diff_cw -= 2 * Math.PI;

    const targetAngleRad = degToRad(targetAngleDeg);
    let startAngle, endAngle;

    // Check if the CCW angle (angleRad1 to angleRad2) is closer to targetAngleRad
    // Or if the CW angle (angleRad2 to angleRad1) is closer to targetAngleRad
    // We want to draw the arc that represents targetAngleRad
    
    // If diff_ccw is approximately targetAngleRad
    if (Math.abs(diff_ccw - targetAngleRad) < degToRad(1) || // CCW matches target
        Math.abs(diff_ccw - (2*Math.PI - targetAngleRad)) < degToRad(1) && targetAngleDeg > 180 ) { // CCW matches reflex of target (when target is small)
        startAngle = angleRad1;
        endAngle = angleRad2;
    } 
    // Else if diff_cw is approximately targetAngleRad
    else if (Math.abs(diff_cw - targetAngleRad) < degToRad(1) ||
             Math.abs(diff_cw - (2*Math.PI - targetAngleRad)) < degToRad(1) && targetAngleDeg > 180) {
        startAngle = angleRad2;
        endAngle = angleRad1;
    }
    // Fallback or default if no clear match (e.g., target is 180, both are 180)
    else {
        // Prefer the smaller sweep if target is not reflex
        if (targetAngleDeg <= 180) {
            if (diff_ccw <= Math.PI + degToRad(1)) { // Prefer CCW if it's not reflex
                 startAngle = angleRad1;
                 endAngle = angleRad2;
            } else { // Otherwise CW must be non-reflex
                 startAngle = angleRad2;
                 endAngle = angleRad1;
            }
        } else { // Target is reflex, prefer larger sweep
             if (diff_ccw > Math.PI - degToRad(1)) { // Prefer CCW if it's reflex
                 startAngle = angleRad1;
                 endAngle = angleRad2;
            } else { // Otherwise CW must be reflex
                 startAngle = angleRad2;
                 endAngle = angleRad1;
            }
        }
    }
    
    // Ensure angle markers for very small angles (like 0) are still visible
    if (Math.abs(startAngle - endAngle) < degToRad(0.1) && Math.abs(targetAngleRad) < degToRad(0.1) ) {
        if (targetAngleDeg > 0.01) { // if it's meant to be a tiny angle, not exactly zero
             endAngle = startAngle + degToRad(0.5); // Draw a tiny sliver
        } else { // if it's meant to be zero, don't draw marker or draw minimally
            // return; // Optionally, don't draw for perfect zero
            endAngle = startAngle + degToRad(0.01); // almost invisible
        }
    }


    drawAngleMarker(ctx, centerX, centerY, radius, startAngle, endAngle, label);
}