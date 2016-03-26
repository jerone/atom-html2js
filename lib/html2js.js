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

    let grammar = atom.grammars.grammarForScopeName('source.js.jsx')  // Babel ES6 JavaScript
    grammar = grammar || atom.grammars.grammarForScopeName('source.js')  // JavaScript fallback

    this.html2JsView = new Html2JsView()
    this.html2JsView.onSubmit((text) => {
      atom.workspace.open().then((textEditor) => {
        let htmlJs = html2js(text, {})
        textEditor.setText(htmlJs)
        textEditor.setGrammar(grammar)
      })
    })

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'html2js:toggle': () => {
        if (!this.html2JsView.isVisible()) {
          let input = ''
          const editor = atom.workspace.getActiveTextEditor()
          if (editor) {
            const selection = editor.getLastSelection()
            if (selection && !selection.isEmpty()) {
              input = selection.getText()
            }
          }
          this.html2JsView.show(input)
        } else {
          this.html2JsView.hide()
        }
      }
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
