import Player from "../player";
import User from "../user";

describe("User class", () => {
  const user = new User();
  test("calls object", () => {
    expect(user).toBeTruthy();
    expect(user instanceof User).toBeTruthy();
    expect(user instanceof Player).toBeTruthy();
    expect(user.getType()).toBeDefined();
    expect(user.getName()).toBeUndefined();
    expect(user.getPlayerBoard()).toBeDefined();
  });

  test("calls setName() function", () => {
    user.setName("Jane");
    expect(user.getName()).toBeDefined();
    expect(user.getName()).toBe("Jane");
  });
});
