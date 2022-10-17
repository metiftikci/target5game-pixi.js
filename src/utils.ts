import { OutlineFilter } from "pixi-filters";
import { Item } from "./item";

const winItemCount = 5;

export type WinResult = undefined | "first" | "second" | "draft";

export function isFnished(items: Item[][], maxRowCount: number): WinResult {
  let isDraft = true;

  for (let col = 0; col < items.length; col++) {
    const cols = items[col];

    if (cols.length !== maxRowCount) isDraft = false;

    for (let row = 0; row < cols.length; row++) {
      const result = checkWin(items, row, col);

      if (result) {
        return result;
      }
    }
  }

  return isDraft ? "draft" : undefined;
}

function checkWin(items: Item[][], row: number, col: number): WinResult {
  const up = checkWinUp(items, row, col);

  if (up) return up;

  const horizontal = checkWinHorizontal(items, row, col);

  if (horizontal) return horizontal;

  const left = checkWinLeft(items, row, col);

  if (left) return left;


  const right = checkWinRight(items, row, col);

  if (right) return right;

  return undefined;
}

function checkWinUp(items: Item[][], row: number, col: number): WinResult {
  const colItems = items[col];

  const wonItems: Item[] = [];

  let player: "first" | "second";

  for (let i = 0; i < winItemCount; i++) {
    const rowIndex = row + i;

    if (rowIndex >= colItems.length) return undefined;

    const item = colItems[rowIndex];

    wonItems.push(item);

    if (i === 0) {
      player = item.props.player;
    } else if (player !== item.props.player) {
      return undefined;
    }
  }

  highlight(wonItems);

  return player;
}

function checkWinLeft(items: Item[][], row: number, col: number): WinResult {
  const wonItems: Item[] = [];

  let player: "first" | "second";

  for (let i = 0; i < winItemCount; i++) {
    const colIndex = col - i;
    const rowIndex = row + i;

    if (colIndex < 0 || colIndex >= items.length) return;

    const colItems = items[colIndex];

    if (rowIndex >= colItems.length) return undefined;

    const item = colItems[rowIndex];

    wonItems.push(item);

    if (i === 0) {
      player = item.props.player;
    } else if (player !== item.props.player) {
      return undefined;
    }
  }

  highlight(wonItems);

  return player;
}

function checkWinRight(items: Item[][], row: number, col: number): WinResult {
  let player: "first" | "second";

  const wonItems: Item[] = [];

  for (let i = 0; i < winItemCount; i++) {
    const colIndex = col + i;
    const rowIndex = row + i;

    if (colIndex < 0 || colIndex >= items.length) return;

    const colItems = items[colIndex];

    if (rowIndex >= colItems.length) return undefined;

    const item = colItems[rowIndex];

    wonItems.push(item);

    if (i === 0) {
      player = item.props.player;
    } else if (player !== item.props.player) {
      return undefined;
    }
  }

  highlight(wonItems);

  return player;
}


function checkWinHorizontal(items: Item[][], row: number, col: number): WinResult {
  let player: "first" | "second";

  const wonItems: Item[] = [];

  for (let i = 0; i < winItemCount; i++) {
    const colIndex = col + i;
    const rowIndex = row;

    if (colIndex < 0 || colIndex >= items.length) return;

    const colItems = items[colIndex];

    if (rowIndex >= colItems.length) return undefined;

    const item = colItems[rowIndex];

    wonItems.push(item);

    if (i === 0) {
      player = item.props.player;
    } else if (player !== item.props.player) {
      return undefined;
    }
  }

  highlight(wonItems);

  return player;
}

function highlight(items: Item[]) {
  const outlineFilterBlue = new OutlineFilter(2, 0x99ff99);

  for (let i = 0; i < items.length; i++) {
    items[i].circle.filters = [outlineFilterBlue];
  }
}
