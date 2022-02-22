let addTodo = document.querySelector("form button");
let section = document.querySelector("section");

let contentModal = document.getElementById("showContentBox");
let todoContent = document.getElementById("todoContent");

let check = '<i class="fa-solid fa-check"></i>';
let recover = '<i class="fa-solid fa-arrow-rotate-left"></i>';
let trash = '<i class="fa-solid fa-trash"></i>';

//ANCHOR set date min value
let minTime = new Date().toISOString().split("T")[0];
const date = document.getElementById("date");
date.setAttribute("value", minTime);
date.setAttribute("min", minTime);

//ANCHOR event Listener add todo button
addTodo.addEventListener("click", (e) => {
  if (
    document.getElementById("title").value !== "" &&
    document.getElementById("content").value !== ""
  ) {
    // prevent form be submitted
    e.preventDefault();
    //form input field list
    let formList = ["id", "title", "date", "content", "done"];
    //get form json date
    formDate = Object.assign(
      //spread array [...{object}] before you can assign object
      ...formList.map((item) => {
        if (item === "id") {
          return { [item]: Math.random().toFixed(8) };
        }
        if (item === "done") {
          return { [item]: false };
        }
        return { [item]: document.getElementById(item).value };
      })
    );

    //show create todo
    showTodo(formDate);

    let list = localStorage.getItem("list");
    if (list === null) {
      localStorage.setItem("list", JSON.stringify([formDate]));
    } else {
      let arrayList = JSON.parse(list);
      arrayList.push(formDate);
      localStorage.setItem("list", JSON.stringify(arrayList));
    }
  }
});

//ANCHOR reload addEventListener
window.addEventListener("load", loadData);

function loadData() {
  let list = localStorage.getItem("list");
  if (list !== null) {
    let arrayList = JSON.parse(list);
    arrayList.forEach((item) => {
      showTodo(item);
    });
  }
}

/**
 * create html tag
 * @param {string} parma - html tag name
 */
//ANCHOR create html tag tool
function createTag(parma) {
  return document.createElement(parma);
}

/**
 *  Add a "class" or "content" to an existing tag, the "content" can be a tag or a string
 * @param {Object} tag - html Element
 * @param {string} className - you want add class
 * @param {(string|Object)} content - append child content
 */
//ANCHOR Add a "class" or "content" tool
function addClassOrContent(tag, className, content) {
  if (tag.nodeType !== undefined) {
    if (className) {
      tag.classList.add(className);
    }
    if (content) {
      if (content.nodeType !== undefined) {
        tag.appendChild(content);
      } else {
        tag.innerHTML = content;
      }
    }
    return tag;
  }
}

/**
 * Build the todo component and show todo on screen
 * @param {Object} formDate - This is a todo list object
 */

//ANCHOR showTodo component
function showTodo(formDate) {
  //create a todo
  let todo = createTag("div");
  let text = createTag("p");
  let time = createTag("p");
  let title = formDate.title;
  let content = formDate.content;
  let done = formDate.done;
  let id = formDate.id;

  //tag add class Or content
  addClassOrContent(todo, "todo");
  addClassOrContent(text, "todo-text", formDate.title);
  addClassOrContent(time, "todo-time", formDate.date);

  //add check and trash icon
  let completeBtn = createTag("button");
  addClassOrContent(completeBtn, "complete", check);

  //relaod checked localStorage have "done" class on tag
  if (done) {
    addClassOrContent(todo, "done");
    completeBtn.innerHTML = recover;
  }

  //ANCHOR check button
  completeBtn.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    let list = localStorage.getItem("list");
    let changeDoneData = JSON.parse(list);
    todoItem.classList.toggle("done");
    if (todoItem.classList.contains("done")) {
      changeDoneData = changeDoneData.map((item) => {
        if (item.id === id) {
          item.done = true;
        }
        return item;
      });
      console.log(changeDoneData);
      localStorage.setItem("list", JSON.stringify(changeDoneData));
      completeBtn.innerHTML = recover;
    } else {
      changeDoneData = changeDoneData.map((item) => {
        if (item.id === id) {
          item.done = false;
        }
        return item;
      });
      console.log(changeDoneData);
      localStorage.setItem("list", JSON.stringify(changeDoneData));
      completeBtn.innerHTML = check;
    }
  });

  //ANCHOR trash button
  let trashBtn = createTag("button");
  addClassOrContent(trashBtn, "trash", trash);
  trashBtn.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      let list = localStorage.getItem("list");
      let removeData = JSON.parse(list);
      removeData = removeData.filter((item) => item.id !== id);
      localStorage.setItem("list", JSON.stringify(removeData));
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.5s forwards";
  });

  text.onclick = function () {
    todoContent.innerHTML = `<h1>${title}</h1><p>${content}</p>`;
    contentModal.style.display = "block";
  };

  //add to section
  addClassOrContent(todo, null, text);
  addClassOrContent(todo, null, time);
  addClassOrContent(todo, null, completeBtn);
  addClassOrContent(todo, null, trashBtn);
  addClassOrContent(section, null, todo);

  todo.style.animation = "scaleUp 0.5s forwards";
}

//ANCHOR sort data
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    let timeArr1 = arr1[i].date.split("-");
    let timeArr2 = arr2[j].date.split("-");

    let yearArr1 = Number(timeArr1[0]);
    let monthArr1 = Number(timeArr1[1]);
    let dayArr1 = Number(timeArr1[2]);

    let yearArr2 = Number(timeArr2[0]);
    let monthArr2 = Number(timeArr2[1]);
    let dayArr2 = Number(timeArr2[2]);

    if (yearArr1 > yearArr2) {
      result.push(arr2[j]);
      j++;
    } else if (yearArr1 < yearArr2) {
      result.push(arr1[i]);
      i++;
    } else if (yearArr1 === yearArr2) {
      if (monthArr1 > monthArr2) {
        result.push(arr2[j]);
        j++;
      } else if (monthArr1 < monthArr2) {
        result.push(arr1[i]);
        i++;
      } else if (monthArr1 === monthArr2) {
        if (dayArr1 > dayArr2) {
          result.push(arr2[j]);
          j++;
        } else {
          result.push(arr1[i]);
          i++;
        }
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);

    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

//ANCHOR sort button event listen
let sortBtn = document.getElementById("sortTodo");
sortBtn.addEventListener("click", () => {
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  //reload sorted data
  loadData();
});
