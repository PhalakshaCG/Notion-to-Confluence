async function getStyling(cur_result){
    let para = cur_result
	let text =""
    let cur_text=""
	for(rt of para.rich_text){
        cur_text=rt.plain_text
	if(rt!=undefined){
		let a = rt.annotations
		if(a.bold==true)
        cur_text="<strong>"+cur_text+"</strong>"
		if(a.italic==true)
        cur_text="<i>"+cur_text+"</i>"
		if(a.strikethrough==true)
        cur_text="<s>"+cur_text+"</s>"
		if(a.underline==true)
        cur_text="<u>"+cur_text+"</u>"
		if(a.code==true)
        cur_text="<code>"+cur_text+"</code>"
        if(a.color!='default')
        cur_text = '<span style="color:'+a.color+';">'+cur_text+'</span>'
	}
	text+=cur_text
    }
    return text;
}
async function getStylingTable(cur_result){
    let para = cur_result[0]
    if(para==undefined)
    return ""
	let text =""
    text+=para.plain_text
    let a = para.annotations
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
	if(para.color!=undefined&&para.color!='default')
		text = '<span style="color:'+para.color+';">'+text+'</span>'
    return text;
}


async function paragraphToHTML(cur_result){
	let text = await getStyling(cur_result)
	return text
}

async function codeToHTML(cur_result){
    let text =""
    for(rt of cur_result.rich_text)
    text+=rt.plain_text
    let res =  '<ac:structured-macro ac:name="code" ac:schema-version="1" ac:macro-id="13054c9d-d99d-4660-84e7-88d28e4c1f8f">'+
    '<ac:plain-text-body><![CDATA[aasdsd\n' + text+']]></ac:plain-text-body></ac:structured-macro>'
    return res
}

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

async function tableToHTML(table_rows,r_n){
        let html = '<table data-layout="default" ac:local-id="728a3df5-d384-4401-9996-edd94ea2affe"><colgroup>'
        for(let j=0;j<r_n;j++)
        html+='<col style="width: 226.67px;" />'
        html+='</colgroup><tbody>'
        for(let i=0;i<table_rows.length;i++){
            html+='<tr>'
            let cur_row=table_rows[i]
            for(let j=0;j<r_n;j++){
                html+='<td><p>'
                html+= await getStylingTable(cur_row.table_row.cells[j])
                html+='</p></td>'
            }
            html+='</tr>'

        }
        html+='</tbody></table>'
        return html
}


module.exports ={
    paragraphToHTML,
    listItemToHTML,
    tableToHTML,
    codeToHTML,
    getStylingTable
}