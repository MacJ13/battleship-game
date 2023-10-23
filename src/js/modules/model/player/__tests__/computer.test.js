import Computer from "../computer";
import Player from "../player";

describe("Computer class", () => {
  const computer = new Computer();
  test("tests object", () => {
    expect(computer).toBeTruthy();
    expect(computer instanceof Computer).toBeTruthy();
    expect(computer instanceof Player).toBeTruthy();
    expect(computer.getType()).toBeDefined();
    expect(computer.getName()).toBeDefined();
    expect(computer.getName()).toBe("computer");
    expect(computer.getPlayerBoard()).toBeDefined();
  });
});
