function debounce (fn) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, 700)
    }
}

function search () {
    const input = document.querySelector('.search-filed__input');

    if (document.querySelector('.autocomplete').children.length !== 0) {
        clearAutocomplete();
    }

    if (input.value.length !== 0) {
        const resultSearch = searchRepository(input.value);

        resultSearch.then(res => {
            createAutocompleteList(res)
        })
    }
}
search = debounce(search)

function createAutocompleteList (list) {
    const listAutocomplete = document.createElement('ul');
    listAutocomplete.classList.add('autocomplete__list');

    const autocomplete = document.querySelector('.autocomplete');
    let repositories = list.items;

    for (let i = 0; i < 5; i++) {
        let repository = repositories[i];
        let elementListAutocomplete = document.createElement('li');

        elementListAutocomplete.classList.add('autocomplete__list-element');
        elementListAutocomplete.textContent = repository.full_name;
        elementListAutocomplete.setAttribute('data-name', repository.name);
        elementListAutocomplete.setAttribute('data-owner', repository.owner.login);
        elementListAutocomplete.setAttribute('data-stars', repository.stargazers_count);

        listAutocomplete.appendChild(elementListAutocomplete);
    }

    autocomplete.appendChild(listAutocomplete);
    autocomplete.addEventListener('mousedown', creatDivRepositoryWithListElement);
}

function creatDivRepositoryWithListElement(event) {
    if (event.target.tagName === 'LI') {
        const repositories = document.querySelector('.repositories');
        if (repositories.children.length === 3) {
            alert('Нет свободных мест для новых репозиториев.\nНужно удалить старые, для добавления нового.')
        } else {
            createDivRepository(
                event.target.getAttribute('data-name'),
                event.target.getAttribute('data-owner'),
                event.target.getAttribute('data-stars')
            );
            clearAutocomplete();
            let inputValue = document.querySelector('.search-filed__input');
            inputValue.value = '';
        }
    }
}

function clearAutocomplete () {
    const autocompleteList = document.querySelector('.autocomplete__list');
    autocompleteList.remove();
}

async function searchRepository(value) {
    return await fetch(`https://api.github.com/search/repositories?q=${value}`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .catch(err => console.log(err))
}

function createDivRepository (name, owner, stars) {
    const divRepository = document.createElement('div');
    const divRepositoryText = document.createElement('div');
    const articleName = document.createElement('p');
    const articleOwner = document.createElement('p');
    const articleStars = document.createElement('p');
    const buttonClose = document.createElement('button');
    const imageLogo = document.createElement('img');
    const imageButton = document.createElement('img');
    const divRepositories = document.querySelector('.repositories');
    const linkRepository = document.createElement('a');
    let urlGitHubRepository = 'https://github.com/';

    divRepositoryText.classList.add("repository__text");
    articleName.classList.add('repository__text-name');
    articleOwner.classList.add('repository__text-owner');
    articleStars.classList.add('repository__text-stars');

    articleName.textContent = name;
    articleOwner.textContent = owner;
    articleStars.textContent = stars;

    divRepositoryText.appendChild(articleName);
    divRepositoryText.appendChild(articleOwner);
    divRepositoryText.appendChild(articleStars);

    imageLogo.classList.add('repository__image-logo');
    imageLogo.setAttribute('src', 'img/logoGitHubCarved.svg');
    imageLogo.setAttribute('alt', 'logo_github');

    urlGitHubRepository += owner + '/' + name;
    linkRepository.classList.add('repositories__link');
    linkRepository.classList.add('button');
    linkRepository.setAttribute('href', urlGitHubRepository);
    linkRepository.setAttribute('target', '_blank');
    linkRepository.appendChild(imageLogo);

    buttonClose.classList.add('repository__close-button');
    buttonClose.classList.add('button');
    buttonClose.addEventListener('click', (event) => {
        let element = event.target.closest('div');
        element.remove()
    })
    imageButton.classList.add('repository__button-close-image');
    imageButton.setAttribute('src', 'img/btnClose.svg');
    imageButton.setAttribute('alt', 'button_close');
    buttonClose.appendChild(imageButton);

    divRepository.classList.add('repositories__repository');
    divRepository.classList.add('repository');
    divRepository.appendChild(linkRepository);
    divRepository.appendChild(divRepositoryText);
    divRepository.appendChild(buttonClose)

    divRepositories.appendChild(divRepository)

}

addEventListener('input', search)
