// ===== ALGEBRA 2 READINESS PRACTICE TESTS =====

let a2CurrentTest = null;
let a2TestNum = 0;
let a2CurrentQ = 0;
let a2Answers = [];
let a2Submitted = false;
let a2Initialized = false;

// ============================================================
// TEST 1 — 45 Questions
// ============================================================
const A2_TEST_1 = [
    // --- Linear Equations & Inequalities (7) ---
    {
        id: 1, topic: "Linear Equations & Inequalities",
        question: "Solve for x: 3(2x − 4) = 18",
        choices: ["x = 5", "x = 3", "x = −5", "x = 1"],
        correct: 0,
        explanation: "Distribute: 6x − 12 = 18. Add 12: 6x = 30. Divide by 6: x = 5."
    },
    {
        id: 2, topic: "Linear Equations & Inequalities",
        question: "Which inequality represents: 'A number decreased by 7 is at most 15'?",
        choices: ["n − 7 > 15", "n − 7 ≥ 15", "n − 7 ≤ 15", "n − 7 < 15"],
        correct: 2,
        explanation: "'At most' means less than or equal to (≤). So n − 7 ≤ 15."
    },
    {
        id: 3, topic: "Linear Equations & Inequalities",
        question: "What is the slope of the line passing through (2, 5) and (6, 13)?",
        choices: ["2", "3", "4", "8"],
        correct: 0,
        explanation: "Slope = (13 − 5)/(6 − 2) = 8/4 = 2."
    },
    {
        id: 4, topic: "Linear Equations & Inequalities",
        question: "Solve: 5x + 3 = 2x + 18",
        choices: ["x = 3", "x = 5", "x = 7", "x = 15"],
        correct: 1,
        explanation: "Subtract 2x: 3x + 3 = 18. Subtract 3: 3x = 15. Divide by 3: x = 5."
    },
    {
        id: 5, topic: "Linear Equations & Inequalities",
        question: "What is the y-intercept of the line y = −3x + 7?",
        choices: ["−3", "7", "3", "−7"],
        correct: 1,
        explanation: "In y = mx + b form, b is the y-intercept. Here b = 7."
    },
    {
        id: 6, topic: "Linear Equations & Inequalities",
        question: "Solve for x: (x/4) + 3 = 7",
        choices: ["x = 1", "x = 10", "x = 16", "x = 28"],
        correct: 2,
        explanation: "Subtract 3: x/4 = 4. Multiply by 4: x = 16."
    },
    {
        id: 7, topic: "Linear Equations & Inequalities",
        question: "Which ordered pair is a solution to y = 2x − 1?",
        choices: ["(0, 1)", "(3, 5)", "(2, 5)", "(1, 3)"],
        correct: 1,
        explanation: "Substitute (3, 5): y = 2(3) − 1 = 5. True."
    },

    // --- Polynomials & Quadratic Equations (7) ---
    {
        id: 8, topic: "Polynomials & Quadratic Equations",
        question: "Factor completely: x² − 9",
        choices: ["(x − 3)²", "(x + 3)(x − 3)", "(x − 9)(x + 1)", "(x + 9)(x − 1)"],
        correct: 1,
        explanation: "This is a difference of squares: a² − b² = (a + b)(a − b). So x² − 9 = (x + 3)(x − 3)."
    },
    {
        id: 9, topic: "Polynomials & Quadratic Equations",
        question: "Multiply: (2x + 3)(x − 5)",
        choices: ["2x² − 7x − 15", "2x² + 7x − 15", "2x² − 13x − 15", "2x² − 7x + 15"],
        correct: 0,
        explanation: "FOIL: 2x·x + 2x·(−5) + 3·x + 3·(−5) = 2x² − 10x + 3x − 15 = 2x² − 7x − 15."
    },
    {
        id: 10, topic: "Polynomials & Quadratic Equations",
        question: "Solve: x² − 5x + 6 = 0",
        choices: ["x = 2, x = 3", "x = −2, x = −3", "x = 1, x = 6", "x = −1, x = −6"],
        correct: 0,
        explanation: "Factor: (x − 2)(x − 3) = 0. So x = 2 or x = 3."
    },
    {
        id: 11, topic: "Polynomials & Quadratic Equations",
        question: "What is the degree of the polynomial 4x³ − 2x² + x − 7?",
        choices: ["4", "3", "2", "7"],
        correct: 1,
        explanation: "The degree is the highest power of x, which is 3."
    },
    {
        id: 12, topic: "Polynomials & Quadratic Equations",
        question: "Simplify: (3x² + 2x − 1) + (x² − 4x + 5)",
        choices: ["4x² − 2x + 4", "4x² + 6x + 4", "3x² − 2x + 4", "4x² − 2x − 4"],
        correct: 0,
        explanation: "Combine like terms: (3x² + x²) + (2x − 4x) + (−1 + 5) = 4x² − 2x + 4."
    },
    {
        id: 13, topic: "Polynomials & Quadratic Equations",
        question: "Factor: x² + 7x + 12",
        choices: ["(x + 3)(x + 4)", "(x + 2)(x + 6)", "(x + 1)(x + 12)", "(x − 3)(x − 4)"],
        correct: 0,
        explanation: "Find two numbers that multiply to 12 and add to 7: 3 and 4. So (x + 3)(x + 4)."
    },
    {
        id: 14, topic: "Polynomials & Quadratic Equations",
        question: "What is the value of x² − 3x + 2 when x = 4?",
        choices: ["6", "10", "2", "8"],
        correct: 0,
        explanation: "Substitute x = 4: 16 − 12 + 2 = 6."
    },

    // --- Rational Expressions & Proportions (6) ---
    {
        id: 15, topic: "Rational Expressions & Proportions",
        question: "Simplify: (x² − 4)/(x + 2)",
        choices: ["x − 4", "x − 2", "x + 2", "x² − 2"],
        correct: 1,
        explanation: "Factor numerator: (x + 2)(x − 2)/(x + 2) = x − 2."
    },
    {
        id: 16, topic: "Rational Expressions & Proportions",
        question: "Solve the proportion: 3/x = 9/15",
        choices: ["x = 5", "x = 45", "x = 3", "x = 9"],
        correct: 0,
        explanation: "Cross multiply: 3 · 15 = 9 · x → 45 = 9x → x = 5."
    },
    {
        id: 17, topic: "Rational Expressions & Proportions",
        question: "Simplify: (12x³)/(4x)",
        choices: ["3x²", "3x³", "8x²", "3x"],
        correct: 0,
        explanation: "Divide coefficients 12/4 = 3. Subtract exponents: x³/x = x². Result: 3x²."
    },
    {
        id: 18, topic: "Rational Expressions & Proportions",
        question: "If 4/7 = x/35, what is x?",
        choices: ["20", "15", "28", "10"],
        correct: 0,
        explanation: "Cross multiply: 4 · 35 = 7 · x → 140 = 7x → x = 20."
    },
    {
        id: 19, topic: "Rational Expressions & Proportions",
        question: "Simplify: (2/3) + (1/4)",
        choices: ["3/7", "11/12", "8/12", "3/12"],
        correct: 1,
        explanation: "LCD is 12: 8/12 + 3/12 = 11/12."
    },
    {
        id: 20, topic: "Rational Expressions & Proportions",
        question: "A recipe needs 2 cups of flour for 12 cookies. How many cups for 30 cookies?",
        choices: ["5 cups", "4 cups", "6 cups", "3 cups"],
        correct: 0,
        explanation: "Set up proportion: 2/12 = x/30. Cross multiply: 60 = 12x. x = 5."
    },

    // --- Exponents & Square Roots; Scientific Notation (7) ---
    {
        id: 21, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: (2³)(2⁴)",
        choices: ["2⁷", "2¹²", "4⁷", "4¹²"],
        correct: 0,
        explanation: "When multiplying same bases, add exponents: 2³⁺⁴ = 2⁷."
    },
    {
        id: 22, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Express 0.00045 in scientific notation.",
        choices: ["4.5 × 10⁻⁴", "45 × 10⁻⁵", "4.5 × 10⁻³", "0.45 × 10⁻³"],
        correct: 0,
        explanation: "Move decimal 4 places right: 4.5 × 10⁻⁴."
    },
    {
        id: 23, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: √(144)",
        choices: ["11", "12", "13", "14"],
        correct: 1,
        explanation: "12 × 12 = 144, so √144 = 12."
    },
    {
        id: 24, topic: "Exponents & Square Roots; Scientific Notation",
        question: "What is (3²)³?",
        choices: ["3⁵", "3⁶", "9³", "Both B and C"],
        correct: 3,
        explanation: "Power of a power: multiply exponents: 3⁶ = 729. Also 9³ = 729. Both B and C are correct."
    },
    {
        id: 25, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: x⁵ / x²",
        choices: ["x³", "x⁷", "x²·⁵", "x¹⁰"],
        correct: 0,
        explanation: "When dividing same bases, subtract exponents: x⁵⁻² = x³."
    },
    {
        id: 26, topic: "Exponents & Square Roots; Scientific Notation",
        question: "What is 5⁰?",
        choices: ["0", "1", "5", "Undefined"],
        correct: 1,
        explanation: "Any nonzero number raised to the power 0 equals 1."
    },
    {
        id: 27, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: √(50)",
        choices: ["5√2", "2√5", "25√2", "10√5"],
        correct: 0,
        explanation: "√50 = √(25 · 2) = √25 · √2 = 5√2."
    },

    // --- Functions and their Representations (6) ---
    {
        id: 28, topic: "Functions and their Representations",
        question: "If f(x) = 2x + 3, find f(−4).",
        choices: ["−5", "−1", "11", "5"],
        correct: 0,
        explanation: "f(−4) = 2(−4) + 3 = −8 + 3 = −5."
    },
    {
        id: 29, topic: "Functions and their Representations",
        question: "What is the domain of f(x) = 1/(x − 3)?",
        choices: ["All real numbers", "All real numbers except 3", "x > 3", "x ≥ 3"],
        correct: 1,
        explanation: "The denominator cannot be zero: x − 3 ≠ 0, so x ≠ 3."
    },
    {
        id: 30, topic: "Functions and their Representations",
        question: "Which equation represents a function?",
        choices: ["x² + y² = 25", "x = 5", "y = 3x − 2", "x = y²"],
        correct: 2,
        explanation: "y = 3x − 2 passes the vertical line test; each x gives exactly one y."
    },
    {
        id: 31, topic: "Functions and their Representations",
        question: "If g(x) = x² − 1, what is g(3)?",
        choices: ["8", "10", "6", "4"],
        correct: 0,
        explanation: "g(3) = 3² − 1 = 9 − 1 = 8."
    },
    {
        id: 32, topic: "Functions and their Representations",
        question: "A linear function has f(0) = 4 and f(2) = 10. What is f(5)?",
        choices: ["19", "22", "16", "25"],
        correct: 0,
        explanation: "Slope = (10 − 4)/(2 − 0) = 3. f(x) = 3x + 4. f(5) = 15 + 4 = 19."
    },
    {
        id: 33, topic: "Functions and their Representations",
        question: "The graph of y = |x| is shifted 2 units up. What is the new equation?",
        choices: ["y = |x + 2|", "y = |x − 2|", "y = |x| + 2", "y = |x| − 2"],
        correct: 2,
        explanation: "Shifting a graph up by k units adds k outside the function: y = |x| + 2."
    },

    // --- Geometry and Trigonometry (6) ---
    {
        id: 34, topic: "Geometry and Trigonometry",
        question: "Find the hypotenuse of a right triangle with legs 5 and 12.",
        choices: ["13", "17", "15", "11"],
        correct: 0,
        explanation: "c² = 5² + 12² = 25 + 144 = 169. c = √169 = 13."
    },
    {
        id: 35, topic: "Geometry and Trigonometry",
        question: "What is the area of a triangle with base 10 and height 6?",
        choices: ["60", "30", "16", "36"],
        correct: 1,
        explanation: "Area = (1/2) · base · height = (1/2)(10)(6) = 30."
    },
    {
        id: 36, topic: "Geometry and Trigonometry",
        question: "Two angles of a triangle measure 45° and 90°. What is the third angle?",
        choices: ["45°", "55°", "35°", "90°"],
        correct: 0,
        explanation: "Angles sum to 180°: 180 − 45 − 90 = 45°."
    },
    {
        id: 37, topic: "Geometry and Trigonometry",
        question: "What is the circumference of a circle with radius 7? (Use π ≈ 22/7)",
        choices: ["44", "154", "22", "88"],
        correct: 0,
        explanation: "C = 2πr = 2(22/7)(7) = 44."
    },
    {
        id: 38, topic: "Geometry and Trigonometry",
        question: "In a 30-60-90 triangle, the side opposite 30° is 5. What is the hypotenuse?",
        choices: ["10", "5√3", "5√2", "15"],
        correct: 0,
        explanation: "In a 30-60-90 triangle, the hypotenuse is twice the short side: 2 × 5 = 10."
    },
    {
        id: 39, topic: "Geometry and Trigonometry",
        question: "What is the volume of a rectangular prism with length 4, width 3, and height 5?",
        choices: ["60", "12", "35", "24"],
        correct: 0,
        explanation: "V = l × w × h = 4 × 3 × 5 = 60."
    },

    // --- Data Analysis, Probability & Statistics (6) ---
    {
        id: 40, topic: "Data Analysis, Probability & Statistics",
        question: "Find the median of: 3, 7, 9, 12, 15",
        choices: ["7", "9", "12", "9.2"],
        correct: 1,
        explanation: "The median is the middle value in an ordered set. The middle (3rd) value is 9."
    },
    {
        id: 41, topic: "Data Analysis, Probability & Statistics",
        question: "A bag has 4 red and 3 blue marbles. What is the probability of drawing a red marble?",
        choices: ["4/7", "3/7", "4/3", "1/2"],
        correct: 0,
        explanation: "P(red) = favorable/total = 4/(4+3) = 4/7."
    },
    {
        id: 42, topic: "Data Analysis, Probability & Statistics",
        question: "What is the mean of: 10, 15, 20, 25, 30?",
        choices: ["20", "15", "25", "22"],
        correct: 0,
        explanation: "Mean = (10 + 15 + 20 + 25 + 30)/5 = 100/5 = 20."
    },
    {
        id: 43, topic: "Data Analysis, Probability & Statistics",
        question: "A coin is flipped 3 times. How many possible outcomes are there?",
        choices: ["6", "8", "3", "9"],
        correct: 1,
        explanation: "Each flip has 2 outcomes. Total = 2³ = 8."
    },
    {
        id: 44, topic: "Data Analysis, Probability & Statistics",
        question: "What is the range of the data set: 4, 8, 15, 21, 30?",
        choices: ["26", "15", "21", "34"],
        correct: 0,
        explanation: "Range = maximum − minimum = 30 − 4 = 26."
    },
    {
        id: 45, topic: "Data Analysis, Probability & Statistics",
        question: "In a bar graph, the tallest bar represents which of the following?",
        choices: ["The least frequent category", "The most frequent category", "The median", "The mean"],
        correct: 1,
        explanation: "The tallest bar in a bar graph represents the category with the highest frequency."
    }
];

// ============================================================
// TEST 2 — 45 Questions
// ============================================================
const A2_TEST_2 = [
    // --- Linear Equations & Inequalities (7) ---
    {
        id: 1, topic: "Linear Equations & Inequalities",
        question: "Solve for x: 4x − 7 = 2x + 9",
        choices: ["x = 8", "x = 1", "x = 2", "x = 16"],
        correct: 0,
        explanation: "Subtract 2x: 2x − 7 = 9. Add 7: 2x = 16. Divide by 2: x = 8."
    },
    {
        id: 2, topic: "Linear Equations & Inequalities",
        question: "What is the slope of the line 2y = 6x − 10?",
        choices: ["6", "3", "−5", "2"],
        correct: 1,
        explanation: "Divide by 2: y = 3x − 5. The slope is 3."
    },
    {
        id: 3, topic: "Linear Equations & Inequalities",
        question: "Solve: −2(x + 5) = 4",
        choices: ["x = −7", "x = 7", "x = −3", "x = 3"],
        correct: 0,
        explanation: "Distribute: −2x − 10 = 4. Add 10: −2x = 14. Divide by −2: x = −7."
    },
    {
        id: 4, topic: "Linear Equations & Inequalities",
        question: "Which graph represents y > 2x + 1?",
        choices: [
            "Dashed line, shaded above",
            "Solid line, shaded above",
            "Dashed line, shaded below",
            "Solid line, shaded below"
        ],
        correct: 0,
        explanation: "Strict inequality (>) uses a dashed line, and y > means shade above."
    },
    {
        id: 5, topic: "Linear Equations & Inequalities",
        question: "A line passes through (0, −2) and has slope 3. What is its equation?",
        choices: ["y = 3x − 2", "y = −2x + 3", "y = 3x + 2", "y = −3x − 2"],
        correct: 0,
        explanation: "Using y = mx + b: slope m = 3, y-intercept b = −2. So y = 3x − 2."
    },
    {
        id: 6, topic: "Linear Equations & Inequalities",
        question: "Solve the system: x + y = 10, x − y = 4",
        choices: ["(7, 3)", "(6, 4)", "(8, 2)", "(5, 5)"],
        correct: 0,
        explanation: "Add the equations: 2x = 14, so x = 7. Then y = 10 − 7 = 3."
    },
    {
        id: 7, topic: "Linear Equations & Inequalities",
        question: "Solve: |x − 3| = 5",
        choices: ["x = 8 only", "x = −2 only", "x = 8 or x = −2", "x = 2 or x = −8"],
        correct: 2,
        explanation: "x − 3 = 5 → x = 8, or x − 3 = −5 → x = −2."
    },

    // --- Polynomials & Quadratic Equations (7) ---
    {
        id: 8, topic: "Polynomials & Quadratic Equations",
        question: "Factor: x² − x − 12",
        choices: ["(x − 4)(x + 3)", "(x + 4)(x − 3)", "(x − 6)(x + 2)", "(x − 12)(x + 1)"],
        correct: 0,
        explanation: "Find two numbers that multiply to −12 and add to −1: −4 and 3. So (x − 4)(x + 3)."
    },
    {
        id: 9, topic: "Polynomials & Quadratic Equations",
        question: "Expand: (x + 5)²",
        choices: ["x² + 25", "x² + 10x + 25", "x² + 5x + 25", "x² + 10x + 10"],
        correct: 1,
        explanation: "(x + 5)² = x² + 2(5)(x) + 25 = x² + 10x + 25."
    },
    {
        id: 10, topic: "Polynomials & Quadratic Equations",
        question: "Solve: x² = 49",
        choices: ["x = 7", "x = −7", "x = 7 or x = −7", "x = 49"],
        correct: 2,
        explanation: "Taking square root of both sides: x = ±7."
    },
    {
        id: 11, topic: "Polynomials & Quadratic Equations",
        question: "Subtract: (5x² − 3x + 2) − (2x² + x − 4)",
        choices: ["3x² − 4x + 6", "3x² − 2x − 2", "7x² − 4x + 6", "3x² − 4x − 2"],
        correct: 0,
        explanation: "Distribute the negative: 5x² − 3x + 2 − 2x² − x + 4 = 3x² − 4x + 6."
    },
    {
        id: 12, topic: "Polynomials & Quadratic Equations",
        question: "What are the zeros of f(x) = x² − 16?",
        choices: ["x = 4 only", "x = −4 only", "x = 4 and x = −4", "x = 8 and x = −8"],
        correct: 2,
        explanation: "Set x² − 16 = 0. Factor: (x − 4)(x + 4) = 0. x = 4 or x = −4."
    },
    {
        id: 13, topic: "Polynomials & Quadratic Equations",
        question: "Multiply: 3x(2x² − 4x + 1)",
        choices: ["6x³ − 12x² + 3x", "6x³ − 12x + 3", "6x² − 12x + 3", "6x³ + 12x² + 3x"],
        correct: 0,
        explanation: "Distribute: 3x · 2x² = 6x³, 3x · (−4x) = −12x², 3x · 1 = 3x."
    },
    {
        id: 14, topic: "Polynomials & Quadratic Equations",
        question: "The vertex of y = x² − 6x + 8 is at which point?",
        choices: ["(3, −1)", "(−3, −1)", "(3, 8)", "(6, 8)"],
        correct: 0,
        explanation: "x = −b/(2a) = 6/2 = 3. y = 9 − 18 + 8 = −1. Vertex is (3, −1)."
    },

    // --- Rational Expressions & Proportions (6) ---
    {
        id: 15, topic: "Rational Expressions & Proportions",
        question: "Simplify: (x² − 25)/(x − 5)",
        choices: ["x − 5", "x + 5", "x − 25", "x² − 5"],
        correct: 1,
        explanation: "Factor numerator: (x + 5)(x − 5)/(x − 5) = x + 5."
    },
    {
        id: 16, topic: "Rational Expressions & Proportions",
        question: "Solve: x/6 = 8/12",
        choices: ["x = 4", "x = 2", "x = 6", "x = 8"],
        correct: 0,
        explanation: "Cross multiply: 12x = 48. x = 4."
    },
    {
        id: 17, topic: "Rational Expressions & Proportions",
        question: "Simplify: (3/5) ÷ (9/10)",
        choices: ["2/3", "27/50", "6/9", "30/45"],
        correct: 0,
        explanation: "Multiply by reciprocal: (3/5) × (10/9) = 30/45 = 2/3."
    },
    {
        id: 18, topic: "Rational Expressions & Proportions",
        question: "If a car travels 240 miles in 4 hours, how far in 7 hours at the same rate?",
        choices: ["420 miles", "480 miles", "360 miles", "560 miles"],
        correct: 0,
        explanation: "Rate = 240/4 = 60 mph. Distance = 60 × 7 = 420 miles."
    },
    {
        id: 19, topic: "Rational Expressions & Proportions",
        question: "Simplify: (18x⁴y²)/(6x²y)",
        choices: ["3x²y", "3x²y²", "12x²y", "3xy"],
        correct: 0,
        explanation: "18/6 = 3, x⁴/x² = x², y²/y = y. Result: 3x²y."
    },
    {
        id: 20, topic: "Rational Expressions & Proportions",
        question: "Solve: 5/(x + 1) = 1",
        choices: ["x = 4", "x = 5", "x = 6", "x = −4"],
        correct: 0,
        explanation: "Multiply both sides by (x + 1): 5 = x + 1. x = 4."
    },

    // --- Exponents & Square Roots; Scientific Notation (7) ---
    {
        id: 21, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: (3x²)³",
        choices: ["27x⁶", "9x⁶", "27x⁵", "3x⁶"],
        correct: 0,
        explanation: "Raise each factor: 3³ = 27, (x²)³ = x⁶. Result: 27x⁶."
    },
    {
        id: 22, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Write 3.2 × 10⁵ in standard form.",
        choices: ["320,000", "32,000", "3,200,000", "3,200"],
        correct: 0,
        explanation: "Move decimal 5 places right: 320,000."
    },
    {
        id: 23, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: √(72)",
        choices: ["6√2", "8√3", "4√9", "9√2"],
        correct: 0,
        explanation: "√72 = √(36 · 2) = 6√2."
    },
    {
        id: 24, topic: "Exponents & Square Roots; Scientific Notation",
        question: "What is 2⁻³?",
        choices: ["−8", "−6", "1/8", "8"],
        correct: 2,
        explanation: "Negative exponent means reciprocal: 2⁻³ = 1/2³ = 1/8."
    },
    {
        id: 25, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: (4 × 10³)(2 × 10⁵)",
        choices: ["8 × 10⁸", "8 × 10¹⁵", "6 × 10⁸", "8 × 10⁷"],
        correct: 0,
        explanation: "Multiply coefficients: 4 × 2 = 8. Add exponents: 10³⁺⁵ = 10⁸. Result: 8 × 10⁸."
    },
    {
        id: 26, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Simplify: √(25x²)",
        choices: ["5x", "25x", "5x²", "x√25"],
        correct: 0,
        explanation: "√(25x²) = √25 · √(x²) = 5x (assuming x ≥ 0)."
    },
    {
        id: 27, topic: "Exponents & Square Roots; Scientific Notation",
        question: "Which is greater: 3⁴ or 4³?",
        choices: ["3⁴", "4³", "They are equal", "Cannot be determined"],
        correct: 0,
        explanation: "3⁴ = 81, 4³ = 64. So 3⁴ > 4³."
    },

    // --- Functions and their Representations (6) ---
    {
        id: 28, topic: "Functions and their Representations",
        question: "If f(x) = x² − 2x, find f(5).",
        choices: ["15", "20", "35", "10"],
        correct: 0,
        explanation: "f(5) = 25 − 10 = 15."
    },
    {
        id: 29, topic: "Functions and their Representations",
        question: "What is the range of f(x) = x² for all real numbers x?",
        choices: ["All real numbers", "y ≥ 0", "y > 0", "y ≤ 0"],
        correct: 1,
        explanation: "x² is always non-negative, so the range is y ≥ 0."
    },
    {
        id: 30, topic: "Functions and their Representations",
        question: "Which table represents a linear function?",
        choices: [
            "x: 1,2,3,4 → y: 2,4,8,16",
            "x: 1,2,3,4 → y: 3,5,7,9",
            "x: 1,2,3,4 → y: 1,4,9,16",
            "x: 1,2,3,4 → y: 2,5,10,17"
        ],
        correct: 1,
        explanation: "A linear function has constant differences. In B, differences are all 2."
    },
    {
        id: 31, topic: "Functions and their Representations",
        question: "If h(x) = 3x − 7, for what value of x does h(x) = 11?",
        choices: ["x = 4", "x = 6", "x = 5", "x = 3"],
        correct: 1,
        explanation: "Set 3x − 7 = 11. Add 7: 3x = 18. Divide by 3: x = 6."
    },
    {
        id: 32, topic: "Functions and their Representations",
        question: "The graph of f(x) = x² is reflected over the x-axis. The new equation is:",
        choices: ["f(x) = −x²", "f(x) = x²", "f(x) = (−x)²", "f(x) = |x²|"],
        correct: 0,
        explanation: "Reflecting over the x-axis negates the output: y = −x²."
    },
    {
        id: 33, topic: "Functions and their Representations",
        question: "Which of these is NOT a function?",
        choices: ["y = 2x + 1", "y = x²", "x² + y² = 9", "y = |x|"],
        correct: 2,
        explanation: "x² + y² = 9 is a circle, which fails the vertical line test."
    },

    // --- Geometry and Trigonometry (6) ---
    {
        id: 34, topic: "Geometry and Trigonometry",
        question: "What is sin(30°)?",
        choices: ["1/2", "√3/2", "√2/2", "1"],
        correct: 0,
        explanation: "sin(30°) = 1/2. This is a standard value from the 30-60-90 triangle."
    },
    {
        id: 35, topic: "Geometry and Trigonometry",
        question: "Find the area of a circle with radius 5. (Use π ≈ 3.14)",
        choices: ["78.5", "31.4", "15.7", "157"],
        correct: 0,
        explanation: "A = πr² = 3.14 × 25 = 78.5."
    },
    {
        id: 36, topic: "Geometry and Trigonometry",
        question: "The legs of a right triangle are both 6. What is the hypotenuse?",
        choices: ["6√2", "12", "6√3", "36"],
        correct: 0,
        explanation: "c² = 6² + 6² = 72. c = √72 = 6√2."
    },
    {
        id: 37, topic: "Geometry and Trigonometry",
        question: "What is the sum of the interior angles of a hexagon?",
        choices: ["720°", "540°", "1080°", "360°"],
        correct: 0,
        explanation: "Sum = (n − 2) × 180 = (6 − 2) × 180 = 720°."
    },
    {
        id: 38, topic: "Geometry and Trigonometry",
        question: "A triangle has sides 3, 4, and 5. Is it a right triangle?",
        choices: ["Yes, because 3² + 4² = 5²", "No, because 3 + 4 ≠ 5²", "Yes, because 3 + 4 = 7", "No, because the sides are too small"],
        correct: 0,
        explanation: "3² + 4² = 9 + 16 = 25 = 5². The Pythagorean theorem holds, so yes."
    },
    {
        id: 39, topic: "Geometry and Trigonometry",
        question: "Two similar triangles have a scale factor of 3:1. If the smaller has area 5, what is the larger's area?",
        choices: ["45", "15", "25", "9"],
        correct: 0,
        explanation: "Areas scale by the square of the ratio: 3² × 5 = 9 × 5 = 45."
    },

    // --- Data Analysis, Probability & Statistics (6) ---
    {
        id: 40, topic: "Data Analysis, Probability & Statistics",
        question: "Find the mode of: 2, 3, 3, 5, 7, 7, 7, 9",
        choices: ["3", "5", "7", "9"],
        correct: 2,
        explanation: "The mode is the most frequent value. 7 appears 3 times."
    },
    {
        id: 41, topic: "Data Analysis, Probability & Statistics",
        question: "A die is rolled. What is P(even number)?",
        choices: ["1/6", "1/3", "1/2", "2/3"],
        correct: 2,
        explanation: "Even outcomes: 2, 4, 6. P(even) = 3/6 = 1/2."
    },
    {
        id: 42, topic: "Data Analysis, Probability & Statistics",
        question: "Find the median of: 4, 1, 7, 2, 9, 3",
        choices: ["3", "3.5", "4", "7"],
        correct: 1,
        explanation: "Ordered: 1, 2, 3, 4, 7, 9. Median = average of 3rd and 4th: (3 + 4)/2 = 3.5."
    },
    {
        id: 43, topic: "Data Analysis, Probability & Statistics",
        question: "Two coins are flipped. What is P(both heads)?",
        choices: ["1/2", "1/3", "1/4", "3/4"],
        correct: 2,
        explanation: "P(H) × P(H) = 1/2 × 1/2 = 1/4."
    },
    {
        id: 44, topic: "Data Analysis, Probability & Statistics",
        question: "A class has test scores: 80, 85, 90, 95, 100. What is the mean?",
        choices: ["88", "90", "92", "85"],
        correct: 1,
        explanation: "Mean = (80 + 85 + 90 + 95 + 100)/5 = 450/5 = 90."
    },
    {
        id: 45, topic: "Data Analysis, Probability & Statistics",
        question: "A spinner has 5 equal sections: red, blue, green, yellow, white. What is P(not red)?",
        choices: ["1/5", "4/5", "3/5", "2/5"],
        correct: 1,
        explanation: "P(not red) = 1 − P(red) = 1 − 1/5 = 4/5."
    }
];

// ============================================================
// UI LOGIC
// ============================================================

let a2Revealed = []; // Track which questions have shown their answer (Test 1 only)

function getTest1BestScore() {
    try { return parseInt(localStorage.getItem('a2test1best') || '0', 10); }
    catch(e) { return 0; }
}

function saveTest1Score(pct) {
    try {
        const prev = getTest1BestScore();
        if (pct > prev) localStorage.setItem('a2test1best', String(pct));
    } catch(e) {}
}

function initA2Test() {
    if (!document.getElementById('a2TestArea')) return;
    a2Initialized = true;
    resetA2Test();
}

function resetA2Test() {
    a2CurrentTest = null;
    a2TestNum = 0;
    a2CurrentQ = 0;
    a2Answers = [];
    a2Submitted = false;
    a2Revealed = [];

    const area = document.getElementById('a2TestArea');
    if (!area) return;

    const best1 = getTest1BestScore();
    const test2Unlocked = best1 >= 90;
    const test2Color = test2Unlocked ? '#38bdf8' : '#475569';
    const test2Bg = test2Unlocked ? '#1e293b' : '#161e2e';
    const test2Border = test2Unlocked ? '#334155' : '#1e293b';

    let test1Badge = '';
    if (best1 > 0) {
        const badgeColor = best1 >= 90 ? '#10b981' : best1 >= 60 ? '#fbbf24' : '#ef4444';
        test1Badge = `<div style="color:${badgeColor}; font-size:0.85rem; font-weight:600; margin-bottom:8px;">Best: ${best1}%</div>`;
    }

    let test2Btn = '';
    if (test2Unlocked) {
        test2Btn = `<button onclick="startA2Test(2)" style="background:#38bdf8; color:#0f172a; border:none; padding:10px 32px; border-radius:8px; font-weight:600; font-size:1rem; cursor:pointer; transition:opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Start Test 2</button>`;
    } else {
        test2Btn = `<div style="color:#94a3b8; font-size:0.85rem; margin-top:4px;">Score ${best1 > 0 ? best1 + '%' : '0%'} / 90% needed</div>
            <div style="background:#0f172a; border-radius:6px; height:8px; margin-top:8px; overflow:hidden; width:80%; margin-left:auto; margin-right:auto;">
                <div style="background:${best1 >= 60 ? '#fbbf24' : '#ef4444'}; height:100%; width:${Math.min(best1 / 90 * 100, 100)}%; transition:width 0.3s; border-radius:6px;"></div>
            </div>`;
    }

    area.innerHTML = `
        <div style="text-align:center; margin-bottom: 24px;">
            <h2 style="color:#38bdf8; font-size:1.4rem; margin-bottom:8px;">Algebra 2 Readiness Assessment</h2>
            <p style="color:#94a3b8; font-size:0.95rem;">Choose a practice test below. Each test has 45 multiple-choice questions across 7 topic areas.<br>No calculator allowed.</p>
        </div>
        <div style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap;">
            <div style="background:#1e293b; border:1px solid #334155; border-radius:14px; padding:28px 36px; text-align:center; min-width:240px; cursor:pointer; transition:border-color 0.2s, transform 0.2s;" onmouseenter="this.style.borderColor='#38bdf8';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='#334155';this.style.transform='translateY(0)'">
                <div style="font-size:2.2rem; font-weight:700; color:#38bdf8; margin-bottom:8px;">Test 1</div>
                <div style="color:#94a3b8; margin-bottom:4px; font-size:0.9rem;">45 Questions &bull; Study Mode</div>
                <div style="color:#64748b; margin-bottom:12px; font-size:0.8rem;">Answers shown after each question</div>
                ${test1Badge}
                <button onclick="startA2Test(1)" style="background:#38bdf8; color:#0f172a; border:none; padding:10px 32px; border-radius:8px; font-weight:600; font-size:1rem; cursor:pointer; transition:opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Start Test 1</button>
            </div>
            <div style="background:${test2Bg}; border:1px solid ${test2Border}; border-radius:14px; padding:28px 36px; text-align:center; min-width:240px; ${test2Unlocked ? 'cursor:pointer;' : ''} transition:border-color 0.2s, transform 0.2s;" ${test2Unlocked ? 'onmouseenter="this.style.borderColor=\'#38bdf8\';this.style.transform=\'translateY(-2px)\'" onmouseleave="this.style.borderColor=\'#334155\';this.style.transform=\'translateY(0)\'"' : ''}>
                <div style="font-size:2.2rem; font-weight:700; color:${test2Color}; margin-bottom:8px;">${test2Unlocked ? '' : '&#x1f512; '}Test 2</div>
                <div style="color:#94a3b8; margin-bottom:4px; font-size:0.9rem;">45 Questions &bull; Test Mode</div>
                <div style="color:#64748b; margin-bottom:12px; font-size:0.8rem;">${test2Unlocked ? 'No answers until you submit' : 'Score 90%+ on Test 1 to unlock'}</div>
                ${test2Btn}
            </div>
        </div>
    `;
}

function startA2Test(testNum) {
    a2TestNum = testNum;
    a2CurrentTest = testNum === 1 ? A2_TEST_1 : A2_TEST_2;
    a2CurrentQ = 0;
    a2Answers = new Array(a2CurrentTest.length).fill(-1);
    a2Revealed = new Array(a2CurrentTest.length).fill(false);
    a2Submitted = false;
    showA2Question(0);
}

function showA2Question(index) {
    if (!a2CurrentTest) return;
    a2CurrentQ = index;
    const q = a2CurrentTest[index];
    const total = a2CurrentTest.length;
    const answered = a2Answers.filter(a => a !== -1).length;
    const progressPct = Math.round((answered / total) * 100);
    const isStudyMode = a2TestNum === 1;
    const isRevealed = isStudyMode && a2Revealed[index];

    const area = document.getElementById('a2TestArea');
    const labels = ['A', 'B', 'C', 'D'];

    let choicesHTML = '';
    for (let i = 0; i < q.choices.length; i++) {
        const selected = a2Answers[index] === i;
        let borderColor, bgColor, textColor, cursor, extraStyle = '';

        if (isRevealed) {
            cursor = 'default';
            if (i === q.correct) {
                borderColor = '#10b981'; bgColor = 'rgba(16,185,129,0.15)'; textColor = '#6ee7b7';
            } else if (selected && i !== q.correct) {
                borderColor = '#ef4444'; bgColor = 'rgba(239,68,68,0.1)'; textColor = '#fca5a5';
                extraStyle = 'text-decoration:line-through;';
            } else {
                borderColor = '#1e293b'; bgColor = '#1e293b'; textColor = '#475569';
            }
        } else {
            cursor = 'pointer';
            borderColor = selected ? '#38bdf8' : '#334155';
            bgColor = selected ? 'rgba(56,189,248,0.1)' : '#1e293b';
            textColor = '#e2e8f0';
        }

        const onclick = isRevealed ? '' : `onclick="selectA2Choice(${i})"`;
        const hover = isRevealed ? '' : `onmouseenter="if(${!selected})this.style.borderColor='#64748b'" onmouseleave="if(${!selected})this.style.borderColor='${borderColor}'"`;

        choicesHTML += `
            <button ${onclick} style="display:block; width:100%; text-align:left; padding:12px 16px; margin-bottom:8px; background:${bgColor}; border:2px solid ${borderColor}; border-radius:10px; color:${textColor}; font-size:0.97rem; cursor:${cursor}; transition:border-color 0.15s, background 0.15s; ${extraStyle}" ${hover}>
                <span style="font-weight:700; color:${isRevealed && i === q.correct ? '#10b981' : '#38bdf8'}; margin-right:10px;">${labels[i]}.</span>${q.choices[i]}
                ${isRevealed && i === q.correct ? ' <span style="margin-left:8px;">&#10003;</span>' : ''}
                ${isRevealed && selected && i !== q.correct ? ' <span style="margin-left:8px;">&#10007;</span>' : ''}
            </button>
        `;
    }

    // Explanation shown after reveal (Test 1 only)
    let explanationHTML = '';
    if (isRevealed) {
        const isCorrect = a2Answers[index] === q.correct;
        const resultColor = isCorrect ? '#10b981' : '#ef4444';
        const resultText = isCorrect ? 'Correct!' : 'Incorrect';
        explanationHTML = `
            <div style="margin-top:16px; padding:16px; background:#0f172a; border-left:4px solid ${resultColor}; border-radius:0 10px 10px 0;">
                <div style="color:${resultColor}; font-weight:700; margin-bottom:6px; font-size:1rem;">${resultText}</div>
                <p style="color:#94a3b8; font-size:0.9rem; line-height:1.5;"><span style="color:#fbbf24; font-weight:600;">Explanation:</span> ${q.explanation}</p>
            </div>
        `;
    }

    // Test 1 study mode: track correct count on the fly
    let scoreDisplay = '';
    if (isStudyMode) {
        const revealedCount = a2Revealed.filter(r => r).length;
        const correctSoFar = a2Answers.reduce((acc, ans, i) => acc + (a2Revealed[i] && ans === a2CurrentTest[i].correct ? 1 : 0), 0);
        if (revealedCount > 0) {
            scoreDisplay = `<span style="color:#94a3b8; font-size:0.85rem; margin-left:12px;">${correctSoFar}/${revealedCount} correct</span>`;
        }
    }

    // For Test 1: show "See Results" after all revealed; for Test 2: show submit on last question
    let submitBtn = '';
    if (isStudyMode) {
        const allRevealed = a2Revealed.every(r => r);
        if (allRevealed) {
            submitBtn = `<button onclick="submitA2Test()" style="padding:10px 28px; border-radius:8px; border:none; background:#10b981; color:#0f172a; font-weight:600; cursor:pointer; font-size:0.95rem; transition:opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">See Results</button>`;
        }
    } else if (index === total - 1) {
        submitBtn = `<button onclick="submitA2Test()" style="padding:10px 28px; border-radius:8px; border:none; background:#10b981; color:#0f172a; font-weight:600; cursor:pointer; font-size:0.95rem; transition:opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Submit Test</button>`;
    }

    const modeLabel = isStudyMode ? 'Study Mode' : 'Test Mode';

    area.innerHTML = `
        <div style="margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div>
                <span style="font-weight:700; color:#38bdf8; font-size:1.1rem;">Test ${a2TestNum}</span>
                <span style="color:#64748b; font-size:0.8rem; margin-left:8px; padding:2px 8px; background:#0f172a; border-radius:4px;">${modeLabel}</span>
                <span style="color:#94a3b8; margin-left:12px;">Question ${index + 1} of ${total}</span>
                ${scoreDisplay}
            </div>
            <span style="background:#1e293b; padding:4px 12px; border-radius:6px; font-size:0.85rem; color:#94a3b8; border:1px solid #334155;">${q.topic}</span>
        </div>
        <div style="background:#0f172a; border-radius:8px; height:6px; margin-bottom:20px; overflow:hidden;">
            <div style="background:linear-gradient(90deg,#38bdf8,#818cf8); height:100%; width:${progressPct}%; transition:width 0.3s;"></div>
        </div>
        <div style="color:#94a3b8; font-size:0.8rem; margin-bottom:16px; text-align:right;">${answered} of ${total} answered</div>
        <div style="background:#1e293b; border:1px solid #334155; border-radius:14px; padding:24px; margin-bottom:20px;">
            <p style="font-size:1.05rem; line-height:1.6; color:#e2e8f0; margin-bottom:20px;">${q.question}</p>
            ${choicesHTML}
            ${explanationHTML}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <button onclick="prevA2Question()" ${index === 0 ? 'disabled' : ''} style="padding:10px 24px; border-radius:8px; border:1px solid #334155; background:#1e293b; color:${index === 0 ? '#475569' : '#e2e8f0'}; cursor:${index === 0 ? 'default' : 'pointer'}; font-size:0.95rem; transition:border-color 0.2s;" ${index > 0 ? 'onmouseenter="this.style.borderColor=\'#38bdf8\'" onmouseleave="this.style.borderColor=\'#334155\'"' : ''}>&#8592; Previous</button>
            <div style="display:flex; gap:8px;">
                ${submitBtn}
                <button onclick="nextA2Question()" ${index === total - 1 ? 'disabled' : ''} style="padding:10px 24px; border-radius:8px; border:${index === total - 1 ? '1px solid #334155' : 'none'}; background:${index === total - 1 ? '#1e293b' : '#38bdf8'}; color:${index === total - 1 ? '#475569' : '#0f172a'}; font-weight:600; cursor:${index === total - 1 ? 'default' : 'pointer'}; font-size:0.95rem; transition:opacity 0.2s;" ${index < total - 1 ? 'onmouseenter="this.style.opacity=\'0.85\'" onmouseleave="this.style.opacity=\'1\'"' : ''}>Next &#8594;</button>
            </div>
        </div>
    `;
}

function selectA2Choice(choiceIndex) {
    if (a2Submitted) return;
    if (a2Revealed[a2CurrentQ]) return; // Already answered and revealed
    a2Answers[a2CurrentQ] = choiceIndex;

    if (a2TestNum === 1) {
        // Study mode: reveal answer immediately
        a2Revealed[a2CurrentQ] = true;
    }

    showA2Question(a2CurrentQ);
}

function nextA2Question() {
    if (a2CurrentQ < a2CurrentTest.length - 1) {
        showA2Question(a2CurrentQ + 1);
    }
}

function prevA2Question() {
    if (a2CurrentQ > 0) {
        showA2Question(a2CurrentQ - 1);
    }
}

function submitA2Test() {
    if (a2TestNum === 2) {
        const unanswered = a2Answers.filter(a => a === -1).length;
        if (unanswered > 0) {
            if (!confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`)) return;
        }
    }
    a2Submitted = true;

    const total = a2CurrentTest.length;
    let correct = 0;
    const topicStats = {};

    for (let i = 0; i < total; i++) {
        const q = a2CurrentTest[i];
        if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
        topicStats[q.topic].total++;
        if (a2Answers[i] === q.correct) {
            correct++;
            topicStats[q.topic].correct++;
        }
    }

    const pct = Math.round((correct / total) * 100);

    // Save Test 1 best score
    if (a2TestNum === 1) {
        saveTest1Score(pct);
    }

    let scoreColor = pct >= 90 ? '#10b981' : pct >= 60 ? '#fbbf24' : '#ef4444';
    let scoreLabel = pct >= 90 ? 'Ready for Test 2!' : pct >= 60 ? 'Almost There' : 'Keep Practicing';
    if (a2TestNum === 2) {
        scoreLabel = pct >= 90 ? 'Excellent - Ready for Algebra 2!' : pct >= 70 ? 'Good - Review weak areas' : 'Needs more practice';
    }

    let topicRows = '';
    for (const [topic, stats] of Object.entries(topicStats)) {
        const tPct = Math.round((stats.correct / stats.total) * 100);
        const tColor = tPct >= 80 ? '#10b981' : tPct >= 60 ? '#fbbf24' : '#ef4444';
        topicRows += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #334155;">
                <span style="color:#e2e8f0; font-size:0.93rem; flex:1;">${topic}</span>
                <span style="color:${tColor}; font-weight:600; min-width:70px; text-align:right;">${stats.correct}/${stats.total} (${tPct}%)</span>
            </div>
        `;
    }

    // Unlock message for Test 1
    let unlockMsg = '';
    if (a2TestNum === 1) {
        if (pct >= 90) {
            unlockMsg = `<div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:10px; padding:14px 20px; margin-bottom:20px; text-align:center;">
                <span style="color:#10b981; font-weight:600; font-size:1rem;">Test 2 is now unlocked!</span>
            </div>`;
        } else {
            unlockMsg = `<div style="background:rgba(251,191,36,0.1); border:1px solid #fbbf24; border-radius:10px; padding:14px 20px; margin-bottom:20px; text-align:center;">
                <span style="color:#fbbf24; font-size:0.95rem;">Score 90%+ to unlock Test 2 (you got ${pct}%)</span>
            </div>`;
        }
    }

    const area = document.getElementById('a2TestArea');
    area.innerHTML = `
        <div style="text-align:center; margin-bottom:24px;">
            <h2 style="color:#38bdf8; font-size:1.3rem; margin-bottom:8px;">Test ${a2TestNum} Results</h2>
        </div>
        <div style="background:#1e293b; border:1px solid #334155; border-radius:14px; padding:28px; text-align:center; margin-bottom:20px;">
            <div style="font-size:3rem; font-weight:800; color:${scoreColor}; margin-bottom:4px;">${pct}%</div>
            <div style="font-size:1.1rem; color:${scoreColor}; font-weight:600; margin-bottom:8px;">${scoreLabel}</div>
            <div style="color:#94a3b8; font-size:0.95rem;">${correct} out of ${total} correct</div>
        </div>
        ${unlockMsg}
        <div style="background:#1e293b; border:1px solid #334155; border-radius:14px; padding:20px; margin-bottom:20px;">
            <h3 style="color:#38bdf8; font-size:1rem; margin-bottom:12px;">Score by Topic</h3>
            ${topicRows}
        </div>
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <button onclick="showA2Review()" style="padding:10px 28px; border-radius:8px; border:none; background:#38bdf8; color:#0f172a; font-weight:600; cursor:pointer; font-size:0.95rem; transition:opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Review Answers</button>
            <button onclick="resetA2Test()" style="padding:10px 28px; border-radius:8px; border:1px solid #334155; background:#1e293b; color:#e2e8f0; cursor:pointer; font-size:0.95rem; transition:border-color 0.2s;" onmouseenter="this.style.borderColor='#38bdf8'" onmouseleave="this.style.borderColor='#334155'">Back to Tests</button>
        </div>
    `;
}

function showA2Review() {
    const area = document.getElementById('a2TestArea');
    const labels = ['A', 'B', 'C', 'D'];
    let questionsHTML = '';

    for (let i = 0; i < a2CurrentTest.length; i++) {
        const q = a2CurrentTest[i];
        const userAns = a2Answers[i];
        const isCorrect = userAns === q.correct;
        const borderColor = isCorrect ? '#10b981' : '#ef4444';
        const bgTint = isCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)';
        const statusIcon = isCorrect ? '&#10003;' : '&#10007;';
        const statusColor = isCorrect ? '#10b981' : '#ef4444';

        let choicesHTML = '';
        for (let c = 0; c < q.choices.length; c++) {
            let choiceStyle = 'color:#94a3b8;';
            let prefix = '';
            if (c === q.correct) {
                choiceStyle = 'color:#10b981; font-weight:600;';
                prefix = '&#10003; ';
            }
            if (c === userAns && !isCorrect) {
                choiceStyle = 'color:#ef4444; text-decoration:line-through;';
                prefix = '&#10007; ';
            }
            choicesHTML += `<div style="${choiceStyle} padding:3px 0; font-size:0.9rem;">${prefix}<span style="font-weight:600; margin-right:6px;">${labels[c]}.</span>${q.choices[c]}</div>`;
        }

        questionsHTML += `
            <div style="background:${bgTint}; border:1px solid ${borderColor}; border-radius:12px; padding:18px; margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px; gap:8px;">
                    <span style="font-weight:700; color:#38bdf8; font-size:0.9rem;">Q${i + 1}</span>
                    <span style="font-size:0.8rem; color:#94a3b8; background:#0f172a; padding:2px 8px; border-radius:4px;">${q.topic}</span>
                    <span style="color:${statusColor}; font-weight:700; font-size:1.1rem;">${statusIcon}</span>
                </div>
                <p style="color:#e2e8f0; font-size:0.95rem; margin-bottom:10px; line-height:1.5;">${q.question}</p>
                ${choicesHTML}
                <div style="margin-top:10px; padding-top:10px; border-top:1px solid #334155;">
                    <p style="color:#94a3b8; font-size:0.85rem;"><span style="color:#fbbf24; font-weight:600;">Explanation:</span> ${q.explanation}</p>
                </div>
                ${userAns === -1 ? '<div style="color:#fbbf24; font-size:0.85rem; font-weight:600; margin-top:6px;">Unanswered</div>' : ''}
            </div>
        `;
    }

    const correct = a2Answers.filter((a, i) => a === a2CurrentTest[i].correct).length;

    area.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <h2 style="color:#38bdf8; font-size:1.2rem;">Test ${a2TestNum} Review &mdash; ${correct}/${a2CurrentTest.length} Correct</h2>
            <div style="display:flex; gap:10px;">
                <button onclick="submitA2Test()" style="padding:8px 20px; border-radius:8px; border:1px solid #334155; background:#1e293b; color:#e2e8f0; cursor:pointer; font-size:0.9rem; transition:border-color 0.2s;" onmouseenter="this.style.borderColor='#38bdf8'" onmouseleave="this.style.borderColor='#334155'">Score Summary</button>
                <button onclick="resetA2Test()" style="padding:8px 20px; border-radius:8px; border:1px solid #334155; background:#1e293b; color:#e2e8f0; cursor:pointer; font-size:0.9rem; transition:border-color 0.2s;" onmouseenter="this.style.borderColor='#38bdf8'" onmouseleave="this.style.borderColor='#334155'">Back to Tests</button>
            </div>
        </div>
        <div style="max-height:70vh; overflow-y:auto; padding-right:8px;">
            ${questionsHTML}
        </div>
    `;
}
