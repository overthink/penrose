import {Vector2, Triangle} from "./geometry";

type Margin = {top: number; right: number; bottom: number; left: number};

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

function draw(appData: AppData): void {

    //context.fillStyle = "#b8c7e0";
    //context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    const c = appData.context;
    for (let t of appData.triangles) {
        c.beginPath();
        c.moveTo(t.a.x, t.a.y);
        c.lineTo(t.b.x, t.b.y);
        c.lineTo(t.c.x, t.c.y);
        //context.lineTo(t.a.x, t.a.y);
        c.closePath();
        c.stroke();
    }

}

// TBD better name; basically everything needed when drawing
class AppData {
    constructor(
        readonly context: CanvasRenderingContext2D,
        readonly triangles: Triangle[],
        readonly canvasWidth: number,
        readonly canvasHeight: number) {}
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

    const triangles: Triangle[] = [];
    (function() {
        const centre = new Vector2(canvasW / 2, canvasH / 2 + 10);
        const t = new Triangle(Vector2.zero, new Vector2(100, 0), new Vector2(100, 75))
            .translate(centre);
            //.translate(centre.add(new Vector2(0, 0)));
        const n = 60;
        const theta = 2  * Math.PI / n;
        for (let i = 0; i < n; ++i) {
            let newT = t.rotate(i * theta, centre);
            newT = newT
                .translate(newT.b.subtract(centre).normalize().multiply(i*1.3));
            triangles.push(newT);
        }
    })();

    const appData = new AppData(context, triangles, canvasW, canvasH);
    draw(appData);
}

main();
