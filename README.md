# Persona - Multi-Account & Workspace Manager

**Persona** is a premium browser extension that allows you to save and switch between multiple user accounts and browsing workspaces with a single click. Originally built for the Brave browser (to provide the missing profile switching feature), it works flawlessly on all Chromium-based browsers (Chrome, Edge, Brave).

It works by capturing session cookies and storing them locally. Switching a workspace or account instantly swaps your browser environment, managing both your identity and your open tabs.

## 🚀 Features

- **Workspace Management**: Organize your work into named contexts (e.g., "Dev", "Work", "Personal"). Each workspace remembers its own tabs.
- **Sub-groups (Chrome Tab Groups)**: Workspaces automatically capture and restore native Chrome Tab Groups — names, colors, and collapsed state are all preserved.
- **Import Tab Groups**: Scan your current browser window for native Tab Groups and import them into a new or existing workspace with a single click.
- **Move / Copy Tabs**: Right-click any page and select "Move Tab to Workspace" or "Copy Tab to Workspace" to instantly send it to any workspace or sub-group.
- **Detach to Window**: "Pop out" the extension into a standalone, persistent window that stays open even if you click away. Fully responsive and supports full-screen.
- **Default Workspace**: Tag a specific workspace as "Default" to open it instantly via shortcut.
- **Workspace Switcher**: A Raycast-style modal (`Alt+Shift+D`) for fuzzy searching and switching between workspaces with arrow keys.
- **Command Palette**: A global palette (`Alt+Shift+S`) to search across all open tabs, move/copy the active tab to any workspace, and execute quick actions.
- **Multi-Account Switching**: Save multiple profiles for the same website and swap between them instantly.
- **Premium Glassmorphic UI**: A stunning, modern interface with glassmorphism, soft shadows, and smooth micro-animations.
- **Smart Hibernation**: Inactive workspaces are "hibernated" to save memory, closing their windows but preserving all tabs for instant restoration.
- **Keyboard Shortcuts**: 
  - `Alt+Shift+1`: Open the **Default** workspace (or first workspace if no default set).
  - `Alt+Shift+D`: Open the **Workspace Switcher**.
  - `Alt+Shift+S`: Open the **Command Palette**.
  - `Alt+C`: **Hibernate** the active workspace window instantly.
  - `Esc`: Close any open Persona modal (Switcher/Palette/Dashboard).
- **Security Hardened**: 
  - **Anti-XSS**: Safe DOM manipulation prevents script injection.
  - **HttpOnly Enforcement**: Automatically secures authentication tokens during restoration.
  - **CSRF Protection**: Implements `SameSite: Lax` by default.
- **Privacy First**: All data is stored 100% locally on your machine. No telemetry, no cloud, no tracking.

## 🛠️ Installation

Since this is a developer extension, you need to load it manually:

1.  Download or clone this repository to a folder on your computer.
2.  Open your browser and navigate to the extensions page:
    *   **Chrome**: `chrome://extensions/`
    *   **Brave**: `brave://extensions/`
3.  Toggle **Developer mode** (top-right).
4.  Click **Load unpacked** and select the **`src/`** directory of this repository.

## 📖 How to Use

### 1. Managing Workspaces
- Click the **+** icon in the **Workspaces** section to create a new context.
- Associate the workspace with a saved account and optionally capture your current tabs.
- Click a workspace to open it in a new window or **Hibernate** it to free up memory.

### 2. Saving Accounts
- Log in to any website (e.g., Gmail).
- Open Persona and it will auto-detect your active session.
- Click **Save Account** to store it globally for use in any workspace.

### 3. Switching Identities
- In the **Accounts** section, click any saved account to instantly swap the current tab's identity.
- The page will reload, and you will be logged in as the selected user.

## 🔒 Permissions Explained

*(For a deep dive into our threat model, read [docs/SECURITY.md](./docs/SECURITY.md))*

This extension requires specific permissions to function:

- **`cookies`**: Essential for reading the current session to save it and injecting saved cookies to switch accounts.
- **`storage`**: Used to save your account lists and active session IDs locally.
- **`tabs` & `activeTab`**: Required to detect the current website domain and reload the page after switching accounts.
- **`tabGroups`**: Required to capture and restore native Chrome Tab Groups within workspaces.
- **`contextMenus`**: Powers the right-click "Move/Copy Tab to Workspace" actions.
- **`scripting`**: Used to safely inject a script into the page to scrape the user's name and avatar for the UI.
- **`<all_urls>`**: Required to allow the extension to switch accounts on any website. This is hardened with a strict **Content Security Policy** and **HttpOnly Flag Assistance** to prevent session theft.

## 📂 Project Structure

- **`src/`**: Contains the source code for the extension.
  - **`manifest.json`**: Configuration file defining permissions and entry points.
  - **`background.js`**: Service worker that handles the heavy lifting—saving cookies, clearing cookies, and swapping sessions.
  - **`popup.*`**: The user interface.
  - **`content.js`**: Script that runs on the web page to extract profile info.
  - **`assets/`**: Static assets like icons.
- **`docs/`**: Project documentation, active bug lists, and security policies.
  - **`ROADMAP.md`**: What's coming next!
  - **`SECURITY.md`**: Threat models and reporting.
  - **`TODO.md`**: Active development tasks and logs.
  - **`timeline.md`**: Project history and major update logs.
  - **`VISION.md`**: Project scope and aspirations.
- **`CONTRIBUTING.md`**: Guidelines for external contributors.
- **`CODE_OF_CONDUCT.md`**: Community standards.

## 🤝 Contributing

We welcome community contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) to get started. Be sure to review the [TODO.md](./docs/TODO.md) to claim an unassigned issue. Use our established [Code of Conduct](./CODE_OF_CONDUCT.md) when interacting with the community.

## ⚠️ Disclaimer

This tool is for educational and productivity purposes. Since it manipulates session cookies:
1.  **Security**: Treat the computer where you save these sessions securely. Anyone with access to your browser can switch to your saved accounts.
2.  **Session Expiry**: If a website invalidates your session (e.g., you change your password or the cookie expires), you will need to log in again and update the saved account in Persona.

---


