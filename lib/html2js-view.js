'use babel'

export default class Html2JsView {

  constructor (serializedState) {
    // Create root element
    this.element = document.createElement('div')
    this.element.classList.add('html2js')

    // Create message element
    const message = document.createElement('div')
    message.textContent = 'The Html2JsView package is Alive! It\'s ALIVE!'
    message.classList.add('message')
    this.element.appendChild(message)

    const input = document.createElement('atom-text-editor')
    input.setAttribute('mini', true)
    input.setAttribute('placeholder-text', 'Input HTML')
    console.log(input)
    this.element.appendChild(input)
    input.classList.add('mini')
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {}

  // Tear down any state and detach
  destroy () {
    this.element.remove()
  }

  getElement () {
    return this.element
  }

}
