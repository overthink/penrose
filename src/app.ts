import {Vector2, Triangle, Phi} from "./geometry";

type Margin = {top: number; right: number; bottom: number; left: number};

const Red = "darkorange";
const Blue = "steelblue";

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

function drawTriangles(context: CanvasRenderingContext2D, triangles: Triangle[]): void {

    //context.fillStyle = "#b8c7e0";
    //context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    for (let t of triangles) {
        context.beginPath();
        context.fillStyle = t.colour;
        context.moveTo(t.a.x, t.a.y);
        context.lineTo(t.b.x, t.b.y);
        context.lineTo(t.c.x, t.c.y);
        context.closePath();
        context.fill();
        context.stroke();
    }

}

// Just messing around
function spiral(width: number, height: number): Triangle[] {
    const centre = new Vector2(width / 2, height / 2 + 10);
    const t = new Triangle(Vector2.zero, new Vector2(100, 0), new Vector2(100, 75), "red")
        .translate(centre);
    //.translate(centre.add(new Vector2(0, 0)));
    const n = 60;
    const theta = 2  * Math.PI / n;
    const triangles = [];
    for (let i = 0; i < n; ++i) {
        let newT = t.rotate(i * theta, centre);
        newT = newT
            .translate(newT.b.subtract(centre).normalize().multiply(i * 1.3));
        triangles.push(newT);
    }
    return triangles;
}

function drawP2Triangle(context: CanvasRenderingContext2D, t: Triangle): void {
    // Assume this:
    //      A
    //     /ϴ\
    //    /   \
    //   B_____C
    // Don't stroke BC since they'll connect on that edge to make rhombi.
    context.save();
    context.beginPath();
    context.strokeStyle = t.colour;
    context.moveTo(t.b.x, t.b.y);
    context.lineTo(t.c.x, t.c.y);
    context.stroke();
    context.restore();

    context.save();
    context.beginPath();
    context.fillStyle = t.colour;
    context.moveTo(t.b.x, t.b.y);
    context.lineTo(t.a.x, t.a.y);
    context.lineTo(t.c.x, t.c.y);
    context.fill();
    context.stroke();
    context.restore();
}


// function deflate(t: PenroseTriangle): PenroseTriangle[] {
//     const [a, b, c, colour] = t;
//
//     const result: PenroseTriangle[] = [];
//     if (colour == Colour.Red) {
//         const p = sum(a, multiply(unitVector(a, b), distance(a, b) / phi));
//         result.push([c, p, b, Colour.Red], [p, c, a, Colour.Blue]);
//     } else {
//         const q = sum(b, multiply(unitVector(b, a), distance(b, a) / phi));
//         const r = sum(b, multiply(unitVector(b, c), distance(b, c) / phi));
//         result.push([q, r, b, Colour.Blue], [r, q, a, Colour.Red], [r, c, a, Colour.Blue]);
//     }
//
//     return result;
// }

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

    // const triangles = spiral(canvasW, canvasH);
    const triangles = generateP2Tiling(canvasW, canvasH, 7);
    console.log("Drawing", triangles.length, "triangles");
    drawP2(context, triangles);
}

main();
