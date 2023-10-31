import React, { useState } from "react";
import { ReactComponent as Right } from '../assets/sendbird-icon-right-arrow.svg';
import '../styles/AccordionItem.css';

function AccordionItem({ Icon, title, children, onActionBtnClick, actionBtnLabel, toggle, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`accordion-item-header ${isOpen ? "open" : ""}`}
        onClick={() => {
            setIsOpen(!isOpen)
            if(toggle) onToggle();
          }
        }
      >
        <div className="accordion-item-header-content">
          <Icon className="icon"/>
          <span>{title}</span>
        </div>
        {!toggle && <Right className="right-arrow"/>}
      </div>
      {isOpen && (
        <div className="accordion-item-content">
          {children}
          {actionBtnLabel && onActionBtnClick && (
            <button
              className="button"
              onClick={onActionBtnClick}
            >
              {actionBtnLabel}
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default AccordionItem;
