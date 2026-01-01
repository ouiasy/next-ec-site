
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