/** @Route.Telemetry */
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("prai");
}