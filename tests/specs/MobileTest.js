var assert = require('assert');

beforeEach(function() {
  browser.setViewportSize({
    width: 600,
    height: 950
  }, false);
  browser.url('/');
});

describe('Huge Mobile Menu', function() {

  it("When a user clicks the open navigation icon (“hamburger”), the navigation should “push” from left to right.", function() {

    var menuIcon = "#main-menu .menu-icon";

    browser.click(menuIcon);

    browser.getAttribute(menuIcon, "class").should.contain("open");

    browser.click(menuIcon);
    browser.getAttribute(menuIcon, "class").should.not.contain("open");

  });

  it("The HUGE logo and navigation toggle slide left to right.", function() {

    var menuIcon = "#main-menu .menu-icon";

    browser.click(menuIcon);

    browser.getAttribute("#main-logo", "class").should.contain("open");

    browser.click(menuIcon);
    browser.getAttribute("#main-logo", "class").should.not.contain("open");

  });

  it("The open navigation icon should change to the close navigation icon (“x”), and Backwards", function() {

    var menuIcon = "#main-menu .menu-icon";

    browser.click(menuIcon);

    browser.getCssProperty(menuIcon, "background-image").value.should.contain("close.svg");
    browser.click(menuIcon);
    browser.getCssProperty(menuIcon, "background-image").value.should.contain("open.svg");


  });

  it("Translucent mask appears over content, right of navigation.", function() {

    var menuIcon = "#main-menu .menu-icon";

    browser.click(menuIcon);

    //Check if black overlay receives open class
    browser.getAttribute("#black-overlay", "class").should.contain("open");

  });

});
