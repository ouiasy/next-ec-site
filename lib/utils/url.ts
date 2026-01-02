
export const sanitizePath = (path: string | undefined): string => {
  const defaultPath = "/"
  if (!path || path.trim() === "") {
    return defaultPath
  }

  if (!path.startsWith("/")) {
    return defaultPath
  }

  // protocol-relative url
  if (path.startsWith("//")) {
    return defaultPath
  }
  return path
}


export const isPublicRoute = (path: string, publicRoutes: string[]): boolean => {
  return publicRoutes.some(route => {
    if (route === path) return true

    if (route === "/") return false

    return path.startsWith(`${route}/`)
  })
}