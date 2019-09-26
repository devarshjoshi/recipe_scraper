 
const unitsArr = ["slices","slice","grams","gram","tbsp","tablespoons","teaspoons","tablespoon","teaspoon","cups","cup","ounces","ounce","large","small"];


/*
	at this point, we are removing the metric units. In the future, we can take this into account.

*/

const getQuantity2= function(str2){

	let start = str2.indexOf('(');
	let end = str2.indexOf(')');
	let text = str2.substring(start,end+1);
	str2 = str2.replace(text,"");
	return str2; 
}


/*
	Searches for the quantity in the ingredient string and returns the quantity.
	This function takes into account the string and numeric quantities
*/
const getQty = function (str){
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


/*
	looks for the unit in the ingredient string and returns the unit
*/
const getUnit = function(str){
	let unit='';
	for(let val of unitsArr){
		
		let pos =str.toLowerCase().indexOf(val.toLowerCase());
		
		if(pos !== -1){
			unit = str.substring(pos,pos+val.length);
			return unit;
		}
	}
}



const removeTextFromIngredient = function(unit,ingredient){

	return ingredient.replace(unit,"");

}

/*
	This function takes the complete ingredient string and returns an object
	with the name, quantity and unit
*/
const processIngredient = function (str){
	let ingredient = str;
	let qty = getQty(ingredient);
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

module.exports = {
	"processIngredient":processIngredient,
	"removeTextFromIngredient":removeTextFromIngredient,
	"getUnit":getUnit
}