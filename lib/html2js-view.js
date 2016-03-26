'use babel'

import { Emitter } from 'event-kit'

var lineHeight = null

export default class Html2JsView {

  constructor () {
    this.emitter = new Emitter()

    this.element = document.createElement('div')
    this.element.classList.add('html2js')
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.element,
      visible: false
    })

    document.documentElement.addEventListener('click', this.blur.bind(this))
    this.modalPanel.onDidDestroy(() => {
      document.documentElement.removeEventListener('click', this.blur.bind(this))
    })

    const message = document.createElement('p')
    message.textContent = 'Enter the valid HTML5 code to convert it to JavaScript'
    message.classList.add('message', 'info-message')
    this.element.appendChild(message)

    this.input = document.createElement('atom-text-editor')
    this.input.setAttribute('placeholder-text', 'Input HTML')
    this.input.getModel().setGrammar(atom.grammars.grammarForScopeName('text.html.basic'))
    this.element.appendChild(this.input)

    const wrapper = document.createElement('atom-panel')
    wrapper.classList.add('padded')
    this.element.appendChild(wrapper)

    this.clearButton = document.createElement('button')
    this.clearButton.classList.add('btn')
    this.clearButton.appendChild(document.createTextNode('Clear'))
    this.clearButton.addEventListener('click', this.clear.bind(this))
    wrapper.appendChild(this.clearButton)

    const submit = document.createElement('button')
    submit.classList.add('btn', 'btn-primary', 'pull-right')
    submit.appendChild(document.createTextNode('Submit'))
    submit.addEventListener('click', this.submit.bind(this))
    wrapper.appendChild(submit)
  }

  serialize () {}

  destroy () {
    this.emitter.dispose()
    this.emitter = null
    this.modalPanel.destroy()
    this.modalPanel = null
    atom.workspace.getActivePane().activate()
  }

  show (input) {
    this.modalPanel.show()
    this.clear()
    if (input) this.setText(input)
    if (lineHeight === null) lineHeight = this.input.getHeight()
    this.input.setHeight(lineHeight * 5)
    this.input.focus()
  }

  close () {
    this.modalPanel.hide()
  }

  toggle () {
    this.isVisible() ? this.close() : this.show()
  }

  isVisible () {
    return this.modalPanel.isVisible()
  }

  setText (text) {
    this.input.getModel().setText(text.trim())
  }

  clear () {
    this.setText('')
  }

  onSubmit (callback) {
    this.emitter.on('submit', callback)
  }

  submit () {
    this.close()
    const text = this.input.getModel().getText().trim()
    this.emitter.emit('submit', text)
  }

  blur (e) {
    if (e.target.closest('.html2js') === null) {
      this.close()
    }
  }
}
