// utils/pageScroller.js

export async function scrollPage(page, depth = 500, iterations = 5) {
  for (let i = 0; i < iterations; i++) {
    await page.evaluate((scrollDepth) => {
      window.scrollBy(0, scrollDepth);
    }, depth);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
