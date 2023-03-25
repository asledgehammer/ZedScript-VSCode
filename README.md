# ZedScript - VSCode Extension

A third-party VSCode extension for supporting ZedScript, a scripting format for the game \"Project Zomboid\".

## Features

- Syntax highlight support.
- Experimental auto-complete for recipe and item properties.
- Auto-completion support for recipe and item properties.

## Known Issues

- Odd multi-lining of properties causes String Regex for highlighting to break.
- Not all scope documentation and auto-completion are implemented at this time.

## Release Notes

## [41.78.23]

- Fixed VSCode version to slightly newer installations of the editor.
- Documented generic item-scope properties.
- Revised Scope API.
  - Implemented enum support.
  - Improved documentation population by using properties in property objects.
  - Improved lua properties.
  - Added range support for integer-property documentation.
- Implemented hover-documentation support for recipe and item properties.

## [41.78.19]

- Fixed VSCode version to support older installations of the editor.
- First version of auto-completion support for Recipes.

## [41.78.18]

- Added Icon for VSCode Extension.
- Changed 'Auto-Detect' to only include 'Module X' as 'Version=1' exists in other files and formats.
- Improvements to Syntax highlighter.
  - Removed some of the coloring for recipes.
  - Fixed bugs where termination of Regex was limited where situations can arise.

## [41.78.16]

- Initial release

![img](https://i.imgur.com/ZLnfTK4.png)
