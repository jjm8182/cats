let modal_form = document.querySelector('.modal_form')

let form = document.querySelector('.form_container');

let form_btn_add = form.querySelector('.form_btn_add');
let form_btn_edit = form.querySelector('.form_btn_edit');

let name_input = form.querySelector('input[name="name"]')
let favorite_input = form.querySelector('input[name="favorite"]')
let description_input = form.querySelector('input[name="description"]')
let age_input = form.querySelector('input[name="age"]')
let rate_input = form.querySelector('input[name="rate"]')
let image_input = form.querySelector('input[name="image"]')

const api_url = 'https://cats.petiteweb.dev/api/single/akuleshova/'

// ------------------ ЛОГИКА ------------------
let state = {
    num: 1,
    load: false,
    load_add: false,
    list: [],
};



let getCats = async () => {
    state.load = true;
    render();

    try {



        state.list = await (await fetch(api_url + 'show')).json();
        state.load = false;
        render();

    } catch (error) {
        alert(error.message);
        return;
    }

}

let addCat = async () => {


    let cats_list = await (await fetch(api_url + 'show')).json();
    let id_list = [];
    for (let cat of cats_list) {
        let id = cat.id;
        id_list.push(id)

    }

    let biggestID = Math.max.apply(null, id_list);

    let obj = {
        id: biggestID + 1,
        name: name_input.value,
        favorite: favorite_input.checked,
        rate: Number(rate_input.value),
        age: Number(age_input.value),
        description: description_input.value,
        image: image_input.value
    }



    try {



        await fetch(api_url + 'add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)

        })

    } catch (error) {
        alert(error.message);
        return;
    }


    await getCats();

    saveFormData()

    document.querySelector('.modal_form').style.display = 'none';

    name_input.value = '';
    favorite_input.checked = false;
    rate_input.value = '';
    age_input.value = '';
    description_input.value = ''
    image_input.value = '';

}


let delCats = async (cat) => {


    try {


        await fetch(api_url + `delete/${cat.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },


        })
    } catch (error) {
        alert(error.message);
        return;
    }

    getCats()

}


let editCat = async (cat) => {


    let obj = {
        name: name_input.value,
        favorite: favorite_input.checked,
        rate: Number(rate_input.value),
        age: Number(age_input.value),
        description: description_input.value,
        image: image_input.value
    }

    try {


        await fetch(api_url + `update/${cat.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)


        })

    } catch (error) {
        alert(error.message);
        return;
    }
    await getCats()

    document.querySelector('.modal_form').style.display = 'none';

}

function saveFormData() {

    let obj = {
        name: name_input.value,
        favorite: favorite_input.checked,
        rate: Number(rate_input.value),
        age: Number(age_input.value),
        description: description_input.value,
        image: image_input.value
    }

    localStorage.formData = JSON.stringify(obj);



}

function getFormData() {
    let new_obj = JSON.parse(localStorage.formData);


    name_input.value = new_obj.name;
    favorite_input.checked = new_obj.favorite;
    rate_input.value = new_obj.rate;
    age_input.value = new_obj.age;
    description_input.value = new_obj.description;
    image_input.value = new_obj.image;

}

// ------------------ ВНЕШНИЙ ВИД ------------------
form_btn_add.addEventListener('click', addCat)



function openAddForm() {
    modal_form.style.display = 'flex';

    form_btn_add.style.display = 'block';
    form_btn_edit.style.display = 'none';

    modal_form.querySelector('h3').innerText = 'Добавить котку'

    name_input.value = '';
    favorite_input.checked = false;
    description_input.value = '';
    age_input.value = '';
    rate_input.value = '';
    image_input.value = '';

    getFormData()

}

function openEditForm(cat) {
    modal_form.style.display = 'flex';

    form_btn_add.style.display = 'none';
    form_btn_edit.style.display = 'block';

    modal_form.querySelector('h3').innerText = 'Причесать котку'



    name_input.value = cat.name;
    favorite_input.checked = cat.favorite;
    description_input.value = cat.description;
    age_input.value = cat.age;
    rate_input.value = cat.rate;
    image_input.value = cat.image;

    form_btn_edit.onclick = () => {
        editCat(cat);
    }
}


function cat_card(catData) {
    return `
        <div class="container">
            <i class="fa fa-solid fa-heart"></i>
            <img src="${catData.image}">
            <p><b>Имя: </b>${catData.name}</p>
            <p><b>Возраст: </b>${catData.age}</p>
            
            <div class="buttons">
                <button class="more_info">О коте</button>
                <button class="delete">Удалить</button>
                <button class="edit">Изменить</button>
            </div> 
        </div> 
    `
}

function cat_info(cat) {
    let love_cat = '';
    if (cat.favorite == true) {
        love_cat = 'Котика все любят!'
    } else {
        love_cat = 'Котика никто не любит! :('
    }

    return `
    <div class='info_about_cat_container'>
    <img class= 'img_modal' src="${cat.image}">
    <div class='info_about_cat_window'>
    <p><b>Имя: </b>${cat.name}</p>
    <p><b>ID: </b>${cat.id}</p>
    <p><b>Рейтинг: </b>${cat.rate}</p>
    <p><b>Возраст: </b>${cat.age}</p>
    <p><b>Описание: </b>${cat.description}</p>
    <p><b>Популярность: </b>${love_cat}</p>
    </div>
    </div>
    `
}



let render = () => {
    let div_parent = document.querySelector('.cards');
    div_parent.innerHTML = '';

    for (let cat of state.list) {

        div_parent.insertAdjacentHTML('beforeend', cat_card(cat))


        let last_container = div_parent.lastElementChild;
        let heart = last_container.querySelector('.fa-heart')
        heart.innerHTML = ` ${cat.rate}`



        let btn_info = last_container.querySelector('.more_info')


        let modal = document.querySelector('.modal')

        let btn_delete = last_container.querySelector('.delete')
        btn_delete.addEventListener('click', () => { delCats(cat) });

        let btn_edit = last_container.querySelector('.edit')
        btn_edit.addEventListener('click', () => { openEditForm(cat) });


        var span = document.getElementsByClassName("close")[0];
        btn_info.onclick = function () {
            modal.style.display = "block";
            let info_about = modal.querySelector('.info_about_cat')

            info_about.innerHTML = cat_info(cat)



        }
        span.onclick = function () {
            modal.style.display = "none";
        }


        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        })


    }

    let btn_add = document.querySelector('#add');
    btn_add.onclick = openAddForm;

    window.addEventListener('click', function (event) {


        if (event.target == modal_form) {
            modal_form.style.display = "none";
            saveFormData()
        }

    })



}

// ЗАПУСК ПРИЛОЖЕНИЯ

getCats();