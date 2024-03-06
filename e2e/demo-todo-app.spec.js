// @ts-check
const { test, expect } = require('@playwright/test');
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const HomePage = require("../features/pages/HomePage");
const env = require("../config/env.json");
const locators = require('../features/page_locators/otto/otto_HP_locators.json')
const locators_pdp = require('../features/page_locators/otto/otto_PDP_locators.json')
const locators_indeed = require('../features/page_locators/indeed/indeed_HP_locators.json');
const { url } = require('inspector');



test.beforeEach(async ({ page }) => {
  await page.goto(env.indeed);
});

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
];


test.describe('As a user, I can find all QA jobs with no required German language skills', () => {
  const processJobs = async (page) => {
    const jobs = await page.locator('xpath=' + locators_indeed['search_result_jobs']).all();
    console.log('Number of jobs:', jobs.length);

    for (const job of jobs) {
      await job.click();
  
      const maxAttempts = 5;
      let attempts = 0;
  
      while (attempts < maxAttempts) {
        try {
          if (!page.isClosed()) { // Check if the page is still open
            await page.waitForSelector('#jobDescriptionText', { timeout: 10000 }); // 10 seconds timeout
            break; // Exit the loop if waitForSelector succeeds
          } else {
            console.error('Page has been closed.');
            return;
          }
        } catch (error) {
          console.error(`Error waiting for selector (Attempt ${attempts + 1}):`, error);
          attempts++;
          await page.waitForTimeout(2000); // 2 seconds delay before retrying
        }
      }
  
      const jobDescription = await page.$('#jobDescriptionText');
      const jobDescriptionText = jobDescription ? await jobDescription.innerText() : null;
  
      if (
        jobDescriptionText !== null &&
        jobDescriptionText !== undefined &&
        jobDescriptionText.includes('Deutsch', 'German', 'Deutschkenntnisse')
      ) {
        const url = await page.url();
        console.log('Job requires Deutsch URL:', url);
      } else {
        const url = await page.url();
        console.log('URL:', url);
      }
    }
  };

  test('User can find all QA jobs with no required German language skills', async ({ page }) => {
    await page.getByText('Alle Cookies akzeptieren').click();
    console.log('Popup is closed');

    await page.locator('#text-input-what').fill('Software Tester');
    await page.getByText('Jobs finden').press('Enter');
    console.log('ENTER is clicked');

  
    await page.waitForSelector('xpath=' + locators_indeed['search_result_jobs']);

    await processJobs(page);

    await page.getByTestId('pagination-page-2').click();
    console.log('Pagination btn is clicked');

    await page.waitForSelector('.css-yi9ndv.e8ju0x51');

    await page.click('.css-yi9ndv.e8ju0x51');

    await page.waitForSelector('xpath=' + locators_indeed['search_result_jobs']);

    await processJobs(page);
  });
});



// test1 OTTO
// test.describe('Home page carousel is available', () => {
  
//     test('user can see the home page carousel with Empfehlungen für dich title', async ({page}) =>{
//       await expect(page.getByRole('heading', { name: 'Empfehlungen für dich' })).toBeVisible();
//     })

    // test('user can see product details', async ({page}) => {

    //   await page.getByRole('button', { name: 'Ok' }).click();

    //   const carousel = await page.locator('xpath=' + locators['top-prosuct-carousel-items-li']);
    //   const elements = await carousel.locator('xpath=' + locators['top-product-carousel-product-name']).all()
    //   console.log('Number of elements: ' + elements.length)

    //   for (const item of elements) {
    //     const productName = await item.innerText();
    //     const productImg = await item.locator('xpath=' + locators['top-product-carousel-product-images']).first();
    //     const productPriceLineThrough = await item.locator('xpath=' + locators['top-product-carousel-product-price-line-through']).first();
    //     const productPriceRed = await item.locator('xpath=' + locators['top-product-carousel-product-price-red']).first();
        
    //     const productImgSrc = await productImg.getAttribute('src')
    //     const priceLineThrough = await productPriceLineThrough.innerText();
    //     const priceRed = await productPriceRed.innerText();
    
    //     console.log('Product name:', productName);
    //     console.log('Product img:', productImgSrc);
    //     console.log('Contains price (line-through):' , !!priceLineThrough);
    //     console.log('Contains price (red):', !!priceRed);
    //   }
    //   }
    // )

//     test('user can click on product and being naviagted to the relevant page', async({page}) => {
//       const carousel = await page.locator('xpath=' + locators['top-prosuct-carousel-items-li']);

//       console.log('getting random element from carousel');
//       const elements = await carousel.all();
    
//       const randomElementIndex = Math.floor(Math.random() * elements.length);
//       const randomElement = elements[randomElementIndex];

//       const randomElementName = await randomElement.textContent();
//       console.log('product name: ', randomElementName);

//       await randomElement.click();

//       const productName = await page.locator('xpath=' + locators_pdp['product_title'])

//       const productName_text = await productName.innerText();
//       console.log('PDP product name: ', productName_text);

//       expect(randomElementName).toEqual(expect.stringContaining(productName_text))
//     }
//     )

// })


// test.describe('New Todo', () => {
//   test('should allow me to add todo items', async ({ page }) => {
//     // create a new todo locator
//     const newTodo = page.getByPlaceholder('What needs to be done?');

//     // Create 1st todo.
//     await newTodo.fill(TODO_ITEMS[0]);
//     await newTodo.press('Enter');

//     // Make sure the list only has one todo item.
//     await expect(page.getByTestId('todo-title')).toHaveText([
//       TODO_ITEMS[0]
//     ]);

//     // Create 2nd todo.
//     await newTodo.fill(TODO_ITEMS[1]);
//     await newTodo.press('Enter');

//     // Make sure the list now has two todo items.
//     await expect(page.getByTestId('todo-title')).toHaveText([
//       TODO_ITEMS[0],
//       TODO_ITEMS[1]
//     ]);

//     await checkNumberOfTodosInLocalStorage(page, 2);
//   });

//   test('should clear text input field when an item is added', async ({ page }) => {
//     // create a new todo locator
//     const newTodo = page.getByPlaceholder('What needs to be done?');

//     // Create one todo item.
//     await newTodo.fill(TODO_ITEMS[0]);
//     await newTodo.press('Enter');

//     // Check that input is empty.
//     await expect(newTodo).toBeEmpty();
//     await checkNumberOfTodosInLocalStorage(page, 1);
//   });

//   test('should append new items to the bottom of the list', async ({ page }) => {
//     // Create 3 items.
//     await createDefaultTodos(page);

//     // create a todo count locator
//     const todoCount = page.getByTestId('todo-count')
  
//     // Check test using different methods.
//     await expect(page.getByText('3 items left')).toBeVisible();
//     await expect(todoCount).toHaveText('3 items left');
//     await expect(todoCount).toContainText('3');
//     await expect(todoCount).toHaveText(/3/);

//     // Check all items in one call.
//     await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
//     await checkNumberOfTodosInLocalStorage(page, 3);
//   });
// });

// test.describe('Mark all as completed', () => {
//   test.beforeEach(async ({ page }) => {
//     await createDefaultTodos(page);
//     await checkNumberOfTodosInLocalStorage(page, 3);
//   });

//   test.afterEach(async ({ page }) => {
//     await checkNumberOfTodosInLocalStorage(page, 3);
//   });

//   test('should allow me to mark all items as completed', async ({ page }) => {
//     // Complete all todos.
//     await page.getByLabel('Mark all as complete').check();

//     // Ensure all todos have 'completed' class.
//     await expect(page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
//     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
//   });

//   test('should allow me to clear the complete state of all items', async ({ page }) => {
//     const toggleAll = page.getByLabel('Mark all as complete');
//     // Check and then immediately uncheck.
//     await toggleAll.check();
//     await toggleAll.uncheck();

//     // Should be no completed classes.
//     await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
//   });

//   test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
//     const toggleAll = page.getByLabel('Mark all as complete');
//     await toggleAll.check();
//     await expect(toggleAll).toBeChecked();
//     await checkNumberOfCompletedTodosInLocalStorage(page, 3);

//     // Uncheck first todo.
//     const firstTodo = page.getByTestId('todo-item').nth(0);
//     await firstTodo.getByRole('checkbox').uncheck();

//     // Reuse toggleAll locator and make sure its not checked.
//     await expect(toggleAll).not.toBeChecked();

//     await firstTodo.getByRole('checkbox').check();
//     await checkNumberOfCompletedTodosInLocalStorage(page, 3);

//     // Assert the toggle all is checked again.
//     await expect(toggleAll).toBeChecked();
//   });
// });

// test.describe('Item', () => {

//   test('should allow me to mark items as complete', async ({ page }) => {
//     // create a new todo locator
//     const newTodo = page.getByPlaceholder('What needs to be done?');

//     // Create two items.
//     for (const item of TODO_ITEMS.slice(0, 2)) {
//       await newTodo.fill(item);
//       await newTodo.press('Enter');
//     }

//     // Check first item.
//     const firstTodo = page.getByTestId('todo-item').nth(0);
//     await firstTodo.getByRole('checkbox').check();
//     await expect(firstTodo).toHaveClass('completed');

//     // Check second item.
//     const secondTodo = page.getByTestId('todo-item').nth(1);
//     await expect(secondTodo).not.toHaveClass('completed');
//     await secondTodo.getByRole('checkbox').check();

//     // Assert completed class.
//     await expect(firstTodo).toHaveClass('completed');
//     await expect(secondTodo).toHaveClass('completed');
//   });

//   test('should allow me to un-mark items as complete', async ({ page }) => {
//      // create a new todo locator
//      const newTodo = page.getByPlaceholder('What needs to be done?');

//     // Create two items.
//     for (const item of TODO_ITEMS.slice(0, 2)) {
//       await newTodo.fill(item);
//       await newTodo.press('Enter');
//     }

//     const firstTodo = page.getByTestId('todo-item').nth(0);
//     const secondTodo = page.getByTestId('todo-item').nth(1);
//     const firstTodoCheckbox = firstTodo.getByRole('checkbox');

//     await firstTodoCheckbox.check();
//     await expect(firstTodo).toHaveClass('completed');
//     await expect(secondTodo).not.toHaveClass('completed');
//     await checkNumberOfCompletedTodosInLocalStorage(page, 1);

//     await firstTodoCheckbox.uncheck();
//     await expect(firstTodo).not.toHaveClass('completed');
//     await expect(secondTodo).not.toHaveClass('completed');
//     await checkNumberOfCompletedTodosInLocalStorage(page, 0);
//   });

//   test('should allow me to edit an item', async ({ page }) => {
//     await createDefaultTodos(page);

//     const todoItems = page.getByTestId('todo-item');
//     const secondTodo = todoItems.nth(1);
//     await secondTodo.dblclick();
//     await expect(secondTodo.getByRole('textbox', { name: 'Edit' })).toHaveValue(TODO_ITEMS[1]);
//     await secondTodo.getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
//     await secondTodo.getByRole('textbox', { name: 'Edit' }).press('Enter');

//     // Explicitly assert the new text value.
//     await expect(todoItems).toHaveText([
//       TODO_ITEMS[0],
//       'buy some sausages',
//       TODO_ITEMS[2]
//     ]);
//     await checkTodosInLocalStorage(page, 'buy some sausages');
//   });
// });

// test.describe('Editing', () => {
//   test.beforeEach(async ({ page }) => {
//     await createDefaultTodos(page);
//     await checkNumberOfTodosInLocalStorage(page, 3);
//   });

//   test('should hide other controls when editing', async ({ page }) => {
//     const todoItem = page.getByTestId('todo-item').nth(1);
//     await todoItem.dblclick();
//     await expect(todoItem.getByRole('checkbox')).not.toBeVisible();
//     await expect(todoItem.locator('label', {
//       hasText: TODO_ITEMS[1],
//     })).not.toBeVisible();
//     await checkNumberOfTodosInLocalStorage(page, 3);
//   });

//   test('should save edits on blur', async ({ page }) => {
//     const todoItems = page.getByTestId('todo-item');
//     await todoItems.nth(1).dblclick();
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');

//     await expect(todoItems).toHaveText([
//       TODO_ITEMS[0],
//       'buy some sausages',
//       TODO_ITEMS[2],
//     ]);
//     await checkTodosInLocalStorage(page, 'buy some sausages');
//   });

//   test('should trim entered text', async ({ page }) => {
//     const todoItems = page.getByTestId('todo-item');
//     await todoItems.nth(1).dblclick();
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('    buy some sausages    ');
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');

//     await expect(todoItems).toHaveText([
//       TODO_ITEMS[0],
//       'buy some sausages',
//       TODO_ITEMS[2],
//     ]);
//     await checkTodosInLocalStorage(page, 'buy some sausages');
//   });

//   test('should remove the item if an empty text string was entered', async ({ page }) => {
//     const todoItems = page.getByTestId('todo-item');
//     await todoItems.nth(1).dblclick();
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('');
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');

//     await expect(todoItems).toHaveText([
//       TODO_ITEMS[0],
//       TODO_ITEMS[2],
//     ]);
//   });

//   test('should cancel edits on escape', async ({ page }) => {
//     const todoItems = page.getByTestId('todo-item');
//     await todoItems.nth(1).dblclick();
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
//     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Escape');
//     await expect(todoItems).toHaveText(TODO_ITEMS);
//   });
// });

// test.describe('Counter', () => {
//   test('should display the current number of todo items', async ({ page }) => {
//     // create a new todo locator
//     const newTodo = page.getByPlaceholder('What needs to be done?');

//     // create a todo count locator
//     const todoCount = page.getByTestId('todo-count')

//     await newTodo.fill(TODO_ITEMS[0]);
//     await newTodo.press('Enter');
//     await expect(todoCount).toContainText('1');

//     await newTodo.fill(TODO_ITEMS[1]);
//     await newTodo.press('Enter');
//     await expect(todoCount).toContainText('2');

//     await checkNumberOfTodosInLocalStorage(page, 2);
//   });
// });

// test.describe('Clear completed button', () => {
//   test.beforeEach(async ({ page }) => {
//     await createDefaultTodos(page);
//   });

//   test('should display the correct text', async ({ page }) => {
//     await page.locator('.todo-list li .toggle').first().check();
//     await expect(page.getByRole('button', { name: 'Clear completed' })).toBeVisible();
//   });

//   test('should remove completed items when clicked', async ({ page }) => {
//     const todoItems = page.getByTestId('todo-item');
//     await todoItems.nth(1).getByRole('checkbox').check();
//     await page.getByRole('button', { name: 'Clear completed' }).click();
//     await expect(todoItems).toHaveCount(2);
//     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
//   });

//   test('should be hidden when there are no items that are completed', async ({ page }) => {
//     await page.locator('.todo-list li .toggle').first().check();
//     await page.getByRole('button', { name: 'Clear completed' }).click();
//     await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
//   });
// });

// test.describe('Persistence', () => {
//   test('should persist its data', async ({ page }) => {
//     // create a new todo locator
//     const newTodo = page.getByPlaceholder('What needs to be done?');

//     for (const item of TODO_ITEMS.slice(0, 2)) {
//       await newTodo.fill(item);
//       await newTodo.press('Enter');
//     }

//     const todoItems = page.getByTestId('todo-item');
//     const firstTodoCheck = todoItems.nth(0).getByRole('checkbox');
//     await firstTodoCheck.check();
//     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
//     await expect(firstTodoCheck).toBeChecked();
//     await expect(todoItems).toHaveClass(['completed', '']);

//     // Ensure there is 1 completed item.
//     await checkNumberOfCompletedTodosInLocalStorage(page, 1);

//     // Now reload.
//     await page.reload();
//     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
//     await expect(firstTodoCheck).toBeChecked();
//     await expect(todoItems).toHaveClass(['completed', '']);
//   });
// });

// test.describe('Routing', () => {
//   test.beforeEach(async ({ page }) => {
//     await createDefaultTodos(page);
//     // make sure the app had a chance to save updated todos in storage
//     // before navigating to a new view, otherwise the items can get lost :(
//     // in some frameworks like Durandal
//     await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
//   });

//   test('should allow me to display active items', async ({ page }) => {
//     const todoItem = page.getByTestId('todo-item');
//     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
    
//     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
//     await page.getByRole('link', { name: 'Active' }).click();
//     await expect(todoItem).toHaveCount(2);
//     await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
//   });

//   test('should respect the back button', async ({ page }) => {
//     const todoItem = page.getByTestId('todo-item');
//     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();

//     await checkNumberOfCompletedTodosInLocalStorage(page, 1);

//     await test.step('Showing all items', async () => {
//       await page.getByRole('link', { name: 'All' }).click();
//       await expect(todoItem).toHaveCount(3);
//     });

//     await test.step('Showing active items', async () => {
//       await page.getByRole('link', { name: 'Active' }).click();
//     });

//     await test.step('Showing completed items', async () => {
//       await page.getByRole('link', { name: 'Completed' }).click();
//     });

//     await expect(todoItem).toHaveCount(1);
//     await page.goBack();
//     await expect(todoItem).toHaveCount(2);
//     await page.goBack();
//     await expect(todoItem).toHaveCount(3);
//   });

//   test('should allow me to display completed items', async ({ page }) => {
//     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
//     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
//     await page.getByRole('link', { name: 'Completed' }).click();
//     await expect(page.getByTestId('todo-item')).toHaveCount(1);
//   });

//   test('should allow me to display all items', async ({ page }) => {
//     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
//     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
//     await page.getByRole('link', { name: 'Active' }).click();
//     await page.getByRole('link', { name: 'Completed' }).click();
//     await page.getByRole('link', { name: 'All' }).click();
//     await expect(page.getByTestId('todo-item')).toHaveCount(3);
//   });

//   test('should highlight the currently applied filter', async ({ page }) => {
//     await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');

//     //create locators for active and completed links
//     const activeLink = page.getByRole('link', { name: 'Active' });
//     const completedLink = page.getByRole('link', { name: 'Completed' });
//     await activeLink.click();

//     // Page change - active items.
//     await expect(activeLink).toHaveClass('selected');
//     await completedLink.click();

//     // Page change - completed items.
//     await expect(completedLink).toHaveClass('selected');
//   });
// });

// async function createDefaultTodos(page) {
//   // create a new todo locator
//   const newTodo = page.getByPlaceholder('What needs to be done?');

//   for (const item of TODO_ITEMS) {
//     await newTodo.fill(item);
//     await newTodo.press('Enter');
//   }
// }

// /**
//  * @param {import('@playwright/test').Page} page
//  * @param {number} expected
//  */
//  async function checkNumberOfTodosInLocalStorage(page, expected) {
//   return await page.waitForFunction(e => {
//     return JSON.parse(localStorage['react-todos']).length === e;
//   }, expected);
// }

// /**
//  * @param {import('@playwright/test').Page} page
//  * @param {number} expected
//  */
//  async function checkNumberOfCompletedTodosInLocalStorage(page, expected) {
//   return await page.waitForFunction(e => {
//     return JSON.parse(localStorage['react-todos']).filter(i => i.completed).length === e;
//   }, expected);
// }

// /**
//  * @param {import('@playwright/test').Page} page
//  * @param {string} title
//  */
// async function checkTodosInLocalStorage(page, title) {
//   return await page.waitForFunction(t => {
//     return JSON.parse(localStorage['react-todos']).map(i => i.title).includes(t);
//   }, title);
// }
