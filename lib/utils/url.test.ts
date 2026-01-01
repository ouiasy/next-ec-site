import { describe, test, expect } from "vitest";
import { sanitizePath } from "./url";

const testCases = [
  { testPath: "", expectResult: "/" },
  { testPath: "/", expectResult: "/" },
  { testPath: "hello", expectResult: "/" },
  { testPath: "//example.com", expectResult: "/" },
  { testPath: "/example", expectResult: "/example" },
]


describe("sanitizePath test", () => {
  test.each(testCases)(
    "$testPath should be $expectResult",
    ({testPath, expectResult}) => {
      expect(sanitizePath(testPath)).toBe(expectResult)
    }
  )
})
