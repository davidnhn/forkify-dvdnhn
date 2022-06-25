import PreviewView from './previewView';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find an bookmark a recipe';
  _successMessage =
    'Start by searching for a recipe or an ingredient. Have fun!';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarksView();
