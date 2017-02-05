console.log("app.ts loaded");

function createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());
    return canvas;
}

function main(): void {
    const body = document.querySelector("body");
    if (!body) {
        throw new Error("no body element in document");
    }

    const canvas = createCanvas(600, 400);
    body.appendChild(canvas);
}

main();
