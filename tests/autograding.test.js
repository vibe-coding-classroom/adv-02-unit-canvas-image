const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Canvas Image Processing Autograding', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
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
        // First ensure we have data
        await page.waitForTimeout(1000);
        
        // Toggle grayscale filter
        await page.click('#btn-grayscale');
        await page.waitForTimeout(1000); // Wait for processing

        const result = await page.evaluate(() => {
            const canvas = document.getElementById('image-canvas');
            const ctx = canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, 50, 50).data; // Larger sample
            
            let isGrayscale = true;
            let hasData = false;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];
                const a = data[i+3];

                if (a > 0) hasData = true;

                // Check if R, G, B are equal (or very close due to rounding/precision)
                if (Math.abs(r - g) > 2 || Math.abs(g - b) > 2) {
                    isGrayscale = false;
                    break;
                }
            }
            return { isGrayscale, hasData };
        });

        expect(result.hasData).toBe(true);
        expect(result.isGrayscale).toBe(true);
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
        await page.mouse.move(150, 150);
        await page.waitForTimeout(500);

        const { uiHasContent, imageHasContent } = await page.evaluate(() => {
            const uiCanvas = document.getElementById('ui-canvas');
            const imgCanvas = document.getElementById('image-canvas');
            
            const checkContent = (canvas) => {
                const ctx = canvas.getContext('2d');
                const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i+3] > 0) return true;
                }
                return false;
            };

            return {
                uiHasContent: checkContent(uiCanvas),
                imageHasContent: checkContent(imgCanvas)
            };
        });

        expect(uiHasContent).toBe(true);
        expect(imageHasContent).toBe(true);
    });
});
