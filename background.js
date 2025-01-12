let isLeetCodeOpen = false;
let leetCodeIDs = [];
let intervalId;

/**
 * Stop live timer and clear intervals.
 */
function stopLiveTimer() {
  isLeetCodeOpen = false;
  clearInterval(intervalId);
  intervalId = null; // Clear interval reference
}

/**
 * Start the live timer.
 */
function startLiveTimer() {
  if (!isLeetCodeOpen) {
    console.log("Live timer started.");
    isLeetCodeOpen = true;
    intervalId = setInterval(updateLiveTime, 1000);
  }
}

/**
 * Periodically update live elapsed time.
 */
async function updateLiveTime() {
  const { openTime, timeData } = await getJsonData();
  if (isLeetCodeOpen && openTime) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - openTime;

    // Combine live elapsed time with previously saved time
    const totalElapsedTime = elapsedTime + (timeData.timeInMs || 0);

    chrome.storage.local.set({ liveTime: totalElapsedTime }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error updating live time:", chrome.runtime.lastError);
      } else {
        console.log("Live time updated:", totalElapsedTime);
      }
    });
  }
}

/**
 * Fetch data from storage (cumulative time and openTime).
 */
async function getJsonData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['timeData', 'openTime'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve({
          timeData: result.timeData || { timeInMs: 0 },
          openTime: result.openTime || null,
        });
      }
    });
  });
}

/**
 * Save updated cumulative time to storage.
 */
async function saveData(timeAdded) {
  try {
    const { timeData } = await getJsonData();
    const oldTime = typeof timeData.timeInMs === 'number' ? timeData.timeInMs : 0;
    const newData = { timeInMs: oldTime + timeAdded };

    chrome.storage.local.set({ timeData: newData }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving data:", chrome.runtime.lastError);
      } else {
        console.log("Updated time data saved successfully:", newData);
      }
    });
  } catch (error) {
    console.error("Error updating and saving data:", error);
  }
}

// Listener for tab updates to track LeetCode usage
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = changeInfo.url;

    if (url.startsWith('https://leetcode.com/')) {
      if (!leetCodeIDs.includes(tabId)) {
        leetCodeIDs.push(tabId);
      }

      if (!isLeetCodeOpen) {
        const currentTime = Date.now();
        chrome.storage.local.set({ openTime: currentTime }, () => {
          console.log("New openTime set:", currentTime);
        });
        startLiveTimer();
      }
    } else {
      if (leetCodeIDs.includes(tabId)) {
        leetCodeIDs = leetCodeIDs.filter(id => id !== tabId);

        if (leetCodeIDs.length === 0) {
          const closeTime = Date.now();
          stopLiveTimer();

          chrome.storage.local.get('openTime', (result) => {
            const openTime = result.openTime;
            if (openTime) {
              const elapsedTime = closeTime - openTime;
              saveData(elapsedTime);

              // Clear openTime after saving
              chrome.storage.local.remove('openTime', () => {
                console.log("openTime cleared after closing LeetCode.");
              });
            }
          });
        }
      }
    }
  }
});

// Listener for tab closure to track LeetCode usage
chrome.tabs.onRemoved.addListener((tabId) => {
  if (leetCodeIDs.includes(tabId)) {
    leetCodeIDs = leetCodeIDs.filter(id => id !== tabId);

    if (leetCodeIDs.length === 0) {
      const closeTime = Date.now();
      stopLiveTimer();

      chrome.storage.local.get('openTime', (result) => {
        const openTime = result.openTime;
        if (openTime) {
          const elapsedTime = closeTime - openTime;
          saveData(elapsedTime);

          // Clear openTime after saving
          chrome.storage.local.remove('openTime', () => {
            console.log("openTime cleared after closing all LeetCode tabs.");
          });
        }
      });
    }
  }
});
