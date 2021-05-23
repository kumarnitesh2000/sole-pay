import React from 'react';
import Brand from '../images/brand.svg'
import './Loding.css'
function Loding(props) {
    return (
        <div className="brand">
           <img src={Brand} alt="Brand" className="brand"/>  
        </div>
    );
}

export default Loding;