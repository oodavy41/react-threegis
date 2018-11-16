export function makeLine(array, color, colorFun = undefined) {
    let lineGeomentry = { vertices: [], faces: [], colors: [] };
    array.forEach(element => {
        let start = element.start;
        let end = element.end;
        let width = element.size / 2;
        let angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
        let pos = lineGeomentry.vertices.length / 3;
        let dx = width * Math.sin(angle);
        let dy = width * Math.cos(angle);

        lineGeomentry.vertices.push(start[0] + dx, start[1] - dy, start[2]);
        lineGeomentry.vertices.push(start[0] - dx, start[1] + dy, start[2]);
        lineGeomentry.vertices.push(end[0] + dx, end[1] - dy, end[2]);
        lineGeomentry.vertices.push(end[0] - dx, end[1] + dy, end[2]);
        lineGeomentry.vertices.push(start[0], start[1], start[2]);
        if (!colorFun) {
            for (let i = 0; i < 5; i++) {
                lineGeomentry.colors.push(...color);
            }
        } else {
            lineGeomentry.colors.push(
                ...colorFun(start[0] + dx, start[1] - dy, start[2])
            );
            lineGeomentry.colors.push(
                ...colorFun(start[0] - dx, start[1] + dy, start[2])
            );
            lineGeomentry.colors.push(...colorFun(end[0] + dx, end[1] - dy, end[2]));
            lineGeomentry.colors.push(...colorFun(end[0] - dx, end[1] + dy, end[2]));
            lineGeomentry.colors.push(...colorFun(start[0], start[1], start[2]));
        }

        for (let i = 0; i < 16; i++) {
            let _ = [
                start[0] + width * Math.sin((Math.PI * i) / 8),
                start[1] + width * Math.cos((Math.PI * i) / 8),
                start[2]
            ];
            lineGeomentry.vertices.push(..._);
            if (!colorFun) {
                lineGeomentry.colors.push(...color);
            } else {
                lineGeomentry.colors.push(...colorFun(..._));
            }
        }
        lineGeomentry.faces.push(pos, pos + 2, pos + 1, pos + 1, pos + 2, pos + 3);

        for (let i = 0; i < 16; i++) {
            lineGeomentry.faces.push(
                pos + 4,
                i < 15 ? pos + 6 + i : pos + 5,
                pos + 5 + i
            );
        }
    });

    return lineGeomentry;
}

export function makePanel(points, color, colorFun = undefined) {
    let panelGeomentry = { vertices: [], faces: [], colors: [] };
    points.forEach(e => {
        panelGeomentry.vertices.push(...e);
        if (!colorFun) {
            panelGeomentry.colors.push(...color);
        } else {
            panelGeomentry.colors.push(...colorFun(...e));
        }
    });
    panelGeomentry.faces.push(0, 1, 2, 0, 2, 3);
    return panelGeomentry;
}

export function makePrismOrigin(
    segment,
    height,
    radius,
    color,
    colorFun = undefined
) {
    let geometry = { vertices: [], faces: [], colors: [] };
    let verticesLength = segment * 2;
    let path = [];
    for (let i = 0; i < segment; i += 1) {
        let angle = (2 * Math.PI * i) / segment;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        path.push([x, y]);
        geometry.vertices.push(x, y, 0);
        geometry.vertices.push(x, y, height);

        if (colorFun) {
            geometry.colors.push(...colorFun(x, y, 0));
            geometry.colors.push(...colorFun(x, y, height));
        } else {
            let colorSide = Array.isArray(color[0]) ? color[0] : color;
            geometry.colors.push(...colorSide);
            geometry.colors.push(...colorSide);
        }

        let bottom = i * 2;
        let top = bottom + 1;
        let nextB = (bottom + 2) % verticesLength;
        let nextT = (bottom + 3) % verticesLength;

        geometry.faces.push(bottom, nextT, top);
        geometry.faces.push(bottom, nextB, nextT);
    }

    // top panel
    let offset = segment * 2;
    for (let i = 0; i < segment; i += 1) {
        if (Array.isArray(color[0])) {
            geometry.vertices.push(path[i][0], path[i][1], height);
            if (colorFun) {
                geometry.colors.push(...colorFun(path[i][0], path[i][1], height));
            } else {
                geometry.colors.push(color);
            }
            if (i !== 0 && i !== segment - 1) {
                geometry.faces.push(offset, offset + i + 1, offset + i);
            }
        } else {
            if (i !== 0 && i !== segment - 1) {
                geometry.faces.push(1, i * 2 + 1, i * 2 + 3);
            }
        }
    }

    return geometry;
}

export function makeDotOrigin(height, radius, color, colorFun = undefined) {
    let segment = 30;
    let geometry = { vertices: [], faces: [], colors: [] };
    geometry.vertices.push(0, 0, height);
    if (colorFun) {
        geometry.colors.push(...colorFun(0, 0, height));
    } else {
        geometry.colors.push(...color);
    }

    for (let i = 0; i < segment; i += 1) {
        let angle = (2 * Math.PI * i) / segment;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        geometry.vertices.push(x, y, height);
        if (colorFun) {
            geometry.colors.push(...colorFun(x, y, height));
        } else {
            geometry.colors.push(...color);
        }

        geometry.faces.push(0, i + 1, ((i + 1) % segment) + 1);
    }

    return geometry;
}
