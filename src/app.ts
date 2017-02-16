import {Vector2, Triangle, Phi} from "./geometry";

type Margin = {top: number; right: number; bottom: number; left: number};

const Red = "#d50081";
const Blue = "#0e73ba";

/** Return a new canvas with given width, height, and margin. */
function createCanvas(width: number, height: number, margin: Margin, border: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    // Don't use CSS to set width/height, see: http://stackoverflow.com/a/12862952/69689
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());
    const s = canvas.style;
    s.marginTop = margin.top + "px";
    s.marginRight = margin.right + "px";
    s.marginBottom = margin.bottom + "px";
    s.marginLeft = margin.left + "px";
    s.border = border;
    s.display = "block"; // disables scrollbars
    return canvas;
}

/** Return the viewport size in pixels: width, height. */
function viewportSize(): [number, number] {
    const de = document.documentElement;
    const width = Math.max(de.clientWidth, window.innerWidth || 0);
    const height = Math.max(de.clientHeight, window.innerHeight || 0);
    return [width, height];
}

function drawP2Triangle(context: CanvasRenderingContext2D, t: Triangle): void {
    // Assume this:
    //      A
    //     /ϴ\
    //    /   \
    //   B_____C
    const isRed = t.colour == Red;

    if (!isRed) {
        // stroke BC in the fill colour to avoid seams... gah, lame solution
        const origStrokeStyle = context.strokeStyle;
        context.beginPath();
        context.moveTo(t.b.x, t.b.y);
        context.lineTo(t.c.x, t.c.y);
        context.strokeStyle = t.colour;
        context.stroke();
        context.strokeStyle = origStrokeStyle;
    }

    context.beginPath();
    context.moveTo(t.b.x, t.b.y);
    context.lineTo(t.a.x, t.a.y);
    context.lineTo(t.c.x, t.c.y);
    // background is already red, so no need to re-fill it as red
    if (!isRed) {
        context.fillStyle = t.colour;
        context.fill();
    }
    context.stroke();
}

function deflate(t: Triangle): Triangle[] {
    const result: Triangle[] = [];
    if (t.colour == Red) {
        const ab = t.b.subtract(t.a); // vector from a to b
        const p = t.a.add(ab.normalize().multiply(ab.magnitude() / Phi));
        result.push(
            new Triangle(t.c, p, t.b, Red),
            new Triangle(p, t.c, t.a, Blue)
        );
    } else {
        const ba = t.a.subtract(t.b); // vector from b to a
        const bc = t.c.subtract(t.b); // vector from b to c
        const q = t.b.add(ba.normalize().multiply(ba.magnitude() / Phi));
        const r = t.b.add(bc.normalize().multiply(bc.magnitude() / Phi));
        result.push(
            new Triangle(q, r, t.b, Blue),
            new Triangle(r, q, t.a, Red),
            new Triangle(r, t.c, t.a, Blue)
        );
    }

    return result;
}

function deflateMany(ts: Triangle[]): Triangle[] {
    return [].concat.apply([], ts.map(deflate));
}

// Apply f to args, then take the result of that and apply f to it again. Do
// this n times.
function iterate<T>(f: (a: T) => T, args: T, n: number) {
    let result = args;
    while (n > 0) {
        result = f.call(null, result);
        n--;
    }
    return result;
}

function generateP2Tiling(width: number, height: number, iterations: number): Triangle[] {
    const triangles: Triangle[] = [];
    const centre = new Vector2(width / 2, height / 2);
    const sideLen = Math.max(width, height) / 2 * 1.3;

    // Generating a "wheel" of triangles about the origin.
    // start is the point from which we start rotating
    let start = new Vector2(centre.x, centre.y + sideLen);
    for (let i = 0; i < 10; ++i) {
        const b = start;
        const c = start.rotate(2 * Math.PI / 10, centre);
        let t = new Triangle(centre, b, c, Red);
        start = t.c;
        // mirror every other triangle
        if (i % 2 == 0) {
            t = new Triangle(centre, c, b, Red);
        }
        triangles.push(t)
    }
    return iterate(deflateMany, triangles, iterations);
}

function drawP2(context: CanvasRenderingContext2D, triangles: Triangle[]): void {
    // fill canvas with "red" to cut out half the .fill calls later
    context.fillStyle = Red;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = "#333333"; // outline colour
    for (let t of triangles) {
        drawP2Triangle(context, t);
    }
}

function main(): void {
    const container = document.querySelector("#canvas-container");
    if (!container) {
        throw new Error("no canvas container element");
    }

    const [viewportW, viewportH] = viewportSize();
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const borderThickness = 1;
    const canvasW = viewportW - margin.left - margin.right;
    const canvasH = viewportH - margin.top - margin.bottom - 2 * borderThickness;

    const canvas = createCanvas(
        canvasW,
        canvasH,
        margin,
        `${borderThickness}px solid #333`);

    container.appendChild(canvas);

    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("could not get 2d context");
    }

    const triangles = generateP2Tiling(canvasW, canvasH, 9);
    drawP2(context, triangles);
    console.log("Drew", triangles.length, "triangles");
}

main();
