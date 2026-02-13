import { describe, test, expect } from "vitest";
import { extractPathFromReferer, isPublicRoute, sanitizePath } from "./url";

describe("url utils", () => {
  describe("extractPathFromReferer test", () => {
    const testCases = [
      { referer: "http://localhost:3000/cart", expectResult: "/cart" },
      { referer: "http://localhost:3000/", expectResult: "/" },
      { referer: "https://example.com/products/1", expectResult: "/products/1" },
      { referer: "https://example.com//google.com", expectResult: "/" },
      { referer: "https://example.com/http://google.com", expectResult: "/" },
      { referer: "https://example.com///google.com", expectResult: "/" },
    ]

    test.each(testCases)(
      "$referer should extract path $expectResult",
      ({ referer, expectResult }) => {
        expect(extractPathFromReferer(referer)).toBe(expectResult)
      }
    )
  })

  describe("sanitizePath test", () => {
    const testCases1 = [
      { testPath: undefined, expectResult: "/" },
      { testPath: "", expectResult: "/" },
      { testPath: "   ", expectResult: "/" },
      { testPath: "/", expectResult: "/" },
      { testPath: "hello", expectResult: "/" },
      { testPath: "//example.com", expectResult: "/" },
      { testPath: "///example.com", expectResult: "/" },
      { testPath: "/example", expectResult: "/example" },
      { testPath: "/http://google.com", expectResult: "/" },
      { testPath: "/valid-path/123", expectResult: "/valid-path/123" },
      { testPath: "javascript:alert(1)", expectResult: "/" },
    ]

    test.each(testCases1)(
      "'$testPath' should be '$expectResult'",
      ({testPath, expectResult}) => {
        expect(sanitizePath(testPath)).toBe(expectResult)
      }
    )
  })

  describe("isPublicRoute test", () => {
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
    test.each(isPublicRouteTestCases)(
      "$testpath is publicPath? => $expectRes",
      ({testpath, expectRes}) => {
        expect(isPublicRoute(testpath, publicRoutes)).toBe(expectRes)
      }
    )
  })



})








