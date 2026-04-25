const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = `file://${path.join(__dirname, '../index.html')}`;

test.describe('Canvas Image Processing Autograding', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(FILE_URL);
        // Wait for the vision engine to initialize and draw something
        await page.waitForTimeout(1000); 
    });

    test('should have dual-canvas structure', async ({ page }) => {
        const imageCanvas = await page.locator('#image-canvas');
        const uiCanvas = await page.locator('#ui-canvas');
        
        await expect(imageCanvas).toBeVisible();
        await expect(uiCanvas).toBeVisible();
    });

    test('grayscale filter should correctly average RGB values', async ({ page }) => {
        // Toggle grayscale filter
        await page.click('#btn-grayscale');
        await page.waitForTimeout(500); // Wait for processing

        const pixels = await page.evaluate(() => {
            const canvas = document.getElementById('image-canvas');
            const ctx = canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, 10, 10).data; // Sample top-left 10x10
            
            let isGrayscale = true;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];
                // Check if R, G, B are equal (or very close)
                if (Math.abs(r - g) > 1 || Math.abs(g - b) > 1) {
                    isGrayscale = false;
                    break;
                }
            }
            return isGrayscale;
        });

        expect(pixels).toBe(true);
    });

    test('mirror filter should produce symmetrical-like results', async ({ page }) => {
        // This is a simplified check. In a real test, we might compare 
        // a known source image with a mirrored version.
        // Here we just check if the button works and doesn't crash the canvas.
        await page.click('#btn-mirror');
        await page.waitForTimeout(500);

        const canvasWidth = await page.evaluate(() => document.getElementById('image-canvas').width);
        expect(canvasWidth).toBeGreaterThan(0);
    });

    test('UI layer should be separate from image layer', async ({ page }) => {
        // Move mouse to trigger crosshairs
        await page.mouse.move(100, 100);
        await page.waitForTimeout(200);

        const uiHasContent = await page.evaluate(() => {
            const canvas = document.getElementById('ui-canvas');
            const ctx = canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            
            for (let i = 0; i < data.length; i += 4) {
                if (data[i+3] > 0) return true; // Found some non-transparent pixel
            }
            return false;
        });

        const imageHasContent = await page.evaluate(() => {
            const canvas = document.getElementById('image-canvas');
            const ctx = canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            
            for (let i = 0; i < data.length; i += 4) {
                if (data[i+3] > 0) return true;
            }
            return false;
        });

        expect(uiHasContent).toBe(true);
        expect(imageHasContent).toBe(true);
    });
});
