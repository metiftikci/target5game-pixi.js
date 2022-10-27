import { Container, DisplayObject, Graphics, Text } from "pixi.js";

const margin = 15;

export interface ButtonProps {
  text?: string;
  fontSize?: number;
  fontColor?: number;
  backgroundColor?: number;
  onClick?: () => void;
}

export class Button {
  private readonly text = new Text();
  private readonly graphics = new Graphics();

  private readonly backgroundColor: number;
  private isOver = false;

  constructor(props: ButtonProps) {
    this.backgroundColor = props.backgroundColor;

    this.graphics.addChild(this.text);

    this.text.x = margin;
    this.text.y = margin;

    this.text.text = props.text ?? "";
    this.text.style.fontSize = props.fontSize ?? 14;
    this.text.style.fill = props.fontColor ?? 0xffffff;

    this.graphics.buttonMode = true;
    this.graphics.interactive = true;

    this.graphics.on("mouseover", () => this.onOver());
    this.graphics.on("mouseout", () => this.onOut());
    this.graphics.on("pointertap", () => {
      if (typeof props.onClick === "function") {
        props.onClick();
      }
    });

    this.draw();
  }

  draw() {
    this.graphics.clear();

    const bgColor = this.backgroundColor || 0;
    const bgAlpha = this.isOver ? 1 : 0.95;

    this.graphics.beginFill(bgColor, bgAlpha);
    this.graphics.lineStyle(1, 0x333333, 0.8);

    this.graphics.drawRoundedRect(
      0,
      0,
      this.text.width + margin * 2,
      this.text.height + margin * 2,
      8
    );

    this.graphics.endFill();
  }

  onOver() {
    this.isOver = true;
    this.draw();
  }

  onOut() {
    this.isOver = false;
    this.draw();
  }

  setText(text: string) {
    this.text.text = text;
  }

  set x(value: number) {
    this.graphics.x = value;
  }

  set y(value: number) {
    this.graphics.y = value;
  }

  get width() {
    return this.graphics.width;
  }

  get height() {
    return this.graphics.height;
  }

  show(parent: Container<DisplayObject>) {
    parent.addChild(this.graphics);
  }

  hide() {
    if (this.graphics.parent) {
      this.graphics.parent.removeChild(this.graphics);
    }
  }
}
