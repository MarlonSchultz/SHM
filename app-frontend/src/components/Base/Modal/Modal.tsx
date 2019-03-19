import React from "react";
import ReactDOM from "react-dom";
import './Modal.scss';

const modalRoot = document.getElementById('modal-root') as HTMLElement;

class Modal extends React.Component {
    el: HTMLElement = document.createElement('div');

    componentDidMount(): void {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount(): void {
        modalRoot.removeChild(this.el);
    }

    render () {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}

export default Modal;
