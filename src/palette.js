// palette.js - Logic for Persona Command Palette

let allItems = [];
let filteredItems = [];
let selectedIndex = 0;
let activeTabCache = null; // stores the real browser tab info

const COMMANDS = [
  { id: 'add-account', title: 'Add Account', subtitle: 'Connect a new Google account', icon: '👤', section: 'Actions' },
  { id: 'create-workspace', title: 'Create Workspace', subtitle: 'New profile from current tabs', icon: '📂', section: 'Actions' },
  { id: 'import-groups', title: 'Import Tab Groups', subtitle: 'Import native Chrome Tab Groups as a Workspace', icon: '📥', section: 'Actions' },
  { id: 'sign-out-all', title: 'Sign Out All', subtitle: 'Remove all sessions from extension', icon: '🚪', section: 'Danger Zone' },
  { id: 'go-home', title: 'Dashboard', subtitle: 'Open main extension view', icon: '🏠', section: 'System' },
];

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('palette-search');
  searchInput.focus();

  await loadItems();

  searchInput.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredItems.length;
      renderList();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
      renderList();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    }
  });
});

async function loadItems() {
  // Load Actions
  allItems = [...COMMANDS];

  // Capture the REAL active browser tab (not this palette window)
  try {
    const lastWin = await chrome.windows.getLastFocused({ windowTypes: ['normal'] });
    if (lastWin) {
      const tabs = await chrome.tabs.query({ active: true, windowId: lastWin.id });
      if (tabs[0] && tabs[0].url && !tabs[0].url.startsWith('chrome')) {
        activeTabCache = tabs[0];
      }
    }
  } catch (err) {
    console.error('Failed to detect active tab:', err);
  }

  // Load Recent Tabs from Profiles & generate Move/Copy commands
  try {
    const response = await chrome.runtime.sendMessage({ action: "GET_PROFILES" });
    if (response && response.success) {
      const profiles = response.profiles;

      // Generate Move/Copy commands for each workspace
      if (activeTabCache) {
        profiles.forEach(p => {
          allItems.push({
            id: `move-to-${p.id}`,
            title: `Move Active Tab → ${p.name}`,
            subtitle: activeTabCache.title?.substring(0, 60) || activeTabCache.url,
            icon: '➡️',
            section: 'Quick Actions',
            workspaceId: p.id,
            actionType: 'move'
          });
          allItems.push({
            id: `copy-to-${p.id}`,
            title: `Copy Active Tab → ${p.name}`,
            subtitle: activeTabCache.title?.substring(0, 60) || activeTabCache.url,
            icon: '📋',
            section: 'Quick Actions',
            workspaceId: p.id,
            actionType: 'copy'
          });
        });
      }

      // Load Recent Tabs
      profiles.forEach(p => {
        p.tabs.forEach(tab => {
          allItems.push({
            id: `tab-${p.id}-${tab.url}`,
            title: tab.title || 'Untitled Tab',
            subtitle: `In Workspace: ${p.name}`,
            icon: '🌐',
            section: 'Recent Tabs',
            url: tab.url,
            profileId: p.id
          });
        });
      });
    }
    filteredItems = [...allItems];
    renderList();
  } catch (err) {
    console.error("Failed to load palette items:", err);
  }
}

function filterItems(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    filteredItems = [...allItems];
  } else {
    filteredItems = allItems.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.subtitle.toLowerCase().includes(q)
    );
  }
  selectedIndex = 0;
  renderList();
}

function renderList() {
  const listEl = document.getElementById('palette-list');
  listEl.innerHTML = '';

  let currentSection = '';

  filteredItems.forEach((item, index) => {
    if (item.section !== currentSection) {
      currentSection = item.section;
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'palette-section';
      sectionHeader.textContent = currentSection;
      listEl.appendChild(sectionHeader);
    }

    const el = document.createElement('div');
    el.className = `palette-item ${index === selectedIndex ? 'selected' : ''}`;
    
    if (index === selectedIndex) {
      setTimeout(() => el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 0);
    }

    const icon = document.createElement('div');
    icon.className = 'item-icon';
    icon.textContent = item.icon;

    const info = document.createElement('div');
    info.className = 'item-info';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'item-title';
    titleDiv.textContent = item.title;

    const subtitleDiv = document.createElement('div');
    subtitleDiv.className = 'item-subtitle';
    subtitleDiv.textContent = item.subtitle;

    info.appendChild(titleDiv);
    info.appendChild(subtitleDiv);

    el.appendChild(icon);
    el.appendChild(info);

    el.addEventListener('click', () => executeItem(item));
    listEl.appendChild(el);
  });

  if (filteredItems.length === 0) {
    listEl.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary);">No commands or files found</div>';
  }
}

async function executeItem(item) {
  // Move / Copy active tab to workspace
  if (item.id.startsWith('move-to-') || item.id.startsWith('copy-to-')) {
    if (!activeTabCache) {
      alert('No active browser tab detected.');
      return;
    }
    const payload = {
      actionType: item.actionType,
      tabData: {
        url: activeTabCache.url,
        title: activeTabCache.title,
        favIconUrl: activeTabCache.favIconUrl,
        tabId: activeTabCache.id
      },
      workspaceId: item.workspaceId
    };
    const resp = await chrome.runtime.sendMessage({ action: "EXECUTE_TAB_ACTION", payload });
    if (resp && resp.success) {
      window.close();
    } else {
      alert('Failed: ' + (resp?.error || 'Unknown error'));
    }
    return;
  }

  if (item.id.startsWith('tab-')) {
    chrome.tabs.create({ url: item.url });
    window.close();
  } else if (item.id === 'add-account') {
    chrome.tabs.create({ url: 'https://accounts.google.com/AddSession' });
    window.close();
  } else if (item.id === 'create-workspace') {
    try {
      await chrome.action.openPopup();
    } catch (e) {
      await chrome.runtime.sendMessage({ action: "OPEN_FOCUSED_POPUP", payload: { mode: "create" } });
    }
    window.close();
  } else if (item.id === 'import-groups') {
    // Open popup in import mode - store a flag
    await chrome.storage.session.set({ pendingImport: true });
    try {
      await chrome.action.openPopup();
    } catch (e) {
      await chrome.runtime.sendMessage({ action: "OPEN_FOCUSED_POPUP" });
    }
    window.close();
  } else if (item.id === 'sign-out-all') {
    if (confirm('Sign out from all extension sessions?')) {
      chrome.storage.local.clear(() => window.close());
    }
  } else if (item.id === 'go-home') {
    try {
      await chrome.action.openPopup();
    } catch (e) {
      await chrome.runtime.sendMessage({ action: "OPEN_FOCUSED_POPUP", payload: { mode: "dashboard" } });
    }
    window.close();
  }
}
