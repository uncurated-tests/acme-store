import { describe, it, expect } from 'vitest';
import { calculateSubtotal } from '../lib/discounts';
import type { CartItem } from '../lib/discounts';

describe('discounts', () => {
  describe('calculateSubtotal', () => {
    it('should calculate subtotal correctly', () => {
      const items: CartItem[] = [
        { productId: '1', name: 'Test', price: 10, quantity: 2, category: 'test' },
      ];
      expect(calculateSubtotal(items)).toBe(20);
    });
  });
});
