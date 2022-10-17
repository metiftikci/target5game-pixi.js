export default class Lock {
  public locked = false;

  delay(time: number) {
    this.locked = true;

    setTimeout(() => (this.locked = false), time);
  }
}
