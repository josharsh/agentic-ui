const puppeteer = require('puppeteer');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to your React application
  await page.goto('http://localhost:3000/capture'); // Replace with your app's URL

  // Perform actions and assertions
  // For example, click on an element and assert its existence
  // Check if the button exists
  const buttonExists = await page.$('button.inline-flex'); // Replace with your button's selector

  if (buttonExists) {
    console.log('Button exists!');
  } else {
    console.error('Button not found.');
  }
  // Take screenshots or do other verifications

  // Close the browser
  await browser.close();
})();
