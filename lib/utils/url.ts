export const sanitizePath = (path: string | undefined): string => {
	const defaultPath = "/";
	if (!path || path.trim() === "") {
		return defaultPath;
	}

	if (!path.startsWith("/")) {
		return defaultPath;
	}

	if (path.startsWith("//")) {
		return defaultPath;
	}

	// htmlタグのsrcなどのために一応入れる
	if (path.includes(":")) {
		return defaultPath;
	}

	return path;
};

export const extractPathFromReferer = (referer: string): string => {
	if (referer.length === 0) return "/";
	const url = new URL(referer);

	return sanitizePath(url.pathname);
};

export const isPublicRoute = (
	path: string,
	publicRoutes: string[],
): boolean => {
	return publicRoutes.some((route) => {
		if (route === path) return true;

		if (route === "/") return false;

		return path.startsWith(`${route}/`);
	});
};
