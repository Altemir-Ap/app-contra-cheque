function carregaPagina(pagina) {
    $.get("paginas/" + pagina, function (resposta) {
        $("#app-body").html(resposta);
    });
}

function logar(){
    console.log("clicou login");
    $("#acessar").prop("disabled", true);
    var cpf = $("#cpf").val();
    var senha = $("#senha").val();
    var param = {
      "username" : cpf,
      "password" : senha  
    };
    
    console.dir(param);
    
    $.ajax({
        url : "http://10.250.10.171/auth/login",
        data : param,
        method : "POST"
    }).done(function(resposta){
        console.dir(resposta);
        if(resposta.status_code == 200){
            token = resposta.api_token;
            console.log(token);
            carregaAnos();
        }
        $("#acessar").prop("disabled", false);
    }).fail(function(erro){
        console.dir("Erro "+erro);
    });
}

function carregaAnos(){
    $.ajax({
        url : "http://10.250.10.171/service/contra-cheque/years?api_token="+token,
        method : "GET"
    }).done(function(resposta){
        console.dir(resposta);
        anos = resposta;
        window.location = "#ano-mes";
    }).fail(function(erro){
        console.dir(erro);
    });
}

function carregaMeses(year){
    console.log(year);
    $.ajax({
        url : "http://10.250.10.171/service/contra-cheque/"+year+"/months?api_token="+token,
        method : "GET"
    }).done(function(resposta){
        console.dir(resposta);
        meses = resposta;
        listaMeses(meses);
        $("#ano").val(ano);
        $(".principal").show();
        $(".area-mes").show();
        $(".sel-ano").hide();
    }).fail(function(erro){
        console.dir(erro);
    });
}

function listaAnos(years) {
    var html = " ";
    
    for(var i = 0; i < years.years.length; i++){
        html += "<div class='opt-combo'><span onclick='defineAno("+years.years[i].value+");'>"+years.years[i].label+"</span><hr></div>";
        
    }
    console.log(html);
    $(".sel-ano").html(html);
}

function listaMeses(months){
    var html = " ";
    
    for(var i = 0; i < months.months.length; i++){
        html += "<div class='opt-combo'><span onclick='defineMes("+months.months[i].value+");'>"+months.months[i].label+"</span><hr></div>";
        
    }
    console.log(html);
    $(".sel-mes").html(html);
}

function defineAno(year){
    ano = year;
    console.log(ano);
    carregaMeses(ano);
}

function defineMes(month){
    mes = month;
    console.log(mes);
    $("#mes").val(mes);
    $(".principal").show();
    $(".area-submit").show();
    $(".sel-mes").hide();
}

function consultarContraCheque(year, month){
    console.log("consultou as matriculas");
    $.ajax({
        url : "http://10.250.10.171/service/contra-cheque/registrations/"+year+"/"+month+"?api_token="+token,
        method : "GET"
    }).done(function(resposta){
        matriculas = resposta.matriculas;
        console.log(matriculas);
        console.log(matriculas.length);
        if(matriculas.length > 1){
            window.location = "#seleciona-matricula";
        }else{
            defineMatricula(matriculas[0].id, matriculas[0].matricula);
        }
    }).fail(function(erro){
        console.dir(erro);
    });
}

function defineMatricula(id, registration){
    idMatricula = id;
    matricula = registration;
    console.log(idMatricula, matricula);
    $.ajax({
        url : "http://10.250.10.171/service/contra-cheque/"+ano+"/"+mes+"/"+idMatricula+"/"+matricula+"?api_token="+token,
        method : "GET"
    }).done(function(resposta){
        contracheque = resposta;
        console.log(contracheque);
        window.location = "#contra-cheque";
    }).fail(function(erro){
        console.dir(erro);
    });
}

function listaMatriculas(){
    console.log("vai listar as matriculas");
    var esp = "</span>&nbsp - &nbsp<span>";
    var html = " ";
    for(var i = 0; i < matriculas.length; i++){
        html += "<div class='opt-combo' onclick='defineMatricula("+matriculas[i].id+","+matriculas[i].matricula+");'><span>"+
        matriculas[i].matricula+esp+matriculas[i].orgao+esp+matriculas[i].cargo+esp+matriculas[i].tipo+"</span></div><hr>";
    }
    console.log(html);
    $(".lista-matriculas").html(html);
}

function exibeContracheque(){
    var html = "<div class='table-details'>";
    anoMes = contracheque.data.ano;
    cpf = contracheque.data.cpf;
    pisPasep = contracheque.data.pis;
    nome = contracheque.data.nome;
    cargo = contracheque.data.cargo;
    orgao = contracheque.data.orgao;
    classePadrao = contracheque.data.classe;
    banco = contracheque.data.banco;
    agencia = contracheque.data.agencia;
    conta = contracheque.data.conta;
    previdencia = contracheque.data.previdencia;
    baseCauculo = contracheque.data.baseCalculoIR;
    proventos = contracheque.data.proventos;
    descontos = contracheque.data.descontos;
    liquido = contracheque.data.liquido;
    
    $("#ano-mes").html(anoMes);
    $("#cpf").html(cpf);
    $("#pis-pasep").html(pisPasep);
    $("#matricula").html(matricula);
    $("#nome").html(nome);
    $("#cargo").html(cargo);
    $("#orgao").html(orgao);
    $("#classe-padrao").html(classePadrao);
    $("#banco").html(banco);
    $("#agencia").html(agencia);
    $("#conta").html(conta);
    $("#previdencia").html(previdencia);
    $("#base-calculo").html(baseCauculo);
    $("#proventos").html(proventos);
    $("#descontos").html(descontos);
    $("#liquido").html(liquido);
    
    console.log(contracheque.data.details[0].descricao);
    
    for(var i = 0; i < contracheque.data.details.length; i++){
        html += "<span class='label'>Rubrica:&nbsp</span><span>"+
        contracheque.data.details[i].rubrica+"</span><br /><span class='label'>Seq:&nbsp</span><span>"+
        contracheque.data.details[i].seq+"</span><br /><span class='label'>Descrição:&nbsp</span><span>"+
        contracheque.data.details[i].descricao+"</span><br /><span class='label'>Valor R$:&nbsp</span><span>"+
        contracheque.data.details[i].valor+"</span><br /><span class='label'>Prazo:&nbsp</span><span>"+
        contracheque.data.details[i].prazo+"</span><br /><span class='label'>Parm:&nbsp</span><span>"+
        contracheque.data.details[i].parm+"</span><br /><span class='label'>Qtd:&nbsp</span><span>"+
        contracheque.data.details[i].qtd+"</span></div>";
    }
    
    $(".bloco-tabela").html(html);
}