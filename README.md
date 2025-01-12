# LeetCode Time Counter!

This small Chrome extension keeps track of how much time you have spent on [LeetCode](https://leetcode.com)!

## Features

- **Live Time Tracking:** Automatically tracks the time you spend on LeetCode in real-time.
- **Persistent Storage:** Keeps a cumulative record of your total time spent, even across browser sessions.
- **Dynamic Popup Display:** The popup shows the cumulative time spent, updating live while you use LeetCode.
- **Seamless Integration:** Tracks time automatically when you open or close LeetCode tabs.
- **User-Friendly Design:** Clean and intuitive UI with a pink-themed gradient design.

---

## Technical Details

### How It Works
1. **Tab Monitoring:**
   - The extension uses `chrome.tabs.onUpdated` to detect when you open or navigate to a LeetCode tab.
   - It uses `chrome.tabs.onRemoved` to stop tracking when you close a LeetCode tab.

2. **Time Tracking:**
   - Tracks time using `Date.now()` to calculate the duration of active sessions.
   - Cumulative time (`timeInMs`) and live session time (`liveTime`) are stored using `chrome.storage.local`.

3. **Storage:**
   - Stores cumulative time (`timeInMs`), live time (`liveTime`), and the session start timestamp (`openTime`) in Chrome's local storage.
   - Ensures data persists even when the browser is restarted.

4. **Popup Display:**
   - Updates the popup dynamically with the total time spent (live + cumulative) using `chrome.storage.onChanged`.

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/DucoLam/LeetCodeExtension.git
2. Open Chrome and navigate to:
    ```bash
    chrome://extensions
3. Enable Developer Mode (toggle in the top right corner).
4. Click Load Unpacked and select the folder where you cloned the repository.
5. The extension will now appear in your Chrome toolbar.

---

## Usage
1. Open any [LeetCode](https://leetcode.com) page. 
2. The extension will start tracking your time automatically. 
3. Click the extension icon to view your total time spent on LeetCode. 4. 4. Close all LeetCode tabs to save the session time.

---

## Notes
- The extension tracks time only while the LeetCode tab is open and active in your browser.
- It does not track idle time or inactivity (e.g., leaving a tab open while away from your computer).
License

---

##Future Enhancements
- Publish on Chrome Webstore
- Add a detailed breakdown of time spent per session.
- Include an optional reset button for clearing the time data.
- Add support for dark mode in the popup UI.
P- rovide visual analytics (charts/graphs) for time usage patterns.
