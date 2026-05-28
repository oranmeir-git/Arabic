// Mock browser globals for testing app.js logic in Node
global.window = {
  speechSynthesis: {
    getVoices: () => []
  },
  addEventListener: () => {}
};
global.document = {
  getElementById: (id) => ({
    addEventListener: () => {},
    appendChild: () => {},
    innerHTML: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    querySelectorAll: () => []
  }),
  querySelectorAll: () => [],
  body: {
    classList: { add: () => {}, remove: () => {}, contains: () => false }
  }
};
global.localStorage = {
  getItem: () => null,
  setItem: () => null
};
global.navigator = {
  speechSynthesis: {}
};
global.fetch = (url) => {
  const fs = require('fs');
  try {
    if (url === 'stories.json') {
      const data = fs.readFileSync('C:/Users/oranm/.gemini/antigravity/scratch/arabic-story-learner/stories.json', 'utf8');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(JSON.parse(data))
      });
    }
    if (url === 'my_stories.txt') {
      const data = fs.readFileSync('C:/Users/oranm/.gemini/antigravity/scratch/arabic-story-learner/my_stories.txt', 'utf8');
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(data)
      });
    }
  } catch (e) {
    return Promise.reject(e);
  }
  return Promise.resolve({ ok: false });
};

// Load the file content
const fs = require('fs');
let appCode = fs.readFileSync('C:/Users/oranm/.gemini/antigravity/scratch/arabic-story-learner/app.js', 'utf8');
// Expose state globally
appCode = appCode.replace('let state = {', 'global.state = {');

try {
  // Run the code
  eval(appCode);
  console.log("SUCCESS: app.js evaluated successfully.");
  
  // Test loadStories()
  loadStories().then(() => {
    console.log("SUCCESS: loadStories() executed successfully.");
    console.log("Total loaded stories:", global.state.stories.length);
    global.state.stories.forEach((s, idx) => {
      console.log(`Story ${idx + 1}: ${s.title} (${s.arabicTitle}) - parts: ${s.parts.length}`);
    });
  }).catch(e => {
    console.error("ERROR in loadStories():", e);
  });
  
} catch (err) {
  console.error("ERROR evaluating app.js:", err);
}
