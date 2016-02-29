/*
 * Desktop Test created by Cesar Zapata [https://github.com/nosoycesaros]
 * For the Huge Navigation Exercise
 * Date: 26.02.2016
 *
 * This files tests the behavior of the page in Mobile screens
 */

var assert = require('assert');

beforeEach(function() {
  // Set the viewport size before each funciton
  browser.setViewportSize({
    width: 600,
    height: 950
  }, false);
  // Navigate to the local URL
  browser.url('/');

});

/**
 *  Test the Responsive Menu
 */
describe('Huge Mobile Menu', function() {

  /**
   * The hamburguer icon must open and close
   */
  it("When a user clicks the open navigation icon (“hamburger”), the navigation should “push” from left to right.", function() {
    // Get the menu icon
    var menuIcon = "#main-menu .menu-icon";

    // Click on the menu icon
    browser.click(menuIcon);

    // Is the menu icon class set to open
    // This class must push the icon
    browser.getAttribute(menuIcon, "class").should.contain("open");

    // Click again on the icon
    browser.click(menuIcon);
    // The class must go
    browser.getAttribute(menuIcon, "class").should.not.contain("open");

  });

  /**
   * The HUGE logo shows up when the menu icon is clicked
   */
  it("The HUGE logo and navigation toggle slide left to right.", function() {

    // Get the menu icon
    var menuIcon = "#main-menu .menu-icon";

    // Click on the menu icon
    browser.click(menuIcon);

    // The logo must show up from left to right, handled by the open class
    browser.getAttribute("#main-logo", "class").should.contain("open");

    // Click again on menu icon
    browser.click(menuIcon);
    // The open class must go
    browser.getAttribute("#main-logo", "class").should.not.contain("open");

  });

  /**
   * The Hamburguer icon must change to ("x") when open and backwards
   */
  it("The open navigation icon should change to the close navigation icon (“x”), and Backwards", function() {
    // Get the menu icon
    var menuIcon = "#main-menu .menu-icon";
    // Click on the menu icon
    browser.click(menuIcon);

    // The background image must contain the close.svg file
    browser.getCssProperty(menuIcon, "background-image").value.should.contain("close.svg");
    // Click again on menu icon
    browser.click(menuIcon);
    // The background image must contain the open.svg file
    browser.getCssProperty(menuIcon, "background-image").value.should.contain("open.svg");


  });

  /**
   * The black overlay must shows up when menu is open
   */
  it("Translucent mask appears over content, right of navigation.", function() {
    // Get the menu icon
    var menuIcon = "#main-menu .menu-icon";
    // Click on the menu icon
    browser.click(menuIcon);

    //Check if black overlay receives open class
    browser.getAttribute("#black-overlay", "class").should.contain("open");

  });

});
