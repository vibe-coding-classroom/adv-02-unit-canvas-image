/**
 * src/filters.js
 * Core pixel-level manipulation algorithms.
 */

export const Filters = {
    /**
     * Task 1: Grayscale filter (R+G+B)/3
     */
    grayscale: (imageData) => {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // R
            data[i + 1] = avg; // G
            data[i + 2] = avg; // B
            // data[i+3] is Alpha, leave it unchanged
        }
        return imageData;
    },

    /**
     * Invert filter
     */
    invert: (imageData) => {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // R
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
        }
        return imageData;
    },

    /**
     * Sepia filter
     */
    sepia: (imageData) => {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
            data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
        }
        return imageData;
    },

    /**
     * Task 3: Mirror filter (Horizontal Flip)
     * Demonstrates coordinate mapping and O(N) array manipulation.
     */
    mirror: (imageData) => {
        const { width, height, data } = imageData;
        const temp = new Uint8ClampedArray(data.length);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const sourceIdx = (y * width + x) * 4;
                const targetIdx = (y * width + (width - 1 - x)) * 4;
                
                temp[targetIdx] = data[sourceIdx];         // R
                temp[targetIdx + 1] = data[sourceIdx + 1]; // G
                temp[targetIdx + 2] = data[sourceIdx + 2]; // B
                temp[targetIdx + 3] = data[sourceIdx + 3]; // A
            }
        }
        
        data.set(temp);
        return imageData;
    }
};
