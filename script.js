$(function () { 
  // Close navbar on mobile when clicking outside
  $("#navbarToggle").blur(function () {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

  // Function to insert HTML into a given selector
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading spinner
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Function to replace {{propertyName}} with its actual value in the HTML string
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Remove active class from home and switch to menu button
  var switchMenuToActive = function () {
    document.querySelector("#navHomeButton").classList.remove("active");
    document.querySelector("#navMenuButton").classList.add("active");
  };

  // Load home view on first page load
  document.addEventListener("DOMContentLoaded", function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML,
      true
    );
  });

  // Function to build and display home page HTML with a random category
  function buildAndShowHomeHTML(categories) {
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {
        var chosenCategoryShortName = chooseRandomCategory(categories).short_name;
        console.log("Random Category Chosen: ", chosenCategoryShortName); // Debugging

        var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", "'" + chosenCategoryShortName + "'");
        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
      },
      false
    );
  }

  // Function to randomly choose a category from the list
  function chooseRandomCategory(categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }

  // Function to load a random category when clicking "Specials"
  dc.loadRandomCategory = function () {
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      function (categories) {
        var randomCategory = chooseRandomCategory(categories).short_name;
        dc.loadMenuItems(randomCategory);
      },
      true
    );
  };

  // Load the menu items view
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML
    );
  };

  // Function to display menu items for a chosen category
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    insertHtml("#main-content", "<h2>Menu for " + categoryMenuItems.category.name + "</h2>");
  }

  global.$dc = dc;
})(window);

