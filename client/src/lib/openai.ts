import { apiRequest } from "./queryClient";
import { HumanizeRequest, HumanizeResponse } from "@shared/schema";

export async function humanizeText(request: HumanizeRequest): Promise<HumanizeResponse> {
  const response = await apiRequest("POST", "/api/humanize", request);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to humanize text");
  }
  return await response.json();
}
