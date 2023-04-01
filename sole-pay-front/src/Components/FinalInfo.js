import React from "react";
import "./Final_Info.css";
import GP from "../images/google-pay-primary-logo.svg";
import Paytm from "../images/paytm-1.svg";
import PP from "../images/image.png";
import Amazon from "../images/amazon-icon-1.svg";
import Upi from "../images/upi-ar21.svg";
import Bhim from "../images/bhim-upi 1.svg";
import QRCode from "react-qr-code";
import Out from './Out_Loader'
function FinalInfo(props) {
    const [qrval,setqrval] = React.useState("");
    const [isSubmitted,setisSubmitted] = React.useState(false);
    const submitCard = () => {
      setisSubmitted(!isSubmitted);
        const options = {
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body:JSON.stringify(props.cardInfo)
        };
        fetch('/pay_service/offline/generate/upiCard', options)
        .then((res)=> res.json())
        .then((data)=>{
            if(data.vpa){
                window.open('/get/'+data.vpa, "_self");
            }else{
                console.log('error');alert(data.message);
                window.open('/', "_self");
            }
        })
    }
    React.useEffect(() => {
        let {payeeName,vpa,amount,reason} = props;
        const config = {
            upi_pay_protocol: 'upi://pay?',
            indian_curr: 'INR'
        }
        payeeName = encodeURI(payeeName);
        reason = encodeURI(reason);
        if(amount){
            setqrval(`${config.upi_pay_protocol}&pn=${payeeName}&pa=${vpa}&cu=${config.indian_curr}&am=${amount}&tn=${reason}`);
        }else{
            setqrval(`${config.upi_pay_protocol}&pn=${payeeName}&pa=${vpa}&cu=${config.indian_curr}&tn=${reason}`);
        }
    }, [props.cardInfo])
    const handleChange = (event) =>{
        props.setCardInfo({...props.cardInfo,[event.target.id]: event.target.value});
    }  
    const changeColor = (event) => {
        let newColor = event.target.id;
        props.setCardInfo({...props.cardInfo,bgColor: newColor});
        let allBox = document.getElementsByClassName('colorb');
        for(var i=0;i<allBox.length;i++){
            allBox[i].style.border = 'none';
        }
        let styleBox = '4px solid #e2e8f0';
        event.target.style.border = styleBox;
    } 
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    const onFileChange = (event) => {
        const file = event.target.files[0];
        toBase64(file)
        .then(base64String => {
          props.setCardInfo({...props.cardInfo,logo:base64String})
        })
        window.scrollTo(0,document.body.scrollHeight);
    }
    return (
    <div className="finalInfo">
      {!isSubmitted ? (<div className="main sm:px-8 lg:px-48 md:px-24 mt-3 lg:flex sm:block justify-between items-center">
        <div className="main_left md:block sm:hidden hidden">
          <h2 className="text-5xl color-h-1">Summary</h2>
          <div className="main_content">
            <div className="main_brand flex items-center ">
              <input type="file" id="upload" hidden onChange={onFileChange} />
              <label className="label" for="upload">
                Add Logo
              </label>
              <h2 className="text-4xl ml-2 mt-1 color-h-1">{props.cardInfo.payeeName}</h2>
            </div>
            <div className="main_form mt-2">
            <div className="main_form_1 py-2">
                <label className="text-xl color-h ml-2">Bussiness Name <span className="font text-gray-500">{props.cardInfo.payeeName.length}/23</span></label>
                <br />
                <input
                  className="color ml-2 width border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="text"
                  value={props.payeeName}
                  id="payeeName"
                  onChange={handleChange}
                  maxLength="23"
                />
              
              </div>
              <div className="main_form_1 py-2">
                <label className="text-xl color-h ml-2">UPI</label>
                <br />
                <input
                  className="color ml-2 width border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="text"
                  value={props.vpa}
                  id="vpa"
                  onChange={handleChange}
                />
              </div>
              <div className="main_form_2 p-2">
                <label className="text-xl color-h">Amount(optional)</label>
                <br />
                <input
                  className="width color border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="number"
                  value={props.amount}
                  id="amount"
                  onChange={handleChange}
                />
              </div>
              <div className="main_form_3 p-2">
                <label className="text-xl color-h">Reason For Payments</label>
                <br />
                <input
                  className="width color border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="text"
                  value={props.reason}
                  onChange={handleChange}
                  id="reason"
                />
              </div>
              <div className="main_form_4 p-2">
                <label className="text-xl color-h">Bg colors</label>
                <div className="colors-box flex mt-2">
                  <div id="#f36565" className="color-box-1 box bg-red-500 mr-5 rounded cursor-pointer colorb" style={{border:'4px solid #e2e8f0'}} onClick={changeColor}></div>
                  <div id="#4299e1" className="color-box-2 box bg-blue-500 mr-5 rounded cursor-pointer colorb"  style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#54bb78" className="color-box-3 box bg-green-500 mr-5 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#ecc94b" className="color-box-4 box bg-yellow-500 mr-5 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#9f7aea" className="color-box-5 box bg-purple-500 mr-5 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#ed8936" className="color-box-6 box bg-orange-500 mr-5 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#667eea" className="color-box-7 box bg-indigo-500 mr-5 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#ed64a6" className="color-box-8 box bg-pink-500 border-4 mr-5 border-none rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                </div>
                <br />
                <div className="submit">
                  <button className="submit-btn bg-green-500 rounded outline-none border-none p-2 font width text-2xl text-white" onClick={submitCard}>
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main_left md:hidden sm:block">
          <h2 className="text-4xl color-h-1 ml-2">Summary</h2>
          <div className="main_content">
            <div className="main_brand flex items-center ">
              <input type="file" id="upload"  hidden onChange={onFileChange} />
              <label className="label ml-2" for="upload">
                Add Logo
              </label>
              <h2 className="text-4xl ml-2 mt-1 color-h-1">{props.cardInfo.payeeName}</h2>
            </div>
            <div className="main_form mt-2">
            <div className="main_form_1 py-2">
                <label className="text-xl color-h ml-2">Bussiness/Payee Name   <span className="font text-gray-500">{props.cardInfo.payeeName.length}/18</span></label>
                <br />
                <input
                  className="color ml-2 width-form border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="text"
                  value={props.payeeName}
                  id="payeeName"
                  onChange={handleChange}
                  maxLength="18"
                />
      
              </div>
              <div className="main_form_1 py-2">
                <label className="text-xl color-h ml-2">UPI</label>
                <br />
                <input
                  className="color ml-2 width-form border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="text"
                  value={props.vpa}
                  id="vpa"
                  onChange={handleChange}
                />
              </div>
              <div className="main_form_2 p-2">
                <label className="text-xl color-h">Amount(optional)</label>
                <br />
                <input
                  className="width-form color border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="number"
                  value={props.amount}
                  id="amount"
                  onChange={handleChange}
                />
              </div>
              <div className="main_form_3 p-2">
                <label className="text-xl color-h">Reason For Payments</label>
                <br />
                <input
                  className="width-form color border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-300 text-xl"
                  type="text"
                  value={props.reason}
                  onChange={handleChange}
                  id="reason"
                />
              </div>
              <div className="main_form_4 p-2">
                <label className="text-xl color-h">Bg colors</label>
                <div className="colors-box flex mt-2">
                  <div id="#f36565" className="color-box-1 box bg-red-500 mr-2 rounded cursor-pointer colorb" style={{border:'4px solid #e2e8f0'}} onClick={changeColor}></div>
                  <div id="#4299e1" className="color-box-2 box bg-blue-500 mr-2 rounded cursor-pointer colorb"  style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#54bb78" className="color-box-3 box bg-green-500 mr-2 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#ecc94b" className="color-box-4 box bg-yellow-500 mr-2 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#9f7aea" className="color-box-5 box bg-purple-500 mr-2 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#ed8936" className="color-box-6 box bg-orange-500 mr-2 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#667eea" className="color-box-7 box bg-indigo-500 mr-2 rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                  <div id="#ed64a6" className="color-box-8 box bg-pink-500 border-4 mr-2 border-none rounded cursor-pointer colorb" style={{border:'none'}} onClick={changeColor}></div>
                </div>
                <br />
                <div className="submit">
                  <button className="submit-btn bg-green-500 rounded outline-none border-none p-2 font width-form text-2xl text-white" onClick={submitCard}>
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main_right">
          <div className="md:block sm:hidden hidden">
          <div className="card-final p-4 hidden" style={{backgroundColor:props.cardInfo.bgColor}}>
            <div className="card-final-inner flex items-center">
              <div className="circle mb-10">
                <img src={props.logo} className="logo-1" alt="logo"/>
              </div>
              <div className="card-owner">
                <h3 className="font text-3xl mt-4">{props.payeeName}</h3>
                <QRCode value={qrval} />
                <div className="other-pay flex items-center mb-12">
                  <div className="pre flex items-center">
                    <img src={GP} alt="Google Pay" className="pay_icon" />
                    <img src={Paytm} alt="Paytm" className="pay_icon" />
                    <img src={PP} alt="PhonePe" className="pay_icon-1" />
                    <img src={Amazon} alt="Amazon" className="pay_icon-1" />
                  </div>
                  <div className="next flex items-center justify-center">
                    <img src={Upi} alt="Upi" />
                    <img src={Bhim} alt="Bhim" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="md:hidden sm:block">
          <div className="card-final-1" style={{backgroundColor:props.cardInfo.bgColor}}>
            <div className="card-final-inner-1 flex items-center">
              <div className="circle mb-10">
                <img src={props.logo} className="logo-1" alt="logo"/>
              </div>
              <div className="card-owner-1">
                <h3 className="font text-4xl mt-4 ml-5">{props.payeeName}</h3>
                <QRCode value={qrval} />
                <div className="other-pay flex items-center mb-12">
                  <div className="pre flex items-center">
                    <img src={GP} alt="Google Pay" className="pay_icon" />
                    <img src={Paytm} alt="Paytm" className="pay_icon" />
                    <img src={PP} alt="PhonePe" className="pay_icon-1" />
                    <img src={Amazon} alt="Amazon" className="pay_icon-1" />
                  </div>
                  <div className="next flex items-center justify-center">
                    <img src={Upi} alt="Upi" />
                    <img src={Bhim} alt="Bhim" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>) : (<div style={{display:'grid', placeItems:'center', height:'60vh'}}><Out/></div>)}
    </div>
  );
}

export default FinalInfo;
