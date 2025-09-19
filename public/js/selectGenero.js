fetch('/genero')
    .then(res => res.json())
    .then(generos =>{

        const select = document.getElementById('select-genero')
        generos.forEach(element => {
                const option = document.createElement('option');
                option.value = element.id;
                option.textContent = element.genero;
                option.id = element.id
                select.appendChild(option);
        });
    })