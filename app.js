// ================================================================
// SUPABASE CONFIGURATION
// ================================================================
// आपन Supabase URL आ anon key एतय डाली
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================================================
// APP STATE
// ================================================================
const APP = {
    currentUser: null,
    session: null,
    currentIndex: 0,
    practiced: {},
    theme: localStorage.getItem('tirhuta_theme') || 'light',
    isAdmin: false,
    // Canvas state
    canvas: null,
    ctx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    drawHistory: [],
    historyIndex: -1,
    maxHistory: 30,
    // Exam state
    examQuestions: [],
    examIndex: 0,
    examScore: 0,
    examAnswered: false,
    examTotal: 0
};

// ================================================================
// DOM REFS
// ================================================================
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ================================================================
// TOAST NOTIFICATIONS
// ================================================================
function showToast(msg, type = 'info') {
    const container = $('toastContainer');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="icon">${icons[type] || 'ℹ️'}</span>
        <span class="message">${msg}</span>
        <button class="close">&times;</button>
    `;
    toast.querySelector('.close').onclick = () => toast.remove();
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
}

// ================================================================
// THEME
// ================================================================
function toggleTheme() {
    APP.theme = APP.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', APP.theme);
    localStorage.setItem('tirhuta_theme', APP.theme);
    const icon = $('themeIcon');
    icon.className = APP.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
$('themeBtn').onclick = toggleTheme;
document.documentElement.setAttribute('data-theme', APP.theme);
if (APP.theme === 'dark') $('themeIcon').className = 'fas fa-sun';

// ================================================================
// AUTH SYSTEM (Supabase)
// ================================================================
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        APP.session = session;
        APP.currentUser = session.user;
        
        // Check if admin (via user_metadata)
        const isAdmin = session.user.user_metadata?.role === 'admin';
        APP.isAdmin = isAdmin;
        
        // Load user progress
        await loadUserProgress(session.user.id);
        updateUI();
        return true;
    }
    return false;
}

async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) throw error;
        
        APP.session = data.session;
        APP.currentUser = data.user;
        APP.isAdmin = data.user.user_metadata?.role === 'admin';
        
        await loadUserProgress(data.user.id);
        updateUI();
        showToast('लॉगिन सफल! स्वागत अछि 🎉', 'success');
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function registerUser(email, password, name) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name || 'साधक',
                    role: 'user'
                }
            }
        });
        if (error) throw error;
        
        // Create user profile
        if (data.user) {
            await supabase.from('user_progress').insert([{
                user_id: data.user.id,
                name: name || 'साधक',
                email: email,
                progress: {},
                exam_scores: [],
                streak: 0,
                total_time: 0
            }]);
        }
        
        showToast('रजिस्ट्रेशन सफल! कृपया लॉगिन करी', 'success');
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function logoutUser() {
    await supabase.auth.signOut();
    APP.currentUser = null;
    APP.session = null;
    APP.isAdmin = false;
    APP.practiced = {};
    $('userDropdown').classList.remove('show');
    updateUI();
    navigateTo('home');
    showToast('लॉगआउट भ गेल', 'info');
}

async function loadUserProgress(userId) {
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
            APP.practiced = data.progress || {};
        } else {
            // Create profile if doesn't exist
            await supabase.from('user_progress').insert([{
                user_id: userId,
                name: APP.currentUser?.user_metadata?.name || 'साधक',
                email: APP.currentUser?.email,
                progress: {},
                exam_scores: [],
                streak: 0,
                total_time: 0
            }]);
            APP.practiced = {};
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

async function saveUserProgress() {
    if (!APP.currentUser) return;
    
    try {
        const { error } = await supabase
            .from('user_progress')
            .update({
                progress: APP.practiced,
                last_practice: new Date().toISOString()
            })
            .eq('user_id', APP.currentUser.id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

async function saveExamResult(score, total, pct) {
    if (!APP.currentUser) return;
    
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('exam_scores')
            .eq('user_id', APP.currentUser.id)
            .single();
        
        if (error) throw error;
        
        const scores = data.exam_scores || [];
        scores.push({
            score: score,
            total: total,
            pct: pct,
            date: new Date().toISOString()
        });
        
        // Check if passed for certificate
        if (pct >= 70) {
            await supabase
                .from('user_progress')
                .update({
                    exam_scores: scores,
                    certificate: {
                        name: APP.currentUser.user_metadata?.name || 'साधक',
                        score: score,
                        total: total,
                        pct: pct,
                        date: new Date().toISOString()
                    }
                })
                .eq('user_id', APP.currentUser.id);
        } else {
            await supabase
                .from('user_progress')
                .update({ exam_scores: scores })
                .eq('user_id', APP.currentUser.id);
        }
    } catch (error) {
        console.error('Error saving exam:', error);
    }
}

// ================================================================
// AUTH MODAL
// ================================================================
let isLoginMode = true;

function openAuthModal(mode = 'login') {
    isLoginMode = mode === 'login';
    $('authModal').classList.add('show');
    $('authError').textContent = '';
    $('authSuccess').textContent = '';
    
    if (isLoginMode) {
        $('authSubtitle').textContent = 'लॉगिन करी आ सीखना शुरू करी';
        $('authSubmitBtn').innerHTML = '<i class="fas fa-sign-in-alt"></i> लॉगिन करी';
        $('nameField').style.display = 'none';
        $('authSwitch').innerHTML = '<span onclick="toggleAuthMode()">नव छी?</span> खाता बनाउ';
    } else {
        $('authSubtitle').textContent = 'खाता बनाउ आ सीखना शुरू करी';
        $('authSubmitBtn').innerHTML = '<i class="fas fa-user-plus"></i> रजिस्टर करी';
        $('nameField').style.display = 'block';
        $('authSwitch').innerHTML = '<span onclick="toggleAuthMode()">पुरान छी?</span> लॉगिन करी';
    }
    $('authForm').reset();
}

function closeAuthModal() {
    $('authModal').classList.remove('show');
}

function toggleAuthMode() {
    openAuthModal(isLoginMode ? 'register' : 'login');
}

async function handleAuth(e) {
    e.preventDefault();
    const name = $('authName').value.trim();
    const email = $('authEmail').value.trim();
    const password = $('authPassword').value;
    
    $('authError').textContent = '';
    $('authSuccess').textContent = '';
    
    if (!email || !password) {
        $('authError').textContent = 'कृपया ईमेल आ पासवर्ड दर्ज करी';
        return;
    }
    
    if (isLoginMode) {
        const result = await loginUser(email, password);
        if (result.success) {
            closeAuthModal();
            updateUI();
            navigateTo('home');
        } else {
            $('authError').textContent = result.message;
        }
    } else {
        if (!name) {
            $('authError').textContent = 'कृपया पूरा नाम दर्ज करी';
            return;
        }
        if (password.length < 6) {
            $('authError').textContent = 'पासवर्ड न्यूनतम 6 अंकक होइत';
            return;
        }
        const result = await registerUser(email, password, name);
        if (result.success) {
            $('authSuccess').textContent = 'रजिस्टर भ गेल! अब लॉगिन करी।';
            setTimeout(() => {
                openAuthModal('login');
            }, 1500);
        } else {
            $('authError').textContent = result.message;
        }
    }
}

// ================================================================
// UI UPDATE
// ================================================================
function updateUI() {
    const user = APP.currentUser;
    const authSection = $('authSection');
    const userMenu = $('userMenu');
    const display = $('userNameDisplay');
    const avatar = $('userAvatar');
    
    if (user) {
        authSection.style.display = 'none';
        userMenu.style.display = 'block';
        const name = user.user_metadata?.name || 'साधक';
        display.textContent = name;
        avatar.textContent = name.charAt(0) || 'सा';
        $('menuAdmin').style.display = APP.isAdmin ? 'block' : 'none';
    } else {
        authSection.style.display = 'block';
        userMenu.style.display = 'none';
        $('menuAdmin').style.display = 'none';
    }
    updateDashboard();
    updateHeroStats();
}

// ================================================================
// NAVIGATION
// ================================================================
function navigateTo(page) {
    const pages = ['home', 'practice', 'progress', 'exam', 'certificate', 'admin'];
    pages.forEach(p => {
        const el = $(p + 'Page');
        if (el) el.classList.remove('active');
    });
    const target = $(page + 'Page');
    if (target) target.classList.add('active');
    
    $$('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.page === page) tab.classList.add('active');
    });
    
    if (page === 'practice') initPractice();
    if (page === 'progress') updateProgressUI();
    if (page === 'exam') initExam();
    if (page === 'certificate') updateCertificateUI();
    if (page === 'admin' && APP.isAdmin) refreshAdminData();
    if (page === 'home') { updateDashboard(); updateHeroStats(); }
    
    $('userDropdown').classList.remove('show');
}

// ================================================================
// HERO STATS
// ================================================================
function updateHeroStats() {
    const total = TIRHUTA_DATA.length;
    const done = Object.keys(APP.practiced).filter(k => APP.practiced[k]).length;
    const pct = Math.round((done / total) * 100);
    
    $('heroTotal').textContent = total;
    $('heroDone').textContent = done;
    $('heroPercent').textContent = pct + '%';
}

// ================================================================
// DASHBOARD
// ================================================================
function updateDashboard() {
    const total = TIRHUTA_DATA.length;
    const done = Object.keys(APP.practiced).filter(k => APP.practiced[k]).length;
    const pct = Math.round((done / total) * 100);
    
    $('statTotal').textContent = total;
    $('statDone').textContent = done;
    $('statProgress').textContent = pct + '%';
    $('learnBadge').textContent = pct + '%';
    
    const dailyDone = Math.min(done, 5);
    $('dailyProgress').style.width = (dailyDone / 5 * 100) + '%';
    $('dailyText').textContent = `${dailyDone}/5`;
    
    $('monthlyProgress').style.width = pct + '%';
    $('monthlyText').textContent = `${done}/${total}`;
}

// ================================================================
// CANVAS - Improved with Undo/Redo
// ================================================================
function initCanvas() {
    const canvas = $('practiceCanvas');
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width || 400, 400);
    
    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    APP.canvas = canvas;
    APP.ctx = canvas.getContext('2d');
    const ctx = APP.ctx;
    ctx.scale(dpr, dpr);
    
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2D1B0E';
    
    // Mouse events
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', stopDraw, { passive: false });
    
    clearCanvas();
    loadChar(APP.currentIndex || 0);
}

function getCanvasCoords(e) {
    const canvas = APP.canvas;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
}

function handleTouchStart(e) {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    startDraw({ clientX: t.clientX, clientY: t.clientY });
}

function handleTouchMove(e) {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    draw({ clientX: t.clientX, clientY: t.clientY });
}

function startDraw(e) {
    const canvas = APP.canvas;
    if (!canvas) return;
    APP.isDrawing = true;
    const coords = getCanvasCoords(e);
    APP.lastX = coords.x;
    APP.lastY = coords.y;
    
    // Start new stroke
    const ctx = APP.ctx;
    ctx.beginPath();
    ctx.moveTo(APP.lastX, APP.lastY);
}

function draw(e) {
    if (!APP.isDrawing) return;
    const canvas = APP.canvas;
    const ctx = APP.ctx;
    if (!canvas || !ctx) return;
    
    const coords = getCanvasCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    APP.lastX = coords.x;
    APP.lastY = coords.y;
}

function stopDraw() {
    if (!APP.isDrawing) return;
    APP.isDrawing = false;
    
    // Save to history
    const canvas = APP.canvas;
    if (canvas) {
        const dataUrl = canvas.toDataURL();
        // Remove any future states
        APP.drawHistory = APP.drawHistory.slice(0, APP.historyIndex + 1);
        APP.drawHistory.push(dataUrl);
        if (APP.drawHistory.length > APP.maxHistory) {
            APP.drawHistory.shift();
        }
        APP.historyIndex = APP.drawHistory.length - 1;
    }
}

function undoDraw() {
    if (APP.historyIndex <= 0) return;
    APP.historyIndex--;
    restoreHistory();
}

function redoDraw() {
    if (APP.historyIndex >= APP.drawHistory.length - 1) return;
    APP.historyIndex++;
    restoreHistory();
}

function restoreHistory() {
    const canvas = APP.canvas;
    const ctx = APP.ctx;
    if (!canvas || !ctx || APP.drawHistory.length === 0) return;
    
    const img = new Image();
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = APP.drawHistory[APP.historyIndex];
}

function clearCanvas() {
    const canvas = APP.canvas;
    const ctx = APP.ctx;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#f0ebe4';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 10; i++) {
        const p = (i / 10) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(p, 0);
        ctx.lineTo(p, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, p);
        ctx.lineTo(canvas.width, p);
        ctx.stroke();
    }
    
    // Draw hint character
    const data = TIRHUTA_DATA[APP.currentIndex];
    if (data) {
        ctx.fillStyle = '#e0d8d0';
        const fs = Math.min(canvas.width * 0.35, 120);
        ctx.font = fs + 'px "Mithilauni", "Noto Sans Tirhuta", "Noto Sans Devanagari", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.char, canvas.width / 2, canvas.height / 2);
    }
    
    ctx.strokeStyle = '#2D1B0E';
    ctx.lineWidth = 6;
    
    // Reset history
    APP.drawHistory = [];
    APP.historyIndex = -1;
}

// ================================================================
// PRACTICE
// ================================================================
function initPractice() {
    if (!APP.canvas) {
        initCanvas();
    }
    loadChar(APP.currentIndex || 0);
}

function loadChar(index) {
    const data = TIRHUTA_DATA[index];
    if (!data) return;
    
    APP.currentIndex = index;
    localStorage.setItem('tirhuta_current_index', index);
    
    $('currentChar').textContent = data.char;
    $('charName').textContent = data.char + ' - ' + data.name;
    $('charCounter').textContent = (index + 1) + ' / ' + TIRHUTA_DATA.length;
    $('charPronounce').textContent = data.pronounce;
    $('charCategory').textContent = data.category;
    $('charStrokes').textContent = data.strokes + ' स्ट्रोक';
    $('charExample').textContent = data.example || '—';
    
    // Update stroke guide
    const steps = $$('.stroke-step');
    steps.forEach((el, i) => {
        if (i < data.strokes) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
    
    const status = $('practiceStatus');
    if (APP.practiced[index]) {
        status.className = 'status success';
        status.textContent = '✅ अभ्यास हो चुकल अछि!';
    } else {
        status.className = 'status';
        status.textContent = '✍️ उंगली या माउस सँ लिखी';
    }
    
    clearCanvas();
    updateDashboard();
    updateHeroStats();
}

async function savePractice() {
    const data = TIRHUTA_DATA[APP.currentIndex];
    if (!data) return;
    
    APP.practiced[APP.currentIndex] = {
        char: data.char,
        name: data.name,
        timestamp: new Date().toISOString()
    };
    
    await saveUserProgress();
    
    const status = $('practiceStatus');
    status.className = 'status success';
    status.textContent = '✅ सहेजल गेल!';
    
    showToast('अभ्यास सहेजल गेल! 🎉', 'success');
    updateDashboard();
    updateHeroStats();
    
    // Auto advance
    setTimeout(() => {
        if (APP.currentIndex < TIRHUTA_DATA.length - 1) {
            APP.currentIndex++;
            loadChar(APP.currentIndex);
        } else {
            showToast('🎉 सब अक्षर पूर्ण!', 'success');
        }
    }, 600);
}

// ================================================================
// PROGRESS UI
// ================================================================
function updateProgressUI() {
    const total = TIRHUTA_DATA.length;
    const done = Object.keys(APP.practiced).filter(k => APP.practiced[k]).length;
    const pct = Math.round((done / total) * 100);
    
    $('progDone').textContent = done;
    $('progTotal').textContent = total;
    $('progPercent').textContent = pct + '%';
    $('progRemaining').textContent = total - done;
    $('progressFill').style.width = pct + '%';
    
    const grid = $('charGrid');
    grid.innerHTML = '';
    TIRHUTA_DATA.forEach((data, i) => {
        const div = document.createElement('div');
        div.className = 'char-grid-item';
        if (APP.practiced[i]) div.classList.add('done');
        if (i === APP.currentIndex) div.classList.add('current');
        div.textContent = data.char;
        div.title = data.name;
        div.onclick = () => {
            APP.currentIndex = i;
            localStorage.setItem('tirhuta_current_index', i);
            navigateTo('practice');
            setTimeout(() => loadChar(i), 100);
        };
        grid.appendChild(div);
    });
}

// ================================================================
// EXAM
// ================================================================
function initExam() {
    const shuffled = [...TIRHUTA_DATA].sort(() => Math.random() - 0.5);
    APP.examQuestions = shuffled.slice(0, 10).map(item => {
        const wrongs = TIRHUTA_DATA.filter(c => c.char !== item.char)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        const opts = [item, ...wrongs].sort(() => Math.random() - 0.5);
        return {
            char: item.char,
            options: opts.map(o => o.char),
            correct: item.char,
            name: item.name
        };
    });
    APP.examIndex = 0;
    APP.examScore = 0;
    APP.examAnswered = false;
    APP.examTotal = APP.examQuestions.length;
    $('examResult').className = 'exam-result';
    $('examResult').textContent = '';
    renderExamQuestion();
}

function renderExamQuestion() {
    if (APP.examIndex >= APP.examQuestions.length) {
        showExamResult();
        return;
    }
    const q = APP.examQuestions[APP.examIndex];
    $('examQuestionText').textContent = `"${q.char}" कौन अक्षर अछि?`;
    const options = $('examOptions');
    options.innerHTML = '';
    APP.examAnswered = false;
    $('examFeedback').textContent = '';
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.dataset.value = opt;
        btn.onclick = () => handleExamAnswer(btn, opt, q.correct);
        options.appendChild(btn);
    });
}

function handleExamAnswer(btn, selected, correct) {
    if (APP.examAnswered) return;
    APP.examAnswered = true;
    const all = $('examOptions').querySelectorAll('button');
    all.forEach(b => {
        b.disabled = true;
        if (b.dataset.value === correct) b.classList.add('correct');
        if (b === btn && selected !== correct) b.classList.add('wrong');
    });
    if (selected === correct) {
        APP.examScore++;
        $('examFeedback').innerHTML = '✅ सही!';
        $('examFeedback').style.color = '#2e7d32';
    } else {
        $('examFeedback').innerHTML = '❌ गलत। सही: "' + correct + '"';
        $('examFeedback').style.color = '#c62828';
    }
}

$('examNextBtn').onclick = () => {
    if (!APP.examAnswered && APP.examIndex < APP.examQuestions.length) {
        showToast('पहिले उत्तर दी', 'warning');
        return;
    }
    APP.examIndex++;
    APP.examIndex >= APP.examQuestions.length ? showExamResult() : renderExamQuestion();
};

$('examResetBtn').onclick = initExam;

async function showExamResult() {
    const pct = Math.round((APP.examScore / APP.examTotal) * 100);
    const passed = pct >= 70;
    const result = $('examResult');
    result.className = 'exam-result show ' + (passed ? 'pass' : 'fail');
    result.innerHTML = `
        <strong>${passed ? '🎉 बधाई!' : '😞 पुनः प्रयास करी'}</strong><br>
        स्कोर: ${APP.examScore}/${APP.examTotal} (${pct}%)
    `;
    $('examOptions').innerHTML = '';
    $('examFeedback').textContent = '';
    
    if (passed && APP.currentUser) {
        await saveExamResult(APP.examScore, APP.examTotal, pct);
        updateCertificateUI();
        showToast('🎉 परीक्षा पास! प्रमाणपत्र देखी।', 'success');
    }
}

// ================================================================
// CERTIFICATE
// ================================================================
async function updateCertificateUI() {
    if (!APP.currentUser) {
        $('certName').textContent = 'साधक';
        $('certScore').textContent = 'स्कोर: —';
        $('certDate').textContent = '—';
        $('certStatus').innerHTML = 'ℹ️ परीक्षा पास करी (७०%+)';
        $('certStatus').style.color = '#888';
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('certificate, name')
            .eq('user_id', APP.currentUser.id)
            .single();
        
        if (error) throw error;
        
        const cert = data?.certificate;
        if (cert && cert.pct >= 70) {
            $('certName').textContent = data?.name || 'साधक';
            $('certScore').textContent = 'स्कोर: ' + cert.score + '/' + cert.total + ' (' + cert.pct + '%)';
            $('certDate').textContent = new Date(cert.date).toLocaleDateString('hi-IN');
            $('certStatus').innerHTML = '✅ प्रमाणपत्र तैयार!';
            $('certStatus').style.color = '#2e7d32';
            $('downloadCert').disabled = false;
            $('shareCert').disabled = false;
        } else {
            $('certName').textContent = data?.name || 'साधक';
            $('certScore').textContent = 'स्कोर: —';
            $('certDate').textContent = '—';
            $('certStatus').innerHTML = 'ℹ️ परीक्षा पास करी (७०%+)';
            $('certStatus').style.color = '#888';
            $('downloadCert').disabled = true;
            $('shareCert').disabled = true;
        }
    } catch (error) {
        console.error('Error loading certificate:', error);
    }
}

// ================================================================
// ADMIN
// ================================================================
async function refreshAdminData() {
    if (!APP.isAdmin) {
        showToast('एडमिन एक्सेस नै अछि', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const tbody = $('adminTableBody');
        $('adminTotalUsers').textContent = `कुल उपयोगकर्ता: ${data?.length || 0}`;
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted);">कोनो डेटा नै</td></tr>`;
            return;
        }
        
        let html = '';
        data.forEach((u, i) => {
            const done = Object.keys(u.progress || {}).filter(k => u.progress[k]).length || 0;
            const pct = Math.round((done / 122) * 100);
            const examCount = u.exam_scores?.length || 0;
            const hasCert = u.certificate && u.certificate.pct >= 70 ? '✅' : '—';
            const lastLogin = u.last_practice ? new Date(u.last_practice).toLocaleDateString('hi-IN') : '—';
            
            html += `
                <tr>
                    <td>${i + 1}</td>
                    <td><strong>${u.name || '—'}</strong></td>
                    <td>${u.email || '—'}</td>
                    <td>${pct}% (${done}/122)</td>
                    <td>${examCount}</td>
                    <td>${hasCert}</td>
                    <td>${lastLogin}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        showToast('डेटा रिफ्रेश भ गेल', 'success');
    } catch (error) {
        showToast('डेटा लोड करमे त्रुटि', 'error');
        console.error(error);
    }
}

// ================================================================
// USER MENU
// ================================================================
$('userMenuBtn').onclick = function(e) {
    e.stopPropagation();
    $('userDropdown').classList.toggle('show');
};

document.onclick = function() {
    $('userDropdown').classList.remove('show');
};

// ================================================================
// PRACTICE BUTTONS
// ================================================================
$('clearCanvas').onclick = clearCanvas;
$('savePractice').onclick = savePractice;
$('undoBtn').onclick = undoDraw;
$('redoBtn').onclick = redoDraw;
$('prevChar').onclick = () => {
    if (APP.currentIndex > 0) { APP.currentIndex--; loadChar(APP.currentIndex); }
};
$('nextChar').onclick = () => {
    if (APP.currentIndex < TIRHUTA_DATA.length - 1) { APP.currentIndex++; loadChar(APP.currentIndex); }
};

// ================================================================
// KEYBOARD SHORTCUTS
// ================================================================
document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    
    if (e.key === 'ArrowLeft' && APP.currentIndex > 0) { APP.currentIndex--; loadChar(APP.currentIndex); e.preventDefault(); }
    if (e.key === 'ArrowRight' && APP.currentIndex < TIRHUTA_DATA.length - 1) { APP.currentIndex++; loadChar(APP.currentIndex); e.preventDefault(); }
    if (e.key === 's' || e.key === 'S') { savePractice(); e.preventDefault(); }
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) { undoDraw(); e.preventDefault(); }
    if (e.key === 'y' && (e.ctrlKey || e.metaKey)) { redoDraw(); e.preventDefault(); }
    if (e.key === 'Escape') { $('userDropdown').classList.remove('show'); closeAuthModal(); }
});

// ================================================================
// RESIZE
// ================================================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (APP.canvas) {
            const canvas = APP.canvas;
            const container = canvas.parentElement;
            const rect = container.getBoundingClientRect();
            const size = Math.min(rect.width || 400, 400);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = size + 'px';
            canvas.style.height = size + 'px';
            const ctx = APP.ctx;
            ctx.scale(dpr, dpr);
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#2D1B0E';
            loadChar(APP.currentIndex || 0);
        }
    }, 300);
});

// ================================================================
// INIT
// ================================================================
async function init() {
    await checkAuth();
    
    // Load saved index
    const idx = localStorage.getItem('tirhuta_current_index');
    if (idx) APP.currentIndex = parseInt(idx);
    
    updateUI();
    navigateTo('home');
    
    // Admin menu
    if (!APP.isAdmin) {
        $('menuAdmin').style.display = 'none';
    }
    
    console.log('🙏 तिरहुता लिपि शिक्षण मञ्च तैयार!');
    console.log('📖 कुल अक्षर:', TIRHUTA_DATA.length);
    console.log('👤 वर्तमान:', APP.currentUser?.email || 'कोनो नै');
    console.log('⌨️  ← → नेविगेट, S सहेजी, Ctrl+Z पूर्व, Ctrl+Y बाद');
}

init();
