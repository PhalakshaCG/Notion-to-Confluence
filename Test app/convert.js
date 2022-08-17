async function getStyling(cur_result){
    let para = cur_result
	let text =""
	for(rt of para.rich_text)
		text+=rt.plain_text
	if(para.rich_text[0]!=undefined){
		let a = para.rich_text[0].annotations
		if(a.bold==true)
			text="<strong>"+text+"</strong>"
		if(a.italic==true)
			text="<i>"+text+"</i>"
		if(a.strikethrough==true)
			text="<s>"+text+"</s>"
		if(a.underline==true)
			text="<u>"+text+"</u>"
		if(a.code==true)
			text="<code>"+text+"</code>"
	}
	if(para.color!='default')
		text = '<span style="color:'+para.color+';">'+text+'</span>'
    return text;
}



async function paragraphToHTML(cur_result){
	let text = await getStyling(cur_result)
	return text
}
let listID = 1
async function listItemToHTML(cur_result){
    let text = await getStyling(cur_result) 
    let status
    if(cur_result.checked)
        status="complete"
    else
        status="incomplete" 
    let res = '<ac:task-list>\n' +'<ac:task>\n' +
    '<ac:task-id>2</ac:task-id>\n' +'<ac:task-status>'+status+'</ac:task-status>\n' +
    '<ac:task-body><span class="placeholder-inline-tasks">'+text+'</span></ac:task-body>\n' +
    '</ac:task>\n' +'</ac:task-list>'
    return res
}
module.exports ={
    paragraphToHTML,
    listItemToHTML
}