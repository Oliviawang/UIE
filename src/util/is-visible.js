export function isVisible (el, parent) {
    const clientX = el.getBoundingClientRect().x;
    const clientY = el.getBoundingClientRect().y;
    const parentX = parent.parentElement.getBoundingClientRect().x - 20;
    const parentY = parent.getBoundingClientRect().y + 20;
    return clientX >= parentX && clientY <=parentY
}
