import { gsap } from "gsap";
import { Graphics } from "pixi.js";
import { Player1, Player2 } from "./core/constants";
import { createCircle } from "./core/graphics/circle";

export interface ItemProps {
  radius: number;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  player: "first" | "second";
}

export class Item {
  public duration = 1;
  public circle: Graphics;

  constructor(public readonly props: ItemProps) {
    this.draw();

    gsap.to(this.circle, {
      duration: this.duration,
      pixi: {
        x: this.props.targetX,
        y: this.props.targetY,
      },
    });
  }

  draw() {
    const props = this.props.player === "first" ? Player1 : Player2;

    this.circle = createCircle({
      x: this.props.sourceX,
      y: this.props.sourceY,
      radius: this.props.radius,
      ...props,
    });
  }
}
