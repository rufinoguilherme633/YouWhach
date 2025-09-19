let id_video = null;

function abrirModalDeletar(id){
    id_video = id;
    document.getElementById("modal-deletar").style.display = "flex";
}

function abrirModalEditar(liElement){
    id_video = liElement.id;
    const titulo = liElement.dataset.titulo;
    const descricao = liElement.dataset.descricao;
    const views = liElement.dataset.views;
    const thumbnail = liElement.dataset.thumbnail;

    document.getElementById("modal-editar").style.display = "flex";
    document.getElementById("titulo-meu-video").value = titulo;
    document.getElementById("descricao-meu-video").value = descricao;
    document.getElementById("views-meu-video").value = views;
    document.getElementById("thumbnail-meu-video").src = thumbnail;
}

function fecharModalDeletar(){
    document.getElementById("modal-deletar").style.display = "none";
}

function deletar(event){
    event.preventDefault();
    const form = document.getElementById("form-deletar");
    form.method = "post";
    form.action = "/video/" + id_video;
    form.submit();
}


function atualizar(event){
    event.preventDefault();
    const form = document.getElementById("form-editar");
    form.method = "post";
    form.action = "/video/atualizar/" + id_video;
    form.submit();
}
