# Change Log

All notable changes to the "zed" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [41.78.24]
- Major restructuring of scoped logic.
  - Consolidated item properties from separate files to prevent duplicate entries populating auto-complete.
  - Added support for module-scope categories. (Opens the door for future templates)
  - Added support for documentation of module-scopes.
  - Initial work for nested scopes auto-complete. (Planned for the next release)
- Completed catalog for item properties, sorted by item types. (Weapon, Radio, etc.)
- Minor fixes to the TextMate Grammar. (Syntax Highlighting)
- Planned write of passive tokenizer for a less aggressive formatter.
- Added basic support for `evolvedrecipe`.
- Added basic support for `animation` and `animationsMesh`.
- Preparation for other module-scope categories.
- Improved the scope API for extendability.
- Improved tooltip hovers for items.
  - Added property-name headers.
    - Properties display types.
  - Lua function examples display better.
  - Improved spacing between sections of generated tooltip.
- Improvement of `AnimNode` property in `recipe`, providing options as enum values.
- Added more range support for numeric-type properties.
- Some link references for module-scope documentation. 

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