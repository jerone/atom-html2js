'use babel'

import AtomHtml2jsV2View from './atom-html2js-v2-view'
import { CompositeDisposable } from 'atom'

export default {

  atomHtml2jsV2View: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.atomHtml2jsV2View = new AtomHtml2jsV2View(state.atomHtml2jsV2ViewState)
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomHtml2jsV2View.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-html2js-v2:toggle': () => this.toggle()
    }))
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.atomHtml2jsV2View.destroy()
  },

  serialize () {
    return {
      atomHtml2jsV2ViewState: this.atomHtml2jsV2View.serialize()
    }
  },

  toggle () {
    console.log('AtomHtml2jsV2 was toggled!')
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
    )
  }

}
