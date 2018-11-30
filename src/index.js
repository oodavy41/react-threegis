import * as serviceWorker from "./serviceWorker";

import React from "react";
import ReactDOM from "react-dom";
import MainCanvas from "./mainCanvas";
import { modelGen } from "./modelGen";
import Panel from "./ui/editPanel";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.model = modelGen("DataJSONFormat.md");
        this.state = { done: false };
        this.model.then(value => {
            this.model = value;
            this.setState({ done: true });
        });
    }

    getstate() {}
    render() {
        let panel = "";
        if (this.state.done) {
            panel = <Panel object={this.model} />;
        }
        return (
            <div>
                <MainCanvas style={{ width: "70%", height: "50%" }} />
                {panel}
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
