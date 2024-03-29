import { isRef, ref } from 'vue';

function makeError() {
  return new DOMException('The request is not allowed', 'NotAllowedError');
}

async function copyClipboardApi(text) {
  if (!navigator.clipboard) { throw makeError(); }
  return navigator.clipboard.writeText(text);
}

async function copyExecCommand(text) {
  const span = document.createElement('span');
  span.textContent = text;
  span.style.whiteSpace = 'pre';
  span.style.webkitUserSelect = 'auto';
  span.style.userSelect = 'all';
  document.body.appendChild(span);
  const selection = window.getSelection();
  const range = window.document.createRange();
  selection.removeAllRanges();
  range.selectNode(span);
  selection.addRange(range);
  let success = false;
  try {
    success = window.document.execCommand('copy');
  } finally {
    selection.removeAllRanges();
    window.document.body.removeChild(span);
  }
  if (!success) { throw makeError(); }
}

async function clipboardCopy(text) {
  try {
    await copyClipboardApi(text);
  } catch (err) {
    try {
      await copyExecCommand(text);
    } catch (err2) {
      throw err2 || err || makeError();
    }
  }
}

export const useClipboard = (delay = 3e3) => {
  const copied = ref(false);
  const copy = (text) => {
    let copyText;
    if (isRef(text)) {
      copyText = text.value;
    } else {
      copyText = text;
    }
    clipboardCopy(copyText).then(() => {
      copied.value = true;
      const timer = setTimeout(() => {
        copied.value = false;
        clearTimeout(timer);
      }, delay);
    });
  };
  return {
    copied,
    copy,
  };
};
