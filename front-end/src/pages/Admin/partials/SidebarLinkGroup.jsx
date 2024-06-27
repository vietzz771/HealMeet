/* eslint-disable react/prop-types */
import { useState } from 'react';

function SidebarLinkGroup({ children, activecondition }) {
  const [open, setOpen] = useState(activecondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li className={`px-3 py-3 rounded-sm mb-0.5 last:mb-0 ${activecondition && 'bg-active'}`}>
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;
