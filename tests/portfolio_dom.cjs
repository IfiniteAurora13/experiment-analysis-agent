const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Isolated DOM double. No browser, GUI, network or user data is accessed.
class Element {
  constructor(tag = 'div') {
    this.tag = tag; this.children = []; this.listeners = {}; this._text = '';
    this.value = ''; this.checked = false; this.hidden = false; this.disabled = false;
  }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this._text = ''; this.children = children; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  trigger(name) {
    if (name === 'click' && this.disabled) return;
    this.listeners[name]?.call(this);
  }
  querySelectorAll(selector) { return this.children.filter(child => child.tag === selector); }
  click() { this.trigger('click'); }
  remove() {}
}

function page() {
  const elements = {};
  const get = id => elements[id] ??= new Element();
  get('categoryFilter').value = 'all';
  get('phaseRow').append(new Element('span'), new Element('span'), new Element('span'));
  const context = vm.createContext({
    window: {}, document: {getElementById: get, createElement: tag => new Element(tag), body: new Element('body')},
    Blob, URL: {createObjectURL: () => 'blob:local-test', revokeObjectURL() {}}, setTimeout: fn => fn(),
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../docs/data/replays.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../docs/app.js'), 'utf8'), context);
  return {
    get,
    select(scenario) { get('scenario').value = scenario; get('scenario').trigger('change'); },
    confirm() { get('acknowledge').checked = true; get('acknowledge').trigger('change'); get('confirmButton').trigger('click'); },
  };
}

test('no result or false quality pass before confirmation', () => {
  const p = page();
  assert.equal(p.get('decisionTitle').textContent, '请先确认口径与水位');
  assert.equal(p.get('confirmButton').disabled, true);
  assert.equal(p.get('metricGrid').hidden, true);
  assert.match(p.get('checkList').textContent, /未确认 \/ 未执行/);
});

test('confirmed normal task shows actual metrics', () => {
  const p = page(); p.confirm();
  assert.equal(p.get('decisionTitle').textContent, '可进入人工发布评审');
  assert.equal(p.get('metricGrid').hidden, false);
  assert.equal(p.get('coreValue').textContent, '15.00%');
  assert.equal(p.get('gmvTag').textContent, '边界以内');
});

test('new dirty source clears old metrics and cannot be confirmed', () => {
  const p = page(); p.confirm(); p.select('immature');
  assert.equal(p.get('metricGrid').hidden, true);
  assert.equal(p.get('decisionTitle').textContent, '数据包需要修复');
  assert.equal(p.get('confirmButton').disabled, true);
  assert.equal(p.get('repairButton').hidden, false);
  assert.equal(p.get('acknowledge').checked, false);
});

test('repair requires a new confirmation before returning to review', () => {
  const p = page(); p.select('cross_group'); p.get('repairButton').trigger('click');
  assert.equal(p.get('decisionTitle').textContent, '请先确认口径与水位');
  assert.equal(p.get('repairNote').hidden, false);
  assert.equal(p.get('metricGrid').hidden, true);
  p.confirm();
  assert.equal(p.get('decisionTitle').textContent, '可进入人工发布评审');
});

test('guardrail harm and uncertainty have distinct outcomes', () => {
  const p = page(); p.select('guardrail_harm'); p.confirm();
  assert.equal(p.get('decisionTitle').textContent, '不支持推进发布');
  assert.equal(p.get('gmvTag').textContent, '损失越界');
  p.select('guardrail_uncertain'); p.confirm();
  assert.equal(p.get('decisionTitle').textContent, '护栏证据不足');
  assert.equal(p.get('gmvTag').textContent, '尚不确定');
});

test('stale or withdrawn confirmation never displays an approved result', () => {
  const p = page();
  for (const scenario of ['stale_confirmation', 'withdrawn']) {
    p.select(scenario);
    assert.equal(p.get('decisionTitle').textContent, '请先确认口径与水位');
    assert.equal(p.get('metricGrid').hidden, true);
  }
  assert.match(p.get('historyList').textContent, /撤回本地评审卡/);
});

test('evaluation filters reflect the published case evidence', () => {
  const p = page();
  assert.equal(p.get('proofCases').textContent, '60');
  assert.equal(p.get('caseRows').children.length, 60);
  p.get('categoryFilter').value = 'risk_policy'; p.get('categoryFilter').trigger('change');
  assert.ok(p.get('caseRows').children.length >= 5);
  assert.match(p.get('caseRows').textContent, /C014/);
  assert.ok(!p.get('caseRows').textContent.includes('C002'));
});
