document.addEventListener('DOMContentLoaded', () => {

// Déclarations

const apiUrl = 'https://newsapp.dwsapp.io/api';
const apiKey = '26ba3a9f856e448c89d75f73c7022e19';

const sectionLogRegister = document.querySelector('#sectionLogRegister');
const sectionLogRegisterBlackback = document.querySelector('#sectionLogRegister .blackback');

const formSearch = document.querySelector('#formSearch');
const formSearchSource = document.querySelector('#formSearch input#source');
const formSearchSourceList = document.querySelector('#formSearch datalist');
const formSearchKeyword = document.querySelector('#formSearch input#keyword');
const formSearchSubmit = document.querySelector('#formSearch input[type=submit]');

const formRegister = document.querySelector('#formRegister');
const formRegisterMail = document.querySelector('#formRegister input#mail');
const formRegisterPassword = document.querySelector('#formRegister input#password');
const formRegisterFirstname = document.querySelector('#formRegister input#prenom');
const formRegisterLastname = document.querySelector('#formRegister input#nom');
const formRegisterSubmit = document.querySelector('#formRegister input[type=submit]');

const formLogin = document.querySelector('#formLogin');
const formLoginMail = document.querySelector('#formLogin input#mailLogin');
const formLoginPassword = document.querySelector('#formLogin input#passwordLogin');
const formLoginSubmit = document.querySelector('#formLogin input[type=submit]');

const logIn = document.querySelector('#loginButton');
const logOut = document.querySelector('#logoutButton');

const addFav = document.querySelector('#addFav');
const spanFav = document.querySelector('#addFav span');
const favTitle = document.querySelector('#favTitle');

const sectionArticle = document.querySelector('#article');
const sectionFav = document.querySelector('#fav');

// Fonctions

sectionLogRegisterBlackback.addEventListener('click', () => {
    sectionLogRegister.classList.add('hidden');
})

const showArticle = (source,key) => {
    new FETCHrequest(`${apiUrl}/news/${source}/${key}`, 'POST', {
        "news_api_token": apiKey
    })
    .fetch()
    .then( fetchData => {
        console.log(fetchData);
        localStorage.setItem('localLastSource', source);
        localStorage.setItem('localLastKeyword', key);
        let urlImg;
        if(fetchData.data.articles.length > 0){
        sectionArticle.innerHTML = '';
        for(let i = 0; i < 10; i++){
            if(fetchData.data.articles[i].urlToImage === null || fetchData.data.articles[i].urlToImage === 'null'){
                urlImg = 'img/news.png'
            }
            else {
                urlImg = fetchData.data.articles[i].urlToImage
            }
            sectionArticle.innerHTML += `
            <div class='cartoucheArticle'>
                <h1>${fetchData.data.articles[i].title}</h1>
                <div style="background-image:url(${urlImg})"></div>
                <p>${fetchData.data.articles[i].description}</p>
                <a href="${fetchData.data.articles[i].url}" target="_blank">Aller lire l'article</a>
            </div>
            `
        }
    }
        if(localStorage.getItem('localToken')){
            new FETCHrequest(`${apiUrl}/me`, 'POST', {
                "token": localStorage.getItem('localToken'),
            })
            .fetch()
            .then( dataMe => {
                console.log(dataMe);
                addFav.classList.remove('hidden');
                for(let i =0; i < dataMe.data.bookmark.length; i++){
                    if(dataMe.data.bookmark[i].id === source){
                        addFav.classList.add('hidden');
                    }
                    else {
                    }
                }
                spanFav.innerHTML = localStorage.getItem('localLastSource', source);
            })
            .catch( fetchError => {
                console.error(fetchError)
            })
        }
    })
    .catch( fetchError => {
        console.error(fetchError)
    })
}

// Récup les news selon une source, avec ou sans keyword

formSearchSubmit.addEventListener('click', event => {
    event.preventDefault();
    let keyword = 'null';
    if (formSearchKeyword.value.length > 0){
        keyword = formSearchKeyword.value
    }
    showArticle(formSearchSource.value, keyword);
})

// Check toutes les sources dispo et les met dans la dropdown pour selectionner

new FETCHrequest(`${apiUrl}/news/sources`, 'POST', {
    "news_api_token": apiKey
})
.fetch()
.then( fetchData => {
    console.log(fetchData)
    for(let i = 0; i<fetchData.data.sources.length; i++){
        formSearchSourceList.innerHTML += `
        <option>${fetchData.data.sources[i].id}</option>
        `
    }
})
.catch( fetchError => {
    console.error(fetchError)
})

// S'inscrire

formRegisterSubmit.addEventListener('click', event => {
    event.preventDefault();
    new FETCHrequest(`${apiUrl}/register`, 'POST', {
        "email": formRegisterMail.value,
        "password": formRegisterPassword.value,
        "firstname": formRegisterFirstname.value,
        "lastname": formRegisterLastname.value
    })
    .fetch()
    .then( fetchData => {
        console.log(fetchData);
        new FETCHrequest(`${apiUrl}/login`, 'POST', {
            "email": formRegisterMail.value,
            "password": formRegisterPassword.value,
        })
        .fetch()
        .then( fetchData => {
            console.log(fetchData);
            localStorage.setItem('localToken', fetchData.data.token);
            sectionLogRegister.classList.add('hidden');
            logIn.classList.add('hidden');
            logOut.classList.remove('hidden');
            sectionFav.classList.remove('hidden');
            favTitle.classList.remove('hidden');
            new FETCHrequest(`${apiUrl}/me`, 'POST', {
                "token": localStorage.getItem('localToken'),
            })
            .fetch()
            .then( dataMe => {
                console.log(dataMe);
                showFav(dataMe.data.bookmark);
            })
            .catch( fetchError => {
                console.error(fetchError)
            })
        })
        .catch( fetchError => {
            console.error(fetchError)
        })
    })
    .catch( fetchError => {
        console.error(fetchError)
    })
})

// Se log à l'app

formLoginSubmit.addEventListener('click', event => {
    event.preventDefault();
    new FETCHrequest(`${apiUrl}/login`, 'POST', {
        "email": formLoginMail.value,
        "password": formLoginPassword.value,
    })
    .fetch()
    .then( fetchData => {
        console.log(fetchData);
        localStorage.setItem('localToken', fetchData.data.token);
        sectionLogRegister.classList.add('hidden');
        logIn.classList.add('hidden');
        logOut.classList.remove('hidden');
        sectionFav.classList.remove('hidden');
        favTitle.classList.remove('hidden');
        new FETCHrequest(`${apiUrl}/me`, 'POST', {
            "token": localStorage.getItem('localToken'),
        })
        .fetch()
        .then( dataMe => {
            console.log(dataMe);
            showFav(dataMe.data.bookmark);
        })
        .catch( fetchError => {
            console.error(fetchError)
        })
    })
    .catch( fetchError => {
        console.error(fetchError)
    })
})

// Si une personne s'est déjà connecté, la connecte automatiquement

if(localStorage.getItem('localToken')){
        new FETCHrequest(`${apiUrl}/me`, 'POST', {
            "token": localStorage.getItem('localToken'),
        })
        .fetch()
        .then( fetchData => {
            console.log(fetchData);
            sectionLogRegister.classList.add('hidden');
            logIn.classList.add('hidden');
            logOut.classList.remove('hidden');
            sectionFav.classList.remove('hidden');
            favTitle.classList.remove('hidden');
            showFav(fetchData.data.bookmark);
        })
        .catch( fetchError => {
            console.error(fetchError)
        })
    }

// Récup dernière recherche, qu'on soit co ou non

if(localStorage.getItem('localLastSource')){
    showArticle(localStorage.getItem('localLastSource'), localStorage.getItem('localLastKeyword'))
}

// Log out

logOut.addEventListener('click', event => {
    event.preventDefault();
    new FETCHrequest(`${apiUrl}/logout`, 'GET')
    .fetch()
    .then( fetchData => {
        console.log(fetchData);
        localStorage.removeItem('localToken');
        logIn.classList.remove('hidden');
        logOut.classList.add('hidden');
        sectionFav.classList.add('hidden');
        favTitle.classList.add('hidden');
    })
    .catch( fetchError => {
        console.error(fetchError)
    })
})

// Ajoute une source en favori ( uniquement si on est connecté )

addFav.addEventListener('click', event => {
    event.preventDefault();
    new FETCHrequest(`${apiUrl}/news/sources`, 'POST', {
        "news_api_token": apiKey
    })
    .fetch()
    .then( fetchData => {
        console.log(fetchData)
        for(let i = 0; i<fetchData.data.sources.length; i++){
            if(fetchData.data.sources[i].id === localStorage.getItem('localLastSource')){
                console.log(fetchData.data.sources[i])
                new FETCHrequest(`${apiUrl}/bookmark/`, 'POST', {
                    "id": fetchData.data.sources[i].id,
                    "name": fetchData.data.sources[i].name,
                    "description": fetchData.data.sources[i].description,
                    "url": fetchData.data.sources[i].url,
                    "category": fetchData.data.sources[i].category,
                    "language": fetchData.data.sources[i].language,
                    "country": fetchData.data.sources[i].country,
                    "token": localStorage.getItem('localToken')
                })
                .fetch()
                .then(articlesData => {
                    console.log(articlesData)
                    sectionFav.innerHTML += `
                        <div>${fetchData.data.sources[i].id}</div><button data-id-bookmark="${articlesData.data.data._id}"><i class='fa fa-close'></i></button>
                    `;
                    if(sectionFav.innerHTML === ''){
                        sectionFav.innerHTML = "Vous n'avez pas de favoris ! Faites une recherche pour en ajouter !"
                    }
                })
                .catch(fetchError => {
                    console.error(fetchError)
                })
            }
        }
    })
    .catch( fetchError => {
        console.error(fetchError)
    })
})

const showFav = (fav) => {
    sectionFav.innerHTML = '';
    for(i = 0; i<fav.length; i++){
        sectionFav.innerHTML += `
        <div>${fav[i].id}</div><button data-id-bookmark="${fav[i]._id}"><i class='fa fa-close'></i></button>
    `
    }
    favArticle(document.querySelectorAll('#fav div'));
    deleteFav(document.querySelectorAll('#fav button'));
}

// affiche les 10 derniers articles d'une source d'un fav

const favArticle = fav => {
    for( let item of fav ){
        item.addEventListener('click', () => {
            showArticle(item.innerHTML, 'null')
        })
    }
}

// Supprimer un favori

const deleteFav = fav => {
    for( let item of fav ){
        item.addEventListener('click', () => {
            new FETCHrequest(`${apiUrl}/bookmark/${item.getAttribute('data-id-bookmark')}`, 'DELETE', {
                "token": localStorage.getItem('localToken')
            })
            .fetch()
            .then(fetchData => {
                console.log(fetchData)
            })
            .catch(fetchError => {
                console.error(fetchError)
            })
        })
    }
}

// Ouvre la popin de log

logIn.addEventListener('click', event => {
    event.preventDefault();
    sectionLogRegister.classList.remove('hidden');
})
})