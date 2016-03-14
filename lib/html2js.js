'use babel'

import Html2JsView from './html2js-view'
import html2js from './html-2-js'
import { CompositeDisposable } from 'atom'

export default {

  html2JsView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.subscriptions = new CompositeDisposable()

    this.html2JsView = new Html2JsView(state.html2JsViewState)
    this.html2JsView.onSubmit((text) => {
      atom.workspace.open().then((textEditor) => {
        let htmlJs = html2js(text, {})
        textEditor.setText(htmlJs)
      })
    })

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'html2js:toggle': () => this.html2JsView.toggle()
    }))
  },

  deactivate () {
    this.subscriptions.dispose()
    this.subscriptions = null
    this.html2JsView.destroy()
    this.html2JsView = null
  },

  serialize () {
    return {
      html2JsViewState: this.html2JsView.serialize()
    }
  }
}
