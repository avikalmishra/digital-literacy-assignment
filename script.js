/**
 * AVIKAL MISHRA - 1ST YEAR B.TECH CSE PORTFOLIO
 * Interactive 3D Motion Graphics, WebGL Canvas, Terminal CLI & Scroll Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJsBackground();
  initCustomCursor();
  initTypewriter();
  initNavbarScrollSpy();
  initTiltCards();
  initMetricsCounter();
  initScrollReveal();
  initTerminalEmulator();
  initProjectFilters();
  initContactForm();
  initResumeModal();
  initBackToTop();
  updateCurrentYear();
});

/* ===================================================================
   1. THREE.JS 3D WEBGL MOTION GRAPHICS & SCROLL INTERACTION
   =================================================================== */
function initThreeJsBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Group for all rotating 3D elements
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Central 3D Geometry: Futuristic Wireframe Icosahedron
  const geometryIcosa = new THREE.IcosahedronGeometry(7, 2);
  const materialIcosa = new THREE.MeshStandardMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
    roughness: 0.2,
    metalness: 0.8
  });
  const icosaMesh = new THREE.Mesh(geometryIcosa, materialIcosa);
  mainGroup.add(icosaMesh);

  // 2. Inner Torus Knot Geometry for sci-fi computational aesthetic
  const knotGeometry = new THREE.TorusKnotGeometry(4.5, 1.2, 100, 16);
  const knotMaterial = new THREE.MeshBasicMaterial({
    color: 0x7928ca,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
  mainGroup.add(torusKnot);

  // 3. 3D Particle Cloud (Starfield / Data Nodes)
  const particleCount = 1400;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x00f2fe); // Cyan
  const color2 = new THREE.Color(0x7928ca); // Purple
  const color3 = new THREE.Color(0x38bdf8); // Sky blue

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;

    const mixedColor = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Ambient & Point Lighting in 3D Space
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f2fe, 2, 60);
  pointLight1.position.set(15, 15, 15);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff0080, 2, 60);
  pointLight2.position.set(-15, -15, 10);
  scene.add(pointLight2);

  // Mouse & Scroll Parallax State
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Responsive Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop with Smooth Physics (Lerping)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant subtle ambient spin
    icosaMesh.rotation.y = elapsedTime * 0.12;
    icosaMesh.rotation.x = elapsedTime * 0.08;
    torusKnot.rotation.y = -elapsedTime * 0.15;
    torusKnot.rotation.z = elapsedTime * 0.07;
    particleSystem.rotation.y = elapsedTime * 0.02;

    // Mouse Parallax Lerping
    targetRotationY = mouseX * 0.6;
    targetRotationX = mouseY * 0.6;
    mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
    mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

    // Scroll-based 3D Camera & Geometry Displacement
    const scrollFactor = scrollY * 0.002;
    camera.position.y = -scrollFactor * 3.5;
    camera.position.x = Math.sin(scrollFactor) * 2;
    mainGroup.position.z = Math.sin(scrollFactor * 0.8) * 3;

    renderer.render(scene, camera);
  }

  animate();
}

/* ===================================================================
   2. CUSTOM GLOWING TRAILING CURSOR
   =================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorDot || !cursorGlow) return;

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let glowX = -100, glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    // Lerp dot (very fast)
    dotX += (mouseX - dotX) * 0.6;
    dotY += (mouseY - dotY) * 0.6;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    // Lerp glow ring (smooth tail)
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover states for interactive elements
  const hoverSelectors = 'a, button, input, textarea, .tilt-card, .terminal-chip, .tech-pill';
  document.querySelectorAll(hoverSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ===================================================================
   3. TYPEWRITER EFFECT
   =================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const roles = [
    '1st Year B.Tech CSE Undergrad',
    'Data Structures & C++ Explorer',
    'Creative 3D & Web Developer',
    'Algorithmic Problem Solver',
    'Aspiring Software Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   4. NAVBAR SCROLL SPY & MOBILE TOGGLE
   =================================================================== */
function initNavbarScrollSpy() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Scroll spy & Navbar glass blur state
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. 3D TILT EFFECT FOR CARDS & AVATAR (Vanilla JS Math)
   =================================================================== */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card, #heroCard3D');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max rotation angles in degrees
      const maxRotate = 10;
      const rotateX = ((y - centerY) / centerY) * -maxRotate;
      const rotateY = ((x - centerX) / centerX) * maxRotate;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ===================================================================
   6. METRIC NUMBER ANIMATION
   =================================================================== */
function initMetricsCounter() {
  const counters = document.querySelectorAll('.metric-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          let current = 0;
          const duration = 1800; // ms
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = Math.ceil(target / totalSteps) || 1;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = current;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsStrip = document.querySelector('.metrics-strip');
  if (metricsStrip) observer.observe(metricsStrip);
}

/* ===================================================================
   7. SCROLL REVEAL ANIMATIONS
   =================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Skill progress bar trigger
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          const targetWidth = bar.style.getPropertyValue('--width') || '75%';
          bar.style.width = targetWidth;
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ===================================================================
   8. INTERACTIVE TERMINAL EMULATOR (CSE Feature)
   =================================================================== */
function initTerminalEmulator() {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  const chips = document.querySelectorAll('.terminal-chip');
  if (!input || !output) return;

  const commandDatabase = {
    help: () => `
<div class="terminal-response">
  <p><strong class="text-highlight">Available Commands:</strong></p>
  <ul style="list-style: none; padding-left: 8px;">
    <li><span class="cmd-pill">whoami</span>    - About Avikal Mishra</li>
    <li><span class="cmd-pill">skills</span>    - Technical competencies & stack</li>
    <li><span class="cmd-pill">projects</span>  - Highlights of engineering projects</li>
    <li><span class="cmd-pill">education</span> - Academic background & B.Tech info</li>
    <li><span class="cmd-pill">stats</span>     - Quick metrics & achievements</li>
    <li><span class="cmd-pill">contact</span>   - How to reach out</li>
    <li><span class="cmd-pill">matrix</span>    - Run Matrix digital rain simulation</li>
    <li><span class="cmd-pill">clear</span>     - Clear terminal buffer</li>
  </ul>
</div>`,
    whoami: () => `
<div class="terminal-response">
  <p><span class="text-highlight">Avikal Mishra</span> — 1st Year B.Tech Computer Science & Engineering Undergraduate.</p>
  <p>Passionate about low-level algorithms in C++, modern web architectures, and 3D graphics.</p>
  <p>Status: Actively learning, hacking, and seeking collaborative student projects & hackathons!</p>
</div>`,
    skills: () => `
<div class="terminal-response">
  <p><span class="text-highlight">[Languages]</span> C++, C, JavaScript (ES6+), Python, SQL</p>
  <p><span class="text-highlight">[Frontend/3D]</span> HTML5, CSS3, Three.js, Canvas API, Responsive Web</p>
  <p><span class="text-highlight">[CS Core]</span> Data Structures & Algorithms, OOPs, Basic OS & Architecture</p>
  <p><span class="text-highlight">[Tools]</span> Git, GitHub, VS Code, Linux CLI, Figma</p>
</div>`,
    projects: () => `
<div class="terminal-response">
  <p>1. <strong class="text-highlight">CosmoSphere 3D</strong> — Interactive WebGL celestial simulator with Three.js</p>
  <p>2. <strong class="text-highlight">AlgoVibe Engine</strong> — Step-by-step sorting & graph pathfinding visualizer</p>
  <p>3. <strong class="text-highlight">DevForge Hub</strong> — CSE student productivity and snippet vault</p>
  <p>4. <strong class="text-highlight">CipherCraft</strong> — Cryptographic encryption and hashing sandbox</p>
</div>`,
    education: () => `
<div class="terminal-response">
  <p><strong>B.Tech in Computer Science & Engineering</strong> (2025–2029)</p>
  <p>First Year Undergraduate | Currently mastering Data Structures in C++</p>
  <p>Class XII (Senior Secondary): PCM + Computer Science with Distinction</p>
</div>`,
    stats: () => `
<div class="terminal-response">
  <p>• <strong>1st Year</strong> B.Tech CSE Student</p>
  <p>• <strong>15+</strong> Coding Experiments & Mini-Projects</p>
  <p>• <strong>100+</strong> DSA Practice Questions Tackled</p>
  <p>• <strong>100%</strong> Passion for Code and Exploration</p>
</div>`,
    contact: () => `
<div class="terminal-response">
  <p>Email: <a href="mailto:avikalmishra@example.com" class="text-highlight">avikalmishra@example.com</a></p>
  <p>LinkedIn: <a href="https://linkedin.com" target="_blank" class="text-highlight">linkedin.com/in/avikal-mishra</a></p>
  <p>GitHub: <a href="https://github.com" target="_blank" class="text-highlight">github.com/avikalmishra</a></p>
</div>`,
    matrix: () => {
      let matrixStream = '';
      for (let i = 0; i < 4; i++) {
        matrixStream += `<p style="color: #34d399; font-family: monospace;">` +
          Array.from({ length: 42 }, () => Math.random() > 0.5 ? '1' : '0').join(' ') +
          `</p>`;
      }
      return matrixStream + `<p style="color: #38bdf8;">[Matrix Protocol initialized for Avikal Mishra]</p>`;
    },
    sudo: () => `<div class="terminal-response" style="color: #f87171;">Permission denied: Even root answers to the semester syllabus!</div>`,
    clear: () => {
      output.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo input
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line';
    echoLine.innerHTML = `<span class="terminal-prompt-user">avikal@cse</span>:<span class="terminal-prompt-path">~</span>$ <span style="color:#fff;">${escapeHtml(rawCmd)}</span>`;
    output.appendChild(echoLine);

    if (cmd === 'clear') {
      commandDatabase.clear();
      return;
    }

    const handler = commandDatabase[cmd];
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';

    if (handler) {
      responseLine.innerHTML = handler();
    } else {
      responseLine.innerHTML = `<span style="color: #f87171;">zsh: command not found: ${escapeHtml(cmd)}. Type <span class="cmd-pill">help</span> for commands.</span>`;
    }

    output.appendChild(responseLine);
    output.scrollTop = output.scrollHeight;
  }

  // Handle enter key in input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      input.value = '';
      executeCommand(cmd);
    }
  });

  // Handle quick run chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/* ===================================================================
   9. PROJECT FILTERING
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   10. CONTACT FORM VALIDATION & INTERACTIVE FEEDBACK
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('formSubmitBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.userName.value.trim();
    const email = form.userEmail.value.trim();
    const subject = form.userSubject.value.trim();
    const message = form.userMessage.value.trim();

    // Simple validation
    let hasError = false;
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('subjectError').textContent = '';
    document.getElementById('messageError').textContent = '';

    if (!name) {
      document.getElementById('nameError').textContent = 'Please provide your name.';
      hasError = true;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email address.';
      hasError = true;
    }
    if (!subject) {
      document.getElementById('subjectError').textContent = 'Please enter a subject.';
      hasError = true;
    }
    if (!message || message.length < 10) {
      document.getElementById('messageError').textContent = 'Message should be at least 10 characters long.';
      hasError = true;
    }

    if (hasError) return;

    // Simulate sending transmission
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Transmitting...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your message was transmitted successfully. Avikal will get back to you shortly!`;
        feedback.style.display = 'block';

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 6000);
      }
    }, 1200);
  });
}

/* ===================================================================
   11. CURRICULUM VITAE MODAL
   =================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  const openBtn = document.getElementById('resumeModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const closeAction = document.getElementById('closeModalAction');
  const downloadAction = document.getElementById('downloadCvAction');

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeAction) closeAction.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (downloadAction) {
    downloadAction.addEventListener('click', () => {
      const originalText = downloadAction.innerHTML;
      downloadAction.innerHTML = `<i class="fa-solid fa-check"></i> <span>Resume Generated!</span>`;
      setTimeout(() => {
        downloadAction.innerHTML = originalText;
        closeModal();
      }, 1500);
    });
  }
}

/* ===================================================================
   12. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   13. CURRENT YEAR HELPER
   =================================================================== */
function updateCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
