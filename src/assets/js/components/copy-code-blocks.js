// Vanilla Web Component, no build step / bundler required.
//
// Wraps a region of content (see base.njk) and adds a "Copy" button to every
// <pre> code block found inside it. Mirrors the same pattern as
// node_modules/@zachleat/heading-anchors: a custom element that upgrades its
// own children once it's connected to the DOM.
//
// Usage:
//   <copy-code-blocks>
//     ...markdown-rendered content with <pre><code>...</code></pre>...
//   </copy-code-blocks>

class CopyCodeBlocks extends HTMLElement {
	connectedCallback() {
		for (const pre of this.querySelectorAll("pre")) {
			if (pre.querySelector(".copy-code-button")) {
				continue; // already upgraded
			}

			const button = document.createElement("button");
			button.type = "button";
			button.className = "copy-code-button";
			button.textContent = "Copy";
			// Inline styling so this component works with zero CSS changes
			// elsewhere. Feel free to move this to global.css and target
			// `.copy-code-button` instead, if you'd rather style it there.
			Object.assign(button.style, {
				position: "absolute",
				top: "0.5em",
				right: "0.5em",
				font: "inherit",
				fontSize: "0.75em",
				padding: "0.25em 0.6em",
				cursor: "pointer",
				backgroundColor: "plum",
			});

			button.addEventListener("click", () => this.copy(pre, button));

			pre.style.position ||= "relative";
			pre.prepend(button);
		}
	}

	async copy(pre, button) {
		const code = pre.querySelector("code")?.textContent ?? pre.textContent;
		const original = button.textContent;

		try {
			await navigator.clipboard.writeText(code);
			button.textContent = "Copied!";
		} catch {
			button.textContent = "Copy failed";
		}

		setTimeout(() => {
			button.textContent = original;
		}, 2000);
	}
}

customElements.define("copy-code-blocks", CopyCodeBlocks);
