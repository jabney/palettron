import tap from "tap"
import { Colord } from "colord"
import { palettron, concat, merge, Palettron } from "../index"
import createRng from "seedable"

const primary = Object.freeze(["#ff0000", "#00ff00", "#0000ff"])
const secondary = Object.freeze(["#ffff00", "#ff00ff", "#00ffff"])

tap.test("Creates a palettron from an array of strings", async (t) => {
    const p = palettron(primary)
    t.equal(p.size, primary.length)
    t.match(p.toHex(), primary)
})

tap.test("Creates a palettron from an array of Colord objects", async (t) => {
    const p = palettron(primary.map((c) => new Colord(c)))
    t.equal(p.size, primary.length)
    t.match(p.toHex(), primary)
})

tap.test("Creates a palettron from an array of strings and Colord objects", async (t) => {
    const p = palettron(
        primary.map((c) => new Colord(c)),
        secondary
    )
    t.equal(p.size, primary.length + secondary.length)
    t.match(p.toHex(), [...primary, ...secondary])
})

tap.test("Creates a palettron from more than one palette", async (t) => {
    const p = palettron(primary, secondary)
    t.equal(p.size, primary.length + secondary.length)
    t.match(p.toHex(), [...primary, ...secondary])
})

tap.test("Creates an empty Palettron from constructor", async (t) => {
    const p = new Palettron()
    t.equal(p.size, 0)

    const pNew = p.add(...primary)
    t.equal(pNew.size, primary.length)
})

tap.test("Converts to RGB", async (t) => {
    const p = palettron(primary)
    const colors = primary.map((c) => new Colord(c).toRgbString())

    const pRgb = p.toRgb()
    t.match(pRgb, colors)
})

tap.test("Converts to HSL", async (t) => {
    const p = palettron(primary)
    const colors = primary.map((c) => new Colord(c).toHslString())

    const pRgb = p.toHsl()
    t.match(pRgb, colors)
})

tap.test("Converts to Any", async (t) => {
    const p = palettron(primary)

    const rgbCol = primary.map((c) => new Colord(c).toRgb())
    const pRgb = p.toAny((c) => c.toRgb())
    t.match(pRgb, rgbCol)

    const hslCol = primary.map((c) => new Colord(c).toHsl())
    const pHsl = p.toAny((c) => c.toHsl())
    t.match(pHsl, hslCol)
})

tap.test("Adds colors to a palette", async (t) => {
    const p = palettron()
    const pNew = p.add(...primary, ...secondary)
    t.equal(pNew.size, primary.length + secondary.length)
    t.match(pNew.toHex(), [...primary, ...secondary])
})

tap.test("Concatenates palettes", async (t) => {
    const a = concat(primary, secondary)
    t.equal(a.size, primary.length + secondary.length)
    t.match(a.toHex(), [...primary, ...secondary])

    const b = concat(secondary, primary)
    t.equal(b.size, secondary.length + primary.length)
    t.match(concat(secondary, primary).toHex(), [...secondary, ...primary])
})

tap.test("Concatenates palettes to palettron", async (t) => {
    const a = palettron(primary).concat(secondary)
    t.equal(a.size, primary.length + secondary.length)
    t.match(a.toHex(), [...primary, ...secondary])

    const b = palettron(secondary).concat(primary)
    t.equal(b.size, secondary.length + primary.length)
    t.match(concat(secondary, primary).toHex(), [...secondary, ...primary])
})

tap.test("Merges palettes", async (t) => {
    const a = merge(primary, primary, secondary, secondary)
    t.equal(a.size, 6)
    t.match(a.toHex(), [...primary, ...secondary])

    const b = merge(primary, secondary, primary, secondary)
    t.equal(b.size, 6)
    t.match(b.toHex(), [...primary, ...secondary])
})

tap.test("Merges palettes to palettron", async (t) => {
    const a = palettron(primary, primary).merge(secondary, secondary)
    t.equal(a.size, 6)
    t.match(a.toHex(), [...primary, ...secondary])

    const b = palettron(primary, secondary).merge(primary, secondary)
    t.equal(b.size, 6)
    t.match(b.toHex(), [...primary, ...secondary])
})

tap.test("Iterates a palette", async (t) => {
    const p = palettron(primary, secondary)
    const colors: string[] = []

    p.each((c) => colors.push(c.toHex()))
    t.equal(p.size, colors.length)
    t.match(p.toHex(), colors)
})

tap.test("Slices a palette", async (t) => {
    const p = palettron(primary, secondary)

    const a = p.slice(0, 3)
    t.match(a.toHex(), primary)
    t.match(a.size, 3)

    const b = p.slice(3)
    t.match(b.toHex(), secondary)
    t.match(b.size, 3)
})

tap.test("Shifts values", async (t) => {
    const p = palettron(primary)

    t.equal(p.shift(1).size, primary.length)
    t.match(p.shift(1).toHex(), [primary[2], primary[0], primary[1]])

    t.equal(p.shift(-1).size, primary.length)
    t.match(p.shift(-1).toHex(), [primary[1], primary[2], primary[0]])
})

tap.test("Swaps values", async (t) => {
    const p = palettron(primary)

    t.match(p.swap(0, 1).size, primary.length)
    t.match(p.swap(0, 1).toHex(), [primary[1], primary[0], primary[2]])
    t.match(p.swap(1, 2).toHex(), [primary[0], primary[2], primary[1]])
})

tap.test("Filters colors", async (t) => {
    const colors = [...primary, ...secondary]
    const filtered = colors.filter((c) => /#ff.+/i.test(c))
    const p = palettron(colors)

    const pNew = p.filter((c) => c.rgba.r > 0)
    t.equal(pNew.size, filtered.length)
    t.match(pNew.toHex(), filtered)
})

tap.test("Picks colors", async (t) => {
    const p = palettron(primary, secondary)
    const even = [...primary, ...secondary].filter((_, i) => i % 2 === 0)

    const pEven = p.pick([0, 2, 4])
    t.equal(pEven.size, even.length)
    t.match(pEven.toHex(), even)

    const pNew = p.pick(1)
    t.equal(pNew.size, 1)
    t.match(pNew.toHex(), [primary[1]])
})

tap.test("Maps colors", async (t) => {
    const p = palettron(primary)
    const withAlpha = primary.map((c) => `${c}80`)

    const pNew = p.map((c) => c.alpha(0.5))
    t.equal(p.size, pNew.size)
    t.match(pNew.toHex(), withAlpha)
})

tap.test("Modifies colors", async (t) => {
    const p = palettron(primary)

    const a = p.modify(1, (c) => c.alpha(0.5))
    t.equal(a.size, primary.length)
    t.match(a.toHex(), [primary[0], `${primary[1]}80`, primary[2]])

    const b = p.modify([0, 2], (c) => c.alpha(0.25))
    t.equal(b.size, primary.length)
    t.match(b.toHex(), [`${primary[0]}40`, primary[1], `${primary[2]}40`])
})

tap.test("Replaces colors", async (t) => {
    const p = palettron(primary)
    const pNew = p.replace(1, "#777777")
    t.equal(pNew.size, primary.length)
    t.match(pNew.toHex(), [primary[0], "#777777", primary[2]])
})

tap.test("Shuffles a palette", async (t) => {
    const rng = createRng()
    const colors = [...primary, ...secondary].sort(() => rng.value - 0.5)
    const p = palettron(primary, secondary).shuffle()
    t.equal(p.size, colors.length)
    t.match(p.toHex(), colors)
    t.notMatch(p.toHex(), [...primary, ...secondary])
})

tap.test("Sorts a palette", async (t) => {
    const rng = createRng()
    const colors = [...primary, ...secondary].map((c, i) => new Colord(c).alpha((i + 1) / 6))
    const shuffled = colors.slice().sort(() => rng.value - 0.5)

    const p = palettron(shuffled).sort((a, b) => a.rgba.a - b.rgba.a)
    t.equal(p.size, colors.length)
    t.match(
        p.toHex(),
        colors.map((c) => c.toHex())
    )
})
