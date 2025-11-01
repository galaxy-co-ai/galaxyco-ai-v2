import React from 'react';
import { describe, it, expect } from 'vitest';
import { Button } from '../components/ui/button';

describe('Button Import Test', () => {
  it('imports Button without error', () => {
    expect(Button).toBeDefined();
    // Button is a forwardRef component, so it's an object not a function
    expect(typeof Button).toBe('object');
  });
});
