import React from 'react';
import Brand_img from '../images/brand.svg'
import './Navbar2.css'
function Navbar_2() {
    const changePage = () => {
        window.open('/','_self');
    }
    return (
        <React.Fragment>
        <div className="navbar flex items-center p-2 px-24 justify-between md:block sm:hidden hidden">
        <div className="navbar_brand">
        <img src={Brand_img} alt="Brand" style={{height:'90px'}}/>
        </div>
        <div className="navbar_options">
        <button onClick={changePage} className="justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 md:py-4 md:text-lg md:px-10 focus:ring-green-600">CREATE UPI CARD</button>
        </div>
    </div>
         <div className="navbar flex items-center p-2 justify-between md:hidden sm:block">
         <div className="navbar_brand">
         <img src={Brand_img} alt="Brand" style={{height:'50px'}}/>
         </div>
         <div className="navbar_options">
         <button onClick={changePage} className="border border-transparent text-sm rounded-md text-white bg-green-500 hover:bg-green-600 p-2 focus:ring-green-600">CREATE UPI CARD</button>
         </div>
     </div>
     </React.Fragment>
    );
}

export default Navbar_2;