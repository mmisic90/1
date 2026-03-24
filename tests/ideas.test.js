import { describe, it, expect } from 'vitest';
import ideas from '../src/ideas.js';

describe('ideas data', () => {
  it('contains 4 ideas', () => {
    expect(ideas.length).toBe(4);
  });

  it('each idea has required fields', () => {
    ideas.forEach((idea) => {
      expect(idea).toHaveProperty('title');
      expect(idea).toHaveProperty('tag');
      expect(idea).toHaveProperty('body');
    });
  });

  it('no idea has empty fields', () => {
    ideas.forEach((idea) => {
      expect(idea.title.length).toBeGreaterThan(0);
      expect(idea.tag.length).toBeGreaterThan(0);
      expect(idea.body.length).toBeGreaterThan(0);
    });
  });

  it('all titles are unique', () => {
    const titles = ideas.map((i) => i.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
