import { describe, test, expect } from "vitest";
import { isPublicRoute, sanitizePath } from "./url";

const testCases1 = [
  { testPath: "", expectResult: "/" },
  { testPath: "/", expectResult: "/" },
  { testPath: "hello", expectResult: "/" },
  { testPath: "//example.com", expectResult: "/" },
  { testPath: "/example", expectResult: "/example" },
]


describe("sanitizePath test", () => {
  test.each(testCases1)(
    "$testPath should be $expectResult",
    ({testPath, expectResult}) => {
      expect(sanitizePath(testPath)).toBe(expectResult)
    }
  )
})

const isPublicRouteTestCases = [
  {testpath: "/", expectRes: true},
  {testpath: "/signin", expectRes: true},
  {testpath: "/products", expectRes: true},
  {testpath: "/products/hogehoge", expectRes: true},
  {testpath: "/productshogehoge", expectRes: false},
  {testpath: "/signup", expectRes: true},
  {testpath: "/hogehoge", expectRes: false},
]

const publicRoutes = ["/", "/signin", "/products", "/signup"]

describe("isPublicRoute test", () => {
  test.each(isPublicRouteTestCases)(
    "$testpath is publicPath? => $expectRes",
    ({testpath, expectRes}) => {
      expect(isPublicRoute(testpath, publicRoutes)).toBe(expectRes)
    }
  )
})