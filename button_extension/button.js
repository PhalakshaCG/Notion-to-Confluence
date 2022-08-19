
//document.addEventListener('DOMContentLoaded', onLoad());
function getLoaderStyle(){
  return '<style>'+
  '.loader {'+
    'border: 5px solid #f3f3f3;'+
    'border-radius: 50%;'+
    'border-top: 5px solid #3498db;'+
   ' width: 30px;'+
    'height: 30px;'+
   ' -webkit-animation: spin 2s linear infinite; /* Safari */'+
   ' animation: spin 2s linear infinite;'+
  '}'+
  
  /* Safari */
  '@-webkit-keyframes spin {'+
    '0% { -webkit-transform: rotate(0deg); }'+
   ' 100% { -webkit-transform: rotate(360deg); }'+
  '}'+
  
  '@keyframes spin {'+
   ' 0% { transform: rotate(0deg); }'+
    '100% { transform: rotate(360deg); }'+
  '}'+
  '</style>'
}




function getButtonStyle(){
  return 'background: #5E5DF0;border-radius: 999px;box-shadow: #5E5DF0 0 10px 20px -10px;'+
  'box-sizing: border-box;'+
  'color: #FFFFFF;'+
  'cursor: pointer;'+
  'font-family: Inter,Helvetica,"Apple Color Emoji","Segoe UI Emoji",NotoColorEmoji,"Noto Color Emoji","Segoe UI Symbol","Android Emoji",EmojiSymbols,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans",sans-serif;'+
  'font-size: 16px;'+
  'font-weight: 700;'+
  'line-height: 24px; position:absolute; right:10px; top:35px; z-index:1000;'+
  'opacity: 1;'+
  'outline: 0 solid transparent;'+
  'padding: 8px 18px;'+
  'user-select: none;'+
  '-webkit-user-select: none;'+
  'touch-action: manipulation;'+
  'width: fit-content;'+
  'word-break: break-word;'+
  'border: 0;'
}




async function addButton(){
async function onLoad(event){
  let button = document.createElement("button")
  function sendReq(){
    let div = document.createElement('div')
    div.className="loader"
    div.style.position="absolute"
    div.style.top="40px"
    div.style.right="90px"
    div.style.zIndex="1001"
    button.parentNode.appendChild(div)
    fetch('http://localhost:3000/',{
      headers:{
        'url':window.location.href
      }
    }).then((response)=>{
      console.log(response)
      document.body.parentNode.removeChild(document.getElementsByClassName("loader").item(0))
    })
    console.log("Req sent")
  }
  document.head.innerHTML+=getLoaderStyle()
  button.innerHTML += "N2C"
  button.style= getButtonStyle()
  button.title="Convert page to confluence page"
  button.onclick = sendReq
  
  document.children[0].appendChild(button)

  console.log("Done")
  
};
window.addEventListener('load', (event) => {
  onLoad(event)
});
}
addButton()
