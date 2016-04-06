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