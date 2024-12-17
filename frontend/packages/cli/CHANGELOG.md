# @liam-hq/cli

## 0.0.10

### Patch Changes

- 66bef4c: fix: reword to open in main area
- bfcbb3a: LeftPane now shows the number of tables currently being displayed
- ae4e27a: fix: Fixed an issue where edges were displayed during the initial loading
- 3f4965f: `Tidy up` button now allows layout adjustments for only the currently displayed nodes
- 9e88995: Refactored components for better maintainability: TableColumnList, TableColumn, Cardinality.
- 28e7f9e: fix: reduce button-in-button
- 91895fd: `-V/--version` now displays the correct version number.
- 9ed0bdd: It is now possible to hide tables other than Related Tables
- 8109940: refactor: reduce useEffect
- b6112e9: Fixed incorrect cardinality icon positioning (left/right)
- a9b9579: ✨Changed the default show mode to 'Table name only'
- 471d49b: fix: Fixed an issue where edges were displayed incorrectly when switching the show mode
- 7eccf51: Add current link copy button
- 3b9c3b4: refactor: Reduced performance degradation caused by calculations for source and target
- a85acb3: fix: Fixed an issue where URL sharing in TableDetail sometimes did not work correctly
- 846feee: Fixed excessive highlighting of cardinality elements.
- d255ff3: fix: Removed the highlight on Edge hover to prevent performance degradation

## 0.0.9

### Patch Changes

- 1aeed01: fix: reduce button-in-button
- 8ed7b59: Enabled toggling the visibility of Table Nodes from the Left Pane.
- b1521ed: Add url query params for quick access

## 0.0.8

### Patch Changes

- Fixed border radius for TABLE_NAME show mode.
- Update HTML and view header titles in ERD.
- feat: 1:n and 1:1 notations can now be displayed when highlighting relationships
- Added links to documentation and community resources
- feat: update ELK layout options for improved node placement and spacing
- fix: disable delete key functionality for delete TableNode
- refactor: optimize edge highlighting using useReactFlow hooks

## 0.0.7

### Patch Changes

- 48f610a: Add tooltips to display the full table name when it is truncated in the Table node

## 0.0.6

### Patch Changes

- Various improvements to the UI/UX

## 0.0.5

### Patch Changes

- Various improvements to the UI/UX

## 0.0.4

### Patch Changes

- Various improvements to the UI/UX

## 0.0.3

### Patch Changes

- Various improvements to the UI/UX

## 0.0.2

### Patch Changes

- 22d8714: Use GitHub App Token for release workflow in GitHub Actions
- 4abcf14: Fix build process: call `pnpm build` before release publishing

## 0.0.1

### Patch Changes

- 562e1fe: First release
