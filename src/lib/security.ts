import { badRequest, forbidden } from "@/lib/errors";

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function enforceJsonRequest(req: Request) {
  if (!STATE_CHANGING_METHODS.has(req.method)) {
    return;
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw badRequest("Content-Type must be application/json");
  }
}

export function enforceSameOrigin(req: Request) {
  if (!STATE_CHANGING_METHODS.has(req.method)) {
    return;
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) {
    throw forbidden();
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw forbidden();
  }

  if (originHost !== host) {
    throw forbidden();
  }
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0]?.trim();
    if (ip) return ip;
  }

  return "unknown";
}