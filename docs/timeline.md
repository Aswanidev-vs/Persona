# Persona - Project Timeline & Updates

This document tracks the evolution of the Persona extension, providing a history of major features and technical updates for contributors.

## v2.1.1 - Tab Management Fixes (2026-04-01)

This patch fixes critical bugs in the workspace tab management system and improves the real-time UI responsiveness.

### Bug Fixes
- **Save Tabs crash**: Fixed `ReferenceError: profile is not defined` in `handleSaveTabsToProfile` (`background.js`) — the console.log referenced an undefined `profile` variable instead of `profiles[profileIndex]`.
- **Wrong window on save**: `saveTabsToProfile()` and `saveProfile()` in `popup.js` always grabbed `windows[0]` (first window) instead of the user's focused window. Changed to `chrome.windows.getLastFocused()`.
- **Tabs lost on "Save Current Tabs"**: "Save Current Tabs" completely replaced the workspace's tabs with all browser tabs, undoing manual removals. Now uses a **merge strategy** — only new tabs (by URL) are added; existing and manually kept tabs are preserved. Applied to both `handleSaveTabsToProfile` and `handleHibernateProfile`.

### UX Improvements
- **Real-time UI updates**: Tab add, remove, and save operations now update the UI instantly using response data instead of waiting for a storage round-trip. `openProfileDetails()` accepts an optional `tabsOverride` parameter for immediate rendering. Workspace list tab count also refreshes after changes.

### Technical Changes
- **Merge logic**: Added URL-based deduplication (`Set`) in `handleSaveTabsToProfile` and `handleHibernateProfile` to merge incoming browser tabs with existing workspace tabs.
- **`openProfileDetails` signature**: Extended to accept `(profileId, tabsOverride)` for optimistic UI updates before storage confirmation.

---

## v2.1.0 - The Productivity Update (2026-03-22)

This update focuses on rapid navigation and workflow efficiency by introducing a Raycast-inspired interface.

### New Features
- **Workspace Switcher (`Alt+Shift+D`)**: A centered modal for fuzzy-searching and switching between all user-created workspaces using arrow keys.
- **Command Palette (`Alt+Shift+S`)**: A global navigation hub that allows searching across all tabs in all active workspaces and executing quick actions.
- **Default Workspaces**: Users can now mark a workspace as "Default" (star icon).
- **Default Shortcut (`Alt+Shift+1`)**: Instantly opens the default workspace, or falls back to the first available workspace if no default is set.

### UX & DX Improvements
- **Modal Close (`Esc`)**: All popups (Dashboard, Switcher, Palette) now close immediately upon pressing the `Escape` key.
- **Centered Popups**: Improved the `openCenteredPopup` logic in `background.js` to ensure tools open in the center of the focused window.
- **Dashboard Fallback**: Implemented a fallback mechanism for opening the main dashboard from sub-popups when `chrome.action.openPopup` is restricted.
- **Dynamic Hints**: Updated the popup footer to dynamically show all configured keyboard shortcuts based on the state.

### Technical Changes
- **Shortcut Optimization**: Reduced the number of custom commands in `manifest.json` to 4 to comply with Chrome's absolute limit for extensions.
- **Storage Evolution**: Updated the `profiles` data structure to include an `isDefault` boolean property.
- **Message Protocol**: Added `TOGGLE_DEFAULT_PROFILE` and `OPEN_FOCUSED_POPUP` actions to the runtime message bus.

---

## v2.0.0 - Premium UI & System Rewrite
- Initial implementation of the Glassmorphic design system.
- Full rewrite of the session capture and restoration engine.
- Introduction of the Workspace (Profile) system.
