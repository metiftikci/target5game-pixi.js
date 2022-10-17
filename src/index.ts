import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import * as PIXI from "pixi.js";
import Board from "./board";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  backgroundColor: 0xffffff,
  antialias: true,
  width: 606,
  height: 525,
});

app.loader
  .add({ name: "Mario-Kart-DS", url: "Mario-Kart-DS.ttf" })
  .add({ name: "MyCustomFont", url: "MyCustomFont.ttf" })
  .load(() => {
    new Board(app.stage);
  });

document.getElementById("root").appendChild(app.view);
