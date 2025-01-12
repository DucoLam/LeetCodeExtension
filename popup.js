/**
 * Fetch the cumulative and live time data and update the display.
 */
async function updateLiveDisplay() {
  try {
    chrome.storage.local.get(['timeInMs', 'liveTime'], (result) => {
      const totalTime = (result.timeInMs || 0) + (result.liveTime || 0);

      // Convert milliseconds to a human-readable format
      const hours = Math.floor(totalTime / 3600000);
      const minutes = Math.floor((totalTime % 3600000) / 60000);
      const seconds = Math.floor(((totalTime % 3600000) % 60000) / 1000);

      // Update the display
      document.getElementById("timeDisplay").innerText = `You have spent: ${hours} hours, ${minutes} minutes, and ${seconds} seconds on LeetCode!`;
    });
  } catch (error) {
    console.error("Error updating live display:", error);
    document.getElementById("timeDisplay").innerText = "Error loading time.";
  }
}

// Listen for storage changes and update the display dynamically
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.timeInMs || changes.liveTime) {
      updateLiveDisplay(); // Refresh display when time changes
    }
  }
});

// Initial call to update the display on popup load
updateLiveDisplay();
