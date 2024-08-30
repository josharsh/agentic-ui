import { cn } from "./utils";

describe("cn", () => {
  it("should return a string with merged class names", () => {
    const result = cn("class1", "class2", "class3");
    expect(result).toBe("class1 class2 class3");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle null and undefined inputs", () => {
    const result = cn("class1", null, "class2", undefined, "class3");
    expect(result).toBe("class1 class2 class3");
  });
});
