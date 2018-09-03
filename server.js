const browser = require('./browserInstance');

browser.init();


//
// ////////
// const chromeCapabilities = webdriver.Capabilities.chrome();
// const chromeOptions = {'args': ['--headless', '--disable-gpu', '--disable-plugins']};
// chromeCapabilities.set('chromeOptions', chromeOptions);
// // const driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
//
// //////
// const driver =
//   new webdriver
//     .Builder()
//     .forBrowser('chrome')
//     .withCapabilities(chromeCapabilities)
//     .build();

// //////////
// const chrome = require('../chrome');
//
// const width = 640;
// const height = 480;
//
// let driver = new Builder()
//   .forBrowser('chrome')
//   .setChromeOptions(
//     new chrome.Options().headless().windowSize({width, height}))
//   .build();

// (async function example() {
//   let driver = await new Builder().forBrowser('firefox').build();
//   try {
//     await driver.get('http://www.google.com/ncr');
//     await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
//     await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
//   } finally {
//     await driver.quit();
//   }
// })();