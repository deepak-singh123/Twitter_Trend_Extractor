import { Builder, By, until } from 'selenium-webdriver';
import { ProxyAgent } from 'proxy-agent';
import dotenv from 'dotenv';
import axios from 'axios';
import chrome from 'chrome-aws-lambda';  // Required for headless Chrome support in Render

dotenv.config();

async function fetchTrendingTopics(proxy, twitterEmail, twitterPassword, twitterUsername) {
  let driver;
  try {
    // Use chrome-aws-lambda's default options for headless Chrome
    const options = new chrome.Options();

    // Add Chrome arguments necessary for headless operation on Render
    options.addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--remote-debugging-port=9222'
    );

    // Make sure to use the correct path to ChromeDriver in Render
    const chromeDriverPath = '/opt/render/.cache/selenium/chrome/linux64/131.0.6778.204/chrome'; // Correct path for Render

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(new chrome.ServiceBuilder(chromeDriverPath)) // Set ChromeDriver path
      .usingHttpAgent(new ProxyAgent(proxy))
      .build();

    await driver.get('https://twitter.com/login');
    console.log('Navigated to Twitter login page.');

    const emailField = await driver.wait(until.elementLocated(By.name('text')), 10000);
    await emailField.sendKeys(twitterEmail, '\n');
    console.log('Entered email.');

    try {
      const usernameField = await driver.wait(
        until.elementLocated(By.css('input[name="text"], input[data-testid="ocfEnterTextTextInput"]')),
        5000
      );
      console.log('Twitter requested username.');
      await usernameField.sendKeys(twitterUsername, '\n');
    } catch {
      console.log('Username input not required.');
    }

    const passwordField = await driver.wait(until.elementLocated(By.name('password')), 10000);
    await passwordField.sendKeys(twitterPassword, '\n');
    console.log('Entered password.');

    await driver.wait(until.urlContains('home'), 10000);
    console.log('Logged in successfully.');

    await driver.get('https://x.com/explore/tabs/trending');
    console.log('Navigated to trending topics.');

    await driver.wait(until.elementLocated(By.css('span.r-18u37iz span.css-1jxf684')), 15000);

    const trends = await driver.findElements(By.css('span.r-18u37iz span.css-1jxf684'));
    const trendingTopics = [];
    for (let i = 0; i < Math.min(5, trends.length); i++) {
      const trendText = await trends[i].getText();
      trendingTopics.push(trendText);
    }
    console.log('Fetched trending topics:', trendingTopics);

    const realIpResponse = await axios.get('https://httpbin.org/ip');
    const ipAddress = realIpResponse.data.origin;
    console.log('Fetched IP address:', ipAddress);

    return { topics: trendingTopics, ipAddress };
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
      console.log('WebDriver session ended.');
    }
  }
}

export default fetchTrendingTopics;
