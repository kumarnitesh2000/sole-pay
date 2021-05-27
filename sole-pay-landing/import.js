import process from "process"
console.log(process.env.FRONTEND_URL);
let node = document.getElementById("redirect");
node.href = process.env.FRONTEND_URL+process.env.SUB_DIR_REDIRECT;

fetch(process.env.BACKEND_URL+'/api/pay/totalUpiCards')
.then(res => res.json())
.then(data => {
    if(data.count){
        document.getElementsByClassName('counter')[0].innerText = data.count;
    }
})