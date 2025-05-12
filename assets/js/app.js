const cl = console.log;

const postscontainer = document.getElementById('postscontainer')
const form = document.getElementById('form')
const title = document.getElementById('title')
const content = document.getElementById('content')
const submitbtn = document.getElementById('submitbtn')
const updatebtn = document.getElementById('updatebtn')
const loader = document.getElementById('loader')
let postarr = []
const generateUuid = ()=>{
    return (
      String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  };
const BASE_URL = `https://fetch-crud-7ef78-default-rtdb.firebaseio.com`
const POST_URL = `${BASE_URL}/posts.json`

const fetchposts = () => {
    loader.classList.remove('d-none')
fetch(POST_URL)
.then(res =>{
return res.json()
})
.then(data => {
   for(const key in data){
    data[key].id = key
    postarr.unshift(data[key])
    createpost(postarr)
   }
})
.catch(err => {
    cl(err)})
.finally(() => {
    loader.classList.add('d-none')
})
}

fetchposts()

const createpost = (arr) => {
          let result = ''
           arr.forEach(p => {
result+= `  <div class="col-md-4 mb-4" id="${p.id}">
            <div class="card h-100">
                <div class="card-header">${p.title}</div>
                <div class="card-body">${p.body}</div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn bg-info" id="editbtn" onclick="onedit(this)">Edit</button>
                    <button class="btn bg-danger" id="removebtn" onclick="onremove(this)">Remove</button>

                </div>
            </div>
        </div>`
          
}) 
postscontainer.innerHTML = result
}
const onedit = (e)=> {
    let editid = e.closest('.col-md-4').id
    localStorage.setItem('editid', editid)
    loader.classList.remove('d-none')
    let EDIT_URL = `${BASE_URL}/posts/${editid}.json`
   fetch(EDIT_URL, {
    method : 'GET',
    body : null
   })
   .then(res => res.json())
   .then(obj => {
    cl(obj)
    title.value = obj.title
    content.value = obj.body
    submitbtn.classList.add('d-none')
    updatebtn.classList.remove('d-none')
    loader.classList.add('d-none')
    window.scrollTo({top:0, behavior:'smooth'})
   })
   .catch((err) => cl(err))
.finally(()=>{
    loader.classList.add('d-none')
})
       
    }

const onupdate = () =>{
    let editid = localStorage.getItem('editid')
    let obj = {
        title : title.value,
        body : content.value,
        id : editid
    }
form.reset()
    submitbtn.classList.remove('d-none')
    updatebtn.classList.add('d-none')
    let UPDATE_URL = `${BASE_URL}/posts/${editid}.json`

    loader.classList.remove('d-none')
    fetch(UPDATE_URL , {
        method:'PATCH',
        body: JSON.stringify(obj)
    })
    .then((res => res.json()))
    .then((res => {
        cl(res)
        let div =  document.getElementById(editid)
        let title = div.querySelector('.card-header')
        let content = div.querySelector('.card-body')
        title.innerHTML = obj.title
        content.innerHTML = obj.body
window.scrollTo({top: div.offsetTop, behavior: "smooth"})
    }))
    .catch((err)=>cl(err))
    .finally(() => loader.classList.add('d-none'))
    }

const onremove = (e) => {
    let removeid = e.closest('.col-md-4').id
    let REMOVE_URL= `${BASE_URL}/posts/${removeid}.json`
    loader.classList.remove('d-none')
   fetch(REMOVE_URL, {
    method: 'DELETE',
    body:null
   })
   .then(res=> res.json())
   .then(res=> {
    cl(res)
    document.getElementById(removeid).remove()
   })
   .catch(err=> cl(err))
   .finally(()=>loader.classList.add('d-none'))  
}

const onsubmit = (e) => {
e.preventDefault()
let obj = {
title : title.value,
body : content.value,
id : generateUuid()
}
loader.classList.remove('d-none')
fetch(POST_URL, {
    method : 'POST',
    body : JSON.stringify(obj)
})
.then(res => res.json())
.then(data => {
    cl(data)
    let div = document.createElement('div')
    div.className = 'col-md-4 mb-4'
    div.id = obj.id
    div.innerHTML = ` <div class="card h-100">
                    <div class="card-header">${obj.title}</div>
                    <div class="card-body">${obj.body}</div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn bg-info" id="editbtn" onclick="onedit(this)">Edit</button>
                        <button class="btn bg-danger" id="removebtn" onclick="onremove(this)">Remove</button>
    
                    </div>
                </div>`
                postscontainer.prepend(div)
})
.catch(err => cl(err))
.finally(() => loader.classList.add('d-none'))

form.reset()
}

updatebtn.addEventListener('click', onupdate)
form.addEventListener('submit', onsubmit)



 