# recipe_scraper
This project scrapes recipes from the following links: 

https://cooking.nytimes.com/recipes/1017518-panzanella-with-mozzarella-and-herbs (Should be possible despite pay-wall)
https://www.eatthelove.com/cookies-and-cream-cookies/
https://www.maangchi.com/recipe/bugeopo-gochujang-muchim
http://www.laurainthekitchen.com/recipes/croque-madam/

**Running the code**
1) clone the repo
2) run: ``npm install``
3) run the command: ``node index.js`` or ``npm run dev`` (which starts a nodemon instance)


**API Call**
make a get request to: localhost:3000/recipes/http://www.laurainthekitchen.com/recipes/croque-madam/
I used postman to make the requests. 

**External Dependencies:**
expressjs: I used express because it is quick to setup, easy to use and meets the requirements for this project
cheeriojs: I have used cheeriojs to scrape the recipes because of its flexibility and ease of use.
request: to make the request to the url and process the returned data

**Architecture:** 
index.js - main file to get and process the request
ingredientHelper.js: to break the ingredients string into unit, quantity and name. There are functions in the file to make it testable.

**Future Architecture Updates:**
Create new files for each website scraped to make it more modular and easy to update and test.

**Challenges:**
The lack of id or class attribute in couple of the websites made it harder to scrape. Every website had its own structure and 
the code could not be standardized for all the websites. The different structure of the list of ingredients also added more 
complexity to it. Even though cheerio is suppose to be easy to use, figuring out how to use it was a bit of a learning curve.


**Improvements to be made:**
1) take metric units into account
2) clean up the steps by trimming whitespace
3) remove "of" from ingredients in laurainthekitchen and remove line breaks in the steps.
4) clear out some nulls and "Directions" text in steps for eatthelove.com



