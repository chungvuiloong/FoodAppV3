import FetchWrapper from './fetch-wrapper.js';
import AppData from './app-data.js';
import { capitalize, calculateCalories } from './helpers.js';
import Snackbar from './snackbar/src/snackbar.js';

const URL = "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents";

const API = new FetchWrapper(URL);
const appData = new AppData();

const snackbar = new Snackbar();

const list = document.querySelector('#food-list');
const form = document.querySelector('#create-form');
const name = document.querySelector('#create-name');
const carbs = document.querySelector('#create-carbs');
const protein = document.querySelector('#create-protein');
const fat = document.querySelector('#create-fat');
const totalCalories = document.querySelector('#total-calories');

// Display each food card in the ul element
const displayEntry = (name, carbs, protein, fat, foodid) => {
  appData.addFood(carbs, protein, fat);
  list.insertAdjacentHTML(
    'beforeend',
    `<li class="card">
        <div>
          <h3 class="name">${capitalize(name)}</h3>
          <div class="calories">${calculateCalories(
            carbs,
            protein,
            fat
          )} calories</div>
          <ul class="macros">
            <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
            <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
            <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
          </ul>
          <button id=${foodid} class="deletebtn">Delete</button>
        </div>
      </li>`
  );

  let deleteBtn = document.querySelector(`#${foodid}`);
  deleteBtn.addEventListener('click', () => deleteFood(foodid));
};

form.addEventListener('submit', event => {
  event.preventDefault();

  API.post('/foodAppV2', {
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  }).then(data => {
    if (data.error) {
      // There was an error
      snackbar.duration = 1800;
      snackbar.show('Some data is missing.');
      return;
    }

    snackbar.duration = 1800;
    snackbar.show('Food added successfully.');

    setTimeout(() => window.location.reload(), 2200);
  });
});

const init = () => {
  API.get('/foodAppV2').then(data => {
    console.log('Get the data from Santosh Website');


    console.log(data);
    console.log(data.documents.length);

    let dataArray = [];


    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        dataArray.push({ ...data[key], id: "foodList" }); // key = documents needs to change
      }
    }
    console.log(dataArray);


    for (let i = 0; i < data.documents.length; i++) {
      dataArray.forEach(doc => {
        displayEntry(
          doc[i].fields.name.stringValue,
          doc[i].fields.carbs.integerValue,
          doc[i].fields.protein.integerValue,
          doc[i].fields.fat.integerValue,
        );
      });}
    
    render();
  });
};

let chartInstance = null;
const renderChart = () => {
  chartInstance?.destroy();
  const context = document.querySelector('#app-chart').getContext('2d');

  chartInstance = new Chart(context, {
    type: 'bar',
    data: {
      labels: ['Carbs', 'Protein', 'Fat'],
      datasets: [
        {
          label: 'Macronutrients',
          data: [
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          backgroundColor: ['#25aeee', '#fecd52', '#ff6384'],
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Macronutrients',
      },
    },
  });
};


const updateTotalCalories = () => {
  totalCalories.textContent = appData.getTotalCalories();
};

const render = () => {
  renderChart();
  updateTotalCalories();
};

function deleteFood(e) {
  e.preventDefault();
  // let url = '/foodAppV2';
  // API.delete(url, {}).then(() => window.location.reload());
}

init();
