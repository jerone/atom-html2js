'use babel'

import Html2JsView from './html2js-view'
import { CompositeDisposable } from 'atom'

export default {

  html2JsView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.html2JsView = new Html2JsView(state.html2JsViewState)
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.html2JsView.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'html2js:toggle': () => this.toggle()
    }))
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.html2JsView.destroy()
  },

  serialize () {
    return {
      html2JsViewState: this.html2JsView.serialize()
    }
  },

  toggle () {
    console.log('Html2JsView was toggled!')
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
    )
  }

}
