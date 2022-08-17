const {Client} = require('@notionhq/client')
const exp = require('constants')
const { text } = require('express')
const { type } = require('os')
const confluence = require('./confluence')
const convert = require('./convert')
const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })


async function getDatabase(){
    const db = await notion.databases.query({
        database_id : process.env.NOTION_DATABASE_ID,
        
    })
    return db
  }


async function getPages(){
    const db = await getDatabase()
    let pages = []
	let names = []
    for(let i=0;i<db.results.length;i++){
      pages[i] = await notion.blocks.children.list({
      block_id: db.results[i].id
    })
	let str = db.results[i].url.substring(22).split("-")
  	let name = str[0]
  	if(str.length>2)
	for(let j=1;j<str.length-1;j++)
		name+=" "+str[j]
  	names[i] = name
  	//console.log(names[i])
  	}
  return {pages,names}
}


async function getChildren(page){
    let response  = await notion.blocks.children.list({
      block_id: page.id
    })
	return response
}


async function printPages(){
  const {pages,names} = await getPages()
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
				case "paragraph": 	html+= '<p>'+await convert.paragraphToHTML(cur_result.paragraph)+'</p>'
									break 
				case "code": 		cur_result.code.rich_text[0].annotations.code=true
									html+= '<p>'+await convert.paragraphToHTML(cur_result.code)+'</p>'
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
				case "table":		console.log(cur_result.table)
									let children = await getChildren(cur_result)
									console.log(children.results[0].table_row)

									

			}
    	}
  	}
	  //confluence(html,names[i])
}
//console.log(html)

}
//getDatabase()
//printPageContent()
printPages()