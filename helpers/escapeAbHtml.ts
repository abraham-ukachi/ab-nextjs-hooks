/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-hooks
* @name: escapeAbHtml - Helper
* @file: helpers/escapeAbHtml.ts
*/

/**
 * Escapes text for safe insertion into HTML (XSS guard for dialogs & toasts).
 * Pass `html: true` to `open()` / `show()` when you intentionally want markup.
 */
export function escapeAbHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Returns `value` as-is when `allowHtml` is true, otherwise an escaped string.
 */
export function abTextOrHtml(value: unknown, allowHtml: boolean | undefined): string {
  if (value == null) return ''
  return allowHtml ? String(value) : escapeAbHtml(value)
}
