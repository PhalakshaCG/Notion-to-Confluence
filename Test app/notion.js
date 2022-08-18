const {Client} = require('@notionhq/client')
const exp = require('constants')
const { text } = require('express')
const { type } = require('os')
const confluence = require('./confluence')
const convert = require('./convert')
const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })


async function getDatabase(id){
    const db = await notion.databases.query({
        database_id : id
        
    })
    return db
  }

  async function getName(url){
	let str = url.substring(22).split("-")
  	let name = str[0]
  	if(str.length>2)
	for(let j=1;j<str.length-1;j++)
		name+=" "+str[j]
	return name
  }

async function getPages(urlfull){
	url = urlfull.substring(22)
	let pages = []
	let names = []
	if(url.includes("?v=")){
		let id = url.split('?')[0]
		console.log(id)
		const db = await getDatabase(id)
		
		for(let i=0;i<db.results.length;i++){
			console.log(db.results[i].id)
		pages[i] = await notion.blocks.children.list({
		block_id: db.results[i].id
		})
		names[i] = await getName(db.results[i].url)
		//console.log(names[i])
		}
	}
	else{
		let str = url.split('-');
		let s= str[str.length-1]
		let id = s.substring(0,8)+'-'+s.substring(8,12)+'-'+s.substring(12,16)+'-'+s.substring(16,20)+'-'+s.substring(20)
		console.log(id)
		pages[0] = await notion.blocks.children.list({
				block_id: id
		})
		names[0]=await getName(urlfull)

	}
	
	return {pages,names}
  
}


async function getChildren(page){
    let response  = await notion.blocks.children.list({
      block_id: page.id
    })
	return response
}


async function printPages(url){
  const {pages,names} = await getPages(url)
  let html =""
  for(let i=0;i<pages.length;i++){
	console.log(names[i])
   //console.log("\nPage " +(i+1)+":")
    let cur_page = pages[i]
	let num = 0
	html=""
    for(let j=0;j<cur_page.results.length;j++){
		let cur_result = cur_page.results[j]
		if(cur_result.hasOwnProperty('type')){
			let type = cur_result.type;
			switch(type){
				case "paragraph": 	if(names[i]=="Page 1")
									html+= '<p>'+await convert.paragraphToHTML(cur_result.paragraph)+'</p>'
									break 
				case "code": 		html+= await convert.codeToHTML(cur_result.code) 
									break
				case "heading_1":   html+= '<h1>' + await convert.paragraphToHTML(cur_result.heading_1) +"</h1>"
									break
				case "heading_2":   html+= '<h2>' + await convert.paragraphToHTML(cur_result.heading_1) +"</h2>"
									break
				case "heading_3":   html+= '<h3>' + await convert.paragraphToHTML(cur_result.heading_1) +"</h3>"
									break
				case "numbered_list_item":	if(num==0){
												html+='<ol>'
												num++
											}
											html+='<li>'+await convert.paragraphToHTML(cur_result.numbered_list_item)+'</li>'
											if(!cur_page.results[j+1].hasOwnProperty('type')||cur_page.results[j+1].type!='numbered_list_item'){
												num=0;
												html+='</ol>'
											}
											break;
				case "to_do":		html+= '<label>' + await convert.listItemToHTML(cur_result.to_do) +'</label>'
											break;
				case "table":		let children = await getChildren(cur_result)
									let table = await convert.tableToHTML(children.results,cur_result.table.table_width)
									html+=table
									break
				case "equation":	html+='<math>'+await convert.paragraphToHTML(cur_result.equation)+'</math>'
									break 
				


			}
    	}
  	}
	  confluence(html,names[i])
}


}
module.exports=printPages