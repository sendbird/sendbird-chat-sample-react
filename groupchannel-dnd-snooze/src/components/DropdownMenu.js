import '../styles/DropdownMenu.css';
import {useEffect, useRef, useState} from "react";

function DropdownMenu({ items, onSelect, position }) {
  const menuRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(0);

  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.offsetWidth);
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className="dropdown-menu"
      style={{
        top: `${position.top + position.height}px`,
        left: `${position.left - menuWidth + 15}px`
      }}
    >
      {items.map(item => (
        <div
          key={item}
          onClick={() => onSelect(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default DropdownMenu;