'use babel'

import html2Js from '../lib/html-2-js'

describe('html-2-js', () => {
  it('has to exist', () => {
    expect(html2Js).toBeDefined()
  })

  it('should always return a string', () => {
    expect(html2Js('')).toBe('')
    expect(html2Js(' ')).toBe('')  // space
    expect(html2Js('  ')).toBe('')  // tab
    expect(html2Js(undefined)).toBe('')
    expect(html2Js(null)).toBe('')
    expect(html2Js([])).toBe('')
    expect(html2Js({})).toBe('')
  })

  it('converts a simple html to javascript', () => {
    expect(html2Js('<div></div>')).toBe(`
const div$0 = document.createElement('div')
    `.trim())
    expect(html2Js(`
<div>
</div>
    `)).toBe(`
const div$0 = document.createElement('div')
    `.trim())
  })

  describe('when called with HTML', () => {
    it('converts classes to javascript', () => {
      expect(html2Js('<div class="foo"></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.classList.add('foo')
      `.trim())
      expect(html2Js('<div class="foo bar"></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.classList.add('foo', 'bar')
      `.trim())
      expect(html2Js('<div class="foo bar foo-bar"></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.classList.add('foo', 'bar', 'foo-bar')
      `.trim())
    })

    it('converts attributes to javascript', () => {
      expect(html2Js('<div foo="bar"></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.setAttribute('foo', 'bar')
      `.trim())
      expect(html2Js('<div foo="bar" foo-bar="bar-foo"></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.setAttribute('foo', 'bar')
div$0.setAttribute('foo-bar', 'bar-foo')
      `.trim())
    })

    it('converts datasets to javascript', () => {
      expect(html2Js('<div data-foo="bar"></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.dataset.add('foo', 'bar')
      `.trim())
      expect(html2Js('<div data-foo="bar" data-foo-bar="bar-foo"></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.dataset.add('foo', 'bar')
div$0.dataset.add('foo-bar', 'bar-foo')
      `.trim())
    })

    describe('that has multiple children', () => {
      it('converts all children to javascript', () => {
        expect(html2Js('<div><span></span></div>')).toBe(`
const div$0 = document.createElement('div')

const span$0 = document.createElement('span')
        `.trim())
        expect(html2Js(`
<div>
  <span></span>
</div>
        `)).toBe(`
const div$0 = document.createElement('div')

const span$0 = document.createElement('span')
        `.trim())
        expect(html2Js('<div><br/></div>')).toBe(`
const div$0 = document.createElement('div')

const br$0 = document.createElement('br')
        `.trim())
        expect(html2Js(`
<div>
  <br/>
</div>
        `)).toBe(`
const div$0 = document.createElement('div')

const br$0 = document.createElement('br')
        `.trim())
      })

      it('converts all classes to javascript', () => {
        expect(html2Js('<div class="foo"><span class="bar"></span></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.classList.add('foo')

const span$0 = document.createElement('span')
span$0.classList.add('bar')
        `.trim())
        expect(html2Js('<div class="foo bar"><span class="foo bar"></span></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.classList.add('foo', 'bar')

const span$0 = document.createElement('span')
span$0.classList.add('foo', 'bar')
      `.trim())
        expect(html2Js('<div class="foo bar foo-bar"><span class="foo bar foo-bar"></span></div>')).toBe(`
const div$0 = document.createElement('div')
div$0.classList.add('foo', 'bar', 'foo-bar')

const span$0 = document.createElement('span')
span$0.classList.add('foo', 'bar', 'foo-bar')
        `.trim())
      })
    })
  })
})
