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
    case '/about':      app.innerHTML = aboutPage();   break;
    case '/privacy':    app.innerHTML = privacyPage(); break;
    case '/contact':    app.innerHTML = contactPage(); break;
    default:            app.innerHTML = homePage();    attachHomeListeners(); break;
  }
  // attach nav links on every render
  document.querySelectorAll('[data-link]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.getAttribute('href'));
    });
  });
  window.scrollTo(0, 0);
}

// ─── Nav (shared) ─────────────────────────────────────────
function nav() {
  return `
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,0.08);position:sticky;top:0;z-index:100;">
    <a href="/" data-link style="font-family:Syne,sans-serif;font-weight:800;font-size:1.3rem;color:#2563eb;text-decoration:none;">🔓 UnlockMyDoc</a>
    <div style="display:flex;gap:1.5rem;">
      <a href="/" data-link style="color:#374151;text-decoration:none;font-family:DM Sans,sans-serif;">Home</a>
      <a href="/about" data-link style="color:#374151;text-decoration:none;font-family:DM Sans,sans-serif;">About</a>
      <a href="/privacy" data-link style="color:#374151;text-decoration:none;font-family:DM Sans,sans-serif;">Privacy</a>
      <a href="/contact" data-link style="color:#374151;text-decoration:none;font-family:DM Sans,sans-serif;">Contact</a>
    </div>
  </nav>`;
}

function footer() {
  return `
  <footer style="text-align:center;padding:2rem;background:#f9fafb;color:#6b7280;font-family:DM Sans,sans-serif;margin-top:3rem;font-size:0.9rem;">
    <p>© ${new Date().getFullYear()} UnlockMyDoc. All rights reserved.</p>
    <p style="margin-top:0.5rem;">
      <a href="/privacy" data-link style="color:#2563eb;text-decoration:none;margin:0 0.5rem;">Privacy Policy</a> |
      <a href="/about" data-link style="color:#2563eb;text-decoration:none;margin:0 0.5rem;">About</a> |
      <a href="/contact" data-link style="color:#2563eb;text-decoration:none;margin:0 0.5rem;">Contact</a>
    </p>
  </footer>`;
}

// ─── Home Page ────────────────────────────────────────────
function homePage() {
  return `
  ${nav()}
  <main style="max-width:680px;margin:3rem auto;padding:0 1rem;font-family:DM Sans,sans-serif;">
    <div style="text-align:center;margin-bottom:2.5rem;">
      <h1 style="font-family:Syne,sans-serif;font-size:2.5rem;font-weight:800;color:#1e293b;margin-bottom:1rem;">
        Remove PDF Password Instantly
      </h1>
      <p style="font-size:1.1rem;color:#64748b;">100% free, works in your browser. Your file never leaves your device.</p>
    </div>

    <!-- Ad slot top -->
    <div style="margin-bottom:1.5rem;text-align:center;">
      <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5777531999104264" data-ad-format="auto" data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <div id="drop-zone" style="border:2px dashed #93c5fd;border-radius:16px;padding:3rem 2rem;text-align:center;cursor:pointer;background:#eff6ff;transition:background 0.2s;">
      <div style="font-size:3rem;margin-bottom:1rem;">📄</div>
      <p style="font-size:1.1rem;color:#2563eb;font-weight:600;">Drag & drop your PDF here</p>
      <p style="color:#64748b;margin:0.5rem 0;">or</p>
      <label style="display:inline-block;background:#2563eb;color:#fff;padding:0.6rem 1.5rem;border-radius:8px;cursor:pointer;font-weight:600;">
        Browse File
        <input type="file" id="file-input" accept=".pdf" style="display:none;" />
      </label>
      <p id="file-name" style="margin-top:1rem;color:#374151;font-size:0.95rem;"></p>
    </div>

    <div id="password-section" style="display:none;margin-top:1.5rem;">
      <label style="display:block;margin-bottom:0.5rem;font-weight:600;color:#374151;">PDF Password</label>
      <div style="display:flex;gap:0.75rem;">
        <input type="password" id="password-input" placeholder="Enter PDF password"
          style="flex:1;padding:0.75rem 1rem;border:1.5px solid #cbd5e1;border-radius:8px;font-size:1rem;outline:none;" />
        <button id="toggle-pw" style="padding:0.75rem 1rem;background:#f1f5f9;border:1.5px solid #cbd5e1;border-radius:8px;cursor:pointer;">👁</button>
      </div>
      <button id="unlock-btn" style="margin-top:1rem;width:100%;padding:0.85rem;background:#2563eb;color:#fff;border:none;border-radius:10px;font-size:1.1rem;font-weight:700;cursor:pointer;font-family:Syne,sans-serif;">
        🔓 Unlock PDF
      </button>
    </div>

    <div id="status-msg" style="margin-top:1rem;text-align:center;font-weight:600;font-size:1rem;"></div>

    <!-- Ad slot bottom -->
    <div style="margin-top:2rem;text-align:center;">
      <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5777531999104264" data-ad-format="auto" data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <div style="margin-top:3rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;text-align:center;">
      <div style="background:#f0fdf4;padding:1.5rem;border-radius:12px;">
        <div style="font-size:2rem;">🔒</div>
        <h3 style="font-family:Syne,sans-serif;margin:0.5rem 0;color:#166534;">100% Private</h3>
        <p style="color:#4b5563;font-size:0.9rem;">Files never leave your device</p>
      </div>
      <div style="background:#eff6ff;padding:1.5rem;border-radius:12px;">
        <div style="font-size:2rem;">⚡</div>
        <h3 style="font-family:Syne,sans-serif;margin:0.5rem 0;color:#1e40af;">Instant</h3>
        <p style="color:#4b5563;font-size:0.9rem;">Unlock in seconds, no waiting</p>
      </div>
      <div style="background:#fdf4ff;padding:1.5rem;border-radius:12px;">
        <div style="font-size:2rem;">💸</div>
        <h3 style="font-family:Syne,sans-serif;margin:0.5rem 0;color:#6b21a8;">Free Forever</h3>
        <p style="color:#4b5563;font-size:0.9rem;">No sign up, no payment</p>
      </div>
    </div>

    <div style="margin-top:3rem;background:#f8fafc;border-radius:16px;padding:2rem;">
      <h2 style="font-family:Syne,sans-serif;color:#1e293b;margin-top:0;">How It Works</h2>
      <ol style="color:#475569;line-height:2;">
        <li>Upload your password-protected PDF</li>
        <li>Enter the PDF password</li>
        <li>Click Unlock — your browser removes the protection</li>
        <li>Download your unlocked PDF instantly</li>
      </ol>
      <p style="color:#64748b;font-size:0.9rem;">All processing happens locally in your browser using WebAssembly. Nothing is uploaded to any server.</p>
    </div>
  </main>
  ${footer()}`;
}

function attachHomeListeners() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const passwordSection = document.getElementById('password-section');
  const passwordInput = document.getElementById('password-input');
  const togglePw = document.getElementById('toggle-pw');
  const unlockBtn = document.getElementById('unlock-btn');
  const statusMsg = document.getElementById('status-msg');
  const fileNameEl = document.getElementById('file-name');
  let pdfFile = null;

  function handleFile(file) {
    if (!file || file.type !== 'application/pdf') {
      statusMsg.textContent = '❌ Please select a valid PDF file.';
      statusMsg.style.color = '#dc2626';
      return;
    }
    pdfFile = file;
    fileNameEl.textContent = `Selected: ${file.name}`;
    passwordSection.style.display = 'block';
    statusMsg.textContent = '';
  }

  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.style.background = '#dbeafe';
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.background = '#eff6ff';
  });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.style.background = '#eff6ff';
    handleFile(e.dataTransfer.files[0]);
  });

  togglePw.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  });

  unlockBtn.addEventListener('click', async () => {
    if (!pdfFile) {
      statusMsg.textContent = '❌ Please select a PDF file first.';
      statusMsg.style.color = '#dc2626';
      return;
    }
    const password = passwordInput.value;
    if (!password) {
      statusMsg.textContent = '❌ Please enter the PDF password.';
      statusMsg.style.color = '#dc2626';
      return;
    }

    unlockBtn.textContent = '⏳ Unlocking...';
    unlockBtn.disabled = true;
    statusMsg.textContent = '';

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { password });
      const unlockedBytes = await pdfDoc.save();
      const blob = new Blob([unlockedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name.replace('.pdf', '_unlocked.pdf');
      a.click();
      URL.revokeObjectURL(url);
      statusMsg.textContent = '✅ PDF unlocked and downloaded!';
      statusMsg.style.color = '#16a34a';
    } catch (err) {
      statusMsg.textContent = '❌ Wrong password or PDF is not password-protected.';
      statusMsg.style.color = '#dc2626';
    }

    unlockBtn.textContent = '🔓 Unlock PDF';
    unlockBtn.disabled = false;
  });
}

// ─── About Page ───────────────────────────────────────────
function aboutPage() {
  return `
  ${nav()}
  <main style="max-width:760px;margin:3rem auto;padding:0 1.5rem;font-family:DM Sans,sans-serif;color:#374151;line-height:1.8;">
    <h1 style="font-family:Syne,sans-serif;font-size:2.2rem;color:#1e293b;">About UnlockMyDoc</h1>
    <p>UnlockMyDoc is a free, browser-based tool that lets you remove password protection from PDF files instantly — without uploading your file to any server.</p>
    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">Our Mission</h2>
    <p>We believe your documents are private. Most online PDF unlockers require you to upload your files to their servers, which poses a serious privacy risk. UnlockMyDoc works entirely in your browser using WebAssembly — your PDF never leaves your device.</p>
    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">How It Works</h2>
    <p>UnlockMyDoc uses <strong>pdf-lib</strong>, a powerful open-source JavaScript library, to process your PDF entirely within your browser. When you provide the correct password, the tool removes the encryption and lets you download the unlocked version.</p>
    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">Who Is This For?</h2>
    <ul>
      <li>People who forgot the password to their own PDF</li>
      <li>Professionals working with password-protected documents they own</li>
      <li>Anyone who values privacy and doesn't want to upload sensitive files online</li>
    </ul>
    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">Technology</h2>
    <p>Built with Vite, vanilla JavaScript, and pdf-lib. Deployed on Railway. Fast, lightweight, and private by design.</p>
    <div style="margin-top:2rem;padding:1.5rem;background:#eff6ff;border-radius:12px;">
      <p style="margin:0;color:#1e40af;font-weight:600;">📧 Questions? Reach us at <a href="mailto:hello@unlockmydoc.in" style="color:#2563eb;">hello@unlockmydoc.in</a></p>
    </div>
  </main>
  ${footer()}`;
}

// ─── Privacy Page ─────────────────────────────────────────
function privacyPage() {
  return `
  ${nav()}
  <main style="max-width:760px;margin:3rem auto;padding:0 1.5rem;font-family:DM Sans,sans-serif;color:#374151;line-height:1.8;">
    <h1 style="font-family:Syne,sans-serif;font-size:2.2rem;color:#1e293b;">Privacy Policy</h1>
    <p style="color:#6b7280;font-size:0.9rem;">Last updated: April 2026</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">1. No File Uploads</h2>
    <p>UnlockMyDoc processes all PDF files entirely within your browser. <strong>Your files are never uploaded to our servers.</strong> All processing happens locally on your device using WebAssembly technology. We have no access to your files, their contents, or your passwords.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">2. Information We Collect</h2>
    <p>We do not collect any personally identifiable information. We may collect anonymous usage data such as:</p>
    <ul>
      <li>Pages visited on our website</li>
      <li>Browser type and device type (via Google Analytics)</li>
      <li>Approximate geographic location (country/city level)</li>
    </ul>
    <p>This data is used solely to improve our service and is never sold to third parties.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">3. Google Analytics</h2>
    <p>We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies to collect anonymous traffic data. You can opt out by installing the <a href="https://tools.google.com/dlpage/gaoptout" style="color:#2563eb;">Google Analytics Opt-out Browser Add-on</a>.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">4. Google AdSense</h2>
    <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" style="color:#2563eb;">Google Ads Settings</a>.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">5. Cookies</h2>
    <p>Our website uses cookies only for analytics and advertising purposes (Google Analytics and Google AdSense). We do not use cookies to track personal information.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">6. Data Security</h2>
    <p>Since your files never leave your browser, there is no risk of your document data being intercepted or stored by us. We take reasonable precautions to protect any non-file data we handle.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">7. Children's Privacy</h2>
    <p>Our service is not directed to children under 13. We do not knowingly collect information from children.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">8. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>

    <h2 style="font-family:Syne,sans-serif;color:#1e293b;">9. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, contact us at: <a href="mailto:privacy@unlockmydoc.in" style="color:#2563eb;">privacy@unlockmydoc.in</a></p>
  </main>
  ${footer()}`;
}

// ─── Contact Page ─────────────────────────────────────────
function contactPage() {
  return `
  ${nav()}
  <main style="max-width:600px;margin:3rem auto;padding:0 1.5rem;font-family:DM Sans,sans-serif;color:#374151;line-height:1.8;">
    <h1 style="font-family:Syne,sans-serif;font-size:2.2rem;color:#1e293b;">Contact Us</h1>
    <p>Have a question, suggestion, or issue? We'd love to hear from you.</p>

    <div style="background:#f8fafc;border-radius:16px;padding:2rem;margin-top:1.5rem;">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
        <span style="font-size:1.5rem;">📧</span>
        <div>
          <p style="margin:0;font-weight:600;color:#1e293b;">General Enquiries</p>
          <a href="mailto:hello@unlockmydoc.in" style="color:#2563eb;text-decoration:none;">hello@unlockmydoc.in</a>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:1rem;">
        <span style="font-size:1.5rem;">🔒</span>
        <div>
          <p style="margin:0;font-weight:600;color:#1e293b;">Privacy Concerns</p>
          <a href="mailto:privacy@unlockmydoc.in" style="color:#2563eb;text-decoration:none;">privacy@unlockmydoc.in</a>
        </div>
      </div>
    </div>

    <div style="margin-top:2rem;background:#eff6ff;border-radius:12px;padding:1.5rem;">
      <h3 style="font-family:Syne,sans-serif;color:#1e40af;margin-top:0;">Common Questions</h3>
      <p><strong>My PDF won't unlock?</strong><br>Make sure you're entering the correct password. UnlockMyDoc can only remove password protection when you know the password — it cannot crack unknown passwords.</p>
      <p style="margin-bottom:0;"><strong>Is my file safe?</strong><br>Yes. Your file never leaves your browser. We cannot see or access your documents.</p>
    </div>
  </main>
  ${footer()}`;
}

// ─── Start ────────────────────────────────────────────────
render(location.pathname);
