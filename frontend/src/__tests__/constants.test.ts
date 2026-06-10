/**
 * Tests for emission factor constants and client-side calculations.
 */

import { describe, it, expect } from 'vitest';
import {
  TRANSPORT_FACTORS,
  ELECTRICITY_FACTOR,
  FLIGHT_FACTORS,
  FOOD_FACTORS,
  SHOPPING_FACTORS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../constants/emissionFactors';

describe('Emission Factor Constants', () => {
  it('should have correct transport factors', () => {
    expect(TRANSPORT_FACTORS.car).toBe(0.19);
    expect(TRANSPORT_FACTORS.bus).toBe(0.08);
    expect(TRANSPORT_FACTORS.train).toBe(0.04);
    expect(TRANSPORT_FACTORS.bike).toBe(0.10);
  });

  it('should have correct electricity factor', () => {
    expect(ELECTRICITY_FACTOR).toBe(0.82);
  });

  it('should have correct flight factors', () => {
    expect(FLIGHT_FACTORS.domestic).toBe(255.0);
    expect(FLIGHT_FACTORS.international).toBe(1100.0);
  });

  it('should have all food types', () => {
    expect(FOOD_FACTORS['vegan']).toBeDefined();
    expect(FOOD_FACTORS['vegetarian']).toBeDefined();
    expect(FOOD_FACTORS['non-vegetarian']).toBeDefined();
  });

  it('should have vegan as lowest food emission', () => {
    expect(FOOD_FACTORS['vegan']).toBeLessThan(FOOD_FACTORS['vegetarian']);
    expect(FOOD_FACTORS['vegetarian']).toBeLessThan(FOOD_FACTORS['non-vegetarian']);
  });

  it('should have all shopping levels', () => {
    expect(SHOPPING_FACTORS['low']).toBeDefined();
    expect(SHOPPING_FACTORS['medium']).toBeDefined();
    expect(SHOPPING_FACTORS['high']).toBeDefined();
  });

  it('should have low as lowest shopping emission', () => {
    expect(SHOPPING_FACTORS['low']).toBeLessThan(SHOPPING_FACTORS['medium']);
    expect(SHOPPING_FACTORS['medium']).toBeLessThan(SHOPPING_FACTORS['high']);
  });

  it('should have colors for all categories', () => {
    const categories = ['transport', 'electricity', 'flights', 'food', 'shopping'];
    categories.forEach((cat) => {
      expect(CATEGORY_COLORS[cat]).toBeDefined();
      expect(CATEGORY_LABELS[cat]).toBeDefined();
    });
  });
});

describe('Client-side Calculation', () => {
  it('should calculate transport emissions correctly', () => {
    const carKm = 500;
    const busKm = 200;
    const expected = carKm * TRANSPORT_FACTORS.car + busKm * TRANSPORT_FACTORS.bus;
    expect(expected).toBeCloseTo(111); // 95 + 16
  });

  it('should calculate electricity emissions correctly', () => {
    const kwh = 300;
    const expected = kwh * ELECTRICITY_FACTOR;
    expect(expected).toBeCloseTo(246);
  });

  it('should calculate monthly flight emissions', () => {
    const domestic = 4;
    const intl = 1;
    const annualEmissions =
      domestic * FLIGHT_FACTORS.domestic + intl * FLIGHT_FACTORS.international;
    const monthly = annualEmissions / 12;
    expect(monthly).toBeCloseTo(176.67, 1);
  });
});
