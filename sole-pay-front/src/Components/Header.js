import React from 'react';

function Header() {
    const fillPageOpen = () => {
        window.open('/fill','_self');
    }
    return (
        <div className="header p-24">
            <div className="header_left">
            <h1>
            Collect Payments through one mode
            </h1>
            <button onClick={fillPageOpen} className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 focus:ring-blue-600">CREATE UPI CARD</button>
            </div>
            <div className="header_right">
         
            </div>
        </div>
    );
}

export default Header;