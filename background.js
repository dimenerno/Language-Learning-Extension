var isTranslating = false;
var favorites = [];
var frequency = 1.0;
chrome.storage.local.set({ isTranslating })
chrome.storage.local.set({ favorites })
chrome.storage.local.set({ frequency })