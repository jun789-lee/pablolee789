/**
 * Space Background - Stars, Gravity Effect, and Shooting Stars
 */

class SpaceBackground {
  constructor() {
    this.canvas = document.getElementById('space-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.mouse = { x: null, y: null };
    this.scrollY = 0;
    
    this.config = {
      starCount: 200,
      starMinSize: 0.5,
      starMaxSize: 2.5,
      gravityRadius: 150,
      gravityStrength: 0.02,
      shootingStarInterval: 4000, // ms
      parallaxFactor: 0.3
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createStars();
    this.bindEvents();
    this.scheduleShootingStar();
    this.animate();
  }
  
  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }
  
  createStars() {
    this.stars = [];
    for (let i = 0; i < this.config.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 2, // Extended for scroll
        baseX: 0,
        baseY: 0,
        size: Math.random() * (this.config.starMaxSize - this.config.starMinSize) + this.config.starMinSize,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0
      });
      // Store original position
      this.stars[i].baseX = this.stars[i].x;
      this.stars[i].baseY = this.stars[i].y;
    }
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
    
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });
  }
  
  scheduleShootingStar() {
    const spawn = () => {
      this.createShootingStar();
      // Random interval between 3-8 seconds
      const nextInterval = 3000 + Math.random() * 5000;
      setTimeout(spawn, nextInterval);
    };
    setTimeout(spawn, 2000); // First one after 2 seconds
  }
  
  createShootingStar() {
    const startX = Math.random() * this.width * 0.8;
    const startY = Math.random() * this.height * 0.3;
    
    this.shootingStars.push({
      x: startX,
      y: startY,
      length: 80 + Math.random() * 60,
      speed: 15 + Math.random() * 10,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3, // ~45 degrees with variance
      opacity: 1,
      trail: []
    });
  }
  
  updateStars() {
    const time = Date.now() * 0.001;
    
    this.stars.forEach(star => {
      // Twinkle effect
      star.opacity = 0.3 + Math.sin(time * star.twinkleSpeed * 10 + star.twinklePhase) * 0.3;
      
      // Gravity effect towards mouse
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - star.x;
        const dy = this.mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.gravityRadius) {
          const force = (1 - distance / this.config.gravityRadius) * this.config.gravityStrength;
          star.vx += dx * force;
          star.vy += dy * force;
        }
      }
      
      // Apply velocity
      star.x += star.vx;
      star.y += star.vy;
      
      // Friction / return to base position
      star.vx *= 0.95;
      star.vy *= 0.95;
      
      // Slowly drift back to original position
      star.x += (star.baseX - star.x) * 0.01;
      star.y += (star.baseY - star.y) * 0.01;
    });
  }
  
  updateShootingStars() {
    this.shootingStars = this.shootingStars.filter(ss => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity -= 0.015;
      
      // Add trail point
      ss.trail.push({ x: ss.x, y: ss.y, opacity: ss.opacity });
      if (ss.trail.length > 15) ss.trail.shift();
      
      return ss.opacity > 0 && ss.x < this.width + 100 && ss.y < this.height + 100;
    });
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw stars with parallax
    this.stars.forEach(star => {
      const parallaxY = star.y - this.scrollY * this.config.parallaxFactor;
      const wrappedY = ((parallaxY % (this.height * 2)) + this.height * 2) % (this.height * 2) - this.height * 0.5;
      
      if (wrappedY > -10 && wrappedY < this.height + 10) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, wrappedY, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        this.ctx.fill();
      }
    });
    
    // Draw shooting stars
    this.shootingStars.forEach(ss => {
      // Draw trail
      ss.trail.forEach((point, i) => {
        const trailOpacity = (i / ss.trail.length) * point.opacity * 0.8;
        const trailSize = (i / ss.trail.length) * 2;
        
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
        this.ctx.fill();
      });
      
      // Draw head
      const gradient = this.ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 4);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      this.ctx.beginPath();
      this.ctx.arc(ss.x, ss.y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });
  }
  
  animate() {
    this.updateStars();
    this.updateShootingStars();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SpaceBackground();
});
