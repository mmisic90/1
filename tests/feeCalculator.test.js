import { describe, it, expect } from 'vitest';
import {
  baseFeeForValue,
  calculateFee,
  requiresValue,
  formatBAM
} from '../src/feeCalculator.js';

describe('baseFeeForValue', () => {
  it('returns lowest tier for very small disputes', () => {
    expect(baseFeeForValue(100)).toBe(60);
    expect(baseFeeForValue(0)).toBe(60);
  });

  it('returns correct tier for mid-range values', () => {
    expect(baseFeeForValue(1500)).toBe(180);
    expect(baseFeeForValue(5000)).toBe(240);
    expect(baseFeeForValue(9999)).toBe(360);
  });

  it('returns highest tier for very large disputes', () => {
    expect(baseFeeForValue(1000000)).toBe(2400);
  });

  it('handles invalid input by falling back to lowest tier', () => {
    expect(baseFeeForValue(-100)).toBe(60);
    expect(baseFeeForValue(NaN)).toBe(60);
    expect(baseFeeForValue('not a number')).toBe(60);
  });
});

describe('requiresValue', () => {
  it('returns true for parnicni, vanparnicni, upravni', () => {
    expect(requiresValue('parnicni')).toBe(true);
    expect(requiresValue('vanparnicni')).toBe(true);
    expect(requiresValue('upravni')).toBe(true);
  });

  it('returns false for fixed-fee types', () => {
    expect(requiresValue('krivicni')).toBe(false);
    expect(requiresValue('prekrsajni')).toBe(false);
    expect(requiresValue('konsultacija')).toBe(false);
  });
});

describe('calculateFee', () => {
  it('calculates parnični fee with multiplier 1.0', () => {
    const r = calculateFee({ type: 'parnicni', value: 5000, actions: 1 });
    expect(r.perAction).toBe(240);
    expect(r.actions).toBe(1);
    expect(r.subtotal).toBe(240);
    expect(r.vat).toBe(Math.round(240 * 0.17));
    expect(r.total).toBe(r.subtotal + r.vat);
    expect(r.usesValue).toBe(true);
  });

  it('multiplies by number of actions', () => {
    const r = calculateFee({ type: 'parnicni', value: 5000, actions: 4 });
    expect(r.subtotal).toBe(240 * 4);
  });

  it('applies krivični multiplier of 1.25 over fixed base', () => {
    const r = calculateFee({ type: 'krivicni', value: 99999, actions: 2 });
    expect(r.perAction).toBe(Math.round(100 * 1.25));
    expect(r.subtotal).toBe(r.perAction * 2);
    expect(r.usesValue).toBe(false);
  });

  it('applies konsultacija multiplier of 0.25', () => {
    const r = calculateFee({ type: 'konsultacija', value: 0, actions: 1 });
    expect(r.perAction).toBe(Math.round(100 * 0.25));
    expect(r.usesValue).toBe(false);
  });

  it('floors actions to at least 1', () => {
    const r = calculateFee({ type: 'parnicni', value: 5000, actions: 0 });
    expect(r.actions).toBe(1);
    const r2 = calculateFee({ type: 'parnicni', value: 5000, actions: -5 });
    expect(r2.actions).toBe(1);
  });

  it('throws for unknown type', () => {
    expect(() => calculateFee({ type: 'nepostojece', value: 100, actions: 1 }))
      .toThrow(/Nepoznata vrsta postupka/);
  });

  it('returns translated type label', () => {
    expect(calculateFee({ type: 'parnicni', value: 5000, actions: 1 }).typeLabel).toBe('parničnom');
    expect(calculateFee({ type: 'krivicni', value: 0, actions: 1 }).typeLabel).toBe('krivičnom');
  });
});

describe('formatBAM', () => {
  it('formats numbers as BAM currency', () => {
    const result = formatBAM(1234);
    expect(result).toMatch(/1[.\s]?234/);
    expect(result).toMatch(/KM|BAM/);
  });
});
