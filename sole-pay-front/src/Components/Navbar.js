import React from 'react';
import Brand_img from '../images/brand.svg'
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import './Navbar.css'
function Navbar() {
    return (
        <div className="navbar flex items-center p-2 lg:px-24 sm:px-10 justify-between">
            <div className="navbar_brand">
            <img src={Brand_img} alt="Brand" className="lg:block sm:hidden height_res hidden"/>
            <img src={Brand_img} alt="Brand" className="lg:hidden sm:block height_res-1"/>
            </div>
            <div className="lg:hidden">
            <MenuOpenIcon style={{fontSize:"40px"}} />
            </div>
            <div className="navbar_options lg:block hidden">
          <ul className="flex items-center relative">
              <li className="text-xl cursor-pointer mr-6">Home</li>
              <li className="text-xl cursor-pointer mr-6">About Us</li>
              <li className="text-xl cursor-pointer mr-6">Contact Us</li>
          </ul>
            </div>
        </div>
    );
}

export default Navbar;