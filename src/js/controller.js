import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
// import coreJs from 'core-js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err.message);
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResults(query);

    //3) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4) Render pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    console.log(err.message);
  }
};

/**
 *
 * @param {*} goToPage
 */
const controlPagination = function (goToPage) {
  console.log(goToPage);
  //1) render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2) Render pagination button
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // update the recipe servings (in the state)
  model.updateServings(newServings);
  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    // console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💣', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  // model.restoreBookmarks();
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // model.restoreBookmarks();
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
