export async function modelGen(filename) {
    let p = () => {
        return new Promise((reslove, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", filename, true);
            xhr.onload = () => reslove(xhr.responseText);
            xhr.onerror = () => reject(xhr.response);
            xhr.send();
        });
    };

    let md = await p();
    return toObj(md.split("\n"));
}

function toObj(lines) {
    let start = false;
    let root = {};
    let stack = [];
    stack.unshift(root);
    lines.forEach(element => {
        if (element.indexOf("---") !== -1) {
            start = true;
        }
        if (start) {
            let objType = element.match(/`(\S+)`/);
            let objName = element.match(/\-*(\S+)\:/);
            let objValue = element.match(/`*\(((\S|\s)+)\)/);
            objType = objType && objType[1];
            objName = objName && objName[1];
            objValue = objValue && objValue[1];
            console.log(objName, objValue);
            let _t;
            switch (objType) {
                case "{":
                    _t = {};
                    stack[0][objName || "prop"] = _t;
                    stack.unshift(_t);
                    break;
                case "[":
                    _t = [];
                    stack[0][objName] = _t;
                    stack.unshift(_t);
                    break;
                case "}":
                case "},":
                case "]":
                    stack.shift();
                    break;
                case null:
                    break;
                default:
                    stack[0][objName] = typeGen(objType, objValue);
                    break;
            }
        }
    });
    console.log(root);
    return root;
}

function typeGen(type, value) {
    let retobj;
    switch (type) {
        case "boolean":
            retobj = Boolean(value);
            break;
        case "string":
            retobj = value;
            break;
        case "type":
            retobj = value; //["dot", "prism", "border", "panel"];
            break;
        case "number":
            retobj = +value;
            break;
        case "url":
            retobj = value;
            break;
        case "easing":
            retobj = value;
            // [
            //     "linear",
            //     "easeInQuad",
            //     "easeOutQuad",
            //     "easeInOutQuad",
            //     "easeInCubic",
            //     "easeOutCubic",
            //     "easeInOutCubic",
            //     "easeInQuart",
            //     "easeOutQuart",
            //     "easeInOutQuart",
            //     "easeInQuint",
            //     "easeOutQuint",
            //     "easeInOutQuint",
            //     "easeInSine",
            //     "easeOutSine",
            //     "easeInOutSine",
            //     "easeInExpo",
            //     "easeOutExpo",
            //     "easeInOutExpo",
            //     "easeInCirc",
            //     "easeOutCirc",
            //     "easeInOutCirc",
            //     "easeInBack",
            //     "easeOutBack",
            //     "easeInOutBack",
            //     "easeInElastic",
            //     "easeOutElastic",
            //     "easeInOutElastic"
            // ];
            break;
        case "direction":
            retobj = value; //["normal", "reverse", "alternate"];
            break;
        default:
            if (type.indexOf("number[") !== -1) {
                let _arr = type.match(/[1-9*]/g);
                retobj = [];
                if (_arr[0] !== "*" && !_arr[1]) {
                    value = value.split(",");
                    retobj = value.map(e => {
                        return +e;
                    });
                } else {
                    retobj["prop"] = new Array(parseInt(_arr[1]));
                }
            } else {
                console.error("analytic worng:", type);
            }
            break;
    }
    return retobj;
}
