import React, { Component } from 'react';
import './Tooltip.scss';

interface Props {
    component: JSX.Element;
    position: string;
}

interface State {
    displayTooltip: boolean;
}

class Tooltip extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            displayTooltip: false,
        };
    }

    public showTooltip = (show: boolean) => () => {
        this.setState({ displayTooltip: show });
    };

    public render(): JSX.Element {
        const component = this.props.component;
        const position = this.props.position;

        return (
            <span className="tooltip" onMouseLeave={this.showTooltip(false)}>
                {this.state.displayTooltip && (
                    <div className={`tooltip-bubble tooltip-${position}`}>
                        <div className="tooltip-message">{component}</div>
                    </div>
                )}
                <span className="tooltip-trigger" onMouseEnter={this.showTooltip(true)}>
                    {this.props.children}
                </span>
            </span>
        );
    }
}

export default Tooltip;
