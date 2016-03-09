'use babel'

// import { CompositeDisposable } from 'atom'

export default class Html2JsView {

  constructor (serializedState) {
    // this.subscriptions = new CompositeDisposable()

    // Create root element
    this.element = document.createElement('div')
    this.element.classList.add('html2js')

    // Create message element
    const message = document.createElement('div')
    message.textContent = 'The Html2JsView package is Alive! It\'s ALIVE!'
    message.classList.add('message')
    this.element.appendChild(message)

    this.input = document.createElement('atom-text-editor')
    // input.setAttribute('mini', true)
    this.input.setAttribute('placeholder-text', 'Input HTML')
    this.element.appendChild(this.input)
    // input.classList.add('mini')

    const submit = document.createElement('button')
    submit.appendChild(document.createTextNode('Submit'))
    this.element.appendChild(submit)
    submit.addEventListener('click', this.submit.bind(this))
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {}

  // Tear down any state and detach
  destroy () {
    this.element.remove()
  }

  submit () {
    // const input = this.input.shadowRoot.querySelector('.text').textContent
    const model = this.input.getModel()
    const text = model.getText()
    atom.workspace.open().then((textEditor) => {
      textEditor.setText(text)
      this.destroy()
    })
  }

  getElement () {
    return this.element
  }

}
