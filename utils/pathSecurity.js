const path = require('path');

function sanitizeFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return 'unnamed_file';
  }

  const cleaned = fileName
    .replace(/[\/\\]/g, '_')
    .replace(/\.{2,}/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .trim();

  const truncated = cleaned.substring(0, 255);
  return truncated.length > 0 ? truncated : 'unnamed_file';
}

function ensureSafeFileName(fileName, fallback = 'unnamed_file') {
  const sanitized = sanitizeFileName(fileName);
  const hasSafeChars = /[a-zA-Z0-9]/.test(sanitized);
  const startsWithSafeChar = /^[a-zA-Z0-9]/.test(sanitized);
  if (sanitized && sanitized.length > 0 && hasSafeChars && startsWithSafeChar) {
    return sanitized;
  }
  return sanitizeFileName(fallback);
}

function resolveSafePath(root, fileName) {
  const safeRoot = path.resolve(root);
  const targetPath = path.resolve(safeRoot, fileName);
  const relative = path.relative(safeRoot, targetPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path traversal attempt detected: ${fileName}`);
  }

  return targetPath;
}

function createSafeFileName(originalName, options = {}) {
  const { fallbackBase = 'file', allowedExtensions = [], defaultExtension = '' } = options;
  const incoming = path.basename(originalName || '');
  const ext = path.extname(incoming).toLowerCase();
  const base = incoming.slice(0, incoming.length - ext.length);
  const useExt = allowedExtensions.length === 0 || allowedExtensions.includes(ext) ? ext : defaultExtension;
  const safeBase = ensureSafeFileName(base, fallbackBase);
  return `${safeBase}${useExt}`;
}

module.exports = {
  sanitizeFileName,
  ensureSafeFileName,
  resolveSafePath,
  createSafeFileName
};
