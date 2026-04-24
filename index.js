// styled-components references DOM APIs even in the /native build.
// New Architecture Hermes throws ReferenceError instead of returning undefined.
// Provide a minimal shim so the library initialises without crashing.
if (typeof global.document === 'undefined') {
  const noop = () => {};
  const noopEl = { setAttribute: noop, appendChild: noop, removeChild: noop, style: {} };
  global.document = {
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ ...noopEl }),
    createElementNS: () => ({ ...noopEl }),
    createTextNode: () => ({}),
    head: { ...noopEl, appendChild: noop, removeChild: noop },
    body: { ...noopEl, appendChild: noop, removeChild: noop },
  };
}

require('expo-router/entry');
