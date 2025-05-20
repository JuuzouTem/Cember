document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('circleCanvas');
    const ctx = canvas.getContext('2d');
    const angleTypeSelect = document.getElementById('angleType');
    const angleNameDisplay = document.getElementById('angleName');
    const angleRuleDisplay = document.getElementById('angleRule');
    const angleFormulaDisplay = document.getElementById('angleFormula');
    const slidersContainer = document.getElementById('slidersContainer');
    const calculatedAngleDisplay = document.getElementById('calculatedAngle');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8; // Canvas'ın %80'i

    let currentAngleType = 'central';
    let params = { arc1: 60, arc2: 40 }; // Varsayılan değerler

    const angleDefinitions = {
        central: {
            name: "Merkez Açı",
            rule: "Merkez açının ölçüsü, gördüğü yayın ölçüsüne eşittir.",
            formula: "α = m(AB yay)",
            sliders: [
                { id: 'arc1', label: 'AB Yayı (°)', min: 0, max: 360, value: 60 }
            ],
            calculate: (p) => p.arc1,
            draw: (p) => {
                const arc1Rad = toRadians(p.arc1);
                // A ve B noktaları
                const Ax = centerX + radius * Math.cos(0);
                const Ay = centerY + radius * Math.sin(0);
                const Bx = centerX + radius * Math.cos(arc1Rad);
                const By = centerY + radius * Math.sin(arc1Rad);

                // Yayı çiz
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * 0.9, 0, arc1Rad, false); // İçeri bir yay
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'orange';
                ctx.stroke();
                drawText(`m(AB)=${p.arc1}°`, centerX + radius * 0.95 * Math.cos(arc1Rad/2), centerY + radius * 0.95 * Math.sin(arc1Rad/2), 'orange', '12px Arial', 'center');


                // Açı kollarını çiz
                drawLine(centerX, centerY, Ax, Ay, 'blue');
                drawLine(centerX, centerY, Bx, By, 'blue');
                drawPoint(centerX, centerY, 'O', 'black');
                drawPoint(Ax, Ay, 'A', 'black');
                drawPoint(Bx, By, 'B', 'black');

                // Açı işaretini çiz
                drawAngleArc(centerX, centerY, radius * 0.3, 0, arc1Rad, 'red');
                drawText(`α`, centerX + radius * 0.4 * Math.cos(arc1Rad/2), centerY + radius * 0.4 * Math.sin(arc1Rad/2), 'red', '14px Arial', 'center');
            }
        },
        inscribed: {
            name: "Çevre Açı",
            rule: "Çevre açının ölçüsü, gördüğü yayın ölçüsünün yarısıdır.",
            formula: "α = m(AB yay) / 2",
            sliders: [
                { id: 'arc1', label: 'AB Yayı (°)', min: 0, max: 360, value: 120 }
            ],
            calculate: (p) => p.arc1 / 2,
            draw: (p) => {
                const arc1Rad = toRadians(p.arc1);
                // C noktası (çevre açı tepe noktası), yayın dışında bir yerde
                const C_angle_offset = toRadians(p.arc1 / 2 + 30); // Yayı görmesi için ayar
                const Cx = centerX + radius * Math.cos(C_angle_offset + arc1Rad); // Yayın diğer tarafında
                const Cy = centerY + radius * Math.sin(C_angle_offset + arc1Rad);

                const Ax = centerX + radius * Math.cos(0);
                const Ay = centerY + radius * Math.sin(0);
                const Bx = centerX + radius * Math.cos(arc1Rad);
                const By = centerY + radius * Math.sin(arc1Rad);

                // Yayı çiz
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * 0.9, 0, arc1Rad, false);
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'orange';
                ctx.stroke();
                drawText(`m(AB)=${p.arc1}°`, centerX + radius * 0.95 * Math.cos(arc1Rad/2), centerY + radius * 0.95 * Math.sin(arc1Rad/2), 'orange', '12px Arial', 'center');


                drawLine(Cx, Cy, Ax, Ay, 'blue');
                drawLine(Cx, Cy, Bx, By, 'blue');
                drawPoint(Cx, Cy, 'C', 'black');
                drawPoint(Ax, Ay, 'A', 'black');
                drawPoint(Bx, By, 'B', 'black');

                drawAngleArc(Cx, Cy, radius * 0.2, angleBetweenPoints(Cx, Cy, Ax, Ay), angleBetweenPoints(Cx, Cy, Bx, By), 'red', true);
                 drawText(`α`, Cx + radius * 0.25 * Math.cos( (angleBetweenPoints(Cx,Cy,Ax,Ay) + angleBetweenPoints(Cx,Cy,Bx,By))/2 ),
                              Cy + radius * 0.25 * Math.sin( (angleBetweenPoints(Cx,Cy,Ax,Ay) + angleBetweenPoints(Cx,Cy,Bx,By))/2 ), 'red', '14px Arial', 'center');
            }
        },
        tangentChord: {
            name: "Teğet-Kiriş Açısı",
            rule: "Teğet-kiriş açısının ölçüsü, gördüğü yayın ölçüsünün yarısıdır.",
            formula: "α = m(AB yay) / 2",
            sliders: [
                { id: 'arc1', label: 'AB Yayı (°)', min: 0, max: 360, value: 90 }
            ],
            calculate: (p) => p.arc1 / 2,
            draw: (p) => {
                const arc1Rad = toRadians(p.arc1);
                // Teğet noktası A (0 derecede)
                const Ax = centerX + radius * Math.cos(0);
                const Ay = centerY + radius * Math.sin(0);
                // Kirişin diğer ucu B
                const Bx = centerX + radius * Math.cos(arc1Rad);
                const By = centerY + radius * Math.sin(arc1Rad);

                // Teğet doğrusu (A noktasından geçen ve yarıçapa dik)
                // Yarıçapın eğimi: (Ay-centerY)/(Ax-centerX)
                // Teğetin eğimi: -(Ax-centerX)/(Ay-centerY) -- eğer Ay != centerY
                // Teğet A(radius, 0) noktasında ise x=radius (düşey teğet) veya y=radius (yatay teğet) gibi özel durumlar olabilir.
                // Basitlik için teğeti A'dan biraz dışarı doğru çizelim.
                const tangentExtension = 50;
                const Tx1 = Ax + tangentExtension * Math.sin(0); // Teğet için x eksenine paralel ise y değişir
                const Ty1 = Ay - tangentExtension * Math.cos(0); // Teğet için y eksenine paralel ise x değişir
                // Aslında teğet OA'ya dik olmalı. A(centerX+R, centerY) noktasındaysa teğet x=centerX+R olurdu.
                // 0 derecedeki nokta (centerX+R, centerY). Teğet x = centerX+R doğrusu olur.
                // Genel durumda teğet (A noktasından geçen, OA'ya dik doğru)
                // OA vektörü: (Ax-centerX, Ay-centerY)
                // Teğet vektörü: -(Ay-centerY, Ax-centerX) veya (Ay-centerY, -(Ax-centerX))
                // Burada A noktası (centerX + radius, centerY) olsun (0 radyan)
                // Teğet doğrusu x = centerX + radius 'a dik olacak, yani y eksenine paralel.
                // A(radius,0) noktasındaki teğet x=radius (merkez 0,0 ise). Burada merkez (centerX, centerY).
                // A(centerX+radius, centerY) ise teğet doğrusu x eksenine dik (y eksenine paralel) bir doğru olacak.
                // Veya daha basitçe teğeti A noktasından geçen ve OA'ya dik bir çizgi çizeriz.
                // A noktası 0 radyan pozisyonunda (sağda)
                drawLine(Ax, Ay - tangentExtension, Ax, Ay + tangentExtension, 'green'); // Teğet
                drawText('T', Ax, Ay - tangentExtension - 10, 'green');


                // Kiriş AB
                drawLine(Ax, Ay, Bx, By, 'blue'); // Kiriş

                // Yayı çiz
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * 0.9, 0, arc1Rad, false);
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'orange';
                ctx.stroke();
                drawText(`m(AB)=${p.arc1}°`, centerX + radius * 0.95 * Math.cos(arc1Rad/2), centerY + radius * 0.95 * Math.sin(arc1Rad/2), 'orange', '12px Arial', 'center');


                drawPoint(Ax, Ay, 'A', 'black');
                drawPoint(Bx, By, 'B', 'black');

                // Teğet-Kiriş açısı
                // A noktasındaki açı: Teğet doğrusu (dikey) ile AB kirişi arasındaki açı
                // Teğet y eksenine paralel. AB kirişinin açısı Math.atan2(By-Ay, Bx-Ax)
                // Bu yaklaşım zorlayıcı olabilir. Daha basit: A noktasını tepe kabul eden açıyı çiz.
                // Teğet yukarı doğruysa açı -PI/2. AB'nin açısı angleBetweenPoints(Ax,Ay,Bx,By)
                // Açı yayı iç tarafta kalacak şekilde işaretlenir.
                // Basitlik için, açının yönünü sabit alalım.
                const angleStartForArc = Math.PI / 2; // Teğet yukarı doğruysa
                const angleEndForArc = angleBetweenPoints(Ax, Ay, Bx,By);

                // Açıyı her zaman pozitif ve küçük olan tarafta çizmek için kontrol
                let start = Math.PI / 2; // Teğet yukarı doğru
                let end = angleBetweenPoints(Ax, Ay, Bx, By);
                if (p.arc1 > 180) { // Büyük yayı görüyorsa, diğer taraftaki açıyı çizmeli
                    start = angleBetweenPoints(Ax, Ay, Bx, By);
                    end = -Math.PI / 2; // Teğet aşağı doğru
                }
                // Eğer A'yı başlangıç noktası (0 radyan) alırsak, teğet -PI/2 (saat yönü) ve PI/2 (saat yönü tersi) yönlerinde olur.
                // Yayın içindeki açıyı işaretleyelim.
                drawAngleArc(Ax, Ay, radius * 0.2, Math.PI / 2, angleBetweenPoints(Ax, Ay, Bx, By), 'red', true);
                drawText(`α`, Ax + radius*0.25 * Math.cos((Math.PI/2 + angleBetweenPoints(Ax, Ay, Bx, By))/2),
                               Ay + radius*0.25 * Math.sin((Math.PI/2 + angleBetweenPoints(Ax, Ay, Bx, By))/2), 'red');

            }
        },
        interior: {
            name: "İç Açı",
            rule: "İç açının ölçüsü, gördüğü yayların ölçüleri toplamının yarısıdır.",
            formula: "α = (m(AB yay) + m(CD yay)) / 2",
            sliders: [
                { id: 'arc1', label: 'Karşılıklı Yay 1 (°)', min: 0, max: 180, value: 60 },
                { id: 'arc2', label: 'Karşılıklı Yay 2 (°)', min: 0, max: 180, value: 40 }
            ],
            calculate: (p) => (p.arc1 + p.arc2) / 2,
            draw: (p) => {
                // İki kiriş çizilecek. Kesişim noktası iç açı olacak.
                // Kiriş 1 (AC) ve Kiriş 2 (BD)
                // Yay 1 (AB) ve Yay 2 (CD)
                // p.arc1 -> AB yayı, p.arc2 -> CD yayı
                const arc1Rad = toRadians(p.arc1);
                const arc2Rad = toRadians(p.arc2);

                // A noktasını 0'da başlatalım. B noktası arc1 kadar sonra.
                const Ax = centerX + radius * Math.cos(0);
                const Ay = centerY + radius * Math.sin(0);
                const Bx = centerX + radius * Math.cos(arc1Rad);
                const By = centerY + radius * Math.sin(arc1Rad);

                // C noktasını B'den biraz sonra başlatalım (örn: arc1 + 30 derece)
                const startAngleC = arc1Rad + toRadians(30);
                const Cx = centerX + radius * Math.cos(startAngleC);
                const Cy = centerY + radius * Math.sin(startAngleC);
                // D noktası C'den arc2 kadar sonra
                const Dx = centerX + radius * Math.cos(startAngleC + arc2Rad);
                const Dy = centerY + radius * Math.sin(startAngleC + arc2Rad);

                // Kirişler: AD ve BC olsun ki kesişsinler
                drawLine(Ax, Ay, Dx, Dy, 'blue'); // Kiriş AD
                drawLine(Bx, By, Cx, Cy, 'blue'); // Kiriş BC

                // Kesişim noktası P
                const P = getLineIntersection(Ax, Ay, Dx, Dy, Bx, By, Cx, Cy);
                if (P) {
                    drawPoint(P.x, P.y, 'P', 'red');
                    // Açıyı P'de işaretle (APB açısı ve tersi CPD)
                    const angleAPD = angleBetweenPoints(P.x, P.y, Ax, Ay);
                    const angleBPC = angleBetweenPoints(P.x, P.y, Bx,By); // Bu ters açı olur
                    const angleCPD = angleBetweenPoints(P.x, P.y, Cx,Cy); // APD ile aynı
                    const angleAPB = angleBetweenPoints(P.x, P.y, Ax,Ay, Bx,By); // Gerçek açı değeri
                    
                    drawAngleArc(P.x, P.y, 20, angleAPD, angleBetweenPoints(P.x,P.y,Bx,By), 'red', true); // APB
                     drawText(`α`, P.x + 25 * Math.cos((angleAPD + angleBetweenPoints(P.x,P.y,Bx,By))/2 ),
                                   P.y + 25 * Math.sin((angleAPD + angleBetweenPoints(P.x,P.y,Bx,By))/2 ), 'red');

                }

                // Gördüğü yaylar: AB ve CD
                ctx.beginPath(); // Yay AB
                ctx.arc(centerX, centerY, radius * 0.9, 0, arc1Rad, false);
                ctx.lineWidth = 3; ctx.strokeStyle = 'orange'; ctx.stroke();
                drawText(`m(AB)=${p.arc1}°`, centerX + radius * 0.95 * Math.cos(arc1Rad/2), centerY + radius * 0.95 * Math.sin(arc1Rad/2), 'orange', '10px Arial', 'center');


                ctx.beginPath(); // Yay CD
                ctx.arc(centerX, centerY, radius * 0.9, startAngleC, startAngleC + arc2Rad, false);
                ctx.lineWidth = 3; ctx.strokeStyle = 'purple'; ctx.stroke();
                drawText(`m(CD)=${p.arc2}°`, centerX + radius * 0.95 * Math.cos(startAngleC + arc2Rad/2), centerY + radius * 0.95 * Math.sin(startAngleC + arc2Rad/2), 'purple', '10px Arial', 'center');


                drawPoint(Ax, Ay, 'A'); drawPoint(Bx, By, 'B');
                drawPoint(Cx, Cy, 'C'); drawPoint(Dx, Dy, 'D');
            }
        },
        exterior: {
            name: "Dış Açı",
            rule: "Dış açının ölçüsü, gördüğü büyük yay ile küçük yayın ölçüleri farkının yarısıdır.",
            formula: "α = (m(Büyük Yay) - m(Küçük Yay)) / 2",
            sliders: [ // İki kesen durumu için
                { id: 'arc1', label: 'Uzak Yay (BD) (°)', min: 20, max: 350, value: 120 }, // arc1 > arc2 olmalı
                { id: 'arc2', label: 'Yakın Yay (AC) (°)', min: 10, max: 180, value: 40 }
            ],
            calculate: (p) => Math.abs(p.arc1 - p.arc2) / 2,
            draw: (p) => {
                // P dış nokta. PAB ve PCD kesenleri.
                // Yakın yay AC (p.arc2), Uzak yay BD (p.arc1)
                // p.arc1 > p.arc2 kontrolü önemli!
                if (p.arc2 >= p.arc1) {
                    drawText("Uzak yay > Yakın yay olmalı!", centerX, 20, "red", "14px Arial", "center");
                    return;
                }

                const arc2Rad = toRadians(p.arc2); // AC yayı
                const arc1Rad = toRadians(p.arc1); // BD yayı (AC'yi de içeren daha büyük bir yay)

                // A ve C noktalarını simetrik yerleştirelim
                const startAngle_A = -arc2Rad / 2;
                const endAngle_C = arc2Rad / 2;

                const Ax = centerX + radius * Math.cos(startAngle_A);
                const Ay = centerY + radius * Math.sin(startAngle_A);
                const Cx = centerX + radius * Math.cos(endAngle_C);
                const Cy = centerY + radius * Math.sin(endAngle_C);

                // B ve D noktalarını da AC'yi kapsayacak şekilde simetrik yerleştirelim
                const startAngle_B = -arc1Rad / 2;
                const endAngle_D = arc1Rad / 2;

                const Bx = centerX + radius * Math.cos(startAngle_B);
                const By = centerY + radius * Math.sin(startAngle_B);
                const Dx = centerX + radius * Math.cos(endAngle_D);
                const Dy = centerY + radius * Math.sin(endAngle_D);

                // P noktasını bulmak için AD ve BC doğrularının kesişimi
                // (P, A, B aynı doğru üzerinde; P, C, D aynı doğru üzerinde olacak)
                // Kesenler: PAB ve PCD.
                // P noktasını x ekseni üzerinde çemberin solunda bir yere koyalım.
                // P noktasının koordinatları P(centerX - R*1.5, centerY) gibi bir şey olabilir.
                // Ancak P'yi A,B,D,C noktalarına göre hesaplamak daha doğru.
                // İki kesen: AD ve BC'nin kesişimi P değil. PB ve PD kesenleri.
                // P noktasını sabit bir yere koyup oradan geçen kesenler çizmek daha kolay olabilir.
                // P noktasını çemberin dışında, x ekseni üzerinde (centerX - radius * 1.5, centerY) alalım
                const Px = centerX - radius * 1.2; // Daha yakına alalım
                const Py = centerY;

                // P'den geçen ve B, A noktalarından geçen doğru
                // P'den geçen ve D, C noktalarından geçen doğru
                // Bu noktaları P'ye göre ayarlamak daha mantıklı.
                // Ancak yay ölçüleri verildiği için, yaylardan gidip kesişimi bulmak daha iyi.
                // Çizilecek doğrular: AD ve BC. Kesişimleri P.
                const P_intersect = getLineIntersection(Ax,Ay,Dx,Dy, Bx,By,Cx,Cy);

                if(P_intersect) {
                    const Px_calc = P_intersect.x;
                    const Py_calc = P_intersect.y;
                    
                    // P'den A'ya ve B'ye uzanan ışınlar (PAB keseni)
                    // P'den C'ye ve D'ye uzanan ışınlar (PCD keseni)
                    // Bu durumda noktalar A, C, B, D sırasıyla olmalıydı.
                    // A, C yakın yayın uçları. B, D uzak yayın uçları.
                    // PAB keseni ve PCD keseni. P dış nokta.
                    // Kesenler: PA ve PC. (P,A,B aynı doğrultuda, P,C,D aynı doğrultuda)

                    // A,B,C,D noktalarını yeniden tanımlayalım:
                    // P noktasını (centerX - radius*1.5, centerY) alalım.
                    const PextX = centerX - radius * 1.8;
                    const PextY = centerY;

                    // P'den çembere teğetler ya da kesenler çiz.
                    // İki kesen durumu:
                    // P noktasından geçen iki doğru çizeceğiz, bunlar çemberi ikişer noktada keser.
                    // Bu doğruların açılarını öyle ayarlamalıyız ki kesilen yaylar arc1 ve arc2 olsun. Bu zor.

                    // En kolayı: Yayları belirle, kesenleri çiz, kesişimlerini bul.
                    // Yay AC (yakın) ve BD (uzak). Kesenler PB ve PD.
                    // P noktası AB ve CD doğrularının kesişimi olmalı (P,A,B ve P,C,D noktaları doğrusal olacak şekilde)

                    // Çizim için: A, C (yakın yay) ve B, D (uzak yay) noktaları.
                    // Kesenler: P noktasından B'ye ve A'ya giden (PAB), P'den D'ye ve C'ye giden (PCD).
                    // P noktası, AD ve BC doğrularının kesişimi olacak.
                    // Çizim için noktalarımız var: Ax,Ay, Bx,By, Cx,Cy, Dx,Dy
                    // Kesenler: PD ve PB. Bu kesenlerin çemberi kestiği diğer noktalar sırasıyla C ve A.
                    // P, C, D doğrusal ve P, A, B doğrusal olmalı.

                    // P = AD ∩ BC (AD ve BC doğrularının kesişimi)
                    // AD ve BC doğrularını uzatarak çizelim.
                    const intersection = getLineIntersection(Ax, Ay, Dx, Dy, Bx, By, Cx, Cy);
                    if (intersection) {
                        const { x: Px_final, y: Py_final } = intersection;
                        drawPoint(Px_final, Py_final, 'P', 'red');
                        drawLine(Px_final, Py_final, Bx, By, 'blue', true, radius*0.5); // Uzat
                        drawLine(Px_final, Py_final, Dx, Dy, 'blue', true, radius*0.5); // Uzat

                        // Açı (BPD açısı)
                        drawAngleArc(Px_final, Py_final, 30, angleBetweenPoints(Px_final,Py_final,Bx,By), angleBetweenPoints(Px_final,Py_final,Dx,Dy), 'red', true);
                         drawText(`α`, Px_final + 35 * Math.cos( (angleBetweenPoints(Px_final,Py_final,Bx,By) + angleBetweenPoints(Px_final,Py_final,Dx,Dy))/2 ),
                                       Py_final + 35 * Math.sin( (angleBetweenPoints(Px_final,Py_final,Bx,By) + angleBetweenPoints(Px_final,Py_final,Dx,Dy))/2 ), 'red');

                    } else {
                        drawText("Kesenler kesişmiyor (paralel olabilir)", centerX, 20, "red", "14px Arial", "center");
                    }

                    // Yayları çiz
                    ctx.beginPath(); // Yakın yay AC
                    ctx.arc(centerX, centerY, radius * 0.9, startAngle_A, endAngle_C, false);
                    ctx.lineWidth = 3; ctx.strokeStyle = 'purple'; ctx.stroke();
                    drawText(`m(AC)=${p.arc2}°`, centerX + radius * Math.cos(0), centerY + radius * Math.sin(0) - 5, 'purple', '10px Arial', 'center');


                    ctx.beginPath(); // Uzak yay BD
                    ctx.arc(centerX, centerY, radius * 0.9, startAngle_B, endAngle_D, false);
                    ctx.lineWidth = 3; ctx.strokeStyle = 'orange'; ctx.stroke();
                    // Uzak yayın etiketini biraz dışarıda gösterelim
                    const midAngleBD = (startAngle_B + endAngle_D) / 2;
                    drawText(`m(BD)=${p.arc1}°`, centerX + radius * 1.05 * Math.cos(midAngleBD), centerY + radius * 1.05 * Math.sin(midAngleBD), 'orange', '10px Arial', 'center');


                    drawPoint(Ax, Ay, 'A'); drawPoint(Bx, By, 'B');
                    drawPoint(Cx, Cy, 'C'); drawPoint(Dx, Dy, 'D');
                } else {
                     drawText("Kesişim hesaplanamadı", centerX, 20, "red", "14px Arial", "center");
                }


            }
        }
    };

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    function toDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    function drawCircleBase() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#333';
        ctx.stroke();
    }

    function drawPoint(x, y, label = '', color = 'black', font = "12px Arial") {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        if (label) {
            ctx.fillStyle = color;
            ctx.font = font;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(label, x, y - 6);
        }
    }

    function drawLine(x1, y1, x2, y2, color = 'black', extend = false, extensionLength = 50) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
         if (extend) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx*dx + dy*dy);
            ctx.lineTo(x1 + dx/len * (len + extensionLength), y1 + dy/len * (len + extensionLength));
        } else {
            ctx.lineTo(x2, y2);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    function drawText(text, x, y, color = 'black', font = "12px Arial", align="left", baseline="alphabetic") {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
    }

    // For inscribed and tangent-chord angle visualization (drawing the angle arc)
    function angleBetweenPoints(cx, cy, p1x, p1y, p2x, p2y) {
        if(p2x !== undefined) { // if three points are given, calculate angle p1-c-p2
            const angle1 = Math.atan2(p1y - cy, p1x - cx);
            const angle2 = Math.atan2(p2y - cy, p2x - cx);
            let angle = angle2 - angle1;
            // Normalize to [0, 2*PI] or [-PI, PI] as needed, or ensure it's the smaller angle
             if (angle > Math.PI) angle -= 2 * Math.PI;
             if (angle < -Math.PI) angle += 2 * Math.PI;
            return angle; // This is the signed angle difference.
        } else { // if two points, calculate angle of vector c-p1 from x-axis
            return Math.atan2(p1y - cy, p1x - cx);
        }
    }


    function drawAngleArc(cx, cy, r, startAngle, endAngle, color = 'red', adjustSweep = false) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle, false); // Default counter-clockwise
        // For inscribed angles, we might need to ensure the arc sweeps the correct way
        if (adjustSweep) {
            let sweep = endAngle - startAngle;
            // Ensure sweep is the smaller angle (e.g. less than PI)
            // This logic might need refinement based on specific angle geometry
            if (Math.abs(sweep) > Math.PI) {
                 if (sweep > 0) sweep -= 2 * Math.PI; // make it negative, smaller sweep
                 else sweep += 2 * Math.PI; // make it positive, smaller sweep
            }
            // Re-draw if adjustment needed
            if(sweep !== (endAngle-startAngle)){
                ctx.beginPath();
                ctx.arc(cx, cy, r, startAngle, startAngle + sweep, sweep < 0);
            }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
    
    // Line intersection: (x1,y1)-(x2,y2) and (x3,y3)-(x4,y4)
    function getLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) return null; // Parallel or coincident

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        // if (t >= 0 && t <= 1 && u >= 0 && u <= 1) { // Check if intersection is on segments
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        // }
        // return null; // Not on segments, but lines intersect
    }


    function updateVisualization() {
        const definition = angleDefinitions[currentAngleType];
        drawCircleBase();
        definition.draw(params);
        const calculated = definition.calculate(params);
        calculatedAngleDisplay.textContent = `${calculated.toFixed(1)}°`;
    }

    function setupControls() {
        const definition = angleDefinitions[currentAngleType];
        angleNameDisplay.textContent = definition.name;
        angleRuleDisplay.textContent = definition.rule;
        angleFormulaDisplay.innerHTML = definition.formula; // Use innerHTML for potential formatting

        slidersContainer.innerHTML = ''; // Clear previous sliders
        definition.sliders.forEach(sliderConfig => {
            const label = document.createElement('label');
            label.htmlFor = sliderConfig.id;
            label.textContent = `${sliderConfig.label}: `;
            
            const valueSpan = document.createElement('span');
            valueSpan.id = `${sliderConfig.id}Value`;
            valueSpan.textContent = params[sliderConfig.id] || sliderConfig.value; // Use current or default
            
            label.appendChild(valueSpan);
            slidersContainer.appendChild(label);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = sliderConfig.id;
            slider.min = sliderConfig.min;
            slider.max = sliderConfig.max;
            slider.value = params[sliderConfig.id] || sliderConfig.value; // Use current or default
            params[sliderConfig.id] = parseFloat(slider.value); // Ensure params has initial value

            slider.addEventListener('input', (e) => {
                params[sliderConfig.id] = parseFloat(e.target.value);
                document.getElementById(`${sliderConfig.id}Value`).textContent = e.target.value;
                // Special handling for exterior angle arcs
                if (currentAngleType === 'exterior') {
                    if (sliderConfig.id === 'arc2' && params.arc2 >= params.arc1) {
                        params.arc2 = params.arc1 -1; // Ensure arc2 is smaller
                        e.target.value = params.arc2;
                        document.getElementById(`${sliderConfig.id}Value`).textContent = params.arc2;
                    } else if (sliderConfig.id === 'arc1' && params.arc1 <= params.arc2) {
                        params.arc1 = params.arc2 + 1; // Ensure arc1 is larger
                         e.target.value = params.arc1;
                        document.getElementById(`${sliderConfig.id}Value`).textContent = params.arc1;
                    }
                }
                updateVisualization();
            });
            slidersContainer.appendChild(slider);
            slidersContainer.appendChild(document.createElement('br'));
        });
        updateVisualization();
    }

    angleTypeSelect.addEventListener('change', (e) => {
        currentAngleType = e.target.value;
        // Reset params or use defaults specific to the new angle type
        const definition = angleDefinitions[currentAngleType];
        params = {}; // Reset params
        definition.sliders.forEach(s => params[s.id] = s.value); // Set default values from config

        setupControls();
    });

    // Initial setup
    setupControls();
});