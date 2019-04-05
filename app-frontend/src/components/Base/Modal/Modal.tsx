import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

const modalRoot = document.getElementById('modal-root') as HTMLElement;

class Modal extends React.Component {
    public el: HTMLElement = document.createElement('div');

    public componentDidMount(): void {
        modalRoot.appendChild(this.el);
    }

    public componentWillUnmount(): void {
        modalRoot.removeChild(this.el);
    }

    public render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}

export default Modal;
