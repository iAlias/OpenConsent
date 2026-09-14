'use strict';

const { loadCmp } = require('./support/load-cmp');

describe('BannerUI input sanitizers', () => {
  let ui;

  beforeAll(() => {
    ui = loadCmp().bannerUI;
  });

  test('escapeHtml neutralizes markup', () => {
    const escaped = ui.escapeHtml('<img src=x onerror="alert(1)">');
    expect(escaped).not.toContain('<img');
    expect(escaped).toContain('&lt;img');
  });

  test('sanitizeUrl allows only http(s) URLs', () => {
    expect(ui.sanitizeUrl('https://example.com/privacy')).toContain('https://example.com/privacy');
    expect(ui.sanitizeUrl('http://example.com/privacy')).toContain('http://example.com/privacy');
    expect(ui.sanitizeUrl('javascript:alert(1)')).toBe('');
    expect(ui.sanitizeUrl('data:text/html;base64,AAAA')).toBe('');
    expect(ui.sanitizeUrl('')).toBe('');
  });

  test('sanitizeColor accepts safe colors and rejects CSS injection', () => {
    expect(ui.sanitizeColor('#fff', '#000')).toBe('#fff');
    expect(ui.sanitizeColor('#1a2b3c', '#000')).toBe('#1a2b3c');
    expect(ui.sanitizeColor('rgb(255, 0, 0)', '#000')).toBe('rgb(255, 0, 0)');
    expect(ui.sanitizeColor('red', '#000')).toBe('red');
    expect(ui.sanitizeColor('red; background: url(http://evil)', '#000')).toBe('#000');
    expect(ui.sanitizeColor('', '#000')).toBe('#000');
  });
});
