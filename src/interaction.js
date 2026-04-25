/**
 * src/interaction.js
 * UI: Crosshairs, data annotation, and interaction logic.
 */

export class Interaction {
    constructor(uiCanvas, statsDisplay) {
        this.canvas = uiCanvas;
        this.ctx = uiCanvas.getContext('2d');
        this.stats = statsDisplay; // { coords, rgb, index }
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.isHovering = false;

        this.init();
    }

    init() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            this.isHovering = true;
            this.updateStats();
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isHovering = false;
        });
    }

    updateStats() {
        if (!this.stats) return;
        this.stats.coords.textContent = `${Math.round(this.mouseX)}, ${Math.round(this.mouseY)}`;
    }

    /**
     * Draw UI overlays (Crosshairs, etc.)
     * Separated from the image processing layer.
     */
    drawOverlay(imageData) {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        if (!this.isHovering) return;

        // Draw crosshair
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        // Horizontal line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.mouseY);
        this.ctx.lineTo(width, this.mouseY);
        this.ctx.stroke();

        // Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX, 0);
        this.ctx.lineTo(this.mouseX, height);
        this.ctx.stroke();

        // Draw circle at intersection
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 10, 0, Math.PI * 2);
        this.ctx.stroke();

        // Update RGB stats if imageData is provided
        if (imageData) {
            const x = Math.floor(this.mouseX * (imageData.width / width));
            const y = Math.floor(this.mouseY * (imageData.height / height));
            const index = (y * imageData.width + x) * 4;
            
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];

            this.stats.rgb.textContent = `${r}, ${g}, ${b}`;
            this.stats.index.textContent = index;
            
            // Draw data tooltip
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            this.ctx.fillRect(this.mouseX + 15, this.mouseY + 15, 120, 50);
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.strokeRect(this.mouseX + 15, this.mouseY + 15, 120, 50);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px JetBrains Mono';
            this.ctx.fillText(`X: ${x} Y: ${y}`, this.mouseX + 25, this.mouseY + 30);
            this.ctx.fillText(`RGB: ${r},${g},${b}`, this.mouseX + 25, this.mouseY + 45);
        }
    }

    /**
     * Task 3: Extract ROI (100x100)
     */
    extractROI(imageCanvas) {
        const roiSize = 100;
        const x = Math.max(0, Math.min(this.mouseX - roiSize/2, imageCanvas.width - roiSize));
        const y = Math.max(0, Math.min(this.mouseY - roiSize/2, imageCanvas.height - roiSize));
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = roiSize;
        tempCanvas.height = roiSize;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(imageCanvas, x, y, roiSize, roiSize, 0, 0, roiSize, roiSize);
        const dataURL = tempCanvas.toDataURL();
        
        console.log('--- ROI Extracted ---');
        console.log(`Position: (${Math.round(x)}, ${Math.round(y)})`);
        console.log(`Base64 Data: ${dataURL.substring(0, 50)}...`);
        return dataURL;
    }
}
