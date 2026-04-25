/**
 * src/vision-engine.js
 * Main rendering loop and state management.
 */

import { Filters } from './filters.js';
import { Interaction } from './interaction.js';

class VisionEngine {
    constructor() {
        this.video = document.getElementById('video-source');
        this.imgCanvas = document.getElementById('image-canvas');
        this.uiCanvas = document.getElementById('ui-canvas');
        this.imgCtx = this.imgCanvas.getContext('2d', { willReadFrequently: true });
        
        this.stats = {
            fps: document.getElementById('stat-fps'),
            coords: document.getElementById('stat-coords'),
            rgb: document.getElementById('stat-rgb'),
            index: document.getElementById('stat-index')
        };

        this.interaction = new Interaction(this.uiCanvas, this.stats);
        
        this.activeFilters = {
            grayscale: false,
            mirror: false,
            invert: false,
            sepia: false
        };

        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;

        this.init();
    }

    async init() {
        // Setup Video Source (Using a placeholder or webcam)
        try {
            // Attempt to use webcam for "Real-time" feel
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
            this.video.srcObject = stream;
        } catch (err) {
            console.warn('Webcam not available, using placeholder image pattern.');
            // Fallback: If no webcam, we'll draw a test pattern in the loop
            this.useFallback = true;
        }

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('btn-grayscale').onclick = (e) => this.toggleFilter('grayscale', e.target);
        document.getElementById('btn-mirror').onclick = (e) => this.toggleFilter('mirror', e.target);
        document.getElementById('btn-invert').onclick = (e) => this.toggleFilter('invert', e.target);
        document.getElementById('btn-sepia').onclick = (e) => this.toggleFilter('sepia', e.target);
        
        document.getElementById('btn-roi').onclick = () => this.interaction.extractROI(this.imgCanvas);
        document.getElementById('btn-reset').onclick = () => this.resetFilters();
    }

    toggleFilter(name, btn) {
        this.activeFilters[name] = !this.activeFilters[name];
        btn.classList.toggle('active');
    }

    resetFilters() {
        Object.keys(this.activeFilters).forEach(k => this.activeFilters[k] = false);
        document.querySelectorAll('.button-grid button').forEach(b => b.classList.remove('active'));
    }

    updateFPS(now) {
        this.frameCount++;
        if (now - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
            this.stats.fps.textContent = this.fps;
        }
    }

    render(now = 0) {
        this.updateFPS(now);

        // Match canvas size to video/container
        const targetWidth = this.imgCanvas.clientWidth || 1280;
        const targetHeight = this.imgCanvas.clientHeight || 720;

        if (this.imgCanvas.width !== targetWidth || this.imgCanvas.height !== targetHeight) {
            this.imgCanvas.width = this.uiCanvas.width = targetWidth;
            this.imgCanvas.height = this.uiCanvas.height = targetHeight;
        }

        const { width, height } = this.imgCanvas;

        // 1. Draw source to canvas
        if (this.useFallback) {
            this.drawTestPattern(now);
        } else if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.imgCtx.drawImage(this.video, 0, 0, width, height);
        }

        // 2. Get pixel data and apply filters
        let imageData = this.imgCtx.getImageData(0, 0, width, height);
        
        if (this.activeFilters.grayscale) imageData = Filters.grayscale(imageData);
        if (this.activeFilters.invert) imageData = Filters.invert(imageData);
        if (this.activeFilters.sepia) imageData = Filters.sepia(imageData);
        if (this.activeFilters.mirror) imageData = Filters.mirror(imageData);

        // 3. Put processed data back
        this.imgCtx.putImageData(imageData, 0, 0);

        // 4. Draw UI Overlays (Top Layer)
        this.interaction.drawOverlay(imageData);

        requestAnimationFrame((t) => this.render(t));
    }

    drawTestPattern(now) {
        const { width, height } = this.imgCanvas;
        // Animated test pattern
        for (let x = 0; x < width; x += 20) {
            this.imgCtx.fillStyle = `hsl(${(x + now / 10) % 360}, 70%, 50%)`;
            this.imgCtx.fillRect(x, 0, 10, height);
        }
        this.imgCtx.fillStyle = '#fff';
        this.imgCtx.font = '20px Inter';
        this.imgCtx.fillText('TEST PATTERN (NO WEBCAM)', 20, 40);
    }
}

new VisionEngine();
