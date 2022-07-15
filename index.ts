import { Colord } from "colord"
import createRng from "seedable"

/**
 * Concatenate two or more palettes together.
 */
export const concat = (...palettes: readonly (Palettron | readonly string[])[]) => {
    return new Palettron(
        palettes.reduce((list: (string | Colord)[], palette) => {
            const values = palette instanceof Palettron ? palette.colors : palette
            list.push(...values)
            return list
        }, [])
    )
}

/**
 * Merge two or more palettes, removing duplicates.
 */
export const merge = (...palettes: readonly (Palettron | readonly string[])[]) => {
    const set = new Set(
        palettes.reduce((list: string[], palette) => {
            const values =
                palette instanceof Palettron ? palette.colors.map((c) => c.toHex()) : new Palettron(palette).toHex()
            list.push(...values)
            return list
        }, [] as string[])
    )
    return new Palettron([...set])
}

export class Palettron {
    readonly colors: readonly Colord[]

    constructor(colors: readonly (string | Colord)[] = []) {
        this.colors = Object.freeze(colors.map((c) => (c instanceof Colord ? c : new Colord(c))))
    }

    /**
     * The number of colors in the palette.
     */
    get size(): number {
        return this.colors.length
    }

    /**
     * Set the alpha of a palette.
     */
    alpha = (a: number) => new Palettron(this.colors.map((c) => c.alpha(a)))

    /**
     * Darken the colors of a palette.
     */
    darken = (x: number) => new Palettron(this.colors.map((c) => c.darken(x)))

    /**
     * Desaturate the colors of a palette.
     */
    desaturate = (x: number) => new Palettron(this.colors.map((c) => c.desaturate(x)))

    /**
     * Convert a palette to grayscale.
     */
    grayscale = () => new Palettron(this.colors.map((c) => c.grayscale()))

    /**
     * Invert the colors of a palette.
     */
    invert = () => new Palettron(this.colors.map((c) => c.invert()))

    /**
     * Lighten the colors of a palette.
     */
    lighten = (x: number) => new Palettron(this.colors.map((c) => c.lighten(x)))

    /**
     * Rotate the hue of a palette.
     */
    rotate = (x: number) => new Palettron(this.colors.map((c) => c.rotate(x)))

    /**
     * Saturate the colors of a palette.
     */
    saturate = (x: number) => new Palettron(this.colors.map((c) => c.saturate(x)))

    /**
     * Add one or more colors to the palette.
     */
    add = (...colors: readonly (Colord | string)[]) => {
        return new Palettron([...this.colors, ...colors])
    }

    /**
     * Concatenate one or more palettes with this one.
     */
    concat = (...palettes: readonly (Palettron | readonly string[])[]) => {
        return concat(this, ...palettes)
    }

    /**
     * Iterate each Colord object in the palette.
     */
    each = (cb: (color: Colord, index: number, array: readonly Colord[]) => void) => {
        this.colors.forEach(cb)
    }

    /**
     * Filter colors using the underlying Colord object.
     */
    filter = (cb: (color: Colord, index: number, array: readonly Colord[]) => boolean) => {
        return new Palettron(this.colors.filter(cb))
    }

    /**
     * Map colors using the underlying Colord object.
     */
    map = (cb: (color: Colord, index: number, array: readonly Colord[]) => Colord | string) => {
        return new Palettron(this.colors.map(cb))
    }

    /**
     * Merge one or more palettes with this one, removing duplicates.
     */
    merge = (...palettes: readonly (Palettron | readonly string[])[]) => {
        return merge(this, ...palettes)
    }

    /**
     * Modify a specific color in a palette as a Colord object.
     */
    modify = (indices: number | readonly number[], cb: (c: Colord, index: number) => Colord) => {
        const _indices = new Set(Array.isArray(indices) ? indices : [indices])
        return new Palettron(this.colors.map((c, i) => (_indices.has(i) ? cb(c, i) : c)))
    }

    /**
     * Reduce a palette to the specified indicies.
     */
    pick = (indices: number | readonly number[]) => {
        const _indices = new Set(Array.isArray(indices) ? indices : [indices])
        return new Palettron(this.colors.filter((_, i) => _indices.has(i)).map((c) => c))
    }

    /**
     * Replace one color in a palette with another given color.
     */
    replace = (index: number, color: string | Colord) => {
        return new Palettron(this.colors.map((v, i) => (i === index ? color : v)))
    }

    /**
     * Reverse the order of items in a palette.
     */
    reverse = () => new Palettron(this.colors.slice().reverse())

    /**
     * Randomly shuffle the palette based on a random seed.
     */
    shuffle = (seed: number | string = 0) => {
        const rng = createRng(seed)
        return new Palettron(this.colors.slice().sort(() => rng.value - 0.5))
    }

    /**
     * Shift the palette by x indices left or right, with wrapping.
     */
    shift = (x: number) => {
        const n = x % this.colors.length
        const v = n < 0 ? this.colors.length + n : n
        const colors = this.colors.slice()
        const end = colors.splice(-v)
        return new Palettron(end.concat(colors))
    }

    /**
     * Slice a palette like an array.
     */
    slice = (a?: number, b?: number) => new Palettron(this.colors.slice(a, b))

    /**
     * Sort a palette based on its underlying Colord object.
     */
    sort = (cb: (a: Colord, b: Colord) => number) => {
        return new Palettron(this.colors.slice().sort(cb))
    }

    /**
     * Swap two items in a palette by index.
     */
    swap = (a: number, b: number) => {
        const colors = this.colors.slice()
        const temp = colors[a]
        colors[a] = colors[b]
        colors[b] = temp
        return new Palettron(colors)
    }

    /**
     * Return the palette as an array of css hex string values.
     */
    toHex = () => this.colors.map((c) => c.toHex())

    /**
     * Return the palette as an array of css rgb/rgba string values.
     */
    toRgb = () => this.colors.map((c) => c.toRgbString())

    /**
     * Return the palette as an array of css hsl string values.
     */
    toHsl = () => this.colors.map((c) => c.toHslString())

    /**
     * Convert colors in the palette to an array of arbitrary values.
     */
    toAny = <T>(cb: (color: Colord, index: number, array: readonly Colord[]) => T): T[] => {
        return this.colors.map(cb)
    }
}

export const palettron = (...p: readonly (readonly (string | Colord)[])[]) => {
    return new Palettron(p.flat())
}
