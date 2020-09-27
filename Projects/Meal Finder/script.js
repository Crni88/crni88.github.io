const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

//Searches for the meal
function searchMeal(e) {
  e.preventDefault(); //Prevents the reloading of the page 
  //Clear single meal
  single_mealEl.innerHTML = '';
  //Get the search term
  const term = search.value;
  //Check for empty 
  if (term.trim()) {
    //Fetch request
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}
    `).then(res => res.json()) //Returns a promise, and res.json() returns another promise
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for: '${term}'</h2>`
        if (data.meals === null) { //If there are no meals with this name
          resultHeading.innerHTML = `<h2>There are no search results for: '${term}'</h2>`
        } else {
          mealsEl.innerHTML = data.meals.map(meal =>
            `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h2>${meal.strMeal}</h2>
            </div>
            </div>
            `).join("");
        }
      });
    //Clear the search text
    search.value = '';
  } else {
    alert("Please enter a search value"); //Create a seperate div
  }
}

//Return ID of the meal
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

//Get random meal

function GetRandomMeal() {
  //Clear meals and heading 
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php
  `).then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

//Add meal to the DOM
function addMealToDOM(meal) {
  const ingridients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingridients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);

    } else {
      break;
    }
  }
  console.log("Ovdje su sastojci", ingridients);
  single_mealEl.innerHTML = `<div class="single-meal"><h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>`:''}
  ${meal.strArea ? `<p>${meal.strArea}</p>`:''}
  </div>
  <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
      ${ingridients.map(ing => `<li>${ing}</li>`).join('')}

      </ul>
    </div>
  </div>
  `;
}
//Event listener 
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", GetRandomMeal);


mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});