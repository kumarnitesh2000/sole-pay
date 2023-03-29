import process from "process"

fetch(process.env.BACKEND_URL+'/api/pay/totalUpiCards')
.then(res => res.json())
.then(data => {
    if(data.count){
        document.getElementsByClassName('counter')[0].innerText = data.count;
    }
})