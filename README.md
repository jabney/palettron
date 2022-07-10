Manipulate palettes of colors in wonderful ways.

Immutable. Particularly useful for working with chart colors.

Uses [Colord](https://www.npmjs.com/package/colord) for color value manipulation under the hood.

## Installation

```sh
npm install palettron
```

## Usage

```js
import { palettron } from "palettron"

// Values can be a css color string or Colord object.
const palette = palettron([
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
])


/**
 * - Swap the order of the first two colors.
 * - Shift the palette one index to the right, wrapping the last to the first.
 * - Darken the colors.
 * - Desaturate a bit.
 * - Pick every other color.
 * - Return an array of rgb string values.
 */
const colors = palette.swap(0, 1).shift(1).darken(0.1).desaturate(0.2).pick([0, 2, 4]).toRgb()
/* [
    'rgb(20, 184, 184)',
    'rgb(184, 20, 20)',
    'rgb(184, 184, 20)',
] */
```

## API

```ts
/**
 * The number of colors in the palette.
 */
get length(): number;

/**
 * Set the alpha of a palette.
 */
alpha: (a: number) => Palettron;

/**
 * Darken the colors of a palette.
 */
darken: (x: number) => Palettron;

/**
 * Desaturate the colors of a palette.
 */
desaturate: (x: number) => Palettron;

/**
 * Convert a palette to grayscale.
 */
grayscale: () => Palettron;

/**
 * Invert the colors of a palette.
 */
invert: () => Palettron;

/**
 * Lighten the colors of a palette.
 */
lighten: (x: number) => Palettron;

/**
 * Rotate the hue of a palette.
 */
rotate: (x: number) => Palettron;

/**
 * Saturate the colors of a palette.
 */
saturate: (x: number) => Palettron;

/**
 * Randomly shuffle the palette based on a random seed.
 */
shuffle: (seed?: number | string) => Palettron;

/**
 * Shift the palette by x indices left or right, with wrapping.
 */
shift: (x: number) => Palettron;

/**
 * Swap two items in a palette by index.
 */
swap: (a: number, b: number) => Palettron;

/**
 * Reverse the order of items in a palette.
 */
reverse: () => Palettron;

/**
 * Reduce a palette to the specified indicies.
 */
pick: (indices: number | readonly number[]) => Palettron;

/**
 * Slice a palette like an array.
 */
slice: (a: number, b: number) => Palettron;

/**
 * Replace one color in a palette with another given color.
 */
replace: (index: number, color: string | Colord) => Palettron;

/**
 * Modify a specific color in a palette as a Colord object.
 */
modify: (indices: number | number[], cb: (c: Colord) => Colord) => Palettron;

/**
 * Concatenate one or more palettes with this one.
 */
concat: (...palettes: readonly (Palettron | readonly string[])[]) => Palettron;

/**
 * Map colors using the underlying Colord object.
 */
map: (cb: (color: Colord, index: number, array: readonly Colord[]) => Colord | string) => Palettron;

/**
 * Filter colors using the underlying Colord object.
 */
filter: (cb: (color: Colord, index: number, array: readonly Colord[]) => boolean) => Palettron;

/**
 * Return the palette as an array of css hex string values.
 */
toHex: () => string[];

/**
 * Return the palette as an array of css rgb/rgba string values.
 */
toRgb: () => string[];

/**
 * Return the palette as an array of css hsl string values.
 */
toHsl: () => string[];
```