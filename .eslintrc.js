module.exports = {
	"env": {
		"es2021": true,
		"node": true,
	},
	"extends": [
		"eslint:recommended", "plugin:@typescript-eslint/recommended",
	],
	"overrides": [
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
	},
	"plugins": [
		"@typescript-eslint",
	],
	"rules": {
		"indent": [ "error", "tab" ],
		"linebreak-style": [ "error", "windows" ],
		"quotes": [ "error", "double" ],
		"semi": [ "error", "always" ],
		// Don't break arrays
		"array-element-newline": [ "error", "consistent" ],
		// Trailing commas
		"comma-dangle": [ "error", {
			"arrays": "always-multiline",
			"objects": "always-multiline",
			"imports": "always-multiline",
			"exports": "always-multiline",
			"functions": "never",
		} ],
		// Don't break function arguments
		"function-call-argument-newline": [ "error", "consistent" ],
		// Space before function parenthesis
		"space-before-function-paren": [ "error", "always" ],
		// Space before arrays
		"array-bracket-spacing": [ "error", "always" ],
		// Space before objects
		"object-curly-spacing": [ "error", "always" ],
	},
};
