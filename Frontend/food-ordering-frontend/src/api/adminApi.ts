import { request } from "./request";

export function checkAdminEntryCode(entryCode: string) {
  return request<{
    allowed: boolean;
    message: string;
  }>("/api/admin/entry/check", {
    method: "POST",
    body: JSON.stringify({
      entryCode,
    }),
  });
}

export function adminLogin(data: {
  username: string;
  password: string;
}) {
  return request<{ token: string } | string>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}