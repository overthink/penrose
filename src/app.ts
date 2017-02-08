import {Vector} from "./geometry";

type Margin = {top: number; right: number; bottom: number; left: number};

/** Return a new canvas with given width, height, and margin. */
function createCanvas(width: number, height: number, margin: Margin, border: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    const s = canvas.style;
    s.width = width + "px";
    s.height = height + "px";
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

function animate(context: CanvasRenderingContext2D): void {

    const v = new Vector(1,2);

    context.beginPath();
    context.fillStyle = "#b8c7e0";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    //requestAnimationFrame(() => animate(context));
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

    animate(context);
}

main();
