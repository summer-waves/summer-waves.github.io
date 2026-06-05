// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button, .card, .skill-pill, .stat-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '56px'; ring.style.height = '56px';
    ring.style.borderColor = 'rgba(255,255,255,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.borderColor = 'rgba(0,212,255,0.5)';
  });
});

// ── NEURAL CANVAS ──
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', () => { resize(); initNodes(); });
function initNodes() {
  nodes = [];
  const count = Math.floor((W * H) / 14000);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, pulse: Math.random() * Math.PI * 2
    });
  }
}
initNodes();
function drawNeural() {
  ctx.clearRect(0, 0, W, H);
  const time = Date.now() * 0.001;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 140) {
        ctx.strokeStyle = `rgba(0,212,255,${(1 - dist/140)*0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      }
    }
  }
  nodes.forEach(n => {
    n.pulse += 0.02;
    const glow = Math.sin(n.pulse) * 0.5 + 0.5;
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${0.3 + glow * 0.4})`; ctx.fill();
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let k = 0; k < 6; k++) {
    const t = (time * 0.3 + k * 0.4) % 1;
    ctx.beginPath(); ctx.arc(t * W, (k * 0.17 + 0.05) * H + Math.sin(time + k) * 30, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(drawNeural);
}
drawNeural();

// ── ACTIVE NAV ──
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
});

// ── SCROLL FADE ──
document.querySelectorAll('.fade-in').forEach(el => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { el.classList.add('visible'); }
  }, { threshold: 0.1 }).observe(el);
});
