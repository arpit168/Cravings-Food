import test from "node:test";
import assert from "node:assert/strict";
import { resolveBaseURL } from "../src/config/Api.jsx";

test("resolveBaseURL prefers the configured backend URL when provided", () => {
  assert.equal(resolveBaseURL("https://api.example.com"), "https://api.example.com");
});

test("resolveBaseURL falls back to the current origin when no backend URL is configured", () => {
  assert.equal(resolveBaseURL("", "https://app.example.com"), "https://app.example.com");
});
