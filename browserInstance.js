require('chromedriver');
const webdriver = require('selenium-webdriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

module.exports = {
  driver: {},
  chromeCapabilities: webdriver.Capabilities.chrome(),
  chromeOptions: {'args': ['--headless', '--disable-gpu', '--disable-plugins']},

  init(){
    this.chromeCapabilities.set('chromeOptions', this.chromeOptions);
    this.startBrowser();
  },

  async startBrowser(){
    try {
      this.driver = new webdriver
        .Builder()
        .forBrowser('chrome')
        .withCapabilities(this.chromeCapabilities)
        .build();

      await this.driver.get('http://www.google.com/ncr');
      await this.driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
      await this.driver.wait(until.titleIs('webdriver - Google Search'), 1000);
      await console.log('Everything as expected')
    } catch (err) {
      await this.driver.quit();
      console.log(err);
    }

    await this.driver.quit();
  }
};