# ZedScript - VSCode Extension

A third-party VSCode extension for supporting ZedScript, a scripting format for the game \"Project Zomboid\".

## Features

- Syntax Highlight Support.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

- Odd multi-lining of properties causes String Regex for highlighting to break.

## Release Notes

## [41.78.18]

- Added Icon for VSCode Extension.
- Changed 'Auto-Detect' to only include 'Module X' as 'Version=1' exists in other files and formats.
- Improvements to Syntax highlighter.
  - Removed some of the coloring for recipes.
  - Fixed bugs where termination of Regex was limited where situations can arise.

## [41.78.16]

- Initial release

![img](https://i.imgur.com/ZLnfTK4.png)
