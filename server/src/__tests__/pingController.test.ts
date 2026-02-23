import { describe, it, expect } from 'vitest';
import { PingController } from '../controllers/pingController';

describe('PingController', () => {
    it('should return a welcome message and version', () => {
        const controller = new PingController();
        const result = controller.hello();

        expect(result).toBeDefined();
        expect(result.message).toBe(
            'This is the timeclicker server. Documentation can be found under ./docs'
        );
        expect(result.version).toBeDefined();
        expect(typeof result.version).toBe('string');
    });

    it('should have a version in semver format', () => {
        const controller = new PingController();
        const result = controller.hello();

        // Check if version matches semver pattern (e.g., 1.0.0, 3.0.1)
        const semverPattern = /^\d+\.\d+\.\d+$/;
        expect(result.version).toMatch(semverPattern);
    });
});
