import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shrink-0 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-brand-600" />
              <span className="text-xl font-bold text-brand-600">TerraSpectra</span>
            </NavLink>
          </div>
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-900'
                } h-full flex items-center px-1`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/diagnose"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-900'
                } h-full flex items-center px-1`
              }
            >
              Diagnose
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-900'
                } h-full flex items-center px-1`
              }
            >
              Dashboard
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
