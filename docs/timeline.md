# Persona - Project Timeline & Updates

This document tracks the evolution of the Persona extension, providing a history of major features and technical updates for contributors.

## v2.2.0 - Sub-groups & Advanced Tab Management (2026-04-08)

This update introduces deep integration with Chrome's native Tab Groups and adds powerful new ways to move tabs between workspaces.

### New Features
- **Sub-groups (Chrome Tab Groups)**: Workspaces now automatically capture and restore native Chrome Tab Groups — including group names, colors, and collapsed state.
- **Import Tab Groups**: A dedicated UI (↓ button in Workspaces header) to scan the current window for native Chrome Tab Groups and import them as Sub-groups into a new or existing workspace.
- **Context Menu — Move / Copy Tab**: Right-click any page to instantly move or copy the current tab into any workspace or sub-group.
- **Command Palette — Quick Actions**: The palette (`Alt+Shift+S`) now dynamically generates "Move Active Tab → [Workspace]" and "Copy Active Tab → [Workspace]" commands for every saved workspace.
- **Command Palette — Import Groups**: A new "Import Tab Groups" command in the palette opens the import flow directly.

### UX & DX Improvements
- **Tab Action View**: When triggered via context menu, the popup shows a dedicated target picker with all workspaces and their nested sub-groups.
- **Live Tab Injection**: If a workspace window is currently open, moved/copied tabs are physically opened in that window and grouped into the correct Chrome Tab Group.
- **Backward Compatibility**: Older workspaces without sub-groups continue to work seamlessly — ungrouped tabs remain in the `tabs` array.

### Technical Changes
- **Permissions**: Added `tabGroups` and `contextMenus` to `manifest.json`.
- **Data Model**: Extended the `profiles` schema with a `subGroups` array containing `name`, `color`, `collapsed`, `tabs`, and `chromeGroupId`.
- **Background Workers**: New `extractProfileTabsData()`, `handleExecuteTabAction()`, and `handleImportTabGroups()` handlers.
- **Message Protocol**: Added `IMPORT_TAB_GROUPS` and `EXECUTE_TAB_ACTION` actions to the runtime message bus.
- **Session Storage**: Uses `chrome.storage.session` for ephemeral `pendingTabAction` and `pendingImport` flags.

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
