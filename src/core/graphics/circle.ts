import { Graphics } from "pixi.js";

export interface CircleOptions {
  radius: number;
  x?: number;
  y?: number;
  fillColor?: number;
  fillAlpha?: number;
  lineWidth?: number;
  lineColor?: number;
  lineAlpha?: number;
  graphics?: Graphics;
}

export function createCircle(options: CircleOptions) {
  const graphics = options.graphics ?? new Graphics();

  if (options.x) graphics.x = options.x;
  if (options.y) graphics.y = options.y;

  if (options.fillColor !== undefined)  {
    graphics.beginFill(options.fillColor, options.fillAlpha);
  }

  if (options.lineWidth !== undefined && options.lineColor !== undefined) {
    graphics.lineStyle(options.lineWidth, options.lineColor, options.lineAlpha);
  }

  graphics.drawCircle(0, 0, options.radius);

  return graphics;
}
