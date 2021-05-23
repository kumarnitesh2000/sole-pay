import React,{useEffect} from "react";
import "./Final_Info.css";
import GP from "../images/google-pay-seeklogo.com.svg";
import Paytm from "../images/paytm-1.svg";
import PP from "../images/image.png";
import Amazon from "../images/amazon-icon-1.svg";
import Upi from "../images/upi-ar21.svg";
import Bhim from "../images/bhim-upi 1.svg";
import Loding from './Loding'
import Navbar from "./Navbar";
import ShareInfo from "./ShareInfo";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Not from '../images/undraw_page_not_found_su7k.svg';


function CardInfo(props) {
    const {REACT_APP_FRONTEND_URL,REACT_APP_BACKEND_URL} = process.env;
    console.log(process.env);
    let [isOpen, setIsOpen] = React.useState(false);
    const [filterVal,setfilterVal] = React.useState('none');
    const [link,setLink] = React.useState(REACT_APP_FRONTEND_URL+window.location.pathname);
    const upiId = window.location.pathname.split('/')[2];
    const [data,setdata] = React.useState();
    const [isExist,setisExist] = React.useState(true);
    function openModal() {
        setIsOpen(true)
        setfilterVal('blur(18px) brightness(70%)');
    }
    function closeModal() {
        setfilterVal('none');
        setIsOpen(false)
    }
    useEffect(() => {
        fetch(REACT_APP_BACKEND_URL+'/api/pay/getupiCard/'+upiId, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        .then(res => res.json())
        .then(data => {
            if(data.statusCode === 404){
              setisExist(false);
            }else if(data.vpa){
              setdata(data);
            }
        })
    }, [])
    const printDocument = () => {
        const input = document.getElementById('printMe');
        html2canvas(input,{scrollY: -window.scrollY})
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            console.log(imgData);
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 30, 20);
            //pdf.output('dataurlnewwindow');
            pdf.save(`${data.vpa}.pdf`);
        });
    }
    const printDocumentMobile = () => {
      console.log('pdf for mobile view');
      const input = document.getElementById('printMeMobile');
      const divHeight = input.clientHeight
      const divWidth = input.clientWidth
      const ratio = divHeight / divWidth;
      html2canvas(input, { scale: '1' })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const width = pdf.internal.pageSize.getWidth();
          let height = pdf.internal.pageSize.getHeight();
          height = ratio * width;
          pdf.addImage(imgData, 'JPEG', 13, -50, width - 20, height);
          //pdf.output('dataurlnewwindow');
          pdf.save(`${data.vpa}.pdf`);
      });
  }
    return (
        <React.Fragment>
            <ShareInfo isOpen={isOpen} closeModal={closeModal} link={link} setLink={setLink}/>
            <div className="blur" style={{filter:filterVal}}>
            {data ? (<Navbar/>) : (null)}
            {!isExist ? (<Navbar/>) : (null)}
        <div className="main_right" style={{display:'grid', placeItems:'center', height:'100vh'}}>
            {data ? (
                <React.Fragment>
                    <div id="printMe">
                      <div className="md:block sm:hidden hidden">
   <div className="card-final p-4" style={{backgroundColor:data.bgColor}}>
          <div className="card-final-inner flex items-center">
            <div className="circle mb-10">
              <img src={data.logo} alt="logo" className="logo-1"/>
            </div>
            <div className="card-owner">
              <h3 className="font text-4xl mt-4 ">{data.payeeName}</h3>
              <img src={data.qrcode} className="qr" alt="qr"/>
              <p className="font text-base">Powered by <a className="font text-base text-blue-900" style={{marginTop:'-20px'}}>solepay.ml</a></p>
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
      <div id="printMeMobile">
      <div className="md:hidden sm:block">
          <div className="card-final-2 p-4" style={{backgroundColor:data.bgColor}}>
            <div className="card-final-inner flex items-center">
              <div className="circle mb-10">
                <img src={data.logo} className="logo-1" alt="logo"/>
              </div>
              <div className="card-owner-2">
                <h3 className="font text-3xl mt-4 ">{data.payeeName}</h3>
                <img src={data.qrcode} />
                <p className="font text-base">Powered by <a className="font text-base text-blue-900" style={{marginTop:'-20px'}}>solepay.ml</a></p>
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
        <div className="buttons flex items-center justify-between margin-btn md:block sm:hidden hidden">
                    <button className="submit-btn bg-green-500 rounded outline-none border-none p-2 font width-1 text-2xl text-white"
                    onClick={openModal}
                    >
                    Share
                  </button>
                  <button className="submit-btn bg-green-500 ml-2 rounded outline-none border-none p-2 font width-1 text-2xl text-white"
                  onClick={printDocument}  
                  >
                    Dowload
                  </button>
        </div>   
        <div className="buttons-1 flex items-center justify-between md:hidden sm:block">
                    <button className="bg-green-500 rounded outline-none border-none p-2 font width-4 text-xl text-white"
                    onClick={openModal}
                    >
                    Share
                  </button>
                  <button className="bg-green-500 ml-6 rounded outline-none border-none p-2 font width-4 text-xl text-white"
                  onClick={printDocumentMobile}  
                  >
                    Dowload
                  </button>
        </div>          
        </React.Fragment>
        ): (<div>
          {!isExist ? (<div><img src={Not} alt='404 Not Found' style={{width:'600px', height:'600px', marginTop:'-200px'}}/></div>) : (<Loding />)}
          </div>)}
        </div>
      </div>
      </React.Fragment>
    );
}

export default CardInfo;