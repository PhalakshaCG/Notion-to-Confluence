
//document.addEventListener('DOMContentLoaded', onLoad());

async function addButton(){
async function onLoad(event){
  function sendReq(){
    let req = new XMLHttpRequest()
    req.open("GET","http://localhost:3000/",false)
    req.setRequestHeader("url",window.location.href)
    req.send()
    console.log("Req sent")
  }
  let button = document.createElement("button")
  button.innerHTML = "N2C"
  button.style.position="absolute"
  button.style.right="200px"
  button.style.fontSize="14px"
  button.style.top="11px"
  button.style.textDecoration="none"
  button.style.zIndex="1000"
  button.style.color="rgb(55, 53, 47)"
  button.style.fontFamily='font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";'
  button.onclick = sendReq
  
  document.children[0].appendChild(button)

  console.log("Done")
  
};
window.addEventListener('load', (event) => {
  onLoad(event)
});
}
addButton()
