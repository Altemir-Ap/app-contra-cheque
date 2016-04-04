function carregaPagina(pagina) {
    $.get("paginas/" + pagina, function (resposta) {
        $("#app-body").html(resposta);
    });
}

function logar(){
    var cpf = $("#cpf").val();
    var senha = $("#senha").val();
    var param = {
      "username" : cpf,
      "password" : senha  
    };
    
    console.dir(param);
    
    $.ajax({
        url : " http://10.250.10.171/auth/login",
        data : param,
        method : "POST"
    }).done(function(resposta){
        console.dir(resposta);
        if(resposta.status_code == 200){
            token = resposta.api_token;
            console.log(token);
            window.location = "#servicos";
        }
    }).fail(function(erro){
        console.dir(erro);
    });
}