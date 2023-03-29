function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(color) {
    return "#" + componentToHex(parseInt(color?.r ?? 0)) + componentToHex(parseInt(color?.g ?? 0)) + componentToHex(parseInt(color?.b ?? 0));
}
