import {loadWasmModule} from './loadWasmModule'
import {html} from './html-template-tag'

async function main() {
	const dependencies = {
		env: {
			// this is called by `assert()`ions in the AssemblyScript std libs.
			// Useful for debugging.
			abort(...args: unknown[]) {
				console.log(...args)
			},

			// any members of this object are passed to the wasm
			// module. The values must be primitive types, or
			// functions accepting and/or returning primitive types.
			getFour() {
				return 4
			},
		},
	}

	// the ../build/optimized.wasm file is generated from the index.ts file,
	// with the `npm run asbuild` command.
	const {mul} = await loadWasmModule('../as/mul/optimized.wasm', dependencies)

	document.head.insertAdjacentHTML(
		'beforeend',
		html`
			<style>
				html,
				body {
					height: 100%;
					margin: 0;
					overflow: hidden;
					background: #111;
					color: white;
				}
				canvas {
					display: block;
					height: 100%;
				}
			</style>
		`
	)

	document.body.insertAdjacentHTML(
		'beforeend',
		html`
			<div id="result"></div>
		`
	)

	const result = document.getElementById('result')!
	let count = 0

	const update = () => {
		// call WebAssembly function from JS.
		result.innerHTML = html`
			<h1>The result is: ${mul(3, ++count)}</h1>
		`
	}

	update()
	setInterval(update, 1000)
}

main()