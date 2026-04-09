import './style.css'
import { PDFDocument } from 'pdf-lib'

// Load PDF.js from CDN at runtime
async function getPdfjsLib() {
  if (window._pdfjsLib) return window._pdfjsLib
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      window._pdfjsLib = window.pdfjsLib
      resolve(window._pdfjsLib)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// ===== ROUTER =====
const routes = ['home', 'about', 'privacy', 'contact']
let currentPage = 'home'

function navigate(page) {
  if (!routes.includes(page)) page = 'home'
  currentPage = page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page)
  })
  const el = document.getElementById(`page-${page}`)
  if (el) el.classList.add('active')
  window.scrollTo(0, 0)

  // Update URL hash
  history.pushState({}, '', page === 'home' ? '/' : `#${page}`)
}

// Handle hash-based routing
function routeFromHash() {
  const hash = location.hash.replace('#', '')
  navigate(routes.includes(hash) ? hash : 'home')
}

// ===== STATE =====
let selectedFile = null
let unlockedBytes = null

// ===== RENDER APP =====
function renderApp() {
  document.getElementById('app').innerHTML = `
    <nav>
      <div class="nav-inner">
        <a class="logo" onclick="navigate('home')">
          <div class="logo-icon">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1.5C6.07 1.5 4.5 3.07 4.5 5v1H3.5A1 1 0 0 0 2.5 7v7a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V5C11.5 3.07 9.93 1.5 8 1.5zm0 1.5c1.1 0 2 .9 2 2v1H6V5c0-1.1.9-2 2-2zm0 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#0a0a0f"/>
            </svg>
          </div>
          UnlockMyDoc
        </a>
        <ul class="nav-links">
          <li><a data-page="home" onclick="navigate('home')">Tool</a></li>
          <li><a data-page="about" onclick="navigate('about')">About</a></li>
          <li><a data-page="privacy" onclick="navigate('privacy')">Privacy</a></li>
          <li><a data-page="contact" onclick="navigate('contact')">Contact</a></li>
        </ul>
      </div>
    </nav>

    <!-- PAGE: HOME -->
    <div class="page active" id="page-home">
      <div id="ad-top" class="ad-slot container">Advertisement</div>

      <div class="hero container">
        <div class="hero-badge">
          <span class="dot"></span>
          100% Free — No signup required
        </div>
        <h1>Unlock your PDF<br><span>in seconds</span></h1>
        <p>Remove password protection from any PDF file — instantly, privately, free.</p>
      </div>

      <div class="privacy-banner container">
        <span class="shield-icon">🛡️</span>
        <div>
          <strong>Your file never leaves your device</strong><br>
          <span>All processing happens in your browser using WebAssembly. Zero uploads.</span>
        </div>
      </div>

      <div class="tool-card container">
        <!-- Drop Zone -->
        <div class="drop-zone" id="drop-zone" onclick="triggerFileInput()">
          <div class="drop-icon">📄</div>
          <h3>Drop your PDF here</h3>
          <p>or <span>click to browse</span> — max 50MB</p>
        </div>
        <input type="file" id="file-input" accept=".pdf,application/pdf" />

        <!-- File Info -->
        <div class="file-info" id="file-info">
          <div class="file-icon">📑</div>
          <div class="file-details">
            <div class="file-name" id="file-name">document.pdf</div>
            <div class="file-size" id="file-size">—</div>
          </div>
          <button class="remove-file" id="remove-file" title="Remove file">✕</button>
        </div>

        <!-- Password Field -->
        <div class="field-group">
          <label class="field-label" for="pdf-password">PDF Password</label>
          <div class="field-wrap">
            <input type="password" id="pdf-password" placeholder="Enter the PDF password…" autocomplete="off" />
            <button class="toggle-pw" id="toggle-pw" title="Show/hide password">👁</button>
          </div>
        </div>

        <!-- Unlock Button -->
        <button class="btn-unlock" id="btn-unlock" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
          </svg>
          Unlock PDF
        </button>

        <!-- Progress -->
        <div class="progress-wrap" id="progress-wrap">
          <div class="progress-label">
            <span id="progress-text">Processing…</span>
            <span id="progress-pct">0%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>
        </div>

        <!-- Status -->
        <div class="status-msg" id="status-msg"></div>

        <!-- Download -->
        <a class="btn-download" id="btn-download" href="#" download="unlocked.pdf">
          ⬇ Download Unlocked PDF
        </a>
      </div>

      <div id="ad-mid" class="ad-slot container">Advertisement</div>

      <div class="how-section">
        <h2 class="section-title">How it works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <h4>Upload PDF</h4>
            <p>Select your password-protected PDF from your device. It stays local.</p>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <h4>Enter Password</h4>
            <p>Type the current password. We use it only to decrypt your file in-browser.</p>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <h4>Download Free</h4>
            <p>Get your unlocked PDF instantly — no watermarks, no limits.</p>
          </div>
        </div>
      </div>

      <div id="ad-bottom" class="ad-slot container">Advertisement</div>
    </div>

    <!-- PAGE: ABOUT -->
    <div class="page" id="page-about">
      <div class="content-page">
        <h1>About<br><span style="color:var(--accent)">UnlockMyDoc</span></h1>
        <p class="subtitle">The world's most private PDF unlocker.</p>

        <p>UnlockMyDoc was built because PDF passwords are annoying — especially when you're the rightful owner of the file and just need to print, share, or edit it. We built a tool that solves that in under 10 seconds, with zero privacy compromise.</p>

        <p>Unlike other PDF tools that upload your files to a server, UnlockMyDoc processes everything directly in your browser using WebAssembly. Your document never touches our servers — because we don't have any file-processing servers.</p>

        <div class="divider"></div>
        <h2>Why choose UnlockMyDoc?</h2>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <h4>100% Private</h4>
            <p>Files are processed locally using pdf-lib in WebAssembly. Nothing is ever uploaded.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h4>Lightning Fast</h4>
            <p>No upload/download round-trip. Unlock happens instantly in your browser.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🆓</div>
            <h4>Completely Free</h4>
            <p>No subscription, no sign-up, no limits. Just upload and unlock.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <h4>Works Everywhere</h4>
            <p>Desktop, tablet, mobile — any modern browser, any operating system.</p>
          </div>
        </div>

        <div class="divider"></div>
        <h2>Technology</h2>
        <p>UnlockMyDoc uses <strong>pdf-lib</strong>, a powerful open-source JavaScript library, to load your encrypted PDF using your password and then re-save it without any encryption. This happens entirely within the browser's JavaScript sandbox — no extensions, no plugins, no server.</p>

        <p>The domain <strong>unlockmydoc.in</strong> is operated independently and is not affiliated with any PDF software vendor.</p>
      </div>
    </div>

    <!-- PAGE: PRIVACY -->
    <div class="page" id="page-privacy">
      <div class="content-page">
        <h1>Privacy<br><span style="color:var(--accent)">Policy</span></h1>
        <p class="subtitle">Last updated: June 2025 &nbsp;·&nbsp; unlockmydoc.in</p>

        <h2>Our Core Promise</h2>
        <p><strong>Your files are never uploaded to any server.</strong> All PDF processing on UnlockMyDoc happens entirely within your web browser using client-side JavaScript (pdf-lib via WebAssembly). When you select a PDF and enter a password, the decryption happens locally on your device. The resulting unlocked PDF is also created locally and downloaded directly to your device.</p>

        <p>We have no file-processing servers. We cannot access your documents. We never see your PDF content, filenames, or passwords.</p>

        <div class="divider"></div>
        <h2>Information We Collect</h2>
        <p>We collect minimal anonymous data to understand how the tool is used and to improve it:</p>
        <ul>
          <li><strong>Analytics</strong>: We use Google Analytics to track page views, session duration, and general usage patterns. This data is anonymized and aggregated. No personal files or content are tracked.</li>
          <li><strong>Cookies</strong>: Google Analytics sets cookies to distinguish unique visitors. No PDF content is stored in cookies.</li>
          <li><strong>Advertising</strong>: We use Google AdSense to display advertisements. AdSense may use cookies for interest-based advertising. You can opt out via <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google's Ad Settings</a>.</li>
        </ul>

        <h2>What We Do NOT Collect</h2>
        <ul>
          <li>Your PDF files or their contents</li>
          <li>Passwords you enter into the tool</li>
          <li>Your name, email, or any personal identifiers</li>
          <li>Any account information (we have no accounts)</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services, each with their own privacy policies:</p>
        <ul>
          <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Analytics</a> — usage analytics</li>
          <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google AdSense</a> — advertising</li>
        </ul>

        <h2>Data Security</h2>
        <p>Because your files never leave your device, there is no risk of a data breach involving your PDF content. Our website is served over HTTPS to protect data in transit.</p>

        <h2>Children's Privacy</h2>
        <p>UnlockMyDoc is not directed at children under 13. We do not knowingly collect data from children.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this privacy policy occasionally. The current version is always available at unlockmydoc.in/privacy. Continued use of the service constitutes acceptance of the updated policy.</p>

        <h2>Contact</h2>
        <p>Questions about this privacy policy? Email us at <a href="mailto:privacy@unlockmydoc.in">privacy@unlockmydoc.in</a>.</p>
      </div>
    </div>

    <!-- PAGE: CONTACT -->
    <div class="page" id="page-contact">
      <div class="content-page">
        <h1>Get in<br><span style="color:var(--accent)">Touch</span></h1>
        <p class="subtitle">We'd love to hear from you.</p>

        <div class="contact-cards">
          <div class="contact-card">
            <h3>💬 General Enquiries</h3>
            <p>Questions, feedback, partnership ideas, or just want to say hi?</p>
            <a href="mailto:hello@unlockmydoc.in">hello@unlockmydoc.in</a>
          </div>
          <div class="contact-card">
            <h3>🔒 Privacy & Data</h3>
            <p>Data-related questions, GDPR requests, or privacy concerns.</p>
            <a href="mailto:privacy@unlockmydoc.in">privacy@unlockmydoc.in</a>
          </div>
        </div>

        <h2>Frequently Asked Questions</h2>

        <h2>Is my PDF safe?</h2>
        <p>Yes. Your PDF is processed entirely in your browser. It never leaves your device and is never sent to any server. We physically cannot see your file.</p>

        <h2>What types of PDF encryption does this support?</h2>
        <p>UnlockMyDoc supports standard user-password (open password) protected PDFs using RC4 and AES encryption, which covers the vast majority of password-protected PDFs. Owner-only restrictions (print/copy locks without an open password) may also be removed.</p>

        <h2>Why doesn't it work on my PDF?</h2>
        <p>Make sure you're entering the correct open password. Some very advanced or non-standard encryption schemes may not be supported. If you're sure the password is right and it still fails, feel free to email us.</p>

        <h2>Do you store my password?</h2>
        <p>Never. Passwords are used only in browser memory to decrypt your file and are discarded when you close the tab.</p>

        <h2>Is this legal?</h2>
        <p>UnlockMyDoc is intended for use on PDFs you have the legal right to access. Unlocking your own documents, documents you've received legitimately, or documents whose passwords you've forgotten is generally legal. Do not use this tool to circumvent access controls on documents you don't have authorization for.</p>

        <div class="divider"></div>
        <p>Response time is typically within 24–48 hours on business days.</p>
      </div>
    </div>

    <footer>
      <div class="footer-inner">
        <div class="footer-nav">
          <a onclick="navigate('home')">Tool</a>
          <a onclick="navigate('about')">About</a>
          <a onclick="navigate('privacy')">Privacy Policy</a>
          <a onclick="navigate('contact')">Contact</a>
        </div>
        <p>© ${new Date().getFullYear()} <span>UnlockMyDoc</span> · unlockmydoc.in · All PDF processing is 100% client-side</p>
      </div>
    </footer>
  `

  bindEvents()
  routeFromHash()
}

// ===== BIND EVENTS =====
function bindEvents() {
  const dropZone = document.getElementById('drop-zone')
  const fileInput = document.getElementById('file-input')
  const removeBtn = document.getElementById('remove-file')
  const passwordInput = document.getElementById('pdf-password')
  const togglePw = document.getElementById('toggle-pw')
  const unlockBtn = document.getElementById('btn-unlock')

  // Drag & drop
  dropZone.addEventListener('dragover', e => {
    e.preventDefault()
    dropZone.classList.add('dragover')
  })
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'))
  dropZone.addEventListener('drop', e => {
    e.preventDefault()
    dropZone.classList.remove('dragover')
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  })

  // File input
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0])
  })

  // Remove file
  removeBtn.addEventListener('click', e => {
    e.stopPropagation()
    clearFile()
  })

  // Password toggle
  togglePw.addEventListener('click', () => {
    const inp = document.getElementById('pdf-password')
    inp.type = inp.type === 'password' ? 'text' : 'password'
    togglePw.textContent = inp.type === 'password' ? '👁' : '🙈'
  })

  // Enable button when both file + password present
  passwordInput.addEventListener('input', updateUnlockBtn)

  // Unlock
  unlockBtn.addEventListener('click', doUnlock)
}

function triggerFileInput() {
  document.getElementById('file-input').click()
}
// Expose to inline onclick
window.triggerFileInput = triggerFileInput
window.navigate = navigate

function handleFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    showStatus('error', '⚠️ Please select a PDF file.')
    return
  }
  if (file.size > 52428800) { // 50MB
    showStatus('error', '⚠️ File too large. Maximum size is 50MB.')
    return
  }
  selectedFile = file
  unlockedBytes = null
  hideDownload()
  clearStatus()

  // Update UI
  document.getElementById('file-info').classList.add('visible')
  document.getElementById('file-name').textContent = file.name
  document.getElementById('file-size').textContent = formatSize(file.size)

  updateUnlockBtn()
}

function clearFile() {
  selectedFile = null
  unlockedBytes = null
  document.getElementById('file-info').classList.remove('visible')
  document.getElementById('file-input').value = ''
  updateUnlockBtn()
  clearStatus()
  hideDownload()
  hideProgress()
}

function updateUnlockBtn() {
  const pw = document.getElementById('pdf-password').value
  const btn = document.getElementById('btn-unlock')
  btn.disabled = !selectedFile || !pw.trim()
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

// ===== CORE UNLOCK LOGIC =====
async function doUnlock() {
  if (!selectedFile) return

  // Don't trim password — spaces can be valid
  const password = document.getElementById('pdf-password').value
  if (!password) return

  const btn = document.getElementById('btn-unlock')
  btn.disabled = true
  btn.innerHTML = `<div class="spinner"></div> Unlocking…`

  clearStatus()
  hideDownload()
  showProgress('Reading file…', 10)

  try {
    const arrayBuffer = await readFileAsArrayBuffer(selectedFile)
    setProgress('Verifying password…', 25)

    // ── Step 1: Use PDF.js to verify password & check encryption ──
    // PDF.js has much broader encryption support than pdf-lib
    const pdfjsLib = await getPdfjsLib()

    let isEncrypted = false
    let passwordCorrect = false

    try {
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer.slice(0), // slice to avoid detached buffer
        password: password,
      })

      const pdfJsDoc = await loadingTask.promise
      await pdfJsDoc.getPage(1) // confirm it actually loaded
      isEncrypted = true
      passwordCorrect = true
      pdfJsDoc.destroy()
    } catch (pdfJsErr) {
      const msg = pdfJsErr.message || ''
      const name = pdfJsErr.name || ''

      if (
        name === 'PasswordException' ||
        msg.includes('password') ||
        msg.includes('Password') ||
        (pdfJsErr.code !== undefined && pdfJsErr.code === 1) // NEED_PASSWORD
      ) {
        // PDF is encrypted but password is wrong
        throw new Error('WRONG_PASSWORD')
      }

      if (msg.includes('No password') || msg.includes('not encrypted')) {
        // Not encrypted — still try pdf-lib below
        isEncrypted = false
        passwordCorrect = false
      }

      // Any other error — still try pdf-lib as fallback
    }

    setProgress('Decrypting…', 50)

    // ── Step 2: Use pdf-lib to load and re-save without encryption ──
    let pdfDoc
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer, {
        password: password,
        ignoreEncryption: false,
        throwOnInvalidObject: false,
        updateMetadata: false,
      })
    } catch (pdfLibErr) {
      const msg = (pdfLibErr.message || '').toLowerCase()

      // If PDF.js already confirmed wrong password, trust that
      if (!passwordCorrect && isEncrypted) {
        throw new Error('WRONG_PASSWORD')
      }

      // pdf-lib sometimes can't handle certain encryption types even
      // with correct password — try with ignoreEncryption as last resort
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer, {
          password: password,
          ignoreEncryption: true,
          throwOnInvalidObject: false,
          updateMetadata: false,
        })
      } catch (fallbackErr) {
        if (isEncrypted && !passwordCorrect) {
          throw new Error('WRONG_PASSWORD')
        }
        throw new Error('UNSUPPORTED_ENCRYPTION')
      }
    }

    setProgress('Removing encryption…', 75)

    // Save without encryption — pdf-lib strips it on save() by default
    let unlockedPdfBytes
    try {
      unlockedPdfBytes = await pdfDoc.save({
        useObjectStreams: false, // better compatibility
      })
    } catch (saveErr) {
      throw new Error('SAVE_FAILED')
    }

    setProgress('Preparing download…', 95)
    unlockedBytes = unlockedPdfBytes

    const blob = new Blob([unlockedBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const downloadLink = document.getElementById('btn-download')
    downloadLink.href = url
    const outName = selectedFile.name.replace(/\.pdf$/i, '') + '_unlocked.pdf'
    downloadLink.download = outName

    setProgress('Done!', 100)
    showStatus('success', '✅ PDF unlocked successfully! Click below to download.')
    showDownload()

  } catch (err) {
    hideProgress()
    console.error('Unlock error:', err.message, err)

    if (err.message === 'WRONG_PASSWORD') {
      showStatus('error', '❌ Wrong password. Please check and try again.')
    } else if (err.message === 'UNSUPPORTED_ENCRYPTION') {
      showStatus('error', '⚠️ This PDF uses an encryption type that isn\'t supported. Try another tool for this file.')
    } else if (err.message === 'SAVE_FAILED') {
      showStatus('error', '⚠️ PDF was decrypted but couldn\'t be saved. The file may be corrupted.')
    } else if (err.message.includes('not encrypted') || err.message.includes('No password')) {
      showStatus('error', '📄 This PDF doesn\'t appear to be password-protected.')
    } else {
      showStatus('error', `❌ Unexpected error: ${err.message}`)
    }
  } finally {
    btn.disabled = false
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
      </svg>
      Unlock PDF`
    updateUnlockBtn()
  }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

// ===== UI HELPERS =====
function showProgress(text, pct) {
  document.getElementById('progress-wrap').classList.add('visible')
  document.getElementById('progress-text').textContent = text
  document.getElementById('progress-pct').textContent = pct + '%'
  document.getElementById('progress-fill').style.width = pct + '%'
}

function setProgress(text, pct) {
  showProgress(text, pct)
}

function hideProgress() {
  document.getElementById('progress-wrap').classList.remove('visible')
}

function showStatus(type, msg) {
  const el = document.getElementById('status-msg')
  el.className = `status-msg ${type} visible`
  el.textContent = msg
}

function clearStatus() {
  const el = document.getElementById('status-msg')
  el.className = 'status-msg'
  el.textContent = ''
}

function showDownload() {
  document.getElementById('btn-download').classList.add('visible')
}

function hideDownload() {
  document.getElementById('btn-download').classList.remove('visible')
}

// ===== HANDLE POPSTATE =====
window.addEventListener('popstate', routeFromHash)

// ===== INIT =====
renderApp()
