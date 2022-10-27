import {
  Container,
  DisplayObject,
  Graphics,
  InteractionEvent,
  Text
} from "pixi.js";
import { Player1, Player2 } from "./core/constants";
import { Button } from "./core/graphics/button";
import { createCircle } from "./core/graphics/circle";
import { createRect } from "./core/graphics/rectangle";
import { createText } from "./core/graphics/text";
import Lock from "./core/lock";
import { Item } from "./item";
import { isFnished, WinResult } from "./utils";

export default class Board {
  public readonly width = 600;
  public readonly height = 400;
  public readonly rows = 8;
  public readonly cols = 12;
  public readonly cellWidth = this.width / this.cols;
  public readonly cellHeight = this.height / this.rows;
  public readonly margin = 5;

  private readonly container = new Graphics();
  private background: Graphics;
  private topMask: Graphics;
  private item: Graphics;
  private itemIndex = 0;
  private readonly items: Item[][] = [];
  private text: Text;

  private restartButton: Button;
  private turn: "first" | "second" = "first";
  private win: WinResult;

  private readonly lock = new Lock();

  constructor(container: Container<DisplayObject>) {
    container.addChild(this.container);

    this.container.x = 3;
    this.container.y = 123;

    this.init();
  }

  init() {
    this.drawBackground();
    this.drawHoles();
    this.drawTopMask();
    this.createItem();
    this.addListeners();
    this.drawText();
    this.initRestartButton();
  }

  restartGame() {
    this.items.forEach((x) => {
      x.forEach((y) => {
        this.container.removeChild(y.circle);
        y.circle.clear();
      });
    });
    this.items.length = 0;
    for (let col = 0; col < this.cols; col++) {
      this.items.push([]);
    }
    this.turn = "first";
    this.win = undefined;
    this.restartButton.hide();
    this.refreshItem();
    this.refreshText();
  }

  drawBackground() {
    this.background = createRect({
      width: this.width,
      height: this.height,
      fillColor: 0,
      fillAlpha: 0.5,
      lineWidth: 2,
      lineColor: 0,
      lineAlpha: 0.5,
    });

    this.container.addChild(this.background);
  }

  drawHoles() {
    this.items.length = 0;

    for (let col = 0; col < this.cols; col++) {
      this.items.push([]);

      for (let row = 0; row < this.rows; row++) {
        this.drawHole(row, col);
      }
    }
  }

  drawHole(row: number, col: number) {
    const x = col * this.cellWidth + this.cellWidth / 2;
    const y = row * this.cellHeight + this.cellHeight / 2;
    const radius = (this.cellWidth - this.margin) / 2;

    const hole = createCircle({
      x,
      y,
      radius,
      fillColor: 0xECECEC,
      lineWidth: 2,
      lineColor: 0,
      lineAlpha: 0.5,
    });

    this.container.addChild(hole);

    return hole;
  }

  drawTopMask() {
    const margin = 2;

    this.topMask = createRect({
      width: this.width,
      height: this.cellHeight + margin * 2,
      fillColor: 0xEEEEEE,
      lineWidth: 2,
      lineColor: 0,
    });

    this.topMask.y = -this.cellHeight - margin * 2;

    this.container.addChild(this.topMask);
  }

  createItem() {
    const item = createCircle({
      radius: this.cellWidth / 2,
      fillColor: this.turn === "first" ? Player1.fillColor : Player2.fillColor,
      lineWidth: 3,
      lineColor: 0,
      lineAlpha: 0.3,
      graphics: this.item,
    });

    if (!this.item) {
      item.x = this.cellWidth / 2;
      item.y = -this.cellHeight / 2 - 2;

      this.container.addChild(item);
    }

    this.item = item;
  }

  refreshItem() {
    this.item.clear();
    this.createItem();
  }

  addListeners() {
    this.container.interactive = true;
    this.container.on("pointermove", (e) => this.onMouseMove(e));
    this.container.on("pointertap", (e) => {
      if (this.lock.locked) return;

      this.onMouseMove(e);
      this.onClick();
    });
  }

  onMouseMove(e: InteractionEvent) {
    if (e.target !== this.container) return;

    const pos = e.data.getLocalPosition(this.container);

    let x = pos.x;

    x = Math.max(x, 0);
    x = Math.min(x, this.width - 10);

    this.itemIndex = Math.floor(x / this.cellWidth);

    this.item.x = this.itemIndex * this.cellWidth + this.cellWidth / 2;
  }

  onClick() {
    if (this.win) return;

    const itemCount = this.items[this.itemIndex].length;

    if (itemCount >= this.rows) return;

    if (this.lock.locked) return;
    this.lock.delay(1000);

    const item = new Item({
      radius: (this.cellWidth - this.margin) / 2,
      sourceX: this.item.x,
      sourceY: this.item.y,
      targetX: this.item.x,
      targetY: this.height - this.cellHeight / 2 - itemCount * this.cellHeight,
      player: this.turn,
    });

    this.items[this.itemIndex].push(item);

    this.container.addChild(item.circle);

    this.win = isFnished(this.items, this.rows);

    this.turn = this.turn === "first" ? "second" : "first";

    this.refreshText();
    this.refreshItem();

    if (this.win) {
      console.log("Game Fnished: " + this.win);
      this.onGameEnds();
    }
  }

  onGameEnds() {
    this.lock.delay(1500);
    this.item.clear();
    this.restartButton.show(this.container);
  }

  drawText() {
    this.text = createText();
    this.text.y = -this.cellHeight * 1.75;

    this.refreshText();

    this.container.addChild(this.text);
  }

  refreshText() {
    if (this.win === "first") {
      this.text.text = "Player 1 Won!";
    } else if (this.win === "second") {
      this.text.text = "Player 2 Won!";
    } else if (this.win === "draft") {
      this.text.text = "Draft!";
    } else if (this.turn === "first") {
      this.text.text = "Player 1";
    } else if (this.turn === "second") {
      this.text.text = "Player 2";
    }

    this.text.x = this.width / 2 - this.text.width / 2;
  }

  initRestartButton() {
    this.restartButton = new Button({
      text: "Restart Game",
      backgroundColor: 0x345678,
      onClick: () => this.restartGame(),
    });
    this.restartButton.y = this.height / 2 - this.restartButton.height / 2;
    this.restartButton.x = this.width / 2 - this.restartButton.width / 2;
  }
}
