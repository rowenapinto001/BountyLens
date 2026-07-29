chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
    // Older Chrome builds may not support this helper yet.
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (typeof tab.windowId === "number") {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
