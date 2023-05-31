/// <reference types="vitest" />
import { defineConfig } from "vitest/dist/config";

export default defineConfig({
	testMatch: [ "**/*.test.ts" ],
	testEnvironment: "",
	test: {
		coverage: {
			provider: "istanbul",
			reporter: ["html-spa"]
		}
	}
});