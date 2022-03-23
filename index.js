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

  API.post('/foodAppV4', {
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
  API.get('/foodAppV4').then(data => {
    console.log('Get the data from Santosh Website');
    let dataArray = [];


    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        dataArray.push({ ...data[key]});
      }
    }
    console.log(dataArray);

    for (let i = 0; i < data.documents.length; i++) {
      dataArray.forEach((data)=> { data[i].fields.foodid = data[i].name.replace('projects/programmingjs-90a13/databases/(default)/documents/foodAppV4/', '');
      });
    }

    

    for (let i = 0; i < data.documents.length; i++) {
      dataArray.forEach(doc => {
        displayEntry(
          doc[i].fields.name.stringValue,
          doc[i].fields.carbs.integerValue,
          doc[i].fields.protein.integerValue,
          doc[i].fields.fat.integerValue,
          doc[i].fields.foodid.stringValue
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
          backgroundColor: ['#25aeee', '#fecd52', '#45c745'],
        },
      ],
    },
    options: {
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
      
      title: {
        display: false,
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

function deleteFood(foodid) {
  let newURL = URL + '/foodAppV4/' + foodid ;
  API.delete(newURL, {}).then(() => window.location.reload());
}

init();
