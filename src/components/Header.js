import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Bridging Abilities</h1>
      <div className="flex items-center">
        <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs mr-4">11</span>
        <img src="/path_to_avatar.png" alt="John Doe" className="h-8 w-8 rounded-full" />
        <span className="ml-2">John Doe</span>
      </div>
    </header>
  );
}

export default Header;