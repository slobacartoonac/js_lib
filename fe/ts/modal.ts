import { MySchema } from "./schema";

export function createModal(definition: any) {
	const closeModal = (response?: any) => {
		newBox.parentNode && newBox.parentNode.removeChild(newBox);
		definition.onclose && definition.onclose()
		definition.callback && definition.callback(response)
	}
	const chamaContent: MySchema = {
		onClick: e => { e.stopPropagation(); e.preventDefault() },
		className: "modal_content" + (definition.animate ? " modal_animation" : ""),
		children: [
			{
				className: "modal_header",
				children: [
					...(definition.close ? [{
						className: "close",
						text: "x",
						onClick: () => closeModal()
					}] : []),
					{
						tag: "h3",
						text: definition.title || "&nbsp",
					}
				]
			},
			{
				className: "modal_body",
				children: [...definition.message ? [{ tag: 'p', text: definition.message }] : [],
				...definition.list ? definition.list.map((item: any) => (
					{
						className: "modal_input",
						text: item.label || item,
						onClick: () => closeModal(typeof item.id === 'undefined' ? item : item.id)

					})
				) : []]
			},
			{
				className: "modal_footer",
				children: definition.options ? definition.options.map((item: any) => (
					{
						className: "modal_button",
						text: item.label || item,
						onClick: () => closeModal(typeof item.id === 'undefined' ? item : item.id)

					})
				) : []
			},
		]
	}

	const chema: MySchema = {
		className: "modal noselect",
		removeIn: definition.removeIn,
		//onClick: () => closeModal(),
		callback: () => closeModal(),
		children: [
			chamaContent
		]
	}

	const newBox = createBoxFromSchema(chema)
	return newBox
}

export function createBoxFromSchema(schema: MySchema) {
	const newBox = document.createElement(schema.tag || 'div');
	const removeFunc = () => {
		newBox.parentNode && newBox.parentNode.removeChild(newBox);
		schema.callback && schema.callback()
	}
	if (schema.text) {
		newBox.innerHTML = schema.text
	}
	if (schema.style) {
		Object.entries(schema.style).forEach(([key, value]) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore:next-line
			newBox.style[key] = value
		})
	}
	if (schema.children) {
		schema.children.forEach(child => {
			newBox.appendChild(createBoxFromSchema(child))
		})
	}
	if (schema.className) {
		schema.className
		newBox.classList.add(...schema.className.split(/\W/))
	}
	if (schema.onClick) {
		newBox.onclick = (...args) => {
			schema.remove && removeFunc()
			schema.onClick(...args)
		}
	}
	if (schema.removeIn) {
		setTimeout(removeFunc, schema.removeIn)
	}
	return newBox
}