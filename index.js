const express = require('express');
const app = express();
const request = require("request");
const URL = require("url");  
const cheerio = require('cheerio');
const port=3000;
const unitsArr = ["slices","slice","grams","gram","tbsp","tablespoons","teaspoons","tablespoon","teaspoon","cups","cup","ounces","ounce","large","small"];
  

function getQuantity2(str2){

	let start = str2.indexOf('(');
	let end = str2.indexOf(')');
	let text = str2.substring(start,end+1);
	str2 = str2.replace(text,"");
	return str2; 
}

function getQtyNumeric(str){
	let q ='';
	const strQty = ["a few","a touch"];

	for(let val of strQty){
		
		let pos =str.toLowerCase().indexOf(val.toLowerCase());
		
		if(pos !== -1){
			q = str.substring(pos,pos+val.length);
			return q;
		}
	}

	for(let i=0;i<str.length;i++){
		let char = str.charAt(i);
			if(!char.match('[A-Za-z]')){
				q += char; 
			}
			else{
				break;
			}
		}
	return q;
}

function getQuantityAndUnit1(str1){

		getQtyNumeric(str);
	return q;
}

function getUnit(str){
	let unit='';
	for(let val of unitsArr){
		
		let pos =str.toLowerCase().indexOf(val.toLowerCase());
		
		if(pos !== -1){
			unit = str.substring(pos,pos+val.length);
			return unit;
		}
	}

	
}

function removeTextFromIngredient(unit,ingredient){

	return ingredient.replace(unit,"");

}

function processIngredient(str){
	let ingredient = str;
	let qty = getQtyNumeric(ingredient);
	ingredient = removeTextFromIngredient(qty, ingredient);
	let unit = getUnit(ingredient);
	ingredient = removeTextFromIngredient(unit, ingredient);
	ingredient = getQuantity2(ingredient);
	let obj = {
			name:ingredient,
			quantity1:qty,
			unit1:unit
		};
	return obj;
}

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/recipes/*', function(req, res){

	let param = req.params[0];
	let url = URL.parse(param,true);

	if(url === undefined || url === ""){
		res.send("error");
	}

	request.get(param, function(error, response, data1) {
	
		let $ = cheerio.load(data1);		
		let steps = [];
		let title = $('h1').text();
		let ingredients = [];
		let recipe = {};

		if(url.host === "www.eatthelove.com"){
			
			$('span[itemprop=ingredients]').map(function(i, el) {
				let ingredient=$(this).text();		
  				ingredients.push(processIngredient(ingredient));
  				
			});

			$('div[itemtype="http://schema.org/Recipe"] p').each(function(i, elem) {
				let x = $(this).text()
				if(i>=5 &&  x!== null){
					steps[i] = x;
				}
			});
			recipe = {
				name:title,
				ingredients:ingredients,
				steps:steps
			};
  			res.send(JSON.stringify(recipe));

		}
		else if(url.host === "www.maangchi.com"){

			let k = cheerio.load($('.entry').html());
			k('ul li').each(function(i, elem) {
				let m = $(this).text();
				ingredients.push(processIngredient(m));
			});
			k('ol li').each(function(i, elem) {
				let m = $(this).text();
				steps.push(m);
			});

			recipe = {
				name:title,
				ingredients:ingredients,
				steps:steps
			};
  			res.send(JSON.stringify(recipe));

		}
		else if(url.host === "cooking.nytimes.com"){
			
			let strResp = '"name":'+title+',';
			$('li[itemprop=recipeIngredient]').each(function(i, elem) {
  				const q = cheerio.load($(this).html());  				
  				let quantity = q(".quantity").text().trim();
  				let ingredient = q(".ingredient-name").text().trim();
  				let unit = getUnit(ingredient);
  				ingredient = removeTextFromIngredient(unit, ingredient);
  				let obj = {
  					name:ingredient,
  					quantity1:quantity,
  					unit1:unit
  				};
  				ingredients.push(obj);
  			
			});
     		$('ol[itemprop=recipeInstructions] li').each(function(i, elem) {
				steps[i] = $(this).text();		
			});
			recipe = {
				name:title,
				ingredients:ingredients,
				steps:steps
			};
  			res.send(JSON.stringify(recipe));

		}
		else if(url.host === "www.laurainthekitchen.com"){
			let k = cheerio.load($('div[id=recipe-ingredients]').html());
			let ingredients = [];
			k('li').each(function(i, elem) {
				
  				let ingredient=$(this).text();				
  				ingredients.push(processIngredient(ingredient));
			
			});
			let l = cheerio.load($('div[id=recipe-process]').html());
			
			let str = l('ul').html();
			let steps=str.split("<br>");
			recipe = {
				name:title,
				ingredients:ingredients,
				steps:steps
			};
  			res.send(JSON.stringify(recipe));
		}
		else{
			res.send("invalid url");
		}
		
	
	});

});
	

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

