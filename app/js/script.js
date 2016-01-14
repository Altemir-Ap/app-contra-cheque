//funções para reduzir os 300ms de delay do jQueryMobile usando FastClickJs
function onBodyLoad(){       
    document.addEventListener("deviceready", onDeviceReady, false);

}

function onDeviceReady(){
  	var attachFastClick = Origami.fastclick;
	attachFastClick(document.body);
}

//função para converter as datas
function dataMoment(param){
	moment.locale("br");
	var data = moment(param).format('DD/MM/YYYY');
	return data;
}

//depois do carregamento da tela
$(function(){
	
	//chamando funções do FastClick
	onBodyLoad();
	onDeviceReady();
	
	//criando view model
	function MostraProcessoViewModel(){
		var self = this;
		self.processo = ko.observableArray();
		self.id = ko.observable();
		self.processoDetalhe = ko.observableArray();
        self.loading = ko.observable(false);
		self.naoEncontrado = ko.observable(false);
		self.paramOk = ko.observable(false);
		self.mensagem = ko.observable();
		self.offline = ko.observable(false);
	
		//pesquisando processos
		$("#pesquisar").click(function(){
			self.processo([]);
			self.processoDetalhe([]);
			self.naoEncontrado(false);
			self.paramOk(false);
			self.offline(false);
		
			var numero = $("#numero-processo").val();
			var parte = $("#nome-parte").val();
			
			
			
			$.ajax({
				url: "http://app.tjap.jus.br/tucujuris/api/consulta-processo/consultar?numero="+numero+"&nome="+parte,
				beforeSend: function(){
					self.loading(true);
				}
			}).done(function(res){
				var json = res;
				if(json.status == "ERRO"){
					self.mensagem(json.mensagem);
					self.loading(false);
					self.paramOk(true);
				}else if(json.status == "OK" && json.dados == null){
					self.loading(false);
					self.naoEncontrado(true);
				}else{
					for(var i = 0; i < json.dados.length; i++){
						$.get("http://app.tjap.jus.br/tucujuris/api/consulta-processo/detalhe?processoId="+res.dados[i].id,
						function(res){
							var json = res;
							self.loading(false);
							self.processo.push(json);
						});
					}
				}
			}).fail(function(){
				self.loading(false);
				self.offline(true);
			});
				
				//função pra exibir os detalhes do processo
				mostraDetalhe = function mostra(data){
					self.loading(false);
					self.offline(false);
					self.processoDetalhe([]);
					var id = data.dados.processo.id;
					$.ajax({
						url: "http://app.tjap.jus.br/tucujuris/api/consulta-processo/detalhe?processoId="+id,
						beforeSend: function(){
							self.loading(true);
						}
					}).done(function(res){
						var jsn = res;
						self.loading(false);
						self.processoDetalhe.push(jsn);
					}).fail(function(){
						self.loading(false);
						self.offline(true);
					});

					window.location.href = "#detalhes-processo";
				}
		
			
			$("#numero-processo").val(null);
			$("#nome-parte").val(null);
			
		});
	}
	ko.applyBindings(new MostraProcessoViewModel());
});

//1º get http://app.tjap.jus.br/tucujuris/api/consulta-processo/consultar?numero="+numero+"&nome="+parte
//2º get http://app.tjap.jus.br/tucujuris/api/consulta-processo/detalhe?processoId="+res.dados[i].id