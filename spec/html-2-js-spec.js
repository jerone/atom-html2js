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

  it('converts simple html to javascript', () => {
    expect(html2Js('<div></div>')).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)
    `.trim())
  })

  it('converts multiline html to javascript', () => {
    expect(html2Js(`
<div>
</div>
    `)).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)
    `.trim())
  })

  it('converts invalid html to javascript', () => {
    expect(html2Js('<DIV FOO="BAR"></DIV>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.setAttribute('foo', 'BAR')
document.body.appendChild(div$0$0)
    `.trim())
  })

  // Classes
  describe('with classes', () => {
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
  })

  // Attributes
  describe('with attributes', () => {
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

    it('converts empty attributes to javascript', () => {
      expect(html2Js('<div foo></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.setAttribute('foo', '')
document.body.appendChild(div$0$0)
      `.trim())
    })

    it('converts checked attribute to javascript', () => {
      expect(html2Js('<input type="checkbox" checked />')).toBe(`
const input$0$0 = document.createElement('input')
input$0$0.setAttribute('type', 'checkbox')
input$0$0.setAttribute('checked', true)
document.body.appendChild(input$0$0)
      `.trim())
    })
  })

  // Datasets
  describe('with datasets', () => {
    it('converts datasets to javascript', () => {
      expect(html2Js('<div data-foo="bar"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.dataset.add('foo', 'bar')
document.body.appendChild(div$0$0)
      `.trim())
    })

    it('converts datasets with integers to javascript', () => {
      expect(html2Js('<div data-foo="bar" data-foo-bar="123"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.dataset.add('foo', 'bar')
div$0$0.dataset.add('foo-bar', 123)
document.body.appendChild(div$0$0)
      `.trim())

      expect(html2Js('<div data-foo="bar" data-foo-bar="-123"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.dataset.add('foo', 'bar')
div$0$0.dataset.add('foo-bar', -123)
document.body.appendChild(div$0$0)
      `.trim())
    })
  })

  describe('with events', () => {
    it('converts events to javascript', () => {
      expect(html2Js('<div onclick="foo()"></div>')).toBe(`
const div$0$0 = document.createElement('div')
div$0$0.addEventListener('click', e => foo())
document.body.appendChild(div$0$0)
      `.trim())
    })
  })

  describe('with text nodes', () => {
    it('converts text node to javascript', () => {
      expect(html2Js('<div>Lorum ipsum</div>')).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

div$0$0.appendChild(document.createTextNode('Lorum ipsum'))
      `.trim())
    })

    it('converts root text node to javascript', () => {
      expect(html2Js('Lorum ipsum')).toBe(`
document.body.appendChild(document.createTextNode('Lorum ipsum'))
      `.trim())
    })

    it('converts text node with quote in the text to javascript', () => {
      expect(html2Js('<div>Lorum ipsum\'s</div>')).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

div$0$0.appendChild(document.createTextNode('Lorum ipsum&#39;s'))
      `.trim())
    })
  })

  it('converts elements with children', () => {
    expect(html2Js(`
<div>
  <span class="bar"></span>
  <br/>
  <strong data-foo="bar">Lorum ipsum</strong>
</div>
    `)).toBe(`
const div$0$0 = document.createElement('div')
document.body.appendChild(div$0$0)

const span$1$0 = document.createElement('span')
span$1$0.classList.add('bar')
div$0$0.appendChild(span$1$0)

const br$1$1 = document.createElement('br')
div$0$0.appendChild(br$1$1)

const strong$1$2 = document.createElement('strong')
strong$1$2.dataset.add('foo', 'bar')
div$0$0.appendChild(strong$1$2)

strong$1$2.appendChild(document.createTextNode('Lorum ipsum'))
    `.trim())
  })

  it('converts multi-level HTML to javascript', () => {
    expect(html2Js(`
<div x="$1">
  <div x="$1$1">
    <div x="$1$1$1"></div>
  </div>
  <div x="$1$2">
    <div x="$1$2$1"></div>
  </div>
</div>
    `.trim())).toBe(`
const div$1 = document.createElement('div')
div$1.setAttribute('x', '$1')
document.body.appendChild(div$1)

const div$1$1 = document.createElement('div')
div$1$1.setAttribute('x', '$1$1')
div$1.appendChild(div$1$1)

const div$1$1$1 = document.createElement('div')
div$1$1$1.setAttribute('x', '$1$1$1')
div$1$1.appendChild(div$1$1$1)

const div$1$2 = document.createElement('div')
div$1$2.setAttribute('x', '$1$2')
div$1.appendChild(div$1$2)

const div$1$2$1 = document.createElement('div')
div$1$2$1.setAttribute('x', '$1$2$1')
div$1$2.appendChild(div$1$2$1)
    `.trim())
  })
})
