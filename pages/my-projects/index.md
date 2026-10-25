---
title: My Projects
description: A list of projects I created or I worked on
outline: [2, 3]
---

# My Projects

## Virtual Scroll {.title--big}

A high-performance, dependency-free virtual scrolling library for Vue 3. Renders only the visible items and handles massive or dynamically sized lists by scaling coordinates beyond the browser scroll limits.

* [Code](https://github.com/pdanpdan/virtual-scroll)
* [Documentation & Examples](https://pdanpdan.github.io/virtual-scroll/)
* [Package](https://www.npmjs.com/package/@pdanpdan/virtual-scroll)

## Headless Combobox {.title--big}

An accessible, renderless combobox for Vue 3 with filtering and keyboard navigation, part of the headless-components monorepo.

* [Code](https://github.com/pdanpdan/headless-components)
* [Documentation & Examples](https://pdanpdan.github.io/headless-components/)
* [Package](https://www.npmjs.com/package/@pdanpdan/headless-combobox)

## Mermaid Pele Preview {.title--big}

A VS Code extension that renders Mermaid diagrams with Pele instead of Mermaid.js. `.mmd` and `.mermaid` files open in a preview editor, fenced `mermaid` blocks render in the Markdown preview, and diagrams can be saved as SVG. Math labels are typeset with Temml. Themes and icon packs are configurable.

* [Code](https://github.com/pdanpdan/mermaid-pele-preview)
* [Marketplace](https://marketplace.visualstudio.com/items?itemName=pdanpdan.mermaid-pele-preview)

## Vue Keyboard Trap {.title--big}

A Vue 3 and Vue 2 directive for keyboard navigation / TAB trapping - roving movement and trapping inside container that can greatly improve a11y in your applications.

* [Code](https://github.com/pdanpdan/vue-keyboard-trap)
* [Documentation](https://pdanpdan.github.io/vue-keyboard-trap/)
* [Package](https://www.npmjs.com/package/@pdanpdan/vue-keyboard-trap)
* [Demo CodePen](https://codepen.io/pdanpdan/pen/MWrzLdM)

## Gerrymandle Solver {.title--big}

Solves the daily puzzles from [gerrymandle.com](https://gerrymandle.com): given the day's hex board, it finds a district map that wins the election for the target party. Runs entirely in your browser.

* [Code](https://github.com/pdanpdan/gerrymandle)
* [Online Solver](https://pdanpdan.github.io/gerrymandle-solver/)

## Wordle Solver {.title--big}

A solver / helper for the Wordle game. Can be used as `solver` or as `game`, in both `easy` and `hard` modes.

* [Code](https://github.com/pdanpdan/wordle-solver)
* [Online Solver](https://pdanpdan.github.io/wordle-solver/)

## SSL Certificate Manager {.title--big}

A desktop / electron application to inspect and validate SSL certificates.

* [Code](https://github.com/pdanpdan/ssl-certificate-manager)

## Quasar v1 (Vue 2) {.title--big}

Quasar is a Vue based components framework that also provide an easy way to build cross-target applications (web, mobile - cordova/capacitor, desktop - electron).

Current version of [Quasar is v2 (Vue 3)](https://quasar.dev/), and the Quasar v1 (Vue 2) is considered EOL.

[This is a still maintained version of the original Quasar v1 (Vue 2)](https://github.com/pdanpdan/quasar/releases) that provides a lot of **bug fixes** and **improvements**.

* [List of changes](https://github.com/pdanpdan/quasar/releases) from the official Quasar v1 release
* [Documentation](https://pdanpdan.github.io/quasar-docs/)

### Highlights of the features / fixes

This version will be supported for as long as I use it (so at least till the end of 2024).

* Material Design Outlined style for form components (QField, QInput, QSelect)
* touch directives are reactive
* new `Interactive` plugin to manage events
* new `KeyGroupNavigation` directive to manage TAB navigation in containers and roving navigation
* improvements to lots of components (`QSelect`, `QVirtualScroll`, `QMenu`, `QDialog`, `QTooltip`, `QTime`, `QDate`, ...)
  * improved keydoard navigation for all components
  * improved scroll prevention when dialogs are displayed
  * improved menus / tooltips - better positioning on screen
  * improved `Ripple` directive
  * lots of improvements and fixes for `QDate`
  * great rendering speed increase for `QVirtualScroll`

### On request paid support

If you need extended support / features / fixes for Quasar v1 please contact me for a paid support contract.

### To use the modified version instead of the official Quasar v1:

* in your `package.json` file add a key `quasar` inside `dependencies` section (or replace the existing one) with the value `"https://github.com/pdanpdan/quasar#quasar-pdan-v1.22.10-beta.3`
  * replace the version number with the latest one from the [releases page](https://github.com/pdanpdan/quasar/releases)
  * the versions are based on the official Quasar v1 releases, and the `-beta.X` is the internal release number for each official version number

```json {3}
"dependencies": {
  ...
  "quasar": "https://github.com/pdanpdan/quasar#quasar-pdan-v1.22.10-beta.3", // [!code focus]
  ...
}
```

* reinstall the packages (`yarn cache clean --pattern quasar && yarn` / `pnpm i`)
* no other changes are required

## Quasar Play REPL {.title--big}

A Vue REPL for Quasar, featuring:
- Quasar Framework v2
- VueRouter
- VueI18n
- Pinia
- JS and/or TS

You can create, share and save projects online in your browser.

Now you have no excuse for not providing a repro in case you have issus :D

* [Code](https://github.com/pdanpdan/quasar-play)
* [Demo Online](https://pdanpdan.github.io/quasar-play/)
