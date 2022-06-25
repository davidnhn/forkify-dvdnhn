import PreviewView from './previewView';

class ResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes for this query. Please try another one!';
  _successMessage =
    'Start by searching for a recipe or an ingredient. Have fun!';
}
export default new ResultsView();
