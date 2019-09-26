const helper = require('./ingredientHelper.js');
const express = require('express');
const app = express();
const request = require("request");
const URL = require("url");  
const cheerio = require('cheerio');
const port=3000;
 

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
  				ingredients.push(helper.processIngredient(ingredient));
  				
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
				ingredients.push(helper.processIngredient(m));
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
  				let unit = helper.getUnit(ingredient);
  				ingredient = helper.removeTextFromIngredient(unit, ingredient);
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
  				ingredients.push(helper.processIngredient(ingredient));
			
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

