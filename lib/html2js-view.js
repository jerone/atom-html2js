'use babel'

import { Emitter } from 'event-kit'

var lineHeight = null

export default class Html2JsView {

  constructor (serializedState) {
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
    // input.setAttribute('mini', true)
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

  show () {
    this.modalPanel.show()
    this.clear()
    if (lineHeight === null) lineHeight = this.input.getHeight()
    this.input.setHeight(lineHeight * 5)
    this.input.focus()

    // Debug
    this.input.getModel().setText(
`<div class="a bb ccc" attr="value" empty-attr="" data-attr="data-value" data-int="123">
  <child-1>Text content</child-1>
  <child-2 id="identifier">
    <sub-child class="a bb ccc" attr="value" empty-attr="" data-attr="data-value" data-int="123" />
  </child-2>
</div>`)
  }

  close () {
    this.modalPanel.hide()
  }

  toggle () {
    this.modalPanel.isVisible() ? this.close() : this.show()
  }

  clear () {
    this.input.getModel().setText('')
  }

  onSubmit (callback) {
    this.emitter.on('submit', callback)
  }

  submit () {
    this.close()
    const text = this.input.getModel().getText()
    this.emitter.emit('submit', text)
  }

  blur (e) {
    if (e.target.closest('.html2js') === null) {
      this.close()
    }
  }
}
