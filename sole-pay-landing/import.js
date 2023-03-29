fetch('/pay_service/offline/totalUpiCards')
.then(res => res.json())
.then(data => {
    if(data.count){
        document.getElementsByClassName('counter')[0].innerText = data.count;
    }
})