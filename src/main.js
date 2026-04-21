import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib';

// ─── Router ───────────────────────────────────────────────
function navigate(path) {
  history.pushState({}, '', path);
  render(path);
}

window.addEventListener('popstate', () => render(location.pathname));

function render(path) {
  const app = document.getElementById('app');
  switch (path) {
    case '/about':   app.innerHTML = aboutPage();   break;
    case '/privacy': app.innerHTML = privacyPage(); break;
    case '/contact': app.innerHTML = contactPage(); break;
    case '/blog':    app.innerHTML = blogPage();    break;
    default:         app.innerHTML = homePage();    attachHomeListeners(); break;
  }
  document.querySelectorAll('[data-link]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.getAttribute('href'));
    });
  });
  window.scrollTo(0, 0);
}

// ─── Nav ──────────────────────────────────────────────────
function navHTML(activePage = '') {
  const links = [
    { href: '/',        label: 'Home' },
    { href: '/blog',    label: 'Blog' },
    { href: '/about',   label: 'About' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/contact', label: 'Contact' },
  ];
  return `
  <nav>
    <div class="nav-inner">
      <a class="logo" href="/" data-link>
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        UnlockMyDoc
      </a>
      <ul class="nav-links">
        ${links.map(l => `
          <li><a href="${l.href}" data-link class="${activePage === l.href ? 'active' : ''}">${l.label}</a></li>
        `).join('')}
      </ul>
    </div>
  </nav>`;
}

// ─── Footer ───────────────────────────────────────────────
function footerHTML() {
  return `
  <footer>
    <div class="footer-inner">
      <div class="footer-nav">
        <a href="/" data-link>Home</a>
        <a href="/blog" data-link>Blog</a>
        <a href="/about" data-link>About</a>
        <a href="/privacy" data-link>Privacy Policy</a>
        <a href="/contact" data-link>Contact</a>
      </div>
      <p>© ${new Date().getFullYear()} <span>UnlockMyDoc</span>. All rights reserved. Your files never leave your device.</p>
    </div>
  </footer>`;
}

// ─── Home Page ────────────────────────────────────────────
function homePage() {
  return `
  ${navHTML('/')}

  <div class="page active">
    <div class="hero">
      <div class="hero-badge"><span class="dot"></span> 100% Client-Side · Zero Uploads</div>
      <h1>Unlock PDF Passwords<br><span>Instantly & Privately</span></h1>
      <p>Remove password protection from any PDF in seconds — entirely in your browser. Your file never touches our servers.</p>
    </div>

    <div class="privacy-banner">
      <span class="shield-icon">🛡️</span>
      <div>
        <strong>Your Privacy is Guaranteed</strong><br>
        <span>All processing happens locally on your device using WebAssembly. We never see your files.</span>
      </div>
    </div>

    <div id="ad-top" class="ad-slot container">Advertisement</div>

    <div class="tool-card container">
      <div class="drop-zone" id="drop-zone">
        <div class="drop-icon">📄</div>
        <h3>Drop your PDF here</h3>
        <p>or <span>browse to upload</span></p>
        <input type="file" id="file-input" accept=".pdf" />
      </div>

      <div class="file-info" id="file-info">
        <div class="file-icon">📄</div>
        <div class="file-details">
          <div class="file-name" id="file-name"></div>
          <div class="file-size" id="file-size"></div>
        </div>
        <button class="remove-file" id="remove-file">✕</button>
      </div>

      <div class="field-group" id="password-section" style="display:none;">
        <label class="field-label">PDF Password</label>
        <div class="field-wrap">
          <input type="password" id="password-input" placeholder="Enter the PDF password…" />
          <button class="toggle-pw" id="toggle-pw">👁</button>
        </div>
      </div>

      <div class="progress-wrap" id="progress-wrap">
        <div class="progress-label">
          <span id="progress-text">Processing…</span>
          <span id="progress-pct">0%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
      </div>

      <div class="status-msg" id="status-msg"></div>

      <a class="btn-download" id="btn-download">⬇ Download Unlocked PDF</a>

      <button class="btn-unlock" id="unlock-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
        </svg>
        Unlock PDF
      </button>
    </div>

    <div id="ad-mid" class="ad-slot container">Advertisement</div>

    <div class="how-section">
      <h2 class="section-title">How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <h4>Upload PDF</h4>
          <p>Drag & drop or browse to select your password-protected PDF file.</p>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <h4>Enter Password</h4>
          <p>Type the PDF password. Everything stays in your browser — nothing is sent anywhere.</p>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <h4>Download Free</h4>
          <p>Click Unlock and instantly download your password-free PDF.</p>
        </div>
      </div>
    </div>

    <div id="ad-bottom" class="ad-slot container">Advertisement</div>
  </div>

  ${footerHTML()}`;
}

function attachHomeListeners() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileInfo = document.getElementById('file-info');
  const fileNameEl = document.getElementById('file-name');
  const fileSizeEl = document.getElementById('file-size');
  const removeFile = document.getElementById('remove-file');
  const passwordSection = document.getElementById('password-section');
  const passwordInput = document.getElementById('password-input');
  const togglePw = document.getElementById('toggle-pw');
  const unlockBtn = document.getElementById('unlock-btn');
  const statusMsg = document.getElementById('status-msg');
  const btnDownload = document.getElementById('btn-download');
  const progressWrap = document.getElementById('progress-wrap');
  const progressFill = document.getElementById('progress-fill');
  const progressPct = document.getElementById('progress-pct');
  const progressText = document.getElementById('progress-text');
  let pdfFile = null;

  function formatSize(bytes) {
    return bytes < 1024 * 1024
      ? (bytes / 1024).toFixed(1) + ' KB'
      : (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function setStatus(type, msg) {
    statusMsg.className = `status-msg visible ${type}`;
    statusMsg.textContent = msg;
  }

  function clearStatus() {
    statusMsg.className = 'status-msg';
    statusMsg.textContent = '';
  }

  function handleFile(file) {
    if (!file || file.type !== 'application/pdf') {
      setStatus('error', '❌ Please select a valid PDF file.');
      return;
    }
    pdfFile = file;
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatSize(file.size);
    fileInfo.classList.add('visible');
    passwordSection.style.display = 'block';
    btnDownload.classList.remove('visible');
    clearStatus();
  }

  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
  });

  removeFile.addEventListener('click', () => {
    pdfFile = null;
    fileInput.value = '';
    fileInfo.classList.remove('visible');
    passwordSection.style.display = 'none';
    btnDownload.classList.remove('visible');
    clearStatus();
  });

  togglePw.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  });

  unlockBtn.addEventListener('click', async () => {
    if (!pdfFile) { setStatus('error', '❌ Please select a PDF file first.'); return; }
    const password = passwordInput.value;
    if (!password) { setStatus('error', '❌ Please enter the PDF password.'); return; }

    unlockBtn.innerHTML = `<div class="spinner"></div> Unlocking…`;
    unlockBtn.disabled = true;
    clearStatus();
    progressWrap.classList.add('visible');
    progressFill.style.width = '0%';
    progressPct.textContent = '0%';
    progressText.textContent = 'Reading file…';

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      progressFill.style.width = '40%'; progressPct.textContent = '40%';
      progressText.textContent = 'Decrypting…';

      const pdfDoc = await PDFDocument.load(arrayBuffer, { password });
      progressFill.style.width = '80%'; progressPct.textContent = '80%';
      progressText.textContent = 'Saving…';

      const unlockedBytes = await pdfDoc.save();
      progressFill.style.width = '100%'; progressPct.textContent = '100%';

      const blob = new Blob([unlockedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      btnDownload.href = url;
      btnDownload.download = pdfFile.name.replace('.pdf', '_unlocked.pdf');
      btnDownload.classList.add('visible');

      setStatus('success', '✅ PDF unlocked successfully! Click the button above to download.');
    } catch {
      setStatus('error', '❌ Wrong password or the PDF is not password-protected.');
      progressWrap.classList.remove('visible');
    }

    unlockBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg> Unlock PDF`;
    unlockBtn.disabled = false;
  });
}

// ─── Blog Page ────────────────────────────────────────────
function blogPage() {
  return `
  ${navHTML('/blog')}
  <div class="page active">
    <div class="content-page">
      <h1>Blog</h1>
      <p class="subtitle">Guides and tips for working with PDF files.</p>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">📄</div>
          <h4>How to Remove a PDF Password</h4>
          <p>Step-by-step guide to unlocking password-protected PDFs on any device.</p>
          <a href="/blog/how-to-remove-pdf-password.html" style="color:var(--accent);font-size:0.85rem;font-weight:600;text-decoration:none;display:inline-block;margin-top:10px;">Read Guide →</a>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <h4>How to Unlock a PDF on iPhone</h4>
          <p>A complete guide to opening and unlocking password-protected PDFs on iOS.</p>
          <a href="/blog/unlock-pdf-on-iphone.html" style="color:var(--accent);font-size:0.85rem;font-weight:600;text-decoration:none;display:inline-block;margin-top:10px;">Read Guide →</a>
        </div>
      </div>
    </div>
  </div>
  ${footerHTML()}`;
}

// ─── About Page ───────────────────────────────────────────
function aboutPage() {
  return `
  ${navHTML('/about')}
  <div class="page active">
    <div class="content-page">
      <h1>About UnlockMyDoc</h1>
      <p class="subtitle">A private, browser-based PDF password remover — built for everyone.</p>

      <p>UnlockMyDoc is a free tool that removes password protection from PDF files entirely in your browser. No uploads, no accounts, no fees.</p>

      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">🔒</div>
          <h4>100% Private</h4>
          <p>Your files never leave your device. All processing uses WebAssembly locally.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <h4>Instant Results</h4>
          <p>Unlock PDFs in seconds with no waiting, no queues, no server delays.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💸</div>
          <h4>Free Forever</h4>
          <p>No sign up, no subscription, no payment. Always free.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🌍</div>
          <h4>Works Everywhere</h4>
          <p>Any modern browser on any device — desktop, tablet, or mobile.</p>
        </div>
      </div>

      <h2>Our Mission</h2>
      <p>Most online PDF unlockers require you to upload your files to their servers — a serious privacy risk for sensitive documents. UnlockMyDoc was built to fix that. Your PDF is processed entirely in your browser using pdf-lib and WebAssembly.</p>

      <h2>Tech Stack</h2>
      <p>Built with Vite, vanilla JavaScript, pdf-lib, and Express. Deployed on Railway. Fast, lightweight, and private by design.</p>

      <div class="divider"></div>
      <p>Questions? Email us at <a href="mailto:hello@unlockmydoc.in">hello@unlockmydoc.in</a></p>
    </div>
  </div>
  ${footerHTML()}`;
}

// ─── Privacy Page ─────────────────────────────────────────
function privacyPage() {
  return `
  ${navHTML('/privacy')}
  <div class="page active">
    <div class="content-page">
      <h1>Privacy Policy</h1>
      <p class="subtitle">Last updated: April 2026</p>

      <h2>1. No File Uploads</h2>
      <p>UnlockMyDoc processes all PDF files entirely within your browser. <strong style="color:var(--text);">Your files are never uploaded to our servers.</strong> All processing happens locally on your device using WebAssembly. We have no access to your files, contents, or passwords.</p>

      <h2>2. Information We Collect</h2>
      <p>We do not collect personally identifiable information. We may collect anonymous usage data via Google Analytics, including pages visited, browser type, and approximate location (country/city level). This data is never sold.</p>

      <h2>3. Google Analytics</h2>
      <p>We use Google Analytics to understand how visitors use our site. It uses cookies to collect anonymous traffic data. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics Opt-out Add-on</a>.</p>

      <h2>4. Google AdSense</h2>
      <p>We display ads via Google AdSense. Google may use cookies to serve personalised ads. You can opt out at <a href="https://www.google.com/settings/ads">Google Ads Settings</a>.</p>

      <h2>5. Cookies</h2>
      <p>Cookies are used only for analytics and advertising (Google Analytics & AdSense). We do not use cookies to track personal information.</p>

      <h2>6. Data Security</h2>
      <p>Since files never leave your browser, there is no risk of document data being intercepted or stored by us.</p>

      <h2>7. Children's Privacy</h2>
      <p>Our service is not directed to children under 13. We do not knowingly collect data from children.</p>

      <h2>8. Changes</h2>
      <p>We may update this policy from time to time. Changes will be posted here with an updated date.</p>

      <h2>9. Contact</h2>
      <p>Questions? Email <a href="mailto:privacy@unlockmydoc.in">privacy@unlockmydoc.in</a></p>
    </div>
  </div>
  ${footerHTML()}`;
}

// ─── Contact Page ─────────────────────────────────────────
function contactPage() {
  return `
  ${navHTML('/contact')}
  <div class="page active">
    <div class="content-page">
      <h1>Contact Us</h1>
      <p class="subtitle">Have a question or suggestion? We'd love to hear from you.</p>

      <div class="contact-cards">
        <div class="contact-card">
          <h3>📧 General Enquiries</h3>
          <p>Questions about the tool or feedback?</p>
          <a href="mailto:hello@unlockmydoc.in">hello@unlockmydoc.in</a>
        </div>
        <div class="contact-card">
          <h3>🔒 Privacy Concerns</h3>
          <p>Questions about your data or privacy?</p>
          <a href="mailto:privacy@unlockmydoc.in">privacy@unlockmydoc.in</a>
        </div>
      </div>

      <div class="divider"></div>

      <h2>Common Questions</h2>
      <p><strong style="color:var(--text);">My PDF won't unlock?</strong><br>
      Make sure you're entering the correct password. UnlockMyDoc can only remove protection when the correct password is provided — it cannot crack unknown passwords.</p>

      <p><strong style="color:var(--text);">Is my file safe?</strong><br>
      Yes. Your file never leaves your browser. We cannot see or access your documents under any circumstances.</p>

      <p><strong style="color:var(--text);">Which PDF types are supported?</strong><br>
      Any password-protected PDF that uses standard AES or RC4 encryption. If your PDF uses DRM (like Adobe Digital Editions), it cannot be unlocked with this tool.</p>
    </div>
  </div>
  ${footerHTML()}`;
}

// ─── Start ────────────────────────────────────────────────
render(location.pathname);
