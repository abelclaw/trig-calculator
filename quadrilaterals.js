// ===== QUADRILATERALS PRACTICE =====
let quadInitialized = false;
let quadDifficulty = 'easy';
let quadStats = { correct: 0, wrong: 0, streak: 0 };
let quadCurrentProblem = null;
let quadAnswered = false;
let quadProofSelections = {};

function setQuadDifficulty(d) {
    quadDifficulty = d;
    document.querySelectorAll('.quad-container .diff-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('quadDiff' + d.charAt(0).toUpperCase() + d.slice(1)).classList.add('active');
    nextQuadProblem();
}

function updateQuadUI() {
    document.getElementById('quadCorrect').textContent = quadStats.correct;
    document.getElementById('quadWrong').textContent = quadStats.wrong;
    document.getElementById('quadStreak').textContent = quadStats.streak;
    document.getElementById('quadStreakFill').style.width = Math.min(100, (quadStats.streak / 10) * 100) + '%';
}

function qpick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function qshuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

// ============================================================
// DIAGRAM DRAWING HELPERS
// ============================================================

function quadResizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.getContext('2d').scale(dpr, dpr);
    return { w: rect.width, h: rect.height };
}

// Draw a quadrilateral from 4 vertices [{x,y}] in 0-1 coords
function drawQuad(ctx, w, h, opts) {
    const { vertices, labels, sideLabels, tickMarks, rightAngles, diagonals, angleLabels, fillColor, highlightSides, dashSides } = opts;
    const pts = vertices.map(v => ({ x: v.x * w, y: v.y * h }));

    // Fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = fillColor || 'rgba(56, 189, 248, 0.06)';
    ctx.fill();

    // Sides
    const sides = [[0,1],[1,2],[2,3],[3,0]];
    sides.forEach(([i,j], idx) => {
        const isHL = highlightSides && highlightSides.includes(idx);
        const isDash = dashSides && dashSides.includes(idx);
        ctx.beginPath();
        if (isDash) ctx.setLineDash([6, 4]);
        else ctx.setLineDash([]);
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = isHL ? '#fbbf24' : '#38bdf8';
        ctx.lineWidth = isHL ? 3.5 : 2.5;
        ctx.stroke();
        ctx.setLineDash([]);
    });

    // Tick marks for equal sides
    if (tickMarks) {
        tickMarks.forEach(({ side, count }) => {
            const [i, j] = sides[side];
            const mx = (pts[i].x + pts[j].x) / 2;
            const my = (pts[i].y + pts[j].y) / 2;
            const dx = pts[j].x - pts[i].x;
            const dy = pts[j].y - pts[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / len * 8;
            const ny = dx / len * 8;
            for (let t = 0; t < count; t++) {
                const offset = (t - (count - 1) / 2) * 6;
                const tx = mx + (dx / len) * offset;
                const ty = my + (dy / len) * offset;
                ctx.beginPath();
                ctx.moveTo(tx + nx, ty + ny);
                ctx.lineTo(tx - nx, ty - ny);
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }

    // Parallel arrows on sides
    if (opts.parallelMarks) {
        opts.parallelMarks.forEach(({ side, count }) => {
            const [i, j] = sides[side];
            const mx = (pts[i].x + pts[j].x) / 2;
            const my = (pts[i].y + pts[j].y) / 2;
            const dx = pts[j].x - pts[i].x;
            const dy = pts[j].y - pts[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len;
            const uy = dy / len;
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 2;
            for (let t = 0; t < count; t++) {
                const ox = (t - (count - 1) / 2) * 8;
                const ax = mx + ux * ox;
                const ay = my + uy * ox;
                ctx.beginPath();
                ctx.moveTo(ax - ux * 5 - uy * 5, ay - uy * 5 + ux * 5);
                ctx.lineTo(ax, ay);
                ctx.lineTo(ax - ux * 5 + uy * 5, ay - uy * 5 - ux * 5);
                ctx.stroke();
            }
        });
    }

    // Right angle markers
    if (rightAngles) {
        rightAngles.forEach(vi => {
            const prev = (vi + 3) % 4;
            const next = (vi + 1) % 4;
            const p = pts[vi];
            const d1x = pts[prev].x - p.x, d1y = pts[prev].y - p.y;
            const len1 = Math.sqrt(d1x * d1x + d1y * d1y);
            const d2x = pts[next].x - p.x, d2y = pts[next].y - p.y;
            const len2 = Math.sqrt(d2x * d2x + d2y * d2y);
            const sq = 10;
            const u1x = d1x / len1 * sq, u1y = d1y / len1 * sq;
            const u2x = d2x / len2 * sq, u2y = d2y / len2 * sq;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x + u1x, p.y + u1y);
            ctx.lineTo(p.x + u1x + u2x, p.y + u1y + u2y);
            ctx.lineTo(p.x + u2x, p.y + u2y);
            ctx.stroke();
        });
    }

    // Diagonals
    if (diagonals) {
        diagonals.forEach(([i, j]) => {
            ctx.beginPath();
            ctx.setLineDash([5, 4]);
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    // Vertex labels
    if (labels) {
        ctx.font = 'bold 16px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const cx = pts.reduce((s, p) => s + p.x, 0) / 4;
        const cy = pts.reduce((s, p) => s + p.y, 0) / 4;
        labels.forEach((label, i) => {
            if (!label) return;
            const dx = pts[i].x - cx;
            const dy = pts[i].y - cy;
            const len = Math.sqrt(dx * dx + dy * dy);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText(label, pts[i].x + (dx / len) * 20, pts[i].y + (dy / len) * 20);
        });
    }

    // Side labels
    if (sideLabels) {
        ctx.font = '13px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        sideLabels.forEach((label, idx) => {
            if (!label) return;
            const [i, j] = sides[idx];
            const mx = (pts[i].x + pts[j].x) / 2;
            const my = (pts[i].y + pts[j].y) / 2;
            const dx = pts[j].x - pts[i].x;
            const dy = pts[j].y - pts[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / len * 16;
            const ny = dx / len * 16;
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(label, mx + nx, my + ny);
        });
    }

    // Angle labels inside the quadrilateral
    if (angleLabels) {
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const cx = pts.reduce((s, p) => s + p.x, 0) / 4;
        const cy = pts.reduce((s, p) => s + p.y, 0) / 4;
        angleLabels.forEach((label, i) => {
            if (!label) return;
            const dx = cx - pts[i].x;
            const dy = cy - pts[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(label, pts[i].x + dx / len * 28, pts[i].y + dy / len * 22);
        });
    }
}

// Draw a labeled rectangle with dimensions
function drawRectDims(ctx, w, h, rw, rh, labelW, labelH) {
    const verts = [
        { x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 },
        { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }
    ];
    drawQuad(ctx, w, h, {
        vertices: verts,
        labels: ['A', 'B', 'C', 'D'],
        rightAngles: [0, 1, 2, 3],
        sideLabels: [labelW, labelH, null, null]
    });
}

// ============================================================
// MC RENDERING
// ============================================================

function selectQuadChoice(btn, value) {
    if (quadAnswered) return;
    btn.parentElement.querySelectorAll('.geo-choice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    quadProofSelections['mc'] = value;
}

// ============================================================
// PROBLEM GENERATORS
// ============================================================

// -- EASY PROBLEMS --

const QUAD_EASY_PROBLEMS = [
    // 1 - Classification
    () => ({
        type: 'Classification',
        question: 'Which quadrilateral has exactly one pair of parallel sides?',
        format: 'mc',
        choices: qshuffle(['Trapezoid', 'Parallelogram', 'Rectangle', 'Rhombus']),
        correct: 'Trapezoid',
        hint: 'Think about which shapes have parallel sides. A parallelogram has two pairs.',
        explanation: 'A <strong>trapezoid</strong> is defined as a quadrilateral with exactly one pair of parallel sides. Parallelograms, rectangles, and rhombuses all have two pairs.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.3, y: 0.25 }, { x: 0.7, y: 0.25 },
                    { x: 0.85, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                parallelMarks: [{ side: 0, count: 1 }, { side: 2, count: 1 }]
            });
            ctx.font = '14px system-ui';
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'center';
            ctx.fillText('Trapezoid', w / 2, h * 0.95);
        }
    }),

    // 2 - Classification
    () => ({
        type: 'Classification',
        question: 'A quadrilateral has four right angles and four equal sides. What is it?',
        format: 'mc',
        choices: qshuffle(['Square', 'Rectangle', 'Rhombus', 'Parallelogram']),
        correct: 'Square',
        hint: 'Which shape combines the properties of a rectangle AND a rhombus?',
        explanation: 'A <strong>square</strong> has four right angles (like a rectangle) and four equal sides (like a rhombus). It is both a rectangle and a rhombus.',
        drawDiagram: (ctx, w, h) => {
            const s = Math.min(w, h) * 0.35;
            const cx = w / 2, cy = h / 2;
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: (cx - s) / w, y: (cy - s) / h }, { x: (cx + s) / w, y: (cy - s) / h },
                    { x: (cx + s) / w, y: (cy + s) / h }, { x: (cx - s) / w, y: (cy + s) / h }
                ],
                labels: ['A', 'B', 'C', 'D'],
                rightAngles: [0, 1, 2, 3],
                tickMarks: [{ side: 0, count: 1 }, { side: 1, count: 1 }, { side: 2, count: 1 }, { side: 3, count: 1 }]
            });
        }
    }),

    // 3 - Classification
    () => ({
        type: 'Classification',
        question: 'Which quadrilateral has two pairs of consecutive equal sides but is NOT a parallelogram?',
        format: 'mc',
        choices: qshuffle(['Kite', 'Rhombus', 'Rectangle', 'Trapezoid']),
        correct: 'Kite',
        hint: 'This shape looks like a diamond kite you fly in the sky.',
        explanation: 'A <strong>kite</strong> has two pairs of consecutive (adjacent) equal sides. Unlike a parallelogram, its opposite sides are not parallel.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.5, y: 0.1 }, { x: 0.8, y: 0.4 },
                    { x: 0.5, y: 0.9 }, { x: 0.2, y: 0.4 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                tickMarks: [
                    { side: 0, count: 1 }, { side: 3, count: 1 },
                    { side: 1, count: 2 }, { side: 2, count: 2 }
                ]
            });
        }
    }),

    // 4 - Properties
    () => ({
        type: 'Properties',
        question: 'How many pairs of parallel sides does a parallelogram have?',
        format: 'mc',
        choices: qshuffle(['2', '0', '1', '4']),
        correct: '2',
        hint: 'The word "parallelogram" contains the word "parallel."',
        explanation: 'A <strong>parallelogram</strong> has exactly <strong>2 pairs</strong> of parallel sides. Opposite sides are parallel and equal in length.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.25, y: 0.25 }, { x: 0.8, y: 0.25 },
                    { x: 0.75, y: 0.75 }, { x: 0.2, y: 0.75 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                parallelMarks: [
                    { side: 0, count: 1 }, { side: 2, count: 1 },
                    { side: 1, count: 2 }, { side: 3, count: 2 }
                ]
            });
        }
    }),

    // 5 - Properties
    () => ({
        type: 'Properties',
        question: 'Which of these is NOT a property of all rectangles?',
        format: 'mc',
        choices: qshuffle(['All sides are equal', 'Opposite sides are equal', 'All angles are 90°', 'Diagonals are equal in length']),
        correct: 'All sides are equal',
        hint: 'Think about a long, narrow rectangle. Are all four sides the same?',
        explanation: 'Rectangles have opposite sides equal, all right angles, and equal diagonals. However, all four sides are equal only in a <strong>square</strong>, which is a special rectangle.'
    }),

    // 6 - Angles
    () => ({
        type: 'Angles',
        question: 'The angles of any quadrilateral add up to how many degrees?',
        format: 'mc',
        choices: qshuffle(['360°', '180°', '270°', '540°']),
        correct: '360°',
        hint: 'A quadrilateral can be split into two triangles. Each triangle has angles summing to 180°.',
        explanation: 'The interior angles of any quadrilateral sum to <strong>360°</strong>. You can prove this by drawing a diagonal, splitting it into two triangles (180° + 180° = 360°).',
        drawDiagram: (ctx, w, h) => {
            const verts = [
                { x: 0.2, y: 0.3 }, { x: 0.75, y: 0.2 },
                { x: 0.85, y: 0.8 }, { x: 0.15, y: 0.75 }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                labels: ['A', 'B', 'C', 'D'],
                diagonals: [[0, 2]]
            });
            ctx.font = '12px system-ui';
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'center';
            ctx.fillText('Two triangles: 180° + 180° = 360°', w / 2, h * 0.95);
        }
    }),

    // 7 - Angles
    () => ({
        type: 'Angles',
        question: 'Three angles of a quadrilateral are 90°, 90°, and 80°. What is the fourth angle?',
        format: 'mc',
        choices: qshuffle(['100°', '90°', '80°', '110°']),
        correct: '100°',
        hint: 'All four angles must sum to 360°. Subtract the three known angles.',
        explanation: '90° + 90° + 80° + x = 360°, so x = 360° − 260° = <strong>100°</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.15, y: 0.2 }, { x: 0.75, y: 0.2 },
                    { x: 0.85, y: 0.8 }, { x: 0.15, y: 0.8 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['90°', '90°', '?', '80°'],
                rightAngles: [0, 1]
            });
        }
    }),

    // 8 - Area
    () => ({
        type: 'Area',
        question: 'What is the area of a rectangle with length 12 cm and width 5 cm?',
        format: 'mc',
        choices: qshuffle(['60 cm²', '34 cm²', '17 cm²', '120 cm²']),
        correct: '60 cm²',
        hint: 'Area of a rectangle = length × width.',
        explanation: 'Area = length × width = 12 × 5 = <strong>60 cm²</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.15, y: 0.25 }, { x: 0.85, y: 0.25 },
                    { x: 0.85, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                labels: ['', '', '', ''],
                rightAngles: [0, 1, 2, 3],
                sideLabels: ['12 cm', '5 cm', null, null]
            });
        }
    }),

    // 9 - Area
    () => ({
        type: 'Area',
        question: 'What is the area of a square with side length 9 m?',
        format: 'mc',
        choices: qshuffle(['81 m²', '36 m²', '18 m²', '72 m²']),
        correct: '81 m²',
        hint: 'Area of a square = side × side = side².',
        explanation: 'Area = 9² = 9 × 9 = <strong>81 m²</strong>.',
        drawDiagram: (ctx, w, h) => {
            const s = Math.min(w, h) * 0.35;
            const cx = w / 2, cy = h / 2;
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: (cx - s) / w, y: (cy - s) / h }, { x: (cx + s) / w, y: (cy - s) / h },
                    { x: (cx + s) / w, y: (cy + s) / h }, { x: (cx - s) / w, y: (cy + s) / h }
                ],
                rightAngles: [0, 1, 2, 3],
                sideLabels: ['9 m', null, null, null],
                tickMarks: [{ side: 0, count: 1 }, { side: 1, count: 1 }, { side: 2, count: 1 }, { side: 3, count: 1 }]
            });
        }
    }),

    // 10 - Area
    () => ({
        type: 'Area',
        question: 'A parallelogram has a base of 10 cm and a height of 6 cm. What is its area?',
        format: 'mc',
        choices: qshuffle(['60 cm²', '16 cm²', '32 cm²', '30 cm²']),
        correct: '60 cm²',
        hint: 'Area of a parallelogram = base × height (not base × side).',
        explanation: 'Area = base × height = 10 × 6 = <strong>60 cm²</strong>. Note: we use the perpendicular height, not the slanted side.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.25, y: 0.25 }, { x: 0.85, y: 0.25 },
                    { x: 0.75, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                labels: ['', '', '', ''],
                sideLabels: ['10 cm', null, null, null],
                parallelMarks: [{ side: 0, count: 1 }, { side: 2, count: 1 }]
            });
            // Draw height line
            const hx = 0.25 * w;
            ctx.beginPath();
            ctx.setLineDash([4, 3]);
            ctx.moveTo(hx, 0.25 * h);
            ctx.lineTo(hx, 0.75 * h);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.font = '13px system-ui';
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'right';
            ctx.fillText('6 cm', hx - 6, h * 0.5);
        }
    }),

    // 11 - Perimeter
    () => ({
        type: 'Perimeter',
        question: 'What is the perimeter of a rectangle with length 14 cm and width 8 cm?',
        format: 'mc',
        choices: qshuffle(['44 cm', '22 cm', '112 cm', '36 cm']),
        correct: '44 cm',
        hint: 'Perimeter of a rectangle = 2 × (length + width).',
        explanation: 'Perimeter = 2 × (14 + 8) = 2 × 22 = <strong>44 cm</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.15, y: 0.25 }, { x: 0.85, y: 0.25 },
                    { x: 0.85, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                rightAngles: [0, 1, 2, 3],
                sideLabels: ['14 cm', '8 cm', '14 cm', '8 cm']
            });
        }
    }),

    // 12 - Perimeter
    () => ({
        type: 'Perimeter',
        question: 'A rhombus has a side length of 7 cm. What is its perimeter?',
        format: 'mc',
        choices: qshuffle(['28 cm', '14 cm', '21 cm', '49 cm']),
        correct: '28 cm',
        hint: 'A rhombus has four equal sides.',
        explanation: 'Since all four sides of a rhombus are equal, perimeter = 4 × 7 = <strong>28 cm</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.5, y: 0.12 }, { x: 0.82, y: 0.5 },
                    { x: 0.5, y: 0.88 }, { x: 0.18, y: 0.5 }
                ],
                sideLabels: ['7 cm', '7 cm', '7 cm', '7 cm'],
                tickMarks: [{ side: 0, count: 1 }, { side: 1, count: 1 }, { side: 2, count: 1 }, { side: 3, count: 1 }]
            });
        }
    }),

    // 13 - Classification
    () => ({
        type: 'Classification',
        question: 'Which quadrilateral has opposite sides that are both parallel and equal, but does NOT require right angles?',
        format: 'mc',
        choices: qshuffle(['Parallelogram', 'Rectangle', 'Square', 'Trapezoid']),
        correct: 'Parallelogram',
        hint: 'Rectangles and squares have right angles. Trapezoids have only one pair of parallel sides.',
        explanation: 'A <strong>parallelogram</strong> has opposite sides parallel and equal. It does not require right angles (though rectangles, which are special parallelograms, do).',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.3, y: 0.2 }, { x: 0.85, y: 0.2 },
                    { x: 0.7, y: 0.8 }, { x: 0.15, y: 0.8 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                parallelMarks: [
                    { side: 0, count: 1 }, { side: 2, count: 1 },
                    { side: 1, count: 2 }, { side: 3, count: 2 }
                ],
                tickMarks: [
                    { side: 0, count: 1 }, { side: 2, count: 1 },
                    { side: 1, count: 2 }, { side: 3, count: 2 }
                ]
            });
        }
    }),

    // 14 - Angles
    () => ({
        type: 'Angles',
        question: 'In a parallelogram, opposite angles are equal. If one angle is 70°, what is the angle adjacent to it?',
        format: 'mc',
        choices: qshuffle(['110°', '70°', '90°', '140°']),
        correct: '110°',
        hint: 'Consecutive angles in a parallelogram are supplementary (add to 180°).',
        explanation: 'In a parallelogram, consecutive angles are supplementary: 70° + x = 180°, so x = <strong>110°</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.25, y: 0.25 }, { x: 0.85, y: 0.25 },
                    { x: 0.75, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['70°', '?', '70°', '?']
            });
        }
    }),

    // 15 - Perimeter
    () => ({
        type: 'Perimeter',
        question: 'A square has a perimeter of 48 cm. What is the length of one side?',
        format: 'mc',
        choices: qshuffle(['12 cm', '24 cm', '16 cm', '8 cm']),
        correct: '12 cm',
        hint: 'A square has four equal sides. Perimeter = 4 × side.',
        explanation: 'Perimeter = 4 × side, so side = 48 ÷ 4 = <strong>12 cm</strong>.'
    }),
];

// -- MEDIUM PROBLEMS --

const QUAD_MEDIUM_PROBLEMS = [
    // 1 - Diagonals
    () => ({
        type: 'Diagonals',
        question: 'In which of these quadrilaterals do the diagonals always bisect each other?',
        format: 'mc',
        choices: qshuffle(['Parallelogram', 'Trapezoid', 'Kite', 'General quadrilateral']),
        correct: 'Parallelogram',
        hint: 'This property is shared by all parallelograms (and their special types: rectangles, rhombuses, squares).',
        explanation: 'In a <strong>parallelogram</strong>, the diagonals always bisect each other. This includes rectangles, rhombuses, and squares. Trapezoids and kites do not have this property.',
        drawDiagram: (ctx, w, h) => {
            const verts = [
                { x: 0.25, y: 0.2 }, { x: 0.85, y: 0.2 },
                { x: 0.75, y: 0.8 }, { x: 0.15, y: 0.8 }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                labels: ['A', 'B', 'C', 'D'],
                diagonals: [[0, 2], [1, 3]]
            });
            // Mark midpoint
            const pts = verts.map(v => ({ x: v.x * w, y: v.y * h }));
            const mx = (pts[0].x + pts[2].x) / 2;
            const my = (pts[0].y + pts[2].y) / 2;
            ctx.beginPath();
            ctx.arc(mx, my, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
            ctx.font = 'bold 13px system-ui';
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'left';
            ctx.fillText('M', mx + 8, my - 4);
        }
    }),

    // 2 - Diagonals
    () => ({
        type: 'Diagonals',
        question: 'Which quadrilateral always has perpendicular diagonals?',
        format: 'mc',
        choices: qshuffle(['Rhombus', 'Rectangle', 'Parallelogram', 'Trapezoid']),
        correct: 'Rhombus',
        hint: 'Think about a diamond shape. Its diagonals cross at right angles.',
        explanation: 'In a <strong>rhombus</strong>, the diagonals are always perpendicular (they cross at 90°). Rectangles have equal diagonals but they are not perpendicular (unless it is a square).',
        drawDiagram: (ctx, w, h) => {
            const verts = [
                { x: 0.5, y: 0.1 }, { x: 0.82, y: 0.5 },
                { x: 0.5, y: 0.9 }, { x: 0.18, y: 0.5 }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                labels: ['A', 'B', 'C', 'D'],
                diagonals: [[0, 2], [1, 3]],
                tickMarks: [{ side: 0, count: 1 }, { side: 1, count: 1 }, { side: 2, count: 1 }, { side: 3, count: 1 }]
            });
            // Draw small right angle at center
            const cx = w * 0.5, cy = h * 0.5;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 8, cy - 8); ctx.lineTo(cx, cy - 8);
            ctx.stroke();
        }
    }),

    // 3 - Area
    () => ({
        type: 'Area',
        question: 'A trapezoid has parallel bases of 8 cm and 14 cm, and a height of 5 cm. What is its area?',
        format: 'mc',
        choices: qshuffle(['55 cm²', '110 cm²', '70 cm²', '40 cm²']),
        correct: '55 cm²',
        hint: 'Area of a trapezoid = ½ × (base₁ + base₂) × height.',
        explanation: 'Area = ½ × (8 + 14) × 5 = ½ × 22 × 5 = <strong>55 cm²</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.35, y: 0.25 }, { x: 0.65, y: 0.25 },
                    { x: 0.8, y: 0.75 }, { x: 0.2, y: 0.75 }
                ],
                sideLabels: ['8 cm', null, '14 cm', null],
                parallelMarks: [{ side: 0, count: 1 }, { side: 2, count: 1 }]
            });
            // Height line
            const hx = 0.35 * w;
            ctx.beginPath();
            ctx.setLineDash([4, 3]);
            ctx.moveTo(hx, 0.25 * h);
            ctx.lineTo(hx, 0.75 * h);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.font = '13px system-ui';
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'right';
            ctx.fillText('5 cm', hx - 6, h * 0.5);
        }
    }),

    // 4 - Area
    () => ({
        type: 'Area',
        question: 'A rhombus has diagonals of length 10 cm and 24 cm. What is its area?',
        format: 'mc',
        choices: qshuffle(['120 cm²', '240 cm²', '34 cm²', '60 cm²']),
        correct: '120 cm²',
        hint: 'Area of a rhombus = ½ × d₁ × d₂, where d₁ and d₂ are the diagonal lengths.',
        explanation: 'Area = ½ × d₁ × d₂ = ½ × 10 × 24 = <strong>120 cm²</strong>.',
        drawDiagram: (ctx, w, h) => {
            const verts = [
                { x: 0.5, y: 0.1 }, { x: 0.85, y: 0.5 },
                { x: 0.5, y: 0.9 }, { x: 0.15, y: 0.5 }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                diagonals: [[0, 2], [1, 3]]
            });
            ctx.font = '13px system-ui';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('24 cm', w * 0.5 + 20, h * 0.5 - 8);
            ctx.save();
            ctx.translate(w * 0.5 - 10, h * 0.5);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('10 cm', 0, 0);
            ctx.restore();
        }
    }),

    // 5 - Area
    () => ({
        type: 'Area',
        question: 'A kite has diagonals of length 6 cm and 16 cm. What is its area?',
        format: 'mc',
        choices: qshuffle(['48 cm²', '96 cm²', '22 cm²', '24 cm²']),
        correct: '48 cm²',
        hint: 'Area of a kite = ½ × d₁ × d₂ (same formula as a rhombus).',
        explanation: 'Area = ½ × d₁ × d₂ = ½ × 6 × 16 = <strong>48 cm²</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.5, y: 0.08 }, { x: 0.75, y: 0.35 },
                    { x: 0.5, y: 0.92 }, { x: 0.25, y: 0.35 }
                ],
                diagonals: [[0, 2], [1, 3]],
                tickMarks: [
                    { side: 0, count: 1 }, { side: 3, count: 1 },
                    { side: 1, count: 2 }, { side: 2, count: 2 }
                ]
            });
            ctx.font = '13px system-ui';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'left';
            ctx.fillText('6 cm', w * 0.52, h * 0.35);
            ctx.fillText('16 cm', w * 0.53, h * 0.55);
        }
    }),

    // 6 - Angles
    () => ({
        type: 'Angles',
        question: 'In a parallelogram ABCD, angle A = 55°. What is angle B?',
        format: 'mc',
        choices: qshuffle(['125°', '55°', '110°', '135°']),
        correct: '125°',
        hint: 'Consecutive angles in a parallelogram are supplementary (sum to 180°).',
        explanation: 'Consecutive angles in a parallelogram are supplementary: A + B = 180°, so B = 180° − 55° = <strong>125°</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.25, y: 0.25 }, { x: 0.85, y: 0.25 },
                    { x: 0.75, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['55°', '?', null, null]
            });
        }
    }),

    // 7 - Angles
    () => ({
        type: 'Angles',
        question: 'In an isosceles trapezoid, the two base angles are each 65°. What are the two upper angles?',
        format: 'mc',
        choices: qshuffle(['115° each', '65° each', '130° each', '100° each']),
        correct: '115° each',
        hint: 'The angle sum is 360°. In an isosceles trapezoid, the two upper angles are equal.',
        explanation: 'Sum of all angles = 360°. Two base angles = 65° + 65° = 130°. Remaining = 360° − 130° = 230°. Each upper angle = 230° ÷ 2 = <strong>115°</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.35, y: 0.2 }, { x: 0.65, y: 0.2 },
                    { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['?', '?', '65°', '65°'],
                tickMarks: [{ side: 1, count: 1 }, { side: 3, count: 1 }]
            });
        }
    }),

    // 8 - Properties
    () => ({
        type: 'Properties',
        question: '"The diagonals of a rectangle are always equal in length." Is this statement Always, Sometimes, or Never true?',
        format: 'mc',
        choices: qshuffle(['Always', 'Sometimes', 'Never']),
        correct: 'Always',
        hint: 'Think about the symmetry of a rectangle.',
        explanation: 'This is <strong>always</strong> true. In every rectangle, the two diagonals have exactly the same length. This follows from the congruence of the triangles formed by the diagonals.'
    }),

    // 9 - Properties
    () => ({
        type: 'Properties',
        question: '"A parallelogram is a rectangle." Is this statement Always, Sometimes, or Never true?',
        format: 'mc',
        choices: qshuffle(['Sometimes', 'Always', 'Never']),
        correct: 'Sometimes',
        hint: 'Is every parallelogram a rectangle? Can a parallelogram ever be a rectangle?',
        explanation: 'This is <strong>sometimes</strong> true. A parallelogram is a rectangle only when all its angles are 90°. Not all parallelograms have right angles, but some do.'
    }),

    // 10 - Properties
    () => ({
        type: 'Properties',
        question: '"A trapezoid has two pairs of parallel sides." Is this statement Always, Sometimes, or Never true?',
        format: 'mc',
        choices: qshuffle(['Never', 'Sometimes', 'Always']),
        correct: 'Never',
        hint: 'By definition, a trapezoid has exactly how many pairs of parallel sides?',
        explanation: 'This is <strong>never</strong> true. A trapezoid has exactly one pair of parallel sides by definition. If it had two pairs, it would be a parallelogram.'
    }),

    // 11 - Coordinate Geometry
    () => ({
        type: 'Properties',
        question: 'Points A(0,0), B(4,0), C(4,3), D(0,3) form which type of quadrilateral?',
        format: 'mc',
        choices: qshuffle(['Rectangle', 'Parallelogram (not rectangle)', 'Trapezoid', 'Rhombus']),
        correct: 'Rectangle',
        hint: 'Plot the points and check: are opposite sides equal? Are there right angles?',
        explanation: 'AB = CD = 4, BC = DA = 3 (opposite sides equal), and all angles are 90° (sides are horizontal/vertical). This is a <strong>rectangle</strong> (4 × 3).',
        drawDiagram: (ctx, w, h) => {
            // Draw coordinate grid
            const pad = 40;
            const gw = w - 2 * pad, gh = h - 2 * pad;
            const sx = gw / 5, sy = gh / 4;
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                ctx.beginPath(); ctx.moveTo(pad + i * sx, pad); ctx.lineTo(pad + i * sx, h - pad); ctx.stroke();
            }
            for (let i = 0; i <= 4; i++) {
                ctx.beginPath(); ctx.moveTo(pad, h - pad - i * sy); ctx.lineTo(w - pad, h - pad - i * sy); ctx.stroke();
            }
            // Axes
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, h - pad); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(pad, pad); ctx.stroke();
            // Rectangle
            const pts = [[0,0],[4,0],[4,3],[0,3]].map(([x,y]) => ({ x: pad + x * sx, y: h - pad - y * sy }));
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Labels
            ctx.font = 'bold 13px system-ui';
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = 'center';
            const labels = ['A(0,0)', 'B(4,0)', 'C(4,3)', 'D(0,3)'];
            const offsets = [[0, 14], [0, 14], [0, -8], [0, -8]];
            pts.forEach((p, i) => {
                ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();
                ctx.fillStyle = '#e2e8f0';
                ctx.fillText(labels[i], p.x + offsets[i][0], p.y + offsets[i][1]);
            });
        }
    }),

    // 12 - Coordinate Geometry
    () => ({
        type: 'Properties',
        question: 'Points P(1,1), Q(5,1), R(6,4), S(2,4) form which quadrilateral? (Opposite sides: PQ ∥ SR and PS ∥ QR)',
        format: 'mc',
        choices: qshuffle(['Parallelogram', 'Rectangle', 'Trapezoid', 'Kite']),
        correct: 'Parallelogram',
        hint: 'Check if both pairs of opposite sides are parallel (same slope) and equal in length.',
        explanation: 'PQ and SR are both horizontal with length 4. PS and QR both have slope 3/1 = 3 and length √10. Two pairs of parallel, equal sides means it is a <strong>parallelogram</strong>. It is not a rectangle because the angles are not 90°.'
    }),

    // 13 - Diagonals
    () => ({
        type: 'Diagonals',
        question: 'In which quadrilateral does one diagonal bisect the other but NOT vice versa?',
        format: 'mc',
        choices: qshuffle(['Kite', 'Parallelogram', 'Rectangle', 'Rhombus']),
        correct: 'Kite',
        hint: 'In a kite, the "main" diagonal (connecting the two vertices where unequal sides meet) has a special property.',
        explanation: 'In a <strong>kite</strong>, the main diagonal (axis of symmetry) bisects the other diagonal, but the other diagonal does NOT bisect the main one. In parallelograms, both diagonals bisect each other.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.5, y: 0.08 }, { x: 0.78, y: 0.38 },
                    { x: 0.5, y: 0.92 }, { x: 0.22, y: 0.38 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                diagonals: [[0, 2], [1, 3]],
                tickMarks: [
                    { side: 0, count: 1 }, { side: 3, count: 1 },
                    { side: 1, count: 2 }, { side: 2, count: 2 }
                ]
            });
            // Mark bisection point on BD
            const ix = w * 0.5, iy = h * 0.38;
            ctx.beginPath(); ctx.arc(ix, iy, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444'; ctx.fill();
        }
    }),

    // 14 - Angles
    () => ({
        type: 'Angles',
        question: 'In a rhombus, one angle is 130°. What are the other three angles?',
        format: 'mc',
        choices: qshuffle(['50°, 130°, 50°', '130°, 130°, 130°', '50°, 50°, 50°', '60°, 130°, 40°']),
        correct: '50°, 130°, 50°',
        hint: 'A rhombus is a parallelogram. Opposite angles are equal, consecutive angles are supplementary.',
        explanation: 'Opposite angles are equal: 130° and 130°. Consecutive angles are supplementary: 180° − 130° = 50°. So the angles are <strong>130°, 50°, 130°, 50°</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.5, y: 0.1 }, { x: 0.85, y: 0.5 },
                    { x: 0.5, y: 0.9 }, { x: 0.15, y: 0.5 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['130°', '?', '130°', '?'],
                tickMarks: [{ side: 0, count: 1 }, { side: 1, count: 1 }, { side: 2, count: 1 }, { side: 3, count: 1 }]
            });
        }
    }),

    // 15 - Perimeter
    () => ({
        type: 'Perimeter',
        question: 'A parallelogram has sides of length 13 cm and 9 cm. What is its perimeter?',
        format: 'mc',
        choices: qshuffle(['44 cm', '22 cm', '117 cm', '36 cm']),
        correct: '44 cm',
        hint: 'Opposite sides of a parallelogram are equal. Perimeter = 2(a + b).',
        explanation: 'Perimeter = 2 × (13 + 9) = 2 × 22 = <strong>44 cm</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.25, y: 0.25 }, { x: 0.85, y: 0.25 },
                    { x: 0.75, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                sideLabels: ['13 cm', '9 cm', '13 cm', '9 cm'],
                tickMarks: [
                    { side: 0, count: 1 }, { side: 2, count: 1 },
                    { side: 1, count: 2 }, { side: 3, count: 2 }
                ]
            });
        }
    }),
];

// -- HARD PROBLEMS --

const QUAD_HARD_PROBLEMS = [
    // 1 - Multi-step angles
    () => ({
        type: 'Angles',
        question: 'In parallelogram ABCD, angle A = (3x + 10)° and angle B = (5x − 2)°. Find angle A.',
        format: 'mc',
        choices: qshuffle(['74.5°', '105.5°', '55°', '90°']),
        correct: '74.5°',
        hint: 'Consecutive angles of a parallelogram are supplementary: A + B = 180°.',
        explanation: '(3x + 10) + (5x − 2) = 180 → 8x + 8 = 180 → 8x = 172 → x = 21.5. Angle A = 3(21.5) + 10 = 64.5 + 10 = <strong>74.5°</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.25, y: 0.25 }, { x: 0.85, y: 0.25 },
                    { x: 0.75, y: 0.75 }, { x: 0.15, y: 0.75 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['(3x+10)°', '(5x−2)°', null, null]
            });
        }
    }),

    // 2 - Multi-step angles
    () => ({
        type: 'Angles',
        question: 'In trapezoid ABCD with AB ∥ CD, angle A = 62°. What is angle D?',
        format: 'mc',
        choices: qshuffle(['118°', '62°', '128°', '90°']),
        correct: '118°',
        hint: 'Co-interior angles (same-side interior angles) between parallel lines sum to 180°.',
        explanation: 'Since AB ∥ CD, angles A and D are co-interior angles on transversal AD. Co-interior angles sum to 180°: ∠A + ∠D = 180°, so ∠D = 180° − 62° = <strong>118°</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.2, y: 0.75 }, { x: 0.8, y: 0.75 },
                    { x: 0.65, y: 0.25 }, { x: 0.35, y: 0.25 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['62°', null, null, '?'],
                parallelMarks: [{ side: 0, count: 1 }, { side: 2, count: 1 }]
            });
        }
    }),

    // 3 - Proofs
    () => ({
        type: 'Proofs',
        question: 'Which of the following is sufficient to prove that a parallelogram is a rectangle?',
        format: 'mc',
        choices: qshuffle([
            'One angle is 90°',
            'Opposite sides are equal',
            'Diagonals bisect each other',
            'Opposite angles are equal'
        ]),
        correct: 'One angle is 90°',
        hint: 'A rectangle is a parallelogram with what special property?',
        explanation: 'If a parallelogram has <strong>one 90° angle</strong>, then all angles must be 90° (consecutive angles are supplementary, opposite angles are equal). The other choices are already true for ALL parallelograms.'
    }),

    // 4 - Proofs
    () => ({
        type: 'Proofs',
        question: 'Which condition is NOT sufficient to prove a quadrilateral is a parallelogram?',
        format: 'mc',
        choices: qshuffle([
            'One pair of opposite sides is equal',
            'Both pairs of opposite sides are equal',
            'Both pairs of opposite angles are equal',
            'Diagonals bisect each other'
        ]),
        correct: 'One pair of opposite sides is equal',
        hint: 'Having one pair of opposite sides equal does not guarantee the shape is a parallelogram. You would also need them to be parallel.',
        explanation: 'Having <strong>one pair of opposite sides equal</strong> is NOT sufficient — consider a trapezoid with equal-length non-parallel sides (isosceles trapezoid). You need one pair that is BOTH equal AND parallel, or both pairs equal, etc.'
    }),

    // 5 - Hierarchy
    () => ({
        type: 'Properties',
        question: 'Which statement about the quadrilateral hierarchy is TRUE?',
        format: 'mc',
        choices: qshuffle([
            'Every square is a rhombus',
            'Every rhombus is a square',
            'Every rectangle is a square',
            'Every trapezoid is a parallelogram'
        ]),
        correct: 'Every square is a rhombus',
        hint: 'A square has four equal sides. What is the definition of a rhombus?',
        explanation: 'A <strong>square</strong> has four equal sides and four right angles. Since a rhombus is any quadrilateral with four equal sides, every square is indeed a rhombus. The converses are not true.',
        drawDiagram: (ctx, w, h) => {
            // Draw hierarchy diagram
            ctx.font = 'bold 14px system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const levels = [
                [{ text: 'Quadrilateral', x: 0.5, y: 0.08 }],
                [{ text: 'Trapezoid', x: 0.2, y: 0.28 }, { text: 'Parallelogram', x: 0.65, y: 0.28 }],
                [{ text: 'Rectangle', x: 0.45, y: 0.52 }, { text: 'Rhombus', x: 0.8, y: 0.52 }],
                [{ text: 'Square', x: 0.62, y: 0.76 }]
            ];
            // Draw boxes and connecting lines
            levels.forEach(level => {
                level.forEach(item => {
                    const px = item.x * w, py = item.y * h;
                    const tw = ctx.measureText(item.text).width + 16;
                    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.roundRect(px - tw / 2, py - 14, tw, 28, 6);
                    ctx.fill(); ctx.stroke();
                    ctx.fillStyle = '#e2e8f0';
                    ctx.fillText(item.text, px, py);
                });
            });
            // Arrows
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            const arrows = [
                [0.5, 0.12, 0.2, 0.24], [0.5, 0.12, 0.65, 0.24],
                [0.65, 0.32, 0.45, 0.48], [0.65, 0.32, 0.8, 0.48],
                [0.45, 0.56, 0.62, 0.72], [0.8, 0.56, 0.62, 0.72]
            ];
            arrows.forEach(([x1, y1, x2, y2]) => {
                ctx.beginPath();
                ctx.moveTo(x1 * w, y1 * h);
                ctx.lineTo(x2 * w, y2 * h);
                ctx.stroke();
            });
        }
    }),

    // 6 - Hierarchy
    () => ({
        type: 'Properties',
        question: 'Which of these is FALSE?',
        format: 'mc',
        choices: qshuffle([
            'All rectangles are squares',
            'All squares are rectangles',
            'All squares are parallelograms',
            'All rhombuses are parallelograms'
        ]),
        correct: 'All rectangles are squares',
        hint: 'Is a long, thin rectangle also a square?',
        explanation: '<strong>"All rectangles are squares"</strong> is false. A rectangle only needs right angles and equal opposite sides. A square additionally requires all four sides to be equal. A 3×5 rectangle is not a square.'
    }),

    // 7 - Area decomposition
    () => ({
        type: 'Area',
        question: 'An irregular quadrilateral has vertices at (0,0), (6,0), (7,4), and (1,4). What is its area?',
        format: 'mc',
        choices: qshuffle(['24 sq units', '28 sq units', '20 sq units', '16 sq units']),
        correct: '24 sq units',
        hint: 'Use the Shoelace Formula: Area = ½|Σ(xᵢyᵢ₊₁ − xᵢ₊₁yᵢ)|.',
        explanation: 'Shoelace: ½|(0·0 − 6·0) + (6·4 − 7·0) + (7·4 − 1·4) + (1·0 − 0·4)| = ½|0 + 24 + 24 + 0| = ½ × 48 = <strong>24 sq units</strong>. (This is actually a parallelogram with base 6 and height 4.)',
        drawDiagram: (ctx, w, h) => {
            const pad = 40;
            const gw = w - 2 * pad, gh = h - 2 * pad;
            const pts = [[0,0],[6,0],[7,4],[1,4]];
            const maxX = 8, maxY = 5;
            const sx = gw / maxX, sy = gh / maxY;
            const mapped = pts.map(([x, y]) => ({ x: pad + x * sx, y: h - pad - y * sy }));
            ctx.beginPath();
            ctx.moveTo(mapped[0].x, mapped[0].y);
            mapped.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.font = 'bold 12px system-ui';
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = 'center';
            const labels = ['(0,0)', '(6,0)', '(7,4)', '(1,4)'];
            const offs = [[0,14],[0,14],[0,-10],[0,-10]];
            mapped.forEach((p, i) => {
                ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();
                ctx.fillStyle = '#e2e8f0';
                ctx.fillText(labels[i], p.x + offs[i][0], p.y + offs[i][1]);
            });
        }
    }),

    // 8 - Diagonal calculations
    () => ({
        type: 'Diagonals',
        question: 'A rectangle has sides of length 6 cm and 8 cm. What is the length of its diagonal?',
        format: 'mc',
        choices: qshuffle(['10 cm', '14 cm', '7 cm', '√100 cm']),
        correct: '10 cm',
        hint: 'The diagonal of a rectangle forms a right triangle with the two sides. Use the Pythagorean theorem.',
        explanation: 'By the Pythagorean theorem: d² = 6² + 8² = 36 + 64 = 100, so d = <strong>10 cm</strong>. This is a 6-8-10 right triangle (a multiple of 3-4-5).',
        drawDiagram: (ctx, w, h) => {
            const verts = [
                { x: 0.15, y: 0.2 }, { x: 0.85, y: 0.2 },
                { x: 0.85, y: 0.8 }, { x: 0.15, y: 0.8 }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                rightAngles: [0, 1, 2, 3],
                sideLabels: ['8 cm', '6 cm', null, null],
                diagonals: [[0, 2]]
            });
            ctx.font = 'bold 14px system-ui';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('d = ?', w * 0.55, h * 0.45);
        }
    }),

    // 9 - Diagonal calculations
    () => ({
        type: 'Diagonals',
        question: 'A rhombus has diagonals of length 16 cm and 12 cm. What is the side length of the rhombus?',
        format: 'mc',
        choices: qshuffle(['10 cm', '14 cm', '20 cm', '8 cm']),
        correct: '10 cm',
        hint: 'The diagonals of a rhombus bisect each other at right angles. Each half-diagonal and a side form a right triangle.',
        explanation: 'The diagonals bisect at right angles, creating right triangles with legs 16/2 = 8 and 12/2 = 6. Side = √(8² + 6²) = √(64 + 36) = √100 = <strong>10 cm</strong>.',
        drawDiagram: (ctx, w, h) => {
            const verts = [
                { x: 0.5, y: 0.08 }, { x: 0.85, y: 0.5 },
                { x: 0.5, y: 0.92 }, { x: 0.15, y: 0.5 }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                diagonals: [[0, 2], [1, 3]],
                tickMarks: [{ side: 0, count: 1 }, { side: 1, count: 1 }, { side: 2, count: 1 }, { side: 3, count: 1 }]
            });
            // Label half-diagonals
            ctx.font = '13px system-ui';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('8', w * 0.5 + 12, h * 0.28);
            ctx.fillText('8', w * 0.5 + 12, h * 0.72);
            ctx.fillText('6', w * 0.33, h * 0.5 - 8);
            ctx.fillText('6', w * 0.67, h * 0.5 - 8);
            // Right angle at center
            const cx = w * 0.5, cy = h * 0.5;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 8, cy - 8); ctx.lineTo(cx, cy - 8);
            ctx.stroke();
            // Label side
            ctx.font = 'bold 14px system-ui';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('s = ?', w * 0.72, h * 0.28);
        }
    }),

    // 10 - Area decomposition
    () => ({
        type: 'Area',
        question: 'An L-shaped figure is made by removing a 2×3 rectangle from the corner of a 6×5 rectangle. What is the area of the L-shape?',
        format: 'mc',
        choices: qshuffle(['24 sq units', '30 sq units', '6 sq units', '36 sq units']),
        correct: '24 sq units',
        hint: 'Area of L-shape = Area of large rectangle − Area of removed rectangle.',
        explanation: 'Large rectangle area = 6 × 5 = 30. Removed piece = 2 × 3 = 6. L-shape area = 30 − 6 = <strong>24 sq units</strong>.',
        drawDiagram: (ctx, w, h) => {
            const pad = 40;
            const gw = w - 2 * pad, gh = h - 2 * pad;
            const sx = gw / 7, sy = gh / 6;
            function pt(x, y) { return { x: pad + x * sx, y: h - pad - y * sy }; }
            // L-shape vertices: (0,0), (6,0), (6,5), (2,5), (2,3), (0,3)
            const shape = [[0,0],[6,0],[6,5],[2,5],[2,3],[0,3]];
            const mapped = shape.map(([x,y]) => pt(x,y));
            ctx.beginPath();
            ctx.moveTo(mapped[0].x, mapped[0].y);
            mapped.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Removed rectangle (dashed)
            const rem = [[0,3],[2,3],[2,5],[0,5]].map(([x,y]) => pt(x,y));
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(rem[0].x, rem[0].y);
            rem.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
            ctx.fill();
            // Labels
            ctx.font = '12px system-ui';
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = 'center';
            ctx.fillText('6', pt(3, -0.3).x, pt(3, -0.3).y);
            ctx.fillText('5', pt(6.4, 2.5).x, pt(6.4, 2.5).y);
            ctx.fillStyle = '#ef4444';
            ctx.fillText('2×3', pt(1, 4).x, pt(1, 4).y);
        }
    }),

    // 11 - Proofs
    () => ({
        type: 'Proofs',
        question: 'In quadrilateral ABCD, both pairs of opposite sides are parallel. What can you conclude?',
        format: 'mc',
        choices: qshuffle([
            'ABCD is a parallelogram',
            'ABCD is a rectangle',
            'ABCD is a rhombus',
            'ABCD is a square'
        ]),
        correct: 'ABCD is a parallelogram',
        hint: 'What is the definition of a parallelogram?',
        explanation: 'By definition, a <strong>parallelogram</strong> is a quadrilateral with both pairs of opposite sides parallel. You cannot conclude it is a rectangle, rhombus, or square without additional information.'
    }),

    // 12 - Proofs
    () => ({
        type: 'Proofs',
        question: 'If the diagonals of a parallelogram are equal in length, what type of parallelogram must it be?',
        format: 'mc',
        choices: qshuffle(['Rectangle', 'Rhombus', 'Square', 'It could be any parallelogram']),
        correct: 'Rectangle',
        hint: 'Which special parallelogram has the property of equal-length diagonals?',
        explanation: 'If a parallelogram has equal diagonals, it must be a <strong>rectangle</strong>. (A rhombus has equal diagonals only if it is also a square.)',
        drawDiagram: (ctx, w, h) => {
            const verts = [
                { x: 0.15, y: 0.2 }, { x: 0.85, y: 0.2 },
                { x: 0.85, y: 0.8 }, { x: 0.15, y: 0.8 }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                labels: ['A', 'B', 'C', 'D'],
                rightAngles: [0, 1, 2, 3],
                diagonals: [[0, 2], [1, 3]]
            });
            // Label diagonals as equal
            ctx.font = '13px system-ui';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('d₁', w * 0.55, h * 0.42);
            ctx.fillText('d₂', w * 0.45, h * 0.58);
            ctx.fillText('d₁ = d₂', w * 0.5, h * 0.95);
        }
    }),

    // 13 - Multi-step angles
    () => ({
        type: 'Angles',
        question: 'In quadrilateral ABCD, ∠A = 2x°, ∠B = 3x°, ∠C = (x + 40)°, and ∠D = (2x + 8)°. Find x.',
        format: 'mc',
        choices: qshuffle(['39', '45', '36', '42']),
        correct: '39',
        hint: 'The sum of interior angles of a quadrilateral is 360°.',
        explanation: '2x + 3x + (x + 40) + (2x + 8) = 360 → 8x + 48 = 360 → 8x = 312 → x = <strong>39</strong>.',
        drawDiagram: (ctx, w, h) => {
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.15, y: 0.3 }, { x: 0.75, y: 0.15 },
                    { x: 0.88, y: 0.75 }, { x: 0.2, y: 0.85 }
                ],
                labels: ['A', 'B', 'C', 'D'],
                angleLabels: ['2x°', '3x°', '(x+40)°', '(2x+8)°']
            });
        }
    }),

    // 14 - Area problem
    () => ({
        type: 'Area',
        question: 'A trapezoid has parallel bases of 10 cm and 18 cm. Its height is 7 cm. A triangle with base 10 cm and height 7 cm is removed from inside. What area remains?',
        format: 'mc',
        choices: qshuffle(['63 cm²', '98 cm²', '35 cm²', '126 cm²']),
        correct: '63 cm²',
        hint: 'Find the trapezoid area first, then subtract the triangle area.',
        explanation: 'Trapezoid area = ½(10 + 18)(7) = ½(28)(7) = 98. Triangle area = ½(10)(7) = 35. Remaining = 98 − 35 = <strong>63 cm²</strong>.',
        drawDiagram: (ctx, w, h) => {
            // Trapezoid
            drawQuad(ctx, w, h, {
                vertices: [
                    { x: 0.3, y: 0.2 }, { x: 0.7, y: 0.2 },
                    { x: 0.85, y: 0.8 }, { x: 0.15, y: 0.8 }
                ],
                sideLabels: ['10 cm', null, '18 cm', null],
                parallelMarks: [{ side: 0, count: 1 }, { side: 2, count: 1 }]
            });
            // Triangle inside (dashed)
            const tx = [0.3 * w, 0.7 * w, 0.5 * w];
            const ty = [0.2 * h, 0.2 * h, 0.8 * h];
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(tx[0], ty[0]);
            ctx.lineTo(tx[1], ty[1]);
            ctx.lineTo(tx[2], ty[2]);
            ctx.closePath();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
            ctx.fill();
            // Height
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.moveTo(0.3 * w, 0.2 * h);
            ctx.lineTo(0.3 * w, 0.8 * h);
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.font = '12px system-ui';
            ctx.fillStyle = '#a855f7';
            ctx.textAlign = 'right';
            ctx.fillText('7 cm', 0.28 * w, 0.5 * h);
        }
    }),

    // 15 - Diagonal calculations
    () => ({
        type: 'Diagonals',
        question: 'A square has a diagonal of length 10√2 cm. What is the side length of the square?',
        format: 'mc',
        choices: qshuffle(['10 cm', '5√2 cm', '20 cm', '10√2 cm']),
        correct: '10 cm',
        hint: 'In a square, diagonal = side × √2.',
        explanation: 'For a square: d = s√2, so s = d/√2 = 10√2/√2 = <strong>10 cm</strong>.',
        drawDiagram: (ctx, w, h) => {
            const s = Math.min(w, h) * 0.35;
            const cx = w / 2, cy = h / 2;
            const verts = [
                { x: (cx - s) / w, y: (cy - s) / h }, { x: (cx + s) / w, y: (cy - s) / h },
                { x: (cx + s) / w, y: (cy + s) / h }, { x: (cx - s) / w, y: (cy + s) / h }
            ];
            drawQuad(ctx, w, h, {
                vertices: verts,
                rightAngles: [0, 1, 2, 3],
                diagonals: [[0, 2]],
                sideLabels: [null, 's = ?', null, null]
            });
            ctx.font = 'bold 14px system-ui';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('10√2 cm', w * 0.55, h * 0.45);
        }
    }),
];

// ============================================================
// MAIN FUNCTIONS
// ============================================================

function nextQuadProblem() {
    quadAnswered = false;
    quadProofSelections = {};
    let pool;
    if (quadDifficulty === 'easy') pool = QUAD_EASY_PROBLEMS;
    else if (quadDifficulty === 'medium') pool = QUAD_MEDIUM_PROBLEMS;
    else pool = QUAD_HARD_PROBLEMS;

    quadCurrentProblem = qpick(pool)();

    document.getElementById('quadProblemType').textContent = quadCurrentProblem.type;
    document.getElementById('quadProblemQuestion').textContent = quadCurrentProblem.question;
    document.getElementById('quadHint').textContent = '';
    document.getElementById('quadHint').classList.remove('visible');
    document.getElementById('quadExplanation').classList.remove('visible');
    document.getElementById('quadHintBtn').style.display = '';
    document.getElementById('quadNextBtn').style.display = 'none';
    document.getElementById('quadCheckBtn').style.display = '';
    document.getElementById('quadCheckBtn').disabled = false;

    // Diagram
    const canvas = document.getElementById('quadDiagramCanvas');
    if (quadCurrentProblem.drawDiagram) {
        canvas.style.display = 'block';
        requestAnimationFrame(() => {
            const { w, h } = quadResizeCanvas(canvas);
            const ctx = canvas.getContext('2d');
            quadCurrentProblem.drawDiagram(ctx, w, h);
        });
    } else {
        canvas.style.display = 'none';
    }

    // Answer area - multiple choice
    const area = document.getElementById('quadAnswerArea');
    if (quadCurrentProblem.format === 'mc') {
        const shuffled = qshuffle(quadCurrentProblem.choices);
        let html = '<div class="geo-choices">';
        shuffled.forEach(c => {
            const escaped = c.replace(/'/g, "\\'");
            html += `<button class="geo-choice-btn" onclick="selectQuadChoice(this, '${escaped}')">${c}</button>`;
        });
        html += '</div>';
        area.innerHTML = html;
    }

    // Hint
    if (quadCurrentProblem.hint) {
        document.getElementById('quadHint').textContent = quadCurrentProblem.hint;
    }
}

function checkQuadAnswer() {
    if (quadAnswered) return;

    const p = quadCurrentProblem;
    let allCorrect = true;

    if (p.format === 'mc') {
        const selected = quadProofSelections['mc'];
        if (!selected) return; // nothing selected
        allCorrect = selected === p.correct;
        // Highlight
        document.querySelectorAll('#quadAnswerArea .geo-choice-btn').forEach(btn => {
            btn.classList.add('locked');
            if (btn.textContent === p.correct) btn.classList.add('correct');
            if (btn.classList.contains('selected') && btn.textContent !== p.correct) btn.classList.add('wrong');
        });
    }

    quadAnswered = true;

    if (allCorrect) {
        quadStats.correct++;
        quadStats.streak++;
    } else {
        quadStats.wrong++;
        quadStats.streak = 0;
    }

    document.getElementById('quadExplanation').innerHTML = quadCurrentProblem.explanation;
    document.getElementById('quadExplanation').classList.add('visible');
    document.getElementById('quadHintBtn').style.display = 'none';
    document.getElementById('quadNextBtn').style.display = '';
    document.getElementById('quadCheckBtn').style.display = 'none';
    updateQuadUI();
}

function showQuadHint() {
    document.getElementById('quadHint').classList.add('visible');
}

function skipQuadProblem() {
    quadStats.streak = 0;
    updateQuadUI();
    nextQuadProblem();
}
