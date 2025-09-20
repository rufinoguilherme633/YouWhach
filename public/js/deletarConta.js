let user_id = null;

function abrirModalDeletarConta(id){
    user_id  = id;
    document.getElementById("modal-deletar-conta").style.display = "flex";
}



function fecharModalDeletarConta(){
    document.getElementById("modal-deletar-conta").style.display = "none";
}

function deletarConta(event){
    event.preventDefault();
    const form = document.getElementById("form-deletar-conta");
    form.method = "post";
    form.action = "/usuario/deletarConta/" + user_id;
    form.submit();

}



