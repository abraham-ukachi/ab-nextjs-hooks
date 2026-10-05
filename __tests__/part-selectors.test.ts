import { beforeEach, describe, expect, it } from 'vitest'
import { AB_ASIDE_LAYOUT_SELECTOR, getAbPartElement } from '../helpers/abPartSelectors'

describe('getAbPartElement', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav class="AbSidebar" data-ab-part="sidebar"><div class="Dialogs" id="sidebar-dialogs"></div></nav>
      <main class="AbMainLayout" data-ab-part="main">
        <div class="Dialogs" id="main-dialogs"></div>
        <div class="Backdrop" id="main-backdrop"></div>
        <div class="Menus" id="main-menus"></div>
        <div class="Toasts" id="main-toasts"></div>
      </main>
      <aside class="AbAsideLayout" data-ab-part="aside">
        <div class="Dialogs" id="aside-dialogs"></div>
        <div class="Backdrop" id="aside-backdrop"></div>
        <div class="Menus" id="aside-menus"></div>
        <div class="Toasts" id="aside-toasts"></div>
      </aside>
      <div id="dialogs"></div>
      <div id="backdrop"></div>
      <div id="menus"></div>
      <div id="toasts"></div>
    `
  })

  it('targets AbAsideLayout, never the first aside-looking sidebar', () => {
    expect(document.querySelector('aside')).toBe(document.querySelector('.AbAsideLayout'))
    expect(document.querySelector(AB_ASIDE_LAYOUT_SELECTOR)?.classList.contains("AbAsideLayout")).toBe(true)
    expect(getAbPartElement('aside', 'Dialogs')?.id).toBe('aside-dialogs')
    expect(getAbPartElement('aside', 'Backdrop')?.id).toBe('aside-backdrop')
    expect(getAbPartElement('aside', 'Menus')?.id).toBe('aside-menus')
    expect(getAbPartElement('aside', 'Toasts')?.id).toBe('aside-toasts')
    // a stray <aside> without the layout class must not win
    document.body.insertAdjacentHTML('afterbegin', '<aside id="stray"><div class="Dialogs" id="stray-dialogs"></div></aside>')
    expect(document.querySelector('aside')?.id).toBe('stray')
    expect(getAbPartElement('aside', 'Dialogs')?.id).toBe('aside-dialogs')
  })

  it('resolves main and full containers', () => {
    expect(getAbPartElement('main', 'Dialogs')?.id).toBe('main-dialogs')
    expect(getAbPartElement('full', 'Dialogs')?.id).toBe('dialogs')
    expect(getAbPartElement('full', 'Backdrop')?.id).toBe('backdrop')
  })
})
