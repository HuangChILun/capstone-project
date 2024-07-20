import React from 'react';

const menuItems = [
  { name: 'Home Page', icon: 'home' },
  { name: 'Patient', icon: 'person', hasSubmenu: true },
  { name: 'Schedule', icon: 'event', hasSubmenu: true },
  { name: 'Invoice', icon: 'receipt', hasSubmenu: true },
  { name: 'Staff Management', icon: 'people', hasSubmenu: true },
  { name: 'Account', icon: 'account_circle', hasSubmenu: true },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <img src="/path_to_logo.png" alt="Bridging Abilities" className="h-8 w-8 mb-4" />
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <a key={index} href="#" className="block px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
            <span>
              <i className="material-icons align-middle mr-2">{item.icon}</i>
              {item.name}
            </span>
            {item.hasSubmenu && <i className="material-icons">expand_more</i>}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;