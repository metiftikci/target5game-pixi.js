import { Graphics } from "pixi.js";

export interface RectangleOptions {
  x?: number;
  y?: number;
  width: number;
  height: number;
  fillColor?: number;
  fillAlpha?: number;
  lineWidth?: number;
  lineColor?: number;
  lineAlpha?: number;
}

export function createRect(options: RectangleOptions) {
  const graphics = new Graphics();

  if (options.x) graphics.x = options.x;

  if (options.y) graphics.y = options.y;

  if (options.fillColor !== undefined)  {
    graphics.beginFill(options.fillColor, options.fillAlpha);
  }

  if (options.lineWidth !== undefined && options.lineColor !== undefined) {
    graphics.lineStyle(options.lineWidth, options.lineColor, options.lineAlpha);
  }

  graphics.drawRect(0, 0, options.width, options.height);

  return graphics;
}
