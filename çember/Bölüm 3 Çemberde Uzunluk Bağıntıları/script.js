document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Chord Properties ---
    const chordSvg = document.getElementById('chordSvg');
    const chordDistInput = document.getElementById('chordDist');
    const chordDistValSpan = document.getElementById('chordDistVal');
    const chordLengthValSpan = document.getElementById('chordLengthVal');
    const rChord = 100; // Fixed radius
    const cxChord = 150, cyChord = 110;

    function drawChord() {
        const d = parseInt(chordDistInput.value);
        chordDistValSpan.textContent = d;
        chordSvg.innerHTML = ''; // Clear SVG

        // Circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cxChord);
        circle.setAttribute("cy", cyChord);
        circle.setAttribute("r", rChord);
        circle.setAttribute("stroke", "blue");
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("fill", "none");
        chordSvg.appendChild(circle);

        // Center
        const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        center.setAttribute("cx", cxChord);
        center.setAttribute("cy", cyChord);
        center.setAttribute("r", "3");
        center.setAttribute("fill", "red");
        chordSvg.appendChild(center);
        
        if (d > rChord) {
             chordLengthValSpan.textContent = "Mesafe yarıçaptan büyük olamaz.";
             return;
        }

        // Chord calculation
        const halfChordLength = Math.sqrt(rChord * rChord - d * d);
        const chordLength = 2 * halfChordLength;
        chordLengthValSpan.textContent = chordLength.toFixed(2);

        // Chord line
        const chord = document.createElementNS("http://www.w3.org/2000/svg", "line");
        chord.setAttribute("x1", cxChord - halfChordLength);
        chord.setAttribute("y1", cyChord - d); // Assuming d is distance towards top
        chord.setAttribute("x2", cxChord + halfChordLength);
        chord.setAttribute("y2", cyChord - d);
        chord.setAttribute("stroke", "green");
        chord.setAttribute("stroke-width", "2");
        chordSvg.appendChild(chord);

        // Perpendicular line from center
        const perp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        perp.setAttribute("x1", cxChord);
        perp.setAttribute("y1", cyChord);
        perp.setAttribute("x2", cxChord);
        perp.setAttribute("y2", cyChord - d);
        perp.setAttribute("stroke", "orange");
        perp.setAttribute("stroke-width", "1");
        perp.setAttribute("stroke-dasharray", "4 2");
        chordSvg.appendChild(perp);
        
        // Radius lines to chord ends (for isosceles triangle visualization)
        const r1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        r1.setAttribute("x1", cxChord);
        r1.setAttribute("y1", cyChord);
        r1.setAttribute("x2", cxChord - halfChordLength);
        r1.setAttribute("y2", cyChord - d);
        r1.setAttribute("stroke", "blue");
        r1.setAttribute("stroke-width", "1");
        chordSvg.appendChild(r1);

        const r2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        r2.setAttribute("x1", cxChord);
        r2.setAttribute("y1", cyChord);
        r2.setAttribute("x2", cxChord + halfChordLength);
        r2.setAttribute("y2", cyChord - d);
        r2.setAttribute("stroke", "blue");
        r2.setAttribute("stroke-width", "1");
        chordSvg.appendChild(r2);
    }
    chordDistInput.addEventListener('input', drawChord);
    drawChord();

    // --- 2. Tangent Properties ---
    const tangentSvg = document.getElementById('tangentSvg');
    const paLengthSpan = document.getElementById('paLength');
    const pbLengthSpan = document.getElementById('pbLength');
    const angleOPASpan = document.getElementById('angleOPA');
    const angleOPBSpan = document.getElementById('angleOPB');

    function drawTangents() {
        tangentSvg.innerHTML = '';
        const cx = 120, cy = 125, r = 70;
        const px = 300, py = 125; // External point P

        // Circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("stroke", "blue");
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("fill", "rgba(0,0,255,0.1)");
        tangentSvg.appendChild(circle);

        // Center O
        const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        center.setAttribute("cx", cx);
        center.setAttribute("cy", cy);
        center.setAttribute("r", "3");
        center.setAttribute("fill", "red");
        tangentSvg.appendChild(center);
        const oLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        oLabel.setAttribute("x", cx - 15); oLabel.setAttribute("y", cy + 5); oLabel.textContent = "O";
        tangentSvg.appendChild(oLabel);


        // External Point P
        const pPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pPoint.setAttribute("cx", px);
        pPoint.setAttribute("cy", py);
        pPoint.setAttribute("r", "3");
        pPoint.setAttribute("fill", "green");
        tangentSvg.appendChild(pPoint);
        const pLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        pLabel.setAttribute("x", px + 5); pLabel.setAttribute("y", py + 5); pLabel.textContent = "P";
        tangentSvg.appendChild(pLabel);

        // Line OP
        const opLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        opLine.setAttribute("x1", cx); opLine.setAttribute("y1", cy);
        opLine.setAttribute("x2", px); opLine.setAttribute("y2", py);
        opLine.setAttribute("stroke", "grey"); opLine.setAttribute("stroke-width", "1");
        opLine.setAttribute("stroke-dasharray", "5,5");
        tangentSvg.appendChild(opLine);
        
        // Calculations for tangent points A and B
        const distOP = Math.sqrt((px - cx)**2 + (py - cy)**2);
        if (distOP <= r) { // P is inside or on the circle
            paLengthSpan.textContent = "P içerde"; pbLengthSpan.textContent = "P içerde";
            return;
        }
        const pa = Math.sqrt(distOP**2 - r**2);
        paLengthSpan.textContent = pa.toFixed(2);
        pbLengthSpan.textContent = pa.toFixed(2); // |PA| = |PB|

        // Angle alpha = angle between OP and x-axis
        // Angle beta = angle AOP (or BOP) where OAP is right angle, cos(beta) = r/distOP
        const alpha = Math.atan2(py - cy, px - cx);
        const beta = Math.acos(r / distOP);

        const ax = cx + r * Math.cos(alpha - beta);
        const ay = cy + r * Math.sin(alpha - beta);
        const bx = cx + r * Math.cos(alpha + beta);
        const by = cy + r * Math.sin(alpha + beta);

        // Tangent PA
        const tanPA = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tanPA.setAttribute("x1", px); tanPA.setAttribute("y1", py);
        tanPA.setAttribute("x2", ax); tanPA.setAttribute("y2", ay);
        tanPA.setAttribute("stroke", "purple"); tanPA.setAttribute("stroke-width", "2");
        tangentSvg.appendChild(tanPA);
        const aLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        aLabel.setAttribute("x", ax - 15); aLabel.setAttribute("y", ay - 5); aLabel.textContent = "A";
        tangentSvg.appendChild(aLabel);

        // Tangent PB
        const tanPB = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tanPB.setAttribute("x1", px); tanPB.setAttribute("y1", py);
        tanPB.setAttribute("x2", bx); tanPB.setAttribute("y2", by);
        tanPB.setAttribute("stroke", "purple"); tanPB.setAttribute("stroke-width", "2");
        tangentSvg.appendChild(tanPB);
        const bLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        bLabel.setAttribute("x", bx - 15); bLabel.setAttribute("y", by + 15); bLabel.textContent = "B";
        tangentSvg.appendChild(bLabel);


        // Radius OA (should be perpendicular to PA)
        const radOA = document.createElementNS("http://www.w3.org/2000/svg", "line");
        radOA.setAttribute("x1", cx); radOA.setAttribute("y1", cy);
        radOA.setAttribute("x2", ax); radOA.setAttribute("y2", ay);
        radOA.setAttribute("stroke", "blue"); radOA.setAttribute("stroke-width", "1");
        tangentSvg.appendChild(radOA);
        // Right angle symbol at A
        const rightAngleA = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        // Simple square, needs rotation logic if not axis aligned
        // For simplicity, we'll assume it looks right.
        // A more robust way is to calculate points for the square based on tangent and radius vectors.
        // Here, just illustrating.
        const len = 8;
        const vPAx = ax-px; const vPAy = ay-py;
        const vOAx = ax-cx; const vOAy = ay-cy;
        const normVPA = Math.sqrt(vPAx**2+vPAy**2);
        const normVOA = Math.sqrt(vOAx**2+vOAy**2);
        const p1x = ax - len * vPAx/normVPA; const p1y = ay - len * vPAy/normVPA;
        const p2x = ax - len * vOAx/normVOA; const p2y = ay - len * vOAy/normVOA;
        const p3x = p1x - len * vOAx/normVOA; const p3y = p1y - len * vOAy/normVOA;
        rightAngleA.setAttribute("points", `${p1x},${p1y} ${p3x},${p3y} ${p2x},${p2y}`);
        rightAngleA.setAttribute("fill", "none");
        rightAngleA.setAttribute("stroke", "red");
        tangentSvg.appendChild(rightAngleA);


        // Radius OB (should be perpendicular to PB)
        const radOB = document.createElementNS("http://www.w3.org/2000/svg", "line");
        radOB.setAttribute("x1", cx); radOB.setAttribute("y1", cy);
        radOB.setAttribute("x2", bx); radOB.setAttribute("y2", by);
        radOB.setAttribute("stroke", "blue"); radOB.setAttribute("stroke-width", "1");
        tangentSvg.appendChild(radOB);

        const angleOPA = Math.atan2(ay-py, ax-px) - Math.atan2(cy-py, cx-px);
        const angleOPB = Math.atan2(by-py, bx-px) - Math.atan2(cy-py, cx-px);
        // Angle between PO and PA (same as angle APO) is beta
        angleOPASpan.textContent = (beta * 180 / Math.PI).toFixed(1);
        angleOPBSpan.textContent = (beta * 180 / Math.PI).toFixed(1); // same, because triangle OAP and OBP are congruent

    }
    drawTangents();


    // --- 3. Power of a Point ---
    const powerSvg = document.getElementById('powerSvg');
    const powerTypeSelect = document.getElementById('powerType');
    const powerInputsDiv = document.getElementById('powerInputs');
    const powerResultP = document.getElementById('powerResult');
    const powerSvgWidth = 400, powerSvgHeight = 300;

    function setupPowerInputs() {
        powerInputsDiv.innerHTML = '';
        powerResultP.textContent = '';
        const type = powerTypeSelect.value;

        if (type === "internal") {
            powerInputsDiv.innerHTML = `
                <label>PA:</label><input type="number" id="paInternal" value="30" min="1">
                <label>PB:</label><input type="number" id="pbInternal" value="70" min="1">
                <label>PC:</label><input type="number" id="pcInternal" value="35" min="1">
                <button id="calcPdInternal">Hesapla PD</button>
            `;
            document.getElementById('calcPdInternal').addEventListener('click', calculateAndDrawPower);
        } else if (type === "external_secants") {
            powerInputsDiv.innerHTML = `
                <label>PA (kısa):</label><input type="number" id="paExtSec" value="40" min="1">
                <label>PB (uzun):</label><input type="number" id="pbExtSec" value="100" min="1">
                <label>PC (kısa):</label><input type="number" id="pcExtSec" value="50" min="1">
                <button id="calcPdExtSec">Hesapla PD (uzun)</button>
            `;
            document.getElementById('calcPdExtSec').addEventListener('click', calculateAndDrawPower);
        } else if (type === "external_tangent_secant") {
            powerInputsDiv.innerHTML = `
                <label>PT (teğet):</label><input type="number" id="ptExtTanSec" value="60" min="1">
                <label>PA (kısa):</label><input type="number" id="paExtTanSec" value="30" min="1">
                <button id="calcPbExtTanSec">Hesapla PB (uzun)</button>
            `;
            document.getElementById('calcPbExtTanSec').addEventListener('click', calculateAndDrawPower);
        }
        calculateAndDrawPower(); // Initial draw
    }

    function calculateAndDrawPower() {
        powerSvg.innerHTML = '';
        const type = powerTypeSelect.value;
        const cx = powerSvgWidth / 2, cy = powerSvgHeight / 2, r = 80;

        // Common Circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("stroke", "black");
        circle.setAttribute("stroke-width", "1");
        circle.setAttribute("fill", "rgba(200,200,200,0.3)");
        powerSvg.appendChild(circle);

        if (type === "internal") {
            const pa = parseFloat(document.getElementById('paInternal').value);
            const pb = parseFloat(document.getElementById('pbInternal').value);
            const pc = parseFloat(document.getElementById('pcInternal').value);
            const pd = (pa * pb) / pc;
            powerResultP.textContent = `PA*PB = ${pa*pb}, PC*PD = ${pc*pd.toFixed(2)} => PD = ${pd.toFixed(2)}`;

            // Simplified visualization
            const pIntX = cx -10, pIntY = cy + 10; // Intersection point P
            const aX = pIntX - pa, aY = pIntY; // Chord AB horizontal
            const bX = pIntX + pb, bY = pIntY;
            const cX = pIntX, cY = pIntY - pc; // Chord CD vertical
            const dX = pIntX, dY = pIntY + pd;

            powerSvg.innerHTML += `
                <line x1="${aX}" y1="${aY}" x2="${bX}" y2="${bY}" stroke="red" stroke-width="2"/>
                <line x1="${cX}" y1="${cY}" x2="${dX}" y2="${dY}" stroke="blue" stroke-width="2"/>
                <circle cx="${pIntX}" cy="${pIntY}" r="3" fill="black"/>
                <text x="${pIntX+5}" y="${pIntY+5}">P</text>
                <text x="${(aX+pIntX)/2}" y="${aY-5}">PA</text><text x="${(bX+pIntX)/2}" y="${bY-5}">PB</text>
                <text x="${cX+5}" y="${(cY+pIntY)/2}">PC</text><text x="${dX+5}" y="${(dY+pIntY)/2}">PD</text>
            `;
        } else if (type === "external_secants") {
            const pa = parseFloat(document.getElementById('paExtSec').value);
            const pb = parseFloat(document.getElementById('pbExtSec').value);
            const pc = parseFloat(document.getElementById('pcExtSec').value);
            const pd = (pa * pb) / pc;
            powerResultP.textContent = `PA*PB = ${pa*pb}, PC*PD = ${pc*pd.toFixed(2)} => PD (uzun) = ${pd.toFixed(2)}`;
            
            const pExtX = cx - r - 80, pExtY = cy; // External point P
            // Secant PAB (Simplified: goes through center for easier drawing)
            const a1X = cx - r, a1Y = cy;
            const b1X = cx + r, b1Y = cy;
            const realPA = pExtX - a1X > 0 ? a1X - pExtX : pExtX - a1X ; // PA is the shorter segment from P to first intersection
                                                                //This is very simplified, just for visual.
            // Secant PCD
            const angle = Math.PI / 6; // 30 degrees
            const c2X = pExtX + pc * Math.cos(angle), c2Y = pExtY + pc * Math.sin(angle);
            const d2X = pExtX + pd * Math.cos(angle), d2Y = pExtY + pd * Math.sin(angle);
            
            powerSvg.innerHTML += `
                <line x1="${pExtX}" y1="${pExtY}" x2="${pExtX+pb}" y2="${pExtY}" stroke="red" stroke-width="2"/> <!-- PAB along x-axis from P -->
                <line x1="${pExtX}" y1="${pExtY}" x2="${d2X}" y2="${d2Y}" stroke="blue" stroke-width="2"/> <!-- PCD -->
                <circle cx="${pExtX}" cy="${pExtY}" r="3" fill="black"/>
                <text x="${pExtX-15}" y="${pExtY}">P</text>
                <text x="${pExtX+pa/2}" y="${pExtY-10}">PA</text><text x="${pExtX+(pa+pb)/2}" y="${pExtY-10}">PB</text>
                <text x="${(pExtX+c2X)/2+5}" y="${(pExtY+c2Y)/2 -5}">PC</text><text x="${(pExtX+d2X)/2+5}" y="${(pExtY+d2Y)/2 -5}">PD</text>
            `;

        } else if (type === "external_tangent_secant") {
            const pt = parseFloat(document.getElementById('ptExtTanSec').value);
            const pa = parseFloat(document.getElementById('paExtTanSec').value);
            const pb = (pt * pt) / pa;
            powerResultP.textContent = `PT² = ${pt*pt}, PA*PB = ${pa*pb.toFixed(2)} => PB (uzun) = ${pb.toFixed(2)}`;
            
            const pExtX = cx - r - 80, pExtY = cy; // External point P
            const tX = pExtX + Math.sqrt(pt**2 - (cy-pExtY-r)**2) , tY = cy-r; // Simplified tangent point T (Top of circle)
                                                                              //This visualization is getting complex. Better to use fixed points.

            // Fixed points for simpler visual:
            const P_X = 50, P_Y = 150;
            const T_X = P_X + pt , T_Y = P_Y - Math.sqrt(pt**2 - (cx-P_X-r)**2); //This is not quite right for tangent point
            // Let T be at (cx, cy-r) for visual simplicity
            const TX_VIS = cx, TY_VIS = cy - r; // Tangent point
            const PT_VIS_LEN = Math.sqrt((P_X-TX_VIS)**2 + (P_Y-TY_VIS)**2); // This should be 'pt' input

            // Secant PAB (along x-axis from P for simplicity)
            const AX_VIS = P_X + pa, AY_VIS = P_Y;
            const BX_VIS = P_X + pb, BY_VIS = P_Y;


            powerSvg.innerHTML += `
                <line x1="${P_X}" y1="${P_Y}" x2="${TX_VIS}" y2="${TY_VIS}" stroke="green" stroke-width="2"/> <!-- PT -->
                <line x1="${P_X}" y1="${P_Y}" x2="${BX_VIS}" y2="${BY_VIS}" stroke="orange" stroke-width="2"/> <!-- PAB -->
                <circle cx="${P_X}" cy="${P_Y}" r="3" fill="black"/>
                <text x="${P_X-15}" y="${P_Y}">P</text>
                <text x="${(P_X+TX_VIS)/2}" y="${(P_Y+TY_VIS)/2 - 5}">PT</text>
                <text x="${(P_X+AX_VIS)/2}" y="${AY_VIS - 10}">PA</text><text x="${(P_X+BX_VIS)/2}" y="${BY_VIS - 10}">PB</text>
            `;
        }
    }
    powerTypeSelect.addEventListener('change', setupPowerInputs);
    setupPowerInputs(); // Initial call


    // --- 4. Two Circles ---
    const twoCirclesSvg = document.getElementById('twoCirclesSvg');
    const r1Input = document.getElementById('r1');
    const r2Input = document.getElementById('r2');
    const distCentersInput = document.getElementById('distCenters');
    const r1ValSpan = document.getElementById('r1Val');
    const r2ValSpan = document.getElementById('r2Val');
    const distCentersValSpan = document.getElementById('distCentersVal');
    const twoCirclesStatusSpan = document.getElementById('twoCirclesStatus');
    const svgWidthTwoCircles = 450;

    function drawTwoCircles() {
        const r1 = parseInt(r1Input.value);
        const r2 = parseInt(r2Input.value);
        const d = parseInt(distCentersInput.value);

        r1ValSpan.textContent = r1;
        r2ValSpan.textContent = r2;
        distCentersValSpan.textContent = d;
        twoCirclesSvg.innerHTML = '';

        const c1x = Math.max(r1, r2) + 20; // Ensure enough space on left
        const c1y = 125;
        const c2x = c1x + d;
        const c2y = 125;

        const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle1.setAttribute("cx", c1x);
        circle1.setAttribute("cy", c1y);
        circle1.setAttribute("r", r1);
        circle1.setAttribute("stroke", "dodgerblue");
        circle1.setAttribute("stroke-width", "2");
        circle1.setAttribute("fill", "rgba(30,144,255,0.2)");
        twoCirclesSvg.appendChild(circle1);

        const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle2.setAttribute("cx", c2x);
        circle2.setAttribute("cy", c2y);
        circle2.setAttribute("r", r2);
        circle2.setAttribute("stroke", "crimson");
        circle2.setAttribute("stroke-width", "2");
        circle2.setAttribute("fill", "rgba(220,20,60,0.2)");
        twoCirclesSvg.appendChild(circle2);
        
        // Line between centers
        const centerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        centerLine.setAttribute("x1", c1x);
        centerLine.setAttribute("y1", c1y);
        centerLine.setAttribute("x2", c2x);
        centerLine.setAttribute("y2", c2y);
        centerLine.setAttribute("stroke", "grey");
        centerLine.setAttribute("stroke-dasharray", "4 2");
        twoCirclesSvg.appendChild(centerLine);


        // Determine status
        let status = "";
        if (d > r1 + r2) {
            status = "Dıştan Ayrık (Disjoint Externally)";
        } else if (d === r1 + r2) {
            status = "Dıştan Teğet (Externally Tangent)";
        } else if (Math.abs(r1 - r2) < d && d < r1 + r2) {
            status = "Kesişen (Intersecting)";
        } else if (d === Math.abs(r1 - r2) && d !== 0) {
            status = "İçten Teğet (Internally Tangent)";
        } else if (d < Math.abs(r1 - r2)) {
            status = "İçten Ayrık (Disjoint Internally)";
             if (r1 > r2 && d + r2 < r1) status += " (Küçük olan içeride)";
             else if (r2 > r1 && d + r1 < r2) status += " (Küçük olan içeride)";
        } else if (d === 0) {
            if (r1 === r2) status = "Çakışık (Concentric & Equal Radii - Coincident)";
            else status = "Eş Merkezli (Concentric)";
        }
        twoCirclesStatusSpan.textContent = status;
    }

    [r1Input, r2Input, distCentersInput].forEach(input => {
        input.addEventListener('input', drawTwoCircles);
    });
    drawTwoCircles(); // Initial draw
});