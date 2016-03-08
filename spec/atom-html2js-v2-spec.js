'use babel';

import AtomHtml2jsV2 from '../lib/atom-html2js-v2';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomHtml2jsV2', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atom-html2js-v2');
  });

  describe('when the atom-html2js-v2:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.atom-html2js-v2')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-html2js-v2:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.atom-html2js-v2')).toExist();

        let atomHtml2jsV2Element = workspaceElement.querySelector('.atom-html2js-v2');
        expect(atomHtml2jsV2Element).toExist();

        let atomHtml2jsV2Panel = atom.workspace.panelForItem(atomHtml2jsV2Element);
        expect(atomHtml2jsV2Panel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'atom-html2js-v2:toggle');
        expect(atomHtml2jsV2Panel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.atom-html2js-v2')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-html2js-v2:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let atomHtml2jsV2Element = workspaceElement.querySelector('.atom-html2js-v2');
        expect(atomHtml2jsV2Element).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'atom-html2js-v2:toggle');
        expect(atomHtml2jsV2Element).not.toBeVisible();
      });
    });
  });
});
