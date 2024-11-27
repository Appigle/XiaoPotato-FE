const puppeteer = require('puppeteer-core');

async function getUnsplashImages() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );

  try {
    // TODO: search img type in 'https://unsplash.com' and copy the url
    // const crawImgsPath = 'https://unsplash.com/s/photos/avatar';
    const crawImgsPath = 'https://unsplash.com/s/photos/dream';
    // Navigate to Unsplash
    await page.goto(crawImgsPath, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    // Wait for images to load
    await page.waitForSelector('figure img', { timeout: 10000 });

    // Extract image URLs
    const imageUrls = await page.evaluate(() => {
      const images = document.querySelectorAll('figure img[loading="lazy"]');
      return Array.from(images)
        .map((img) => img.src)
        .filter((url) => url && url.startsWith('https://'))
        .filter((url) => !url.includes('profile'));
    });

    console.log(`Found ${imageUrls.length} images`);
    return imageUrls;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Execute the function
getUnsplashImages()
  .then((urls) => {
    console.log('Image URLs:');
    urls.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });
  })
  .catch((err) => console.error('Error:', err));
