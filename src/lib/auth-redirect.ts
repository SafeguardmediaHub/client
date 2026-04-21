import api from "./api";

export async function redirectAfterLogin(router: {
  push: (href: string) => void;
}): Promise<void> {
  try {
    const res = await api.get("/api/anonymous/status");
    const dashboardMode = res.data?.data?.dashboardMode;
    router.push(dashboardMode === "full" ? "/dashboard" : "/try");
  } catch {
    router.push("/dashboard");
  }
}
