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
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)
    `.trim())

    expect(html2Js(`
<div>
</div>
    `)).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)
    `.trim())
  })

  describe('when called with HTML', () => {
    it('converts classes to javascript', () => {
      expect(html2Js('<div class="foo"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.classList.add('foo')
document.body.appendChild(div$0$0)
      `.trim())

      expect(html2Js('<div class="foo bar"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.classList.add('foo', 'bar')
document.body.appendChild(div$0$0)
      `.trim())

      expect(html2Js('<div class="foo bar foo-bar"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.classList.add('foo', 'bar', 'foo-bar')
document.body.appendChild(div$0$0)
      `.trim())
    })

    it('converts attributes to javascript', () => {
      expect(html2Js('<div foo="bar"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.setAttribute('foo', 'bar')
document.body.appendChild(div$0$0)
      `.trim())

      expect(html2Js('<div foo="bar" foo-bar="bar-foo"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.setAttribute('foo', 'bar')
div$0$0.setAttribute('foo-bar', 'bar-foo')
document.body.appendChild(div$0$0)
      `.trim())
    })

    it('converts datasets to javascript', () => {
      expect(html2Js('<div data-foo="bar"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.dataset.add('foo', 'bar')
document.body.appendChild(div$0$0)
      `.trim())

      expect(html2Js('<div data-foo="bar" data-foo-bar="bar-foo"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.dataset.add('foo', 'bar')
div$0$0.dataset.add('foo-bar', 'bar-foo')
document.body.appendChild(div$0$0)
      `.trim())
    })

    describe('that has children', () => {
      it('converts all children to javascript', () => {
        expect(html2Js('<div><span></span></div>')).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

const span$1$0 = document.createElement('span')
div$0$0.appendChild(span$1$0)
        `.trim())

        expect(html2Js(`
<div>
  <span></span>
</div>
        `)).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

const span$1$0 = document.createElement('span')
div$0$0.appendChild(span$1$0)
        `.trim())

        expect(html2Js('<div><br/></div>')).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

const br$1$0 = document.createElement('br')
div$0$0.appendChild(br$1$0)
        `.trim())

        expect(html2Js(`
<div>
  <br/>
</div>
        `)).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

const br$1$0 = document.createElement('br')
div$0$0.appendChild(br$1$0)
        `.trim())
      })

      expect(html2Js(`
<div>
  <span></span>
  <span></span>
</div>
      `)).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

const span$1$0 = document.createElement('span')
div$0$0.appendChild(span$1$0)

const span$1$1 = document.createElement('span')
div$0$0.appendChild(span$1$1)
      `.trim())

      it('converts all classes to javascript', () => {
        expect(html2Js('<div class="foo"><span class="bar"></span></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.classList.add('foo')
document.body.appendChild(div$0$0)

const span$1$0 = document.createElement('span')
span$1$0.classList.add('bar')
div$0$0.appendChild(span$1$0)
        `.trim())

        expect(html2Js('<div class="foo bar"><span class="foo bar"></span></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.classList.add('foo', 'bar')
document.body.appendChild(div$0$0)

const span$1$0 = document.createElement('span')
span$1$0.classList.add('foo', 'bar')
div$0$0.appendChild(span$1$0)
      `.trim())

        expect(html2Js('<div class="foo bar foo-bar"><span class="foo bar foo-bar"></span></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.classList.add('foo', 'bar', 'foo-bar')
document.body.appendChild(div$0$0)

const span$1$0 = document.createElement('span')
span$1$0.classList.add('foo', 'bar', 'foo-bar')
div$0$0.appendChild(span$1$0)
        `.trim())
      })
    })
  })
})
