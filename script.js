/* ==========================================================================
   GAME DEV PORTFOLIO - V3.2 EASY SANTAI ARCADE & REAL ASSETS
   Developer: Dimas Rizky AF (Unity Lead Game Dev & Programmer)
   ========================================================================== */

// 1. Background Interactive Canvas with Particle Grid & Floating Cubes
class CyberBackground {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.cubes = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener('click', (e) => {
      this.checkCubeClick(e.clientX, e.clientY);
    });
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.createCubes();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    // Planning V5.0: lower density — subtle ambiance, not distracting
    const count = Math.floor((this.canvas.width * this.canvas.height) / 28000);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ec4899'
      });
    }
  }

  createCubes() {
    this.cubes = [];
    // Planning V5.0: fewer cubes (5), slower movement
    for (let i = 0; i < 5; i++) {
      this.cubes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 22 + 14,
        vx: (Math.random() - 0.5) * 0.50,
        vy: (Math.random() - 0.5) * 0.50,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.012,
        color: i % 2 === 0 ? '#00f0ff' : '#ec4899'
      });
    }
  }

  checkCubeClick(x, y) {
    for (let i = this.cubes.length - 1; i >= 0; i--) {
      let c = this.cubes[i];
      let dist = Math.hypot(c.x - x, c.y - y);
      if (dist < c.size + 15) {
        if (window.gameAudio) window.gameAudio.playScore();
        this.cubes.splice(i, 1);
        setTimeout(() => this.spawnCube(), 2500);
        break;
      }
    }
  }

  spawnCube() {
    this.cubes.push({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 26 + 18,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      rot: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.025,
      color: '#10b981'
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    }
    
    for (let c of this.cubes) {
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vRot;
      if (c.x < 0 || c.x > this.canvas.width) c.vx *= -1;
      if (c.y < 0 || c.y > this.canvas.height) c.vy *= -1;

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rot);
      this.ctx.strokeStyle = c.color;
      this.ctx.lineWidth = 1.5;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = c.color;
      this.ctx.strokeRect(-c.size / 2, -c.size / 2, c.size, c.size);
      this.ctx.restore();
    }

    this.connectParticles();
    requestAnimationFrame(() => this.animate());
  }
  
  drawGrid() {
    const gridSize = 60;
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }
  
  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        let dx = this.particles[i].x - this.particles[j].x;
        let dy = this.particles[i].y - this.particles[j].y;
        let dist = Math.hypot(dx, dy);
        if (dist < 100) {
          this.ctx.beginPath();
          // Planning V5.0: lower opacity connection lines — very subtle grid
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 100)})`;
          this.ctx.lineWidth = 0.4;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

// 2. Synthesized Web Audio API Engine
class GameAudioEngine {
  constructor() {
    this.sfxEnabled = true;
    this.bgmEnabled = true;
    this.audioCtx = null;
    this.started = false;

    // Cyberpunk 2077 OST - Main Menu Theme (Chiptune Arcade)
    this.bgmAudio = new Audio('assets/audio/cyberpunk_bgm.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.preload = 'metadata'; // Optimized for mobile bandwidth
    this.bgmAudio.volume = 0.15; // Low volume so button SFX remain crisp & clear

    this.bindVisibilityAndMobileListeners();
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  bindVisibilityAndMobileListeners() {
    // 1. Mobile Autoplay & Touch Unlock Handler
    const unlockAudio = () => {
      this.initContext();
      if (this.bgmEnabled && this.started && this.bgmAudio && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
    };

    ['pointerdown', 'touchstart', 'click'].forEach(evt => {
      document.addEventListener(evt, unlockAudio, { passive: true });
    });

    // 2. Battery & Data Mobile Saver on Tab Switch
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.bgmAudio) this.bgmAudio.pause();
      } else {
        if (this.bgmEnabled && this.started && this.bgmAudio && this.bgmAudio.paused) {
          this.bgmAudio.play().catch(() => {});
        }
      }
    });
  }

  startAudioSystem() {
    this.initContext();
    this.started = true;
    this.playStartJingle();
    this.startBGM();
  }

  startBGM() {
    if (!this.bgmAudio) return;
    if (this.bgmEnabled && this.started) {
      this.bgmAudio.play().catch(err => {
        console.warn('BGM play deferred for user interaction:', err);
      });
    }
  }

  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  toggleBGM(enable) {
    this.bgmEnabled = enable;
    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
  }

  playStartJingle() {
    if (!this.sfxEnabled) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        try {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
          gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.15);
        } catch(e) {}
      }, i * 90);
    });
  }

  playLaser() {
    if (!this.sfxEnabled || !this.started) return;
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch(e) {}
  }

  playExplosion() {
    if (!this.sfxEnabled || !this.started) return;
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch(e) {}
  }

  playHit() {
    if (!this.sfxEnabled || !this.started) return;
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.09, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.2);
    } catch(e) {}
  }

  playHover() {
    if (!this.sfxEnabled || !this.started) return;
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch(e) {}
  }

  playClick() {
    if (!this.sfxEnabled || !this.started) return;
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(700, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, this.audioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.07);
    } catch(e) {}
  }

  playScore() {
    if (!this.sfxEnabled || !this.started) return;
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, this.audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch(e) {}
  }
}

// 3. Arcade Mini Game: Cyberpunk Tetris
class CyberpunkTetrisGame {
  constructor(audio) {
    this.canvas = document.getElementById('minigame-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.audio = audio;

    this.cols = 10;
    this.rows = 20;
    this.blockSize = 22;

    this.grid = [];
    this.active = false;
    this.isGameOver = false;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.animId = null;
    this.dropCounter = 0;
    this.lastTime = 0;
    this.dropInterval = 800;

    try {
      this.highScore = (typeof localStorage !== 'undefined' && localStorage.getItem('tetris_high_score')) || 0;
    } catch (e) {
      this.highScore = 0;
    }

    this.shapes = {
      I: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
      J: [[1,0,0], [1,1,1], [0,0,0]],
      L: [[0,0,1], [1,1,1], [0,0,0]],
      O: [[1,1], [1,1]],
      S: [[0,1,1], [1,1,0], [0,0,0]],
      T: [[0,1,0], [1,1,1], [0,0,0]],
      Z: [[1,1,0], [0,1,1], [0,0,0]]
    };

    this.colors = {
      I: '#00f0ff',
      J: '#3b82f6',
      L: '#f97316',
      O: '#f59e0b',
      S: '#10b981',
      T: '#8b5cf6',
      Z: '#ec4899'
    };

    this.currentPiece = null;
    this.nextPiece = null;

    this.updateUI();
    this.bindEvents();
    this.bindVisibilityAndObserver();
    this.drawInitialScreen();
  }

  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  getRandomPiece() {
    const keys = Object.keys(this.shapes);
    const type = keys[Math.floor(Math.random() * keys.length)];
    return {
      type: type,
      matrix: this.shapes[type].map(row => [...row]),
      color: this.colors[type],
      x: Math.floor((this.cols - this.shapes[type][0].length) / 2),
      y: 0
    };
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.active || this.isGameOver) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.moveLeft();
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.moveRight();
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'k' || e.key === 'K') {
        this.rotatePiece();
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.dropPiece();
        this.score += 1;
        this.updateUI();
        e.preventDefault();
      } else if (e.key === ' ' || e.key === 'Enter') {
        this.hardDrop();
        e.preventDefault();
      }
    });

    const leftBtn = document.getElementById('btn-touch-left');
    const rightBtn = document.getElementById('btn-touch-right');
    const rotateBtn = document.getElementById('btn-touch-rotate');
    const dropBtn = document.getElementById('btn-touch-drop') || document.getElementById('btn-touch-fire');

    if (leftBtn) leftBtn.onclick = (e) => { e.preventDefault(); if (this.active) this.moveLeft(); };
    if (rightBtn) rightBtn.onclick = (e) => { e.preventDefault(); if (this.active) this.moveRight(); };
    if (rotateBtn) rotateBtn.onclick = (e) => { e.preventDefault(); if (this.active) this.rotatePiece(); };
    if (dropBtn) dropBtn.onclick = (e) => { e.preventDefault(); if (this.active) this.hardDrop(); };
  }

  moveLeft() {
    this.currentPiece.x--;
    if (this.checkCollision()) {
      this.currentPiece.x++;
    } else {
      if (this.audio) this.audio.playHover();
    }
  }

  moveRight() {
    this.currentPiece.x++;
    if (this.checkCollision()) {
      this.currentPiece.x--;
    } else {
      if (this.audio) this.audio.playHover();
    }
  }

  rotatePiece() {
    const matrix = this.currentPiece.matrix;
    const N = matrix.length;
    const rotated = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - 1 - j][i])
    );

    const originalMatrix = this.currentPiece.matrix;
    this.currentPiece.matrix = rotated;

    let offset = 1;
    while (this.checkCollision()) {
      this.currentPiece.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (Math.abs(offset) > this.currentPiece.matrix[0].length) {
        this.currentPiece.matrix = originalMatrix;
        this.currentPiece.x -= offset;
        return;
      }
    }
    if (this.audio) this.audio.playHover();
  }

  dropPiece() {
    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnNextPiece();
    }
    this.dropCounter = 0;
  }

  hardDrop() {
    while (!this.checkCollision()) {
      this.currentPiece.y++;
    }
    this.currentPiece.y--;
    if (this.audio) this.audio.playClick();
    this.lockPiece();
    this.clearLines();
    this.spawnNextPiece();
    this.dropCounter = 0;
  }

  checkCollision() {
    const m = this.currentPiece.matrix;
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (m[r][c] !== 0) {
          const newX = this.currentPiece.x + c;
          const newY = this.currentPiece.y + r;
          if (newX < 0 || newX >= this.cols || newY >= this.rows) {
            return true;
          }
          if (newY >= 0 && this.grid[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  lockPiece() {
    const m = this.currentPiece.matrix;
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (m[r][c] !== 0) {
          const gridY = this.currentPiece.y + r;
          const gridX = this.currentPiece.x + c;
          if (gridY >= 0 && gridY < this.rows && gridX >= 0 && gridX < this.cols) {
            this.grid[gridY][gridX] = this.currentPiece.color;
          }
        }
      }
    }
  }

  clearLines() {
    let linesCleared = 0;
    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.grid[r].every(cell => cell !== 0)) {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(this.cols).fill(0));
        linesCleared++;
        r++;
      }
    }

    if (linesCleared > 0) {
      this.lines += linesCleared;
      const points = [0, 100, 300, 500, 800];
      this.score += (points[linesCleared] || 800) * this.level;

      this.level = Math.floor(this.lines / 10) + 1;
      this.dropInterval = Math.max(120, 800 - (this.level - 1) * 65);

      if (this.audio) this.audio.playScore();
      this.updateUI();
    }
  }

  spawnNextPiece() {
    this.currentPiece = this.nextPiece || this.getRandomPiece();
    this.nextPiece = this.getRandomPiece();

    if (this.checkCollision()) {
      this.gameOver();
    }
  }

  updateUI() {
    const scoreEl = document.getElementById('score-val');
    const highEl = document.getElementById('high-score-val');
    const linesEl = document.getElementById('lines-val');
    const levelEl = document.getElementById('level-val');

    if (scoreEl) scoreEl.textContent = this.score;
    if (highEl) highEl.textContent = this.highScore;
    if (linesEl) linesEl.textContent = this.lines;
    if (levelEl) levelEl.textContent = this.level;
  }

  drawInitialScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#060e22';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 20px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('TETRIS', this.canvas.width / 2, this.canvas.height / 2 - 30);

    this.ctx.font = '11px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#10b981';
    this.ctx.fillText('ROTATE, STACK & CLEAR LINES!', this.canvas.width / 2, this.canvas.height / 2 + 10);

    this.ctx.font = '10px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#ec4899';
    this.ctx.fillText('PRESS "START TETRIS" TO PLAY', this.canvas.width / 2, this.canvas.height / 2 + 45);
  }

  start() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    this.grid = this.createEmptyGrid();
    this.active = true;
    this.isGameOver = false;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = 800;
    this.dropCounter = 0;
    this.lastTime = performance.now();

    this.nextPiece = this.getRandomPiece();
    this.spawnNextPiece();

    this.updateUI();
    this.loop(performance.now());
  }

  gameOver() {
    this.active = false;
    this.isGameOver = true;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('tetris_high_score', this.highScore);
        }
      } catch (e) {}
    }
    this.updateUI();

    if (this.audio) this.audio.playExplosion();

    this.ctx.fillStyle = 'rgba(4, 8, 18, 0.92)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 24px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#ec4899';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER!', this.canvas.width / 2, this.canvas.height / 2 - 35);

    this.ctx.font = '12px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillText(`SCORE: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 5);

    this.ctx.font = '11px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#10b981';
    this.ctx.fillText(`HIGH SCORE: ${this.highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 35);

    this.ctx.font = '10px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.fillText('PRESS RETRY TO PLAY AGAIN', this.canvas.width / 2, this.canvas.height / 2 + 70);

    const startBtn = document.getElementById('start-minigame-btn');
    if (startBtn) startBtn.textContent = 'RETRY TETRIS';
  }

  bindVisibilityAndObserver() {
    this.isVisible = true;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      if (this.canvas) observer.observe(this.canvas);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.isVisible = false;
    });
  }

  loop(time = 0) {
    if (!this.active) return;
    this.animId = requestAnimationFrame((t) => this.loop(t));

    if (document.hidden || !this.isVisible) {
      this.lastTime = time;
      return;
    }

    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
    }

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#060e22';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const boardWidth = this.cols * this.blockSize;
    const boardHeight = this.rows * this.blockSize;
    const startX = Math.floor((this.canvas.width - boardWidth) / 2) - 50;
    const startY = Math.floor((this.canvas.height - boardHeight) / 2);

    // Draw Board Frame & Background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    this.ctx.fillRect(startX, startY, boardWidth, boardHeight);
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(startX, startY, boardWidth, boardHeight);

    // Draw Grid Lines
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
    this.ctx.lineWidth = 1;
    for (let r = 0; r <= this.rows; r++) {
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY + r * this.blockSize);
      this.ctx.lineTo(startX + boardWidth, startY + r * this.blockSize);
      this.ctx.stroke();
    }
    for (let c = 0; c <= this.cols; c++) {
      this.ctx.beginPath();
      this.ctx.moveTo(startX + c * this.blockSize, startY);
      this.ctx.lineTo(startX + c * this.blockSize, startY + boardHeight);
      this.ctx.stroke();
    }

    // Draw Locked Grid Blocks
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] !== 0) {
          this.drawBlock(startX + c * this.blockSize, startY + r * this.blockSize, this.grid[r][c]);
        }
      }
    }

    // Draw Active Piece
    if (this.currentPiece) {
      const m = this.currentPiece.matrix;
      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[r].length; c++) {
          if (m[r][c] !== 0) {
            const px = startX + (this.currentPiece.x + c) * this.blockSize;
            const py = startY + (this.currentPiece.y + r) * this.blockSize;
            if (py >= startY) {
              this.drawBlock(px, py, this.currentPiece.color);
            }
          }
        }
      }
    }

    // Draw Next Piece Preview Panel (Side HUD)
    const nextPanelX = startX + boardWidth + 25;
    const nextPanelY = startY + 20;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(nextPanelX, nextPanelY, 120, 120);
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(nextPanelX, nextPanelY, 120, 120);

    this.ctx.font = '10px "Press Start 2P", "Pixelify Sans", monospace';
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('NEXT', nextPanelX + 60, nextPanelY + 22);

    if (this.nextPiece) {
      const m = this.nextPiece.matrix;
      const pieceW = m[0].length * 18;
      const pieceH = m.length * 18;
      const offsetX = nextPanelX + Math.floor((120 - pieceW) / 2);
      const offsetY = nextPanelY + Math.floor((120 - pieceH) / 2) + 8;

      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[r].length; c++) {
          if (m[r][c] !== 0) {
            this.drawBlock(offsetX + c * 18, offsetY + r * 18, this.nextPiece.color, 18);
          }
        }
      }
    }
  }

  drawBlock(x, y, color, size = this.blockSize) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    this.ctx.fillRect(x, y, size, 2);
    this.ctx.fillRect(x, y, 2, size);

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.fillRect(x + size - 2, y, 2, size);
    this.ctx.fillRect(x, y + size - 2, size, 2);
  }
}

// 4. Projects Data Store
const projectsData = {
  "3d-puzzle-explorer": {
    title: "3D Puzzle Explorer",
    category: "Simulation",
    role: "Unity Game Programmer & Architect",
    year: "2026",
    platform: "PC (Windows x86_64)",
    coverImage: "assets/projects/3d_puzzle_explorer_cover.webp",
    screenshots: [
      "assets/projects/3d_puzzle_explorer_cover.webp",
      "assets/projects/3d_puzzle_explorer_gameplay1.webp",
      "assets/projects/3d_puzzle_explorer_gameplay2.webp"
    ],
    bgGradient: "linear-gradient(135deg, #0d9488, #115e59)",
    videos: [
      { label: "GAMEPLAY & PUZZLE DEMO", type: "mp4", src: "https://github.com/user-attachments/assets/20d05e70-9b7d-4a69-84cc-2e06d7615dfe" }
    ],
    toolsUsed: ["Unity 6 LTS (6000.3.7f1)", "Universal Render Pipeline (URP)", "Cinemachine 3", "UniTask", "New Input System", "Asmdefs"],
    tech: ["Unity 6 LTS", "C#", "SOLID Architecture", "UniTask Async", "Cinemachine", "Assembly Definitions", "Model-View Decoupling"],
    links: [
      { text: "VIEW ON GITHUB", url: "https://github.com/dimasrizky29/3D-Puzzle-Explorer", class: "btn-hud btn-hud-green" },
      { text: "DOWNLOAD WINDOWS BUILD", url: "https://drive.google.com/file/d/1dWbiEPVTmdoV4GSdH1QEVToABZ357Em0/view?usp=sharing", class: "btn-hud btn-hud-secondary" }
    ],
    description: "A third-person 3D exploration prototype in Unity 6 LTS: players explore environments, interact with 3D objects, and transition to UI-based 2D mini-puzzles (Memory Match & Sliding Puzzle) with seamless input locking and state restoration.",
    highlights: [
      "Architected strict Assembly Definitions (Game.Core, Game.UI, Game.Puzzle, Game.Interaction, Game.Player, Game.Bootstrap) ensuring inward dependency flow and zero circular references.",
      "Applied SOLID principles with pure C# decoupled models (MemoryMatchModel & SlidingPuzzleModel) for 100% testable domain rules without MonoBehaviour dependencies.",
      "Implemented UniTask 2.5.10 async lifecycle pipelines with linked CancellationTokenSources and zero Coroutines, preventing memory leaks on object destruction.",
      "Optimized hot paths with Physics.OverlapSphereNonAlloc on cached layer masks (0.1s interval), UI view pooling, and zero runtime garbage collection."
    ],
    collaboration: "Structured clean abstractions and modular IPuzzle interfaces so designers can introduce new puzzle archetypes or interactable triggers without modifying core puzzle services.",
    takeaway: "Demonstrated enterprise-level Unity 6 engineering practices: modular asmdefs, DI via composition root (GameBootstrapper), zero GC hot paths, and robust async state management."
  },
  "destiny-of-heroes": {
    title: "Destiny of Heroes",
    category: "Action / Shooter",
    role: "Unity Programmer (Sole Programmer)",
    year: "2023",
    platform: "PC (Steam)",
    coverImage: "assets/projects/destiny_of_heroes.webp",
    bgGradient: "linear-gradient(135deg, #1f2937, #111827)",
    videos: [
      { label: "GAMEPLAY VIDEO", type: "drive", src: "https://drive.google.com/file/d/1ou9V18eDUllZ4z8SZ0O7uQWs_JUqviUl/preview" }
    ],
    toolsUsed: ["Unity Game Engine", "Git", "Custom Shaders", "State Machine Architecture"],
    tech: ["Unity", "C#", "Git", "State Machine", "Custom Shaders", "Hit Detection"],
    links: [
      { text: "VIEW ON STEAM", url: "https://store.steampowered.com/app/2906040/ARCHIVED_Destiny_of_Heroes", class: "btn-hud btn-hud-green" },
      { text: "ITCH.IO STORY EDITION", url: "https://dimas-rizky.itch.io/destiny-of-heroes-story", class: "btn-hud btn-hud-secondary" },
      { text: "ITCH.IO GAME EDITION", url: "https://dimas-rizky.itch.io/destiny-of-heroes", class: "btn-hud btn-hud-secondary" }
    ],
    description: "A tactical top-down shooter set in 1942–1945 Indonesia, featuring characters with unique active combat skills.",
    highlights: [
      "Sole Programmer: Developed the entire core combat loops, character active skill systems, and multidirectional movement mechanics from scratch.",
      "Engineered high-precision hit detection, seamless UI integration, and custom shader visual effects to deliver a responsive, tactile game feel.",
      "Constructed a robust, modular state machine architecture for player character states and combat behaviors."
    ],
    collaboration: "Collaborated closely with the Director and Art team through rapid prototyping sprints to seamlessly integrate all 2D/3D assets and animations.",
    takeaway: "Sharpened deep capabilities in building modular state machines, tuning responsive game feel/gameplay loops, and structuring maintainable single-programmer game architecture."
  },
  "mon-tycoon": {
    title: "Mon Tycoon",
    category: "Casual / Tycoon",
    role: "Lead Game Developer",
    year: "2026",
    platform: "Android & iOS / PC",
    coverImage: "assets/projects/mon_tycoon.webp",
    bgGradient: "linear-gradient(135deg, #581c87, #3b0764)",
    videos: [
      { label: "VIDEO TRAILER", type: "drive", src: "https://drive.google.com/file/d/1GvHNPTpXBYfuNxZn_2nfQhtkX7aWP4x5/preview" }
    ],
    toolsUsed: ["Unity Game Engine", "Git", "VContainer (DI)", "MVP Architecture", "Multi-Scene Workflow"],
    tech: ["Unity", "VContainer (DI)", "MVP Architecture", "Git", "Clean Architecture", "Multi-Scene Workflow"],
    links: [],
    description: "A 3D simulation tycoon game featuring dual-perspective camera controls (FPS & Top-Down) and a complex creature management lifecycle across multiple environments.",
    highlights: [
      "Core Game Developer: Built the dual-perspective camera system (seamless switching between First-Person and Top-Down tactical view) and engineered creature lifecycle loops from scratch.",
      "Applied strict Clean Architecture principles (MVP pattern with VContainer Dependency Injection) to completely decouple domain logic from UI presentation.",
      "Architected a modular multi-scene workflow for efficient background map loading and zero memory leaks."
    ],
    collaboration: "Structured clean abstractions and automated DI containers so designers and 3D animators could create new creature behaviors without touching core codebase.",
    takeaway: "Significantly deepened expertise in advanced clean architecture, Dependency Injection (VContainer), and writing highly decoupled, enterprise-grade maintainable game systems."
  },
  "my-farm-sim": {
    title: "My Farm Simulation",
    category: "Simulation",
    role: "Solo Game Developer",
    year: "2023",
    platform: "Android & iOS",
    coverImage: "assets/projects/my_farm_sim.webp",
    bgGradient: "linear-gradient(135deg, #065f46, #047857)",
    videos: [],
    toolsUsed: ["Unity Game Engine", "Firebase", "In-App Purchases (IAP)", "C#", "Custom Shaders"],
    tech: ["Unity", "Firebase", "In-App Purchases (IAP)", "C#", "Custom Shaders", "Mobile Optimization"],
    links: [
      { text: "VIEW ON ITCH.IO", url: "https://dimas-rizky.itch.io/my-farm-simulation", class: "btn-hud btn-hud-green" }
    ],
    description: "A mobile farm management simulation game on Android and iOS, featuring complex livestock raising, crop cultivation, and virtual economy tracking.",
    highlights: [
      "Solo Developer: Handled complete development from scratch, including core simulation loops, virtual economy tracking, and asset implementation.",
      "Authored custom shaders, configured audio/animation pipelines, and integrated Firebase for real-time cloud data saving.",
      "Implemented In-App Purchases (IAP) with secure transaction validation across Google Play and Apple App Store."
    ],
    collaboration: "Managed the complete production pipeline end-to-end to ensure the game ran smoothly across mid-to-low-end Android and iOS devices.",
    takeaway: "Deepened skills in complex state management, data-driven gameplay architectures, and mobile memory/performance optimization."
  },
  "hyper-legend": {
    title: "Hyper Legend",
    category: "Multiplayer",
    role: "Lead Game Developer & Core Programmer",
    year: "2025",
    platform: "Android & iOS",
    coverImage: "assets/projects/hyper_legend.webp",
    screenshots: ["assets/projects/hyper_legend.webp", "assets/projects/hyper_legend_lobby.webp"],
    bgGradient: "linear-gradient(135deg, #991b1b, #7f1d1d)",
    videos: [
      { label: "FULL GAMEPLAY", type: "drive", src: "https://drive.google.com/file/d/1fZYH-40DJzYQk9iirCgMzUGQ5VaLH9Mt/preview" },
      { label: "PVP MATCH", type: "drive", src: "https://drive.google.com/file/d/1RNxvbmo1CjkTaGKWiTD4Ph9KrKLmUDfF/preview" },
      { label: "ARCADE MODE", type: "drive", src: "https://drive.google.com/file/d/1ZAYlXLPh2CVDmkSo5B5kInYr2_InC7oq/preview" }
    ],
    toolsUsed: ["Unity Game Engine", "Unity Netcode", "AWS GameLift", "REST APIs", "Git"],
    tech: ["Unity", "AWS GameLift", "Git", "REST APIs", "Multiplayer Netcode", "Mobile Profiling"],
    links: [
      { text: "VIEW ON ITCH.IO", url: "https://dimas-rizky.itch.io/", class: "btn-hud btn-hud-green" }
    ],
    description: "A real-time multiplayer 3D fighting game, featuring competitive PvP and arcade modes with unique character combat skills.",
    highlights: [
      "Lead Game Developer & Core Programmer: Engineered primary gameplay loops, combat physics, and real-time multiplayer netcode.",
      "Integrated backend REST APIs for player profiles, matchmaking, and combat session synchronization.",
      "Supervised the UI implementation pipeline within Unity to ensure pixel-perfect rendering and responsive input."
    ],
    collaboration: "Collaborated closely with the Project Manager, Backend Developer, and 3D Art team to sync all game assets and release builds on schedule.",
    takeaway: "Executing deep mobile profiling to deliver this optimized Android release sharpened technical leadership and production-level debugging under real-world constraints."
  },
  "multiplayer-billiards": {
    title: "Multiplayer Billiards",
    category: "Multiplayer",
    role: "Lead Game Developer & Core Programmer",
    year: "2025",
    platform: "Android & iOS",
    coverImage: "assets/projects/multiplayer_billiard.webp",
    screenshots: ["assets/projects/multiplayer_billiard.webp", "assets/projects/multiplayer_billiard_bot_system.webp"],
    bgGradient: "linear-gradient(135deg, #1e3a8a, #1e40af)",
    videos: [
      { label: "GAMEPLAY DEMO", type: "drive", src: "https://drive.google.com/file/d/1oiXMTRlpEMo4C1fQAXiRonEZ1C8J7ugw/preview" },
      { label: "LOBBY & MENU", type: "drive", src: "https://drive.google.com/file/d/1f4tXuUg-OmaGyFhW403IMpcAqixlBB2D/preview" }
    ],
    toolsUsed: ["Unity Game Engine", "Unity Netcode", "AWS GameLift Server", "FlexMatch", "Git"],
    tech: ["Unity", "AWS GameLift", "FlexMatch", "Git", "Headless Server", "REST APIs", "Custom Physics"],
    links: [
      { text: "VIEW ON ITCH.IO", url: "https://dimas-rizky.itch.io/", class: "btn-hud btn-hud-green" }
    ],
    description: "A real-time 8-ball billiards game on Mobile, featuring fast-paced 1v1 PvP matches, private rooms, and realistic physics loops.",
    highlights: [
      "Lead Game Developer & Core Programmer: Built core gameplay physics, ball-to-ball elastic collisions, and tactile cue stick aiming mechanics.",
      "Developed and deployed a dedicated headless server on AWS GameLift, configuring FlexMatch rule sets for low-latency player matchmaking.",
      "Integrated backend REST APIs for virtual currency, match history, and account progression."
    ],
    collaboration: "Managed technical coordination across PM, art, and UI teams to guarantee synchronized state replication and a smooth low-latency Android launch.",
    takeaway: "Significantly deepened expertise in scalable cloud infrastructure (AWS GameLift / FlexMatch) and real-time multiplayer server synchronization."
  },
  "rush-hero": {
    title: "Rush Hero",
    category: "Action / Shooter",
    role: "Unity Developer",
    year: "2021",
    platform: "Android & Itch.io",
    coverImage: "assets/projects/rush_hero_cover.webp",
    screenshots: ["assets/projects/rush_hero_cover.webp", "assets/projects/RushHeroes_Screenshot 2025-06-16 230624.webp"],
    bgGradient: "linear-gradient(135deg, #1e293b, #0f172a)",
    videos: [],
    toolsUsed: ["Unity Game Engine", "Huawei AppGallery SDK", "Itch.io Distribution", "C#"],
    tech: ["Unity", "C#", "Huawei AppGallery SDK", "Itch.io", "Mobile Touch"],
    links: [
      { text: "PLAY ON ITCH.IO", url: "https://dimas-rizky.itch.io/rush-heroes", class: "btn-hud btn-hud-green" },
      { text: "VIEW ON HUAWEI APPGALLERY", url: "https://appgallery.huawei.com/app/C107157263", class: "btn-hud btn-hud-pink" }
    ],
    description: "A futuristic sci-fi dimensional runner where heroes cross dimensions to gather unlimited energy reserves for a depleted Earth.",
    highlights: [
      "Developed full endless runner loops, responsive mobile swipe & touch input controllers, and high-score progression systems.",
      "Successfully integrated Huawei AppGallery SDK (C107157263) and deployed APK builds on multiple app stores."
    ],
    collaboration: "Worked with sound designers and 2D artists to implement visual particle feedback and dynamic retro soundtrack triggers.",
    takeaway: "Gained comprehensive experience in mobile publishing pipelines, third-party distribution SDKs, and mobile performance profiling."
  },
  "gold-miner": {
    title: "Gold Miner",
    category: "Casual / Tycoon",
    role: "Solo Unity Developer",
    year: "2024",
    platform: "Android",
    coverImage: "assets/projects/gold_miner.webp",
    screenshots: ["assets/projects/gold_miner.webp", "assets/projects/gold_miner_gameplay.webp"],
    bgGradient: "linear-gradient(135deg, #854d0e, #713f12)",
    videos: [
      { label: "GAMEPLAY PROTOTYPE", type: "drive", src: "https://drive.google.com/file/d/18ZmVEZJW4n14_dvrQns6lF6Ncj9OQZif/preview" }
    ],
    toolsUsed: ["Unity Game Engine", "Grid Map Architecture", "APK Build Pipeline", "C#"],
    tech: ["Unity", "C#", "Grid Map Architecture", "APK Build", "Mobile Optimization"],
    links: [
      { text: "DOWNLOAD APK (GOOGLE DRIVE)", url: "https://drive.google.com/file/d/11KzfMYNFHzSL3A0y5EhXzrqFwmv-LX2d/view?usp=sharing", class: "btn-hud btn-hud-green" }
    ],
    description: "A natural resource mining simulation prototype where players place miners strategically across grid maps to harvest precious metals.",
    highlights: [
      "Created grid placement mechanics, pathfinding tile logic, and miner resource generation algorithms.",
      "Engineered lightweight saving/loading serialization to persist board layouts and resource yields."
    ],
    collaboration: "Built modular scriptable objects allowing quick balancing of mineral values, upgrade costs, and mining speeds.",
    takeaway: "Deepened understanding of grid-based coordinate calculations, data serialization, and mobile CPU throttling management."
  },
  "shiba-hunter": {
    title: "Shiba Hunter",
    category: "Action / Shooter",
    role: "Unity Developer",
    year: "2023",
    platform: "Android",
    coverImage: "assets/projects/shiba_hunter_sampul.webp",
    screenshots: ["assets/projects/shiba_hunter_sampul.webp", "assets/projects/shiba_hunter.webp"],
    bgGradient: "linear-gradient(135deg, #064e3b, #022c22)",
    videos: [
      { label: "GAMEPLAY DEMO", type: "mp4", src: "https://file.notion.com/f/f/20068283-c4de-4522-a6a4-695c2be5ff5e/d6c5c16a-c649-4f1e-a7f8-b505131073ac/Screen_Recording_2025-06-15_132041.mp4?table=block&id=21333c73-ef0a-807b-a81c-d971bafd4616&spaceId=20068283-c4de-4522-a6a4-695c2be5ff5e&expirationTimestamp=1787313600000&signature=4JrG9-ZEbna8Xg4w-JSgUVWoRGJEC3kFZK2zhEsDDnA&downloadName=Screen+Recording+2025-06-15+132041.mp4" }
    ],
    toolsUsed: ["Unity Game Engine", "Near-Field Communication (NFC)", "In-App Purchases (IAP)", "C#", "Custom Shaders"],
    tech: ["Unity", "C#", "Mobile Touch Controls", "Enemy AI Behavior", "Particle FX"],
    links: [
      { text: "VIEW ON ITCH.IO", url: "https://dimas-rizky.itch.io/", class: "btn-hud btn-hud-green" },
      { text: "YOUTUBE CHANNEL", url: "https://www.youtube.com/@shibahunterofficial123", class: "btn-hud btn-hud-pink" },
      { text: "GOOGLE DRIVE BUILDS", url: "https://drive.google.com/drive/folders/1VZz62IlEX1UzHoPda8Log5wL8i_VDU0U", class: "btn-hud btn-hud-secondary" }
    ],
    description: "Fast-paced mobile action hunter game with responsive touch movement, enemy spawning waves, and weapon upgrades.",
    highlights: [
      "Built custom mobile virtual joystick controllers and auto-aim weapon targeting algorithms.",
      "Engineered scalable enemy wave spawning state machines with progressive difficulty scaling.",
      "Integrated NFC hardware SDK for physical toy-to-life mobile character unlocking."
    ],
    collaboration: "Paired with 2D character animators to synchronize hit frames, projectile trails, and screen-shake feedback.",
    takeaway: "Mastered responsive mobile action controls, enemy pooling for low garbage collection, and satisfying juice/game-feel design."
  },
  "zuma-infinity": {
    title: "Zuma Infinity",
    category: "Casual / Tycoon",
    role: "Unity WebGL Developer",
    year: "2021",
    platform: "WebGL Browser",
    coverImage: "assets/projects/zuma_infinity.png",
    bgGradient: "linear-gradient(135deg, #1e1b4b, #312e81)",
    videos: [
      { label: "GAMEPLAY DEMO", type: "mp4", src: "https://file.notion.com/f/f/20068283-c4de-4522-a6a4-695c2be5ff5e/32d2662d-8d76-4c4b-9a39-ad547a8180ee/Recording_2025-06-15_024829.mp4?table=block&id=21233c73-ef0a-803c-888a-d6241c3e5fca&spaceId=20068283-c4de-4522-a6a4-695c2be5ff5e&expirationTimestamp=1787313600000&signature=zAv_iHlrnX8Pw3lX7sVw0H1bGK5pM0pc-hFe1nhc7Cw&downloadName=Recording+2025-06-15+024829.mp4" }
    ],
    toolsUsed: ["Unity WebGL", "MetaMask (Web3 SDK)", "Bezier Spline Curves", "C#"],
    tech: ["Unity", "WebGL", "Bezier Spline Curves", "Combo Reaction System", "Optimization"],
    links: [
      { text: "PLAY ON WEBGL BROWSER", url: "https://dimas-rizky.itch.io/", class: "btn-hud btn-hud-green" }
    ],
    description: "Classic marble shooter mechanics recreated for WebGL browser play with smooth spline curve pathing and chain reaction combo scoring.",
    highlights: [
      "Engineered mathematically accurate marble movement along parametric Bezier curves and tracks.",
      "Built recursive chain-reaction ball matching algorithms and projectile collision calculations."
    ],
    collaboration: "Optimized WebGL asset bundling and shaders to achieve instantaneous browser loading times.",
    takeaway: "Gained mastery over mathematical Bezier spline algorithms, WebGL memory constraints, and deterministic chain reaction loops."
  },
  "chips-domino": {
    title: "Chips Domino",
    category: "Simulation",
    role: "Unity Developer",
    year: "2022",
    platform: "Android",
    coverImage: "assets/projects/chips_domino_menu.webp",
    screenshots: [
      "assets/projects/chips_domino_menu.webp",
      "assets/projects/chips_domino_Login.webp",
      "assets/projects/chips_domino_vs.webp",
      "assets/projects/chips_domino_jackpot.webp",
      "assets/projects/chips_domino_win.webp",
      "assets/projects/chips_domino_gameplay1.webp",
      "assets/projects/chips_domino_gameplay2.webp",
      "assets/projects/chips_domino_gameplay3.webp",
      "assets/projects/chips_domino_gameplay4.webp",
      "assets/projects/chips_domino_gameplay5.webp",
      "assets/projects/chips_domino_editor.webp"
    ],
    bgGradient: "linear-gradient(135deg, #374151, #1f2937)",
    videos: [],
    toolsUsed: ["Unity Game Engine", "Firebase", "In-App Purchases (IAP)", "AdMob", "WebSocket Networking", "C#"],
    tech: ["Unity", "C#", "Card Game Logic", "Virtual Economy", "Tweening"],
    links: [
      { text: "VIEW ON ITCH.IO", url: "https://dimas-rizky.itch.io/chips-domino", class: "btn-hud btn-hud-green" }
    ],
    description: "Casual mobile domino simulation game with online virtual chip economy, room selection, and table card animations.",
    highlights: [
      "Programmed domino matching rules, table hand validation, and round scoring algorithms.",
      "Implemented smooth domino tile dealing physics and UI transition flow."
    ],
    collaboration: "Integrated UI assets and sound fx cues to provide tactile board feedback on mobile screens.",
    takeaway: "Reinforced clean turn-based rule engine architecture and secure local/server chip balance handling."
  },
  "pesulap-merah": {
    title: "Pesulap Merah Adventure",
    category: "Action / Shooter",
    role: "Solo Unity Developer",
    year: "2022",
    platform: "Android",
    coverImage: "assets/projects/pesulap_merah.png",
    bgGradient: "linear-gradient(135deg, #991b1b, #450a0a)",
    videos: [
      { label: "GAMEPLAY SHOWCASE", type: "youtube", src: "https://www.youtube.com/embed/a22EFLaXkHg?autoplay=1&enablejsapi=1&rel=0" }
    ],
    toolsUsed: ["Unity Game Engine", "In-App Purchases (IAP)", "AdMob", "C#", "Custom Shaders"],
    tech: ["Unity 3D", "C#", "Combat System", "Enemy AI System", "IAP", "AdMob"],
    links: [
      { text: "VIEW ON ITCH.IO", url: "https://dimas-rizky.itch.io/pesulap-merah-adventure", class: "btn-hud btn-hud-green" },
      { text: "WATCH ON YOUTUBE", url: "https://www.youtube.com/watch?v=a22EFLaXkHg", class: "btn-hud btn-hud-pink" }
    ],
    description: "Pedukunan palsu di Indonesia semakin merajalela dan banyak masyarakat yang dirugikan oleh tipu muslihat. Pesulap Merah berinisiatif menumpas dukun-dukun sesat tersebut. A 3D fighting adventure game featuring a full combat system: Attack combos, Jump maneuvers, Defence shields, Healing, and Spellcasting against multiple enemy and boss encounters.",
    highlights: [
      "Sole Creator: Designed and programmed the complete 3D combat loop, implementing dynamic attack chains, jump physics, active defence blocking, healing mechanics, and spellcasting.",
      "Engineered multi-phase Enemy AI Systems with telegraphed attack patterns and distinct adversary behavior loops.",
      "Integrated monetization pipelines including AdMob rewarded video ads and In-App Purchases (IAP)."
    ],
    collaboration: "Handled full cycle end-to-end: Game Design, Programming, Sound Design, Shader/Visual FX, Character Animations, and 3D Asset Implementation.",
    takeaway: "Gained extensive mastery over 3D character action controllers, multi-action combat state machines, enemy AI system tuning, and commercial mobile monetization."
  },
  "venus-infinity": {
    title: "Venus Infinity",
    category: "Casual / Tycoon",
    role: "Unity Developer",
    year: "2024",
    platform: "Android",
    coverImage: "assets/projects/venus_infinity.webp",
    bgGradient: "linear-gradient(135deg, #d97706, #92400e)",
    videos: [],
    toolsUsed: ["Unity Game Engine", "WebSocket Networking", "C#", "Custom Shaders", "3D Animation"],
    tech: ["Unity", "C#", "WebSockets", "Resource Extraction", "Mobile UI Animation"],
    links: [
      { text: "VIEW ON ITCH.IO", url: "https://dimas-rizky.itch.io/venus-infinity", class: "btn-hud btn-hud-green" }
    ],
    description: "An astronaut lands on planet Venus with the objective of extracting, refining, and managing rare extraterrestrial energy reserves.",
    highlights: [
      "Programmed resource gathering logic, planetary survival metrics, and real-time inventory management.",
      "Integrated WebSocket networking for real-time player telemetry and asset synchronization."
    ],
    collaboration: "Implemented 3D astronaut models, sci-fi particle shaders, and UI animations for mobile tactile feedback.",
    takeaway: "Strengthened skills in mobile real-time client-server communication and economic balancing loops."
  }
};

// Motion.dev Progress Bar Asset Preloader
function initPreloader() {
  const loaderScreen = document.getElementById('loader-screen');
  const loaderFill = document.getElementById('loader-fill');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderStatus = document.getElementById('loader-status-text');

  if (!loaderScreen || !loaderFill || !loaderPercent) return;

  const assetsToPreload = [
    'assets/Profile.png',
    'assets/background.jpg',
    'assets/Game Developer certificate.png',
    'assets/dimas_rizky_alimu_award_certificate.jpg',
    'assets/projects/destiny_of_heroes.webp',
    'assets/projects/3d_puzzle_explorer_cover.webp',
    'assets/projects/mon_tycoon.webp',
    'assets/projects/my_farm_sim.webp',
    'assets/projects/hyper_legend.webp',
    'assets/projects/multiplayer_billiard.webp',
    'assets/projects/pesulap_merah.png',
    'assets/projects/rush_hero_cover.webp',
    'assets/projects/shiba_hunter_sampul.webp',
    'assets/projects/venus_infinity.webp',
    'assets/projects/chips_domino_menu.webp',
    'assets/projects/gold_miner.webp',
    'assets/projects/zuma_infinity.png'
  ];

  let loadedCount = 0;
  const totalAssets = assetsToPreload.length;

  function updateProgress(percent, statusMsg) {
    const clamped = Math.min(100, Math.max(0, Math.round(percent)));
    loaderFill.style.width = `${clamped}%`;
    loaderPercent.textContent = `${clamped}%`;
    if (statusMsg && loaderStatus) loaderStatus.textContent = statusMsg;
  }

  // Initial progress start
  updateProgress(25, 'INITIALIZING ENGINE & RESOURCES...');

  let finished = false;
  function finishLoading() {
    if (finished) return;
    finished = true;
    updateProgress(100, 'PRELOAD COMPLETE. READY!');
    setTimeout(() => {
      if (loaderScreen) {
        loaderScreen.classList.add('hidden');
        setTimeout(() => {
          if (loaderScreen && typeof loaderScreen.remove === 'function') loaderScreen.remove();
        }, 500);
      }
    }, 200);
  }

  // Safety timer: Preloader disappears in max 700ms no matter what
  setTimeout(finishLoading, 700);

  if (totalAssets === 0) {
    finishLoading();
    return;
  }

  assetsToPreload.forEach((src) => {
    const img = new Image();
    img.src = src;
    const onComplete = () => {
      loadedCount++;
      const currentPercent = 25 + (loadedCount / totalAssets) * 75;
      updateProgress(currentPercent, `PRELOADING ASSETS (${loadedCount}/${totalAssets})...`);
      if (loadedCount >= totalAssets) {
        setTimeout(finishLoading, 100);
      }
    };
    img.onload = onComplete;
    img.onerror = onComplete;
  });
}

// ── Start Screen Ambient Particle Canvas ──
class StartParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = window.innerWidth <= 768 ? 20 : 45;
    this.animId = null;
    this.resize();
    this.init();
    this.animate = this.animate.bind(this);
    this.animate();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  init() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ec4899'
      });
    }
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const isMobile = window.innerWidth <= 768;
    for (let p of this.particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      if (!isMobile) {
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
      }
      this.ctx.fill();
    }
    this.animId = requestAnimationFrame(this.animate);
  }
  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

// ── Pixel Curtain Transition ──
function triggerPixelCurtainTransition(onCompleteCallback) {
  const container = document.getElementById('pixel-curtain-container');
  if (!container) { if (onCompleteCallback) onCompleteCallback(); return; }
  const rows = 8, cols = 12;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('div');
      tile.className = 'pixel-tile';
      container.appendChild(tile);
      tiles.push(tile);
    }
  }
  if (typeof gsap !== 'undefined') {
    gsap.to(tiles, {
      scale: 0, opacity: 0, borderRadius: '50%', duration: 0.55,
      stagger: { grid: [rows, cols], from: 'center', amount: 0.6 },
      ease: 'power2.inOut',
      onComplete: () => { container.innerHTML = ''; if (onCompleteCallback) onCompleteCallback(); }
    });
    setTimeout(() => { if (container) container.innerHTML = ''; }, 900);
  } else {
    container.innerHTML = '';
    if (onCompleteCallback) onCompleteCallback();
  }
}

// 5. Main Initialization & Event Listener Registration

// THREE.JS HERO 3D SCENE  (Planning V5.0 — 3D Engine Layer)
// =============================================================
class HeroThreeScene {
  constructor() {
    if (typeof THREE === 'undefined') return;
    this.canvas = document.getElementById('hero-3d-canvas');
    if (!this.canvas) return;
    this.mouse = { x: 0, y: 0 };
    this.clock = { start: Date.now() };
    this.isVisible = true;

    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: window.innerWidth > 768 });
    } catch(e) { return; }
    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    this.camera.position.z = 4.2;
    this._buildScene();
    this._bindEvents();
    this._initObserver();
    this._onResize();
    this._animate();
  }

  _initObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(this.canvas);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.isVisible = false;
    });
  }

  _buildScene() {
    // Outer wireframe icosahedron (neon cyan)
    const geo1 = new THREE.IcosahedronGeometry(1.5, 1);
    const mat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.32 });
    this.mesh1 = new THREE.Mesh(geo1, mat1);
    this.scene.add(this.mesh1);

    // Inner octahedron (pink accent)
    const geo2 = new THREE.OctahedronGeometry(0.78, 0);
    const mat2 = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true, transparent: true, opacity: 0.24 });
    this.mesh2 = new THREE.Mesh(geo2, mat2);
    this.scene.add(this.mesh2);

    // Orbital ring (yellow-stat)
    const geo3 = new THREE.TorusGeometry(2.0, 0.012, 6, 80);
    const mat3 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.18 });
    this.ring = new THREE.Mesh(geo3, mat3);
    this.scene.add(this.ring);

    // Floating point cloud (reduced particle count on mobile)
    const count = window.innerWidth <= 768 ? 45 : 90;
    const positions = [];
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const ptMat = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.05, transparent: true, opacity: 0.35 });
    this.points = new THREE.Points(ptGeo, ptMat);
    this.scene.add(this.points);
  }

  _bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    window.addEventListener('resize', () => this._onResize(), { passive: true });
  }

  _onResize() {
    const parent = this.canvas.parentElement;
    const w = parent ? parent.clientWidth : (this.canvas.clientWidth || 360);
    const h = parent ? parent.clientHeight : (this.canvas.clientHeight || 360);
    this.renderer.setSize(w, h, false);
    // Cap pixel ratio to 1.5 on mobile to save GPU power
    const maxRatio = window.innerWidth <= 768 ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxRatio));
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    if (!this.isVisible || document.hidden) return; // Pause 3D render when offscreen or tab hidden

    const t = (Date.now() - this.clock.start) * 0.001;
    if (this.mesh1) {
      this.mesh1.rotation.x = t * 0.14 + this.mouse.y * 0.28;
      this.mesh1.rotation.y = t * 0.22 + this.mouse.x * 0.38;
    }
    if (this.mesh2) {
      this.mesh2.rotation.x = -t * 0.18 + this.mouse.y * 0.18;
      this.mesh2.rotation.y =  t * 0.28 - this.mouse.x * 0.25;
    }
    if (this.ring) {
      this.ring.rotation.x  = Math.PI * 0.3 + t * 0.07;
      this.ring.rotation.y  = t * 0.12;
    }
    if (this.points) {
      this.points.rotation.y = t * 0.04;
      this.points.rotation.x = t * 0.025;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// =============================================================
// GSAP ANIMATIONS  (Planning V5.0 — UI Animation Layer)
// =============================================================
class GSAPAnimations {
  constructor() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    try { this._heroEntrance(); } catch(e) { console.warn('GSAP hero entrance error:', e); }
    try { this._scrollReveal(); } catch(e) { console.warn('GSAP scroll reveal error:', e); }
    try { this._skillsScanlineTrigger(); } catch(e) { console.warn('GSAP skills scanline error:', e); }
  }

  _heroEntrance() {
    try {
      const isMobile = window.innerWidth <= 1024;
      gsap.from('.hero-title',    { opacity: 0, y: 30,  duration: 0.8, delay: 0.15, ease: 'power3.out' });
      gsap.from('.hero-tagline',  { opacity: 0, y: isMobile ? -20 : 0, x: isMobile ? 0 : -30, duration: 0.6, delay: 0.1,  ease: 'power2.out' });
      gsap.from('.hero-bio',      { opacity: 0, y: 20,  duration: 0.7, delay: 0.35, ease: 'power2.out' });
      gsap.from('.hero-cta',      { opacity: 0, y: 20,  duration: 0.6, delay: 0.55, ease: 'power2.out' });
      gsap.from('.hero-hud-card', {
        opacity: 0,
        y: isMobile ? 30 : 0,
        x: isMobile ? 0 : 50,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        clearProps: 'transform'
      });
      gsap.from('#hero-3d-canvas',{ opacity: 0, scale: 0.75, duration: 1.1, delay: 0.3, ease: 'back.out(1.4)' });
    } catch(e) {
      console.warn('Hero entrance error:', e);
    }
  }

  _scrollReveal() {
    if (typeof ScrollTrigger === 'undefined') return;

    try {
      ScrollTrigger.batch('.reveal-up, .reveal-left, .reveal-right, .reveal-scale', {
        start: 'top 95%',
        onEnter: (batch) => {
          batch.forEach(el => el.classList.add('visible'));
        },
        once: true
      });
    } catch (e) {
      console.warn('ScrollTrigger batch error:', e);
    }
  }

  _skillsScanlineTrigger() {
    if (typeof ScrollTrigger === 'undefined') return;
    const skillsZone = document.querySelector('.skills-highlight-zone');
    const scanline = document.querySelector('.skills-scanline');
    if (!skillsZone || !scanline) return;

    ScrollTrigger.create({
      trigger: skillsZone,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        scanline.classList.add('scanning');
      }
    });
  }
}

// =============================================================
// CANVAS-CONFETTI  (Planning V5.0 — 2D FX & Particles Layer)
// Library: github.com/catdad/canvas-confetti
// =============================================================
function initConfettiFX() {
  if (typeof confetti === 'undefined') return;
  document.querySelectorAll('.cert-card, .achievement-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const rect = card.getBoundingClientRect();
      confetti({
        particleCount: 80, spread: 75,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ['#00f0ff', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
        ticks: 220, scalar: 0.9
      });
    });
  });
  const awardsTitle = document.querySelector('#awards .section-title');
  if (awardsTitle && typeof awardsTitle.addEventListener === 'function') {
    awardsTitle.style.cursor = 'pointer';
    awardsTitle.title = 'Click for surprise!';
    awardsTitle.addEventListener('click', () => {
      confetti({ particleCount: 130, spread: 100, origin: { y: 0.5 },
        colors: ['#00f0ff', '#ec4899', '#f59e0b', '#8b5cf6'] });
    });
  }
}

// ============================================================
// HAMBURGER MENU TOGGLE (global for onclick attributes)
// ============================================================
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger-btn');
  if (!navLinks || !hamburger) return;
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger-btn');
  if (!navLinks || !hamburger) return;
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

// Close menu on outside click / Escape key
document.addEventListener('click', (e) => {
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger-btn');
  if (!navLinks || !hamburger) return;
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});


document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  const audio = new GameAudioEngine();
  window.gameAudio = audio;
  new CyberBackground();

  // ── Start Screen (Touch to Start Overlay) ──
  const startScreen = document.getElementById('start-screen');
  const startCanvas = new StartParticleCanvas('start-canvas');
  let startTriggered = false;

  function handleStart() {
    if (startTriggered) return;
    startTriggered = true;
    audio.startAudioSystem();
    triggerPixelCurtainTransition(() => {
      if (startCanvas) startCanvas.stop();
    });
    if (startScreen) startScreen.classList.add('hidden');
    setTimeout(() => {
      if (typeof checkScrollReveals === 'function') checkScrollReveals();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      if (window._gsapAnims && typeof window._gsapAnims._heroEntrance === 'function') window._gsapAnims._heroEntrance();
      if (window._heroThree && typeof window._heroThree._onResize === 'function') window._heroThree._onResize();
    }, 150);
  }

  if (startScreen) {
    startScreen.addEventListener('click', handleStart);
    window.addEventListener('keydown', () => handleStart(), { once: true });
    window.addEventListener('touchstart', () => handleStart(), { once: true });
  }

  const arcadeGame = new CyberpunkTetrisGame(audio);

  const startMinigameBtn = document.getElementById('start-minigame-btn');
  if (startMinigameBtn) {
    startMinigameBtn.addEventListener('click', () => {
      arcadeGame.start();
      startMinigameBtn.textContent = 'RETRY TETRIS';
    });
  }

  // Audio Toggles (Motion.dev Interactive Switches)
  const bgmBtn = document.getElementById('bgm-toggle');
  const sfxBtn = document.getElementById('sfx-toggle');

  if (bgmBtn) {
    bgmBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.toggleBGM(!audio.bgmEnabled);
      bgmBtn.classList.toggle('active', audio.bgmEnabled);
      bgmBtn.setAttribute('aria-checked', audio.bgmEnabled ? 'true' : 'false');
      const eq = document.getElementById('audio-eq');
      if (eq) eq.classList.toggle('paused', !audio.bgmEnabled);
    });
  }

  if (sfxBtn) {
    sfxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.sfxEnabled = !audio.sfxEnabled;
      sfxBtn.classList.toggle('active', audio.sfxEnabled);
      sfxBtn.setAttribute('aria-checked', audio.sfxEnabled ? 'true' : 'false');
    });
  }

  // EXP Scroll Progress Bar
  const expBar = document.getElementById('exp-progress-bar');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (expBar) expBar.style.width = `${progress}%`;
  });

  // Dynamic Header Typing Effect
  const typingElement = document.getElementById('hero-typing');
  if (typingElement) {
    const phrases = [
      'Unity Lead Game Developer',
      'Game Programmer (C#)',
      'Multiplayer & Cloud Specialist',
      'Mobile Performance Optimizer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let speed = isDeleting ? 40 : 80;
      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }
      setTimeout(typeEffect, speed);
    }
    typeEffect();
  }

  // SFX for Interactive Elements
  document.querySelectorAll('a, button, .project-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => audio.playHover());
    el.addEventListener('click', () => audio.playClick());
  });

  // 3D Tilt Effect on Project Cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((rect.height / 2) - y) / 15;
      const rotateY = (x - (rect.width / 2)) / 15;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Project Filtering & Sorting Engine
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('project-sort-select');
  const projectsGrid = document.querySelector('.projects-grid');
  const projectCards = document.querySelectorAll('.project-card');
  
  let currentFilter = 'favorite';
  let currentSort = 'featured';

  function applyFilterAndSort() {
    if (!projectsGrid) return;
    const cards = Array.from(document.querySelectorAll('.project-card'));
    
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const isFavorite = card.dataset.favorite === 'true';
      let visible = false;

      if (currentFilter === 'all') {
        visible = true;
      } else if (currentFilter === 'favorite') {
        visible = isFavorite;
      } else if (currentFilter === 'Multiplayer') {
        visible = category.includes('Multiplayer');
      } else if (currentFilter === 'Simulation') {
        visible = category.includes('Simulation') || category.includes('Tycoon');
      } else if (currentFilter === 'Action / Shooter') {
        visible = category.includes('Action') || category.includes('Shooter');
      } else {
        visible = category.toLowerCase().includes(currentFilter.toLowerCase());
      }

      card.style.display = visible ? 'flex' : 'none';
    });

    const sortedCards = cards.sort((a, b) => {
      if (currentSort === 'featured') {
        const rankA = parseInt(a.dataset.rank || '99', 10);
        const rankB = parseInt(b.dataset.rank || '99', 10);
        return rankA - rankB;
      } else if (currentSort === 'newest') {
        const yearA = parseInt(a.dataset.year || '2000', 10);
        const yearB = parseInt(b.dataset.year || '2000', 10);
        return yearB - yearA;
      } else if (currentSort === 'oldest') {
        const yearA = parseInt(a.dataset.year || '2000', 10);
        const yearB = parseInt(b.dataset.year || '2000', 10);
        return yearA - yearB;
      } else if (currentSort === 'alpha') {
        const titleA = a.querySelector('.project-title')?.textContent.trim() || '';
        const titleB = b.querySelector('.project-title')?.textContent.trim() || '';
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    sortedCards.forEach(card => projectsGrid.appendChild(card));
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      applyFilterAndSort();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilterAndSort();
    });
  }

  // Initial filter run (defaults to Favorites & Flagships)
  applyFilterAndSort();

  // Modal Popup Handlers
  // Modal Popup & Media Streaming Handlers
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalMediaTabs = document.getElementById('modal-media-tabs');
  const modalVideoContainer = document.getElementById('modal-video-container');
  const modalPreview = document.getElementById('modal-preview');
  const modalPlayOverlay = document.getElementById('modal-play-overlay');

  let currentModalProject = null;

  function stopAndUnloadVideo() {
    if (modalVideoContainer) {
      modalVideoContainer.classList.remove('active');
      modalVideoContainer.innerHTML = '';
    }
    if (modalMediaTabs) {
      modalMediaTabs.querySelectorAll('.media-tab-btn').forEach(b => b.classList.remove('active'));
      const imgBtn = document.getElementById('btn-tab-image');
      if (imgBtn) imgBtn.classList.add('active');
    }
    if (modalPreview) modalPreview.style.display = 'block';
  }

  function playProjectVideo(videoIndex = 0) {
    if (!currentModalProject || !currentModalProject.videos || !currentModalProject.videos[videoIndex]) return;
    const vid = currentModalProject.videos[videoIndex];

    if (modalPreview) modalPreview.style.display = 'none';

    if (modalVideoContainer) {
      modalVideoContainer.classList.add('active');
      if (vid.type === 'mp4') {
        modalVideoContainer.innerHTML = `
          <video class="modal-video-player" src="${vid.src}" controls autoplay playsinline></video>
        `;
      } else {
        modalVideoContainer.innerHTML = `
          <iframe class="modal-video-iframe" src="${vid.src}" style="width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
        `;
      }
    }

    if (modalMediaTabs) {
      modalMediaTabs.querySelectorAll('.media-tab-btn').forEach(b => b.classList.remove('active'));
      const targetBtn = modalMediaTabs.querySelector(`.tab-video-btn[data-video-idx="${videoIndex}"]`);
      if (targetBtn) targetBtn.classList.add('active');
    }
  }

  function closeModal() {
    stopAndUnloadVideo();
    currentModalProject = null;
    modalBackdrop?.classList.remove('active');
  }

  if (modalPlayOverlay) {
    modalPlayOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      playProjectVideo(0);
    });
  }
  
  function renderMediaTabs(data) {
    if (!modalMediaTabs) return;

    if (!data.videos || data.videos.length === 0) {
      modalMediaTabs.style.display = 'none';
      if (modalPlayOverlay) modalPlayOverlay.style.display = 'none';
      return;
    }

    modalMediaTabs.style.display = 'flex';
    if (modalPlayOverlay) {
      modalPlayOverlay.style.display = 'inline-flex';
      modalPlayOverlay.textContent = data.videos.length > 1
        ? `▶ STREAM: ${data.videos[0].label}`
        : '▶ STREAM VIDEO GAMEPLAY';
    }

    // Build tabs HTML: Image Tab + Video Tab(s)
    let tabsHtml = `
      <button id="btn-tab-image" class="media-tab-btn active" type="button">
        📷 SCREENSHOTS & ART
      </button>
    `;

    data.videos.forEach((vid, index) => {
      tabsHtml += `
        <button class="media-tab-btn tab-video-btn" data-video-idx="${index}" type="button">
          ▶ ${vid.label || 'STREAM VIDEO'}
        </button>
      `;
    });

    modalMediaTabs.innerHTML = tabsHtml;

    // Attach click listeners to tabs
    const imgBtn = document.getElementById('btn-tab-image');
    if (imgBtn) {
      imgBtn.addEventListener('click', () => {
        stopAndUnloadVideo();
      });
    }

    modalMediaTabs.querySelectorAll('.tab-video-btn').forEach(vBtn => {
      vBtn.addEventListener('click', () => {
        const idx = parseInt(vBtn.dataset.videoIdx, 10);
        playProjectVideo(idx);
      });
    });
  }

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;
    currentModalProject = data;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-role').textContent = data.role;
    document.getElementById('modal-platform').textContent = data.platform;
    const yearEl = document.getElementById('modal-year');
    if (yearEl) yearEl.textContent = data.year;
    
    document.getElementById('modal-desc').textContent = data.description;
    
    // Stop any active video & render appropriate media tabs
    stopAndUnloadVideo();
    renderMediaTabs(data);

    // Preview Image or Gradient
    const previewEl = document.getElementById('modal-preview');
    if (previewEl) {
      if (data.coverImage) {
        previewEl.style.backgroundImage = `url('${data.coverImage}')`;
        previewEl.style.backgroundSize = 'cover';
        previewEl.style.backgroundPosition = 'center';
      } else {
        previewEl.style.backgroundImage = 'none';
        previewEl.style.background = data.bgGradient || 'linear-gradient(135deg, #1f2937, #111827)';
      }
    }

    // Gallery Thumbnails (if multiple screenshots exist)
    const gallerySec = document.getElementById('modal-gallery-section');
    const galleryEl = document.getElementById('modal-gallery');
    if (gallerySec && galleryEl) {
      if (data.screenshots && data.screenshots.length > 1) {
        gallerySec.style.display = 'block';
        galleryEl.innerHTML = data.screenshots.map((imgSrc, idx) => `
          <div class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" 
               style="background-image: url('${imgSrc}')" 
               title="Click to preview image"
               data-src="${imgSrc}"></div>
        `).join('');
        
        galleryEl.querySelectorAll('.gallery-thumb-item').forEach(thumb => {
          thumb.addEventListener('click', () => {
            stopAndUnloadVideo();
            galleryEl.querySelectorAll('.gallery-thumb-item').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (previewEl) {
              previewEl.style.backgroundImage = `url('${thumb.dataset.src}')`;
            }
          });
        });
      } else {
        gallerySec.style.display = 'none';
        galleryEl.innerHTML = '';
      }
    }
    
    // Highlights / What I Built
    const highlightsEl = document.getElementById('modal-highlights');
    if (highlightsEl && data.highlights) {
      highlightsEl.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');
    }

    // Collaboration Section
    const collabSec = document.getElementById('modal-collab-section');
    const collabEl = document.getElementById('modal-collab');
    if (collabEl && collabSec) {
      if (data.collaboration) {
        collabSec.style.display = 'block';
        collabEl.textContent = data.collaboration;
      } else {
        collabSec.style.display = 'none';
      }
    }

    // Key Takeaway Section
    const takeawaySec = document.getElementById('modal-takeaway-section');
    const takeawayEl = document.getElementById('modal-takeaway');
    if (takeawayEl && takeawaySec) {
      if (data.takeaway) {
        takeawaySec.style.display = 'block';
        takeawayEl.textContent = data.takeaway;
      } else {
        takeawaySec.style.display = 'none';
      }
    }

    // Tools Used Section
    const toolsSec = document.getElementById('modal-tools-section');
    const toolsEl = document.getElementById('modal-tools');
    if (toolsEl && toolsSec) {
      if (data.toolsUsed && data.toolsUsed.length > 0) {
        toolsSec.style.display = 'block';
        toolsEl.innerHTML = data.toolsUsed.map(t => `<span class="tool-tag-item">${t}</span>`).join('');
      } else {
        toolsSec.style.display = 'none';
      }
    }

    // Tech Stack
    const techEl = document.getElementById('modal-tech');
    if (techEl && data.tech) {
      techEl.innerHTML = data.tech.map(t => `<span class="tag-item">${t}</span>`).join('');
    }
    
    // Dynamic Action Links (Clean external store/build links only)
    const actionsContainer = document.getElementById('modal-actions');
    if (actionsContainer) {
      if (data.links && data.links.length > 0) {
        actionsContainer.innerHTML = data.links.map(l => `
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="${l.class || 'btn-hud btn-hud-green'}">
            ${l.text}
          </a>
        `).join('');
      } else {
        actionsContainer.innerHTML = `
          <a href="${data.linkUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn-hud btn-hud-green">
            ${data.linkText || 'VIEW PROJECT DETAILS'}
          </a>
        `;
      }
    }
    
    modalBackdrop.classList.add('active');
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.projectId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.projectId);
      }
    });
  });

  // Keyboard Section Shortcuts (Keys 1 to 7)
  const navSectionIds = ['about', 'projects', 'skills', 'experience', 'awards', 'minigame-section', 'contact'];
  window.addEventListener('keydown', (e) => {
    // Ignore keypress when typing in input/textarea or inside modal
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (modalBackdrop?.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      return;
    }
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 7) {
      const targetSec = document.getElementById(navSectionIds[num - 1]);
      if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Konami Code Easter Egg
  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIndex = 0;
  window.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        alert('GOD MODE ACTIVATED! Welcome Unity Lead Developer Dimas Rizky AF.');
        document.body.style.filter = 'hue-rotate(90deg)';
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // ── Scroll Reveal Engine (IntersectionObserver + Direct Viewport Checks) ──
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  
  window.checkScrollReveals = function() {
    const triggerBottom = window.innerHeight * 0.95;
    revealEls.forEach(el => {
      if (el.classList.contains('visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= triggerBottom) {
        el.classList.add('visible');
      }
    });
  };

  // Run immediately on page load, and on scroll or resize
  window.checkScrollReveals();
  window.addEventListener('scroll', window.checkScrollReveals, { passive: true });
  window.addEventListener('resize', window.checkScrollReveals, { passive: true });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '100px 0px 100px 0px' });

    revealEls.forEach(el => {
      if (!el.classList.contains('visible')) {
        revealObserver.observe(el);
      }
    });

    const skillsZoneEl = document.querySelector('.skills-highlight-zone');
    const skillsScanlineEl = document.querySelector('.skills-scanline');
    if (skillsZoneEl && skillsScanlineEl) {
      const scanObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skillsScanlineEl.classList.add('scanning');
            scanObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      scanObserver.observe(skillsZoneEl);
    }
  }

  // ── Initialize 3D Engine & GSAP Animations ──
  if (typeof THREE !== 'undefined' && !window._heroThree) {
    try { window._heroThree = new HeroThreeScene(); } catch(e) { console.warn('Three.js scene init:', e); }
  }

  if (typeof gsap !== 'undefined' && !window._gsapAnims) {
    try { window._gsapAnims = new GSAPAnimations(); } catch(e) { console.warn('GSAP anims init:', e); }
  }

  initConfettiFX();

  window.addEventListener('load', () => {
    if (!window._heroThree && typeof THREE !== 'undefined') {
      try { window._heroThree = new HeroThreeScene(); } catch(e) {}
    }
    if (!window._gsapAnims && typeof gsap !== 'undefined') {
      try { window._gsapAnims = new GSAPAnimations(); } catch(e) {}
    }
    window.checkScrollReveals();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
});

// =============================================================
