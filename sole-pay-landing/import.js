let node = document.getElementById("redirect");
node.href = config.frontend_url+"/fill";
fetch(config.backend_url+'/api/pay/totalUpiCards')
.then(res => res.json())
.then(data => {
    if(data.count){
        document.getElementsByClassName('counter')[0].innerText = data.count;
    }
})