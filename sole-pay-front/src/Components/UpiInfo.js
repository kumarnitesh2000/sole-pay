import React,{useState} from 'react';
import FinalInfo from './FinalInfo';
import './Final_Info.css'
import NavBar from './Navbar';
import Busy_ill from '../images/undraw_business_shop_qw5t (2) 1.svg'
import upi from '../images/undraw_Designer_by46 (1) 1.svg'
import choice from '../images/undraw_Choice_re_2hkp 1.svg'
import Amount from '../images/undraw_personal_finance_tqcd 1.svg'
import Reason from '../images/undraw_survey_05s5.svg'
function UpiInfo(props) {
    const [step,setStep] = useState(1);
    const [cardInfo,setCardInfo] = useState({
        amount: 0,
        payeeName: "",
        vpa: "",
        reason: "",
        bgColor: "#f36565",
        logo: ''
    });
    const handleChange = (event) =>{
        setCardInfo({...cardInfo,[event.target.id]: event.target.value});
    }
    const nextStep = () => {
        setStep(step+1);
    }
    const skipStep = () => {
        setStep(step+2);
    }
    return (
        <div>
            <NavBar />
            {step===1 ? (<div>
                <div className="md:flex sm:flex-column items-center justify-around mt-12 px-10">
                <img src={Busy_ill} alt="Busy_ill" className="md:hidden lg:block"/>
                <form className="form bg-gray-100 shadow-xl p-6 px-8 md:block sm:hidden hidden">
                    <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Bussiness Name</h3>
                    <input maxLength="25" type="text" className="color width border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" id="payeeName" value={cardInfo.payeeName} onChange={handleChange} placeholder="eg. modern auto spairs"/>
                   <br/>
                    <span className="float-right font text-gray-500">0/25</span>
                    <br />
                    <button className="submit-btn width mt-5 bg-green-500 rounded outline-none border-none p-2 font text-2xl text-white"onClick={nextStep}>
                        Next
                    </button>
                </form>
                <form className="p-6 px-8 res_form md:hidden">
                    <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Bussiness Name</h3>
                    <input type="text" className="color width_res border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" id="payeeName" value={cardInfo.payeeName} onChange={handleChange} placeholder="eg. modern auto spairs"/>
                    <br />
                    <button className="submit-btn width_res mt-5 bg-green-500 rounded outline-none border-none p-2 font text-2xl text-white"onClick={nextStep}>
                        Next
                    </button>
                </form>
                </div>
            </div>) :(null)}
            {step===2 ? (<div>
                <div className="md:flex sm:flex-column items-center justify-around mt-12 px-24">
                <img src={upi} alt="Busy_ill" className="md:hidden lg:block"/>
                <form className="form bg-gray-100 shadow-xl p-6 px-8 md:block sm:hidden hidden">
                <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Enter your UPI ID</h3>
                    <input type="text" className="color width border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" id="vpa" value={cardInfo.vpa} onChange={handleChange} placeholder="eg. lol@okaxis"/>
                    <br/>
                    <button className="submit-btn mt-5 bg-green-500 rounded outline-none border-none p-2 font width text-2xl text-white" onClick={nextStep}>
                        Next
                    </button>
                </form>
                <form className="p-6 px-8 res_form-1 md:hidden">
                <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Enter your UPI ID</h3>
                    <input type="text" className="color width_res border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" id="vpa" value={cardInfo.vpa} onChange={handleChange} placeholder="eg. lol@okaxis"/>
                    <br/>
                    <button className="submit-btn width_res mt-5 bg-green-500 rounded outline-none border-none p-2 font text-2xl text-white" onClick={nextStep}>
                        Next
                    </button>
                </form>
            </div>
            </div>) :(null)}
            {step===3 ? (<div>
<div className="md:flex sm:flex-column items-center justify-around px-24 mt-12">
                <img src={choice} alt="Busy_ill" className="md:hidden lg:block"/>
                <form className="form bg-gray-100 p-6 px-8 shadow-xl md:block sm:hidden hidden">
                <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <p className="text-xl color-h font text-center">Did you want to make of specific amount
                    <br/>or any amount</p>
                    <button className="submit-btn bg-green-500 rounded outline-none border-none p-4 mt-4 font text-xl text-white" onClick={skipStep}>
                        Any Amount
                    </button>
                    <button className="submit-btn bg-green-500 mt-4 rounded outline-none border-none p-4 float-right font ml-4 text-xl text-white" onClick={nextStep}>
                        Specific Amount
                    </button>
                </form>
                <form className="p-6 px-8 res_form-1 md:hidden">
                <h3 className="text-2xl color-h-1 mb-4 font">Fill Form</h3>
                    <p className="text-base color-h font text-center width_res">Did you want to make of specific <br/>amount or any amount</p>
                    <div className="buttons items-center" style={{display:'flex',placeItems:'center'}}>
                    <button className="submit-btn bg-green-500 rounded outline-none border-none p-2 mt-4 font text-sm text-white" onClick={skipStep}>
                        Any_Amount
                    </button>
                    <button className="submit-btn bg-green-500 mt-4 rounded outline-none border-none p-2 float-right font text-base text-white" style={{marginLeft:'60px'}} onClick={nextStep}>
                        Specific_Amount
                    </button>
                    </div>
                </form>
            </div>
            </div>) :(null)}
            {step===4 ? (<div>
<div className="md:flex sm:flex-column items-center justify-around mt-12 px-24">
                <img src={Amount} alt="Busy_ill" className="md:hidden lg:block"/>
                <form className="form bg-gray-100 shadow-xl p-6 px-8 md:block sm:hidden hidden">
                <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Amount</h3>
                    <input type="number" className="color width border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" min="1" id="amount" onChange={handleChange} placeholder="eg. ₹ 1000"/>
                    <br/>
                    <button className="submit-btn mt-5 bg-green-500 rounded outline-none border-none p-2 font width text-2xl text-white" onClick={nextStep}>
                        Next
                    </button>
                </form>
                <form className="p-6 px-8 res_form-1 md:hidden">
                <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Amount</h3>
                    <input type="number" className="color width_res border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" min="1" id="amount" onChange={handleChange} placeholder="eg. ₹ 1000"/>
                    <br/>
                    <button className="submit-btn mt-5 bg-green-500 rounded outline-none border-none p-2 font width_res text-2xl text-white" onClick={nextStep}>
                        Next
                    </button>
                </form>
            </div>
            </div>) :(null)}
            {step===5 ? (<div>
<div className="md:flex sm:flex-column items-center justify-around mt-12 px-24">
                <img src={Reason} alt="Busy_ill" className="md:hidden lg:block"/>
                <form className="form bg-gray-100 shadow-xl p-6 px-8 md:block sm:hidden hidden">
                <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Reason for payment</h3>
                    <input type="text" id="reason" value={cardInfo.reason} onChange={handleChange} className="color width border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" placeholder="eg. consultant fees"/>
                    <br/>
                    <button className="submit-btn bg-green-500 mt-5 rounded outline-none border-none p-2 font width text-2xl text-white" onClick={nextStep}>
                        Next
                    </button>
                </form>
                <form className="p-6 px-8 res_form-1 md:hidden">
                <h3 className="text-2xl color-h-1 mb-10 font">Fill Form</h3>
                    <h3 className="text-xl color-h font">Reason for payment</h3>
                    <input type="text" id="reason" value={cardInfo.reason} onChange={handleChange} className="color width_res border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl" placeholder="eg. consultant fees"/>
                    <br/>
                    <button className="submit-btn bg-green-500 mt-5 rounded outline-none border-none p-2 font width_res text-2xl text-white" onClick={nextStep}>
                        Next
                    </button>
                </form>
            </div>
            </div>) :(null)}
            {step===6 ? (<div>
                <FinalInfo cardInfo={cardInfo} vpa={cardInfo.vpa} amount={cardInfo.amount} reason={cardInfo.reason} payeeName={cardInfo.payeeName} setCardInfo={setCardInfo}/>
            </div>) :(null)}
        </div>
    );
}

export default UpiInfo;