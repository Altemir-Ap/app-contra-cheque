function carregaPagina(pagina) {
    $.get("paginas/" + pagina, function (resposta) {
        $("#app-body").html(resposta);
    });
}