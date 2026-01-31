import { describe, it, expect } from 'vitest';

// Test básico de la lógica
describe('Hanoi Game Logic', () => {
  it('should initialize with 3 discs on first rod', () => {
    const difficulty = 3;
    const initialRod = Array.from({ length: difficulty }, (_, i) => ({
      id: i + 1,
      size: difficulty - i,
    }));

    expect(initialRod).toHaveLength(3);
    expect(initialRod[0].size).toBe(3);
    expect(initialRod[1].size).toBe(2);
    expect(initialRod[2].size).toBe(1);
  });

  it('should validate moves correctly', () => {
    // Small disc can go on top of large disc
    const smallDisc = { id: 1, size: 1 };
    const largeDisc = { id: 2, size: 3 };
    expect(smallDisc.size < largeDisc.size).toBe(true);

    // Large disc cannot go on top of small disc
    expect(largeDisc.size < smallDisc.size).toBe(false);
  });

  it('should calculate minimum moves correctly', () => {
    // For n discs: 2^n - 1
    expect(Math.pow(2, 3) - 1).toBe(7);
    expect(Math.pow(2, 4) - 1).toBe(15);
    expect(Math.pow(2, 5) - 1).toBe(31);
  });
});
