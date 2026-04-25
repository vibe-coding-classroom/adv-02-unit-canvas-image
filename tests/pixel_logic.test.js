/**
 * tests/pixel_logic.test.js
 * Unit tests for pixel manipulation logic.
 */

// Mock Filters (since we are not using a test runner like Vitest/Jest yet)
import { Filters } from '../src/filters.js';

function assert(condition, message) {
    if (!condition) {
        console.error('❌ FAILED:', message);
        return false;
    }
    console.log('✅ PASSED:', message);
    return true;
}

function testGrayscale() {
    console.log('\n--- Testing Grayscale Filter ---');
    // Create a mock 1x1 image (Red)
    const mockData = {
        width: 1,
        height: 1,
        data: new Uint8ClampedArray([255, 0, 0, 255])
    };
    
    Filters.grayscale(mockData);
    const avg = 255 / 3;
    assert(mockData.data[0] === avg && mockData.data[1] === avg && mockData.data[2] === avg, 
           `Red (255,0,0) should become (${avg},${avg},${avg})`);
}

function testMirror() {
    console.log('\n--- Testing Mirror Filter ---');
    // Create a mock 2x1 image [Red, Blue]
    const mockData = {
        width: 2,
        height: 1,
        data: new Uint8ClampedArray([
            255, 0, 0, 255, // Pixel 0 (Red)
            0, 0, 255, 255  // Pixel 1 (Blue)
        ])
    };
    
    Filters.mirror(mockData);
    assert(mockData.data[0] === 0 && mockData.data[4] === 255, 
           'Horizontal mirror should swap Red and Blue pixels');
}

// Run tests if called directly
if (typeof window === 'undefined') {
    testGrayscale();
    testMirror();
} else {
    window.runTests = () => {
        testGrayscale();
        testMirror();
    };
}
