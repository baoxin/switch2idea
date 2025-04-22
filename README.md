# Switch2Idea

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/baoxin.switch2idea?label=VS%20Marketplace&style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=baoxin.switch2idea)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/baoxin.switch2idea?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=baoxin.switch2idea)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

A VSCode extension that enables quick switching between VSCode and JetBrains IDEs (IntelliJ IDEA, WebStorm, Android Studio).

![Switch2Idea Demo](images/switch-show.gif)

## ✨ Features

- 🚀 Quick switching between VSCode and JetBrains IDEs
- 📂 Open current file in JetBrains IDE with the same position
- 📁 Open current project in JetBrains IDE
- 🛠️ Support for multiple JetBrains IDEs:
  - IntelliJ IDEA
  - WebStorm
  - Android Studio
- ⌨️ Keyboard shortcuts support
- 📝 Context menu integration
- 🌐 Cross-platform support (Windows, macOS, Linux)

## 📦 Installation

1. Open VSCode
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS) to open the Extensions view
3. Search for "Switch2Idea"
4. Click Install

Alternatively, you can install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=baoxin.switch2idea)

## ⚙️ Configuration

Before using the extension, you need to configure the paths to your JetBrains IDEs:

1. Open VSCode Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Switch2Idea"
3. Configure the following paths:
   - `switch2idea.webStormPath`: Path to WebStorm executable
   - `switch2idea.androidStudioPath`: Path to Android Studio executable

### Default Paths

- **WebStorm**:
  - Windows: `C:\Program Files\JetBrains\WebStorm\bin\webstorm64.exe`
  - macOS: `/Applications/WebStorm.app/Contents/MacOS/webstorm`
  - Linux: `/usr/local/bin/webstorm`

- **Android Studio**:
  - Windows: `C:\Program Files\Android\Android Studio\bin\studio64.exe`
  - macOS: `/Applications/Android Studio.app/Contents/MacOS/studio`
  - Linux: `/usr/local/android-studio/bin/studio.sh`

## 🚀 Usage

### Opening Files

1. Open the file you want to switch in VSCode
2. Use one of the following methods to open the file in a JetBrains IDE:
   - Keyboard shortcuts:
     - WebStorm: `Alt+Shift+O`
     - Android Studio: `Alt+Shift+O O`
   - Right-click the file and select "Open File in [IDE]"
   - Use the Command Palette (`Ctrl+Shift+P`) and type "Open File in [IDE]"

### Opening Projects

1. Open the project you want to switch in VSCode
2. Use one of the following methods to open the project in a JetBrains IDE:
   - Keyboard shortcuts:
     - WebStorm: `Alt+Shift+P`
     - Android Studio: `Alt+Shift+P P`
   - Right-click the project in the Explorer and select "Open Project in [IDE]"
   - Use the Command Palette (`Ctrl+Shift+P`) and type "Open Project in [IDE]"

## ⌨️ Keyboard Shortcuts

- **WebStorm**:
  - Open File: `Alt+Shift+O`
  - Open Project: `Alt+Shift+P`
- **Android Studio**:
  - Open File: `Alt+Shift+O O`
  - Open Project: `Alt+Shift+P P`

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❓ FAQ

### Q: The IDE doesn't open when I use the shortcut or context menu
A: Please check:
1. The IDE path is correctly configured in VSCode settings
2. The IDE is properly installed
3. You have sufficient permissions to run the IDE

### Q: Can I use different IDEs for different projects?
A: Yes! You can configure IDE paths per workspace:
1. Open VSCode settings
2. Switch to the Workspace tab
3. Configure the IDE paths for your current workspace

### Q: Does it support other JetBrains IDEs?
A: Currently, the extension officially supports IntelliJ IDEA, WebStorm, and Android Studio. Support for other JetBrains IDEs may be added in future versions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📮 Feedback

If you encounter any issues or have suggestions, please:
- [Open an Issue](https://github.com/baoxin/switch2idea/issues)
- [Submit a Pull Request](https://github.com/baoxin/switch2idea/pulls)

[中文文档](README_zh.md)