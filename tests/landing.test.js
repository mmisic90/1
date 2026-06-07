import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');

let doc;
beforeAll(() => {
  doc = new DOMParser().parseFromString(html, 'text/html');
});

describe('landing page structure', () => {
  it('has the documented sections', () => {
    expect(doc.querySelector('nav')).not.toBeNull();
    expect(doc.getElementById('hero')).not.toBeNull();
    expect(doc.getElementById('about')).not.toBeNull();
    expect(doc.getElementById('oblasti')).not.toBeNull();
  });

  it('every in-page anchor except #kontakt resolves to an element', () => {
    const targets = [...doc.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute('href').slice(1))
      .filter((id) => id && id !== 'kontakt');
    targets.forEach((id) => {
      expect(doc.getElementById(id), `missing #${id}`).not.toBeNull();
    });
  });

  // Known debt (see CLAUDE.md): #kontakt is linked from nav + hero CTA but the
  // section does not exist yet. When the contact section is added, this test
  // will start failing and should be folded into the assertion above.
  it.fails('#kontakt section is not implemented yet', () => {
    expect(doc.querySelector('a[href="#kontakt"]')).not.toBeNull();
    expect(doc.getElementById('kontakt')).not.toBeNull();
  });

  // Known debt: the areas-of-law grid is present but empty (no .area-card).
  // When cards are added, remove `.fails` and assert the real count.
  it.fails('areas grid is populated with area cards', () => {
    const grid = doc.querySelector('#oblasti .areas-grid');
    expect(grid).not.toBeNull();
    expect(grid.querySelectorAll('.area-card').length).toBeGreaterThan(0);
  });
});
