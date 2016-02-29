/*
 * Desktop Test created by Cesar Zapata [https://github.com/nosoycesaros]
 * For the Huge Navigation Exercise
 * Date: 26.02.2016
 *
 * This files tests the behavior of the page in Desktop screens
 */

var assert = require('assert');

beforeEach(function() {
    //Noavigate to the test
    browser.url('/');
});

/**
 *  Test the Desktop Menu
 */
describe('Huge Desktop Menu', function() {

  /**
   * If Menu Item is hovered, it should change background and text color to white and magenta
   */
    it("On hover, Primary Navigation reverses color (white/magenta)", function(){
      var completeMenu = [1,2,3,4,5,6,7];

      completeMenu.forEach(function(e,i){
        //Get the temporary menuItem
        var menuItem = "#primary-menu>li:nth-child("+e+")";

        browser.moveToObject(menuItem);

        // browser.getCssProperty(menuItem+">a", 'color').parsed.hex.should.be.equal("#ec008c");
        browser.getCssProperty(menuItem+">a", 'background-color').parsed.hex.should.be.equal("#ffffff");
      })
    });

    /**
     * If item with URL is clicked, it should change the browser URL
     */
    it('On click, if item contains a URL, Primary Navigation navigates to a new page', function(){
      var itemsToNavigate = [1,5,6];

      itemsToNavigate.forEach(function(e, i){
        //Get the temporary menuItem
        var menuItem = "#primary-menu>li:nth-child("+e+")";

        //Get the actual URL
        var actualUrl = browser.getUrl();

        // Click the menu item
        browser.click(menuItem);

        // The actual URL should be differnet from preovious
        browser.getUrl().should.not.be.equal(actualUrl);
      })
    });

    /**
     * If item with submenu is clicked, it should add the class open to it
     */
    it('On click, if item contains other items, Secondary Navigation appears (see Desktop, Secondary Navigation)', function () {
      //Declare the items with submenus
      var itemsWithSubMenu = [2,3,4,7];

      //Iterate over the items
      itemsWithSubMenu.forEach(function(e, i){
        //Get the temporary menuItem
        var menuItem = "#primary-menu>li:nth-child("+e+")";

        //Click the menu menuItem
        browser.click(menuItem);

        //Check if secondary menu receive open class
        browser.getAttribute(menuItem+">.secondary-menu", "class").should.contain("open");
      })
    });

    /**
     *  If the submenu is opened, the #black-overlay should receive class open
     */
    it('Translucent mask appears over content, behind menu', function () {
      //Declare the items with submenus
      var itemsWithSubMenu = [2,3,4,7];

      //Iterate over the items
      itemsWithSubMenu.forEach(function(e, i){
        //Get the temporary menuItem
        var menuItem = "#primary-menu>li:nth-child("+e+")";

        //Click the menu menuItem
        browser.click(menuItem);

        //Check if black overlay receives open class
        browser.getAttribute("#black-overlay", "class").should.be.equal("open");
      })
    });

    it("On hover in, Secondary Navigation changes color (magenta/light gray)");
    it("On click, Secondary navigates to a new page.");

    /**
     * If click on black overlay, it should hide submenus and overlay
     */
    it("On click outside of menu, menu and mask are hidden", function(){
      //Declare the items with submenus
      var itemsWithSubMenu = [2,3,4,7];

      //Iterate over the items
      itemsWithSubMenu.forEach(function(e, i){
        //Get the temporary menuItem
        var menuItem = "#primary-menu>li:nth-child("+e+")";

        //Click the menu menuItem
        browser.click(menuItem);

        //Click the black overlay
        browser.click("#black-overlay");

        //Check if secondary menu receive open class
        browser.getAttribute(menuItem+">.secondary-menu", "class").should.be.equal("secondary-menu");
        //Check if black overlay receives open class
        browser.getAttribute("#black-overlay", "class").should.not.be.equal("open");
      })
    });
});
