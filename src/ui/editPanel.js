import React from "react";
import ReactDOM from "react-dom";
import { Switch, InputNumber, Select, Input, Collapse } from "antd";
import "antd/dist/antd.css";

export default class Panel extends React.Component {
    childComp(object, name) {
        let obj = [];
        for (let key in object) {
            if (
                typeof object[key] === "object" &&
                typeof object[key][0] !== "number"
            ) {
                obj.push(this.childComp(object[key], key));
            } else {
                switch (typeof object[key]) {
                    case "boolean":
                        obj.push(
                            <div>
                                {key}: <Switch />
                            </div>
                        );
                        break;
                    case "number":
                        obj.push(
                            <div>
                                {key}:
                                <InputNumber min={0} max={10} />
                            </div>
                        );
                        break;
                    case "object":
                        obj.push(
                            <Select defaultValue={object[key][0]}>
                                {object[key].map(e => {
                                    return (
                                        <Select.Option value={e}>{e}</Select.Option>
                                    );
                                })}
                            </Select>
                        );
                        break;
                    case "string":
                        obj.push(<Input placeholder={key} />);
                        break;
                    default:
                        obj.push(
                            <p>
                                {key},{object[key]}
                            </p>
                        );
                        break;
                }
                obj.push(<br />);
            }
        }
        let Panel = Collapse.Panel;
        if (name) {
            return (
                <Collapse bordered={false}>
                    <Panel header={name} key="1">
                        {obj}
                    </Panel>
                </Collapse>
            );
        } else {
            return obj;
        }
    }
    render() {
        return this.childComp(this.props.object);
    }
}
