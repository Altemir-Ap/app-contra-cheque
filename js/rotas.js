//setup crossroads
crossroads.addRoute('/', function () {
	carregaPagina("login.html");
});

crossroads.addRoute('servicos', function(){
  carregaPagina("servicos.html");
});

crossroads.addRoute('ano-mes', function(){
  carregaPagina("mes-e-ano.html");
});

crossroads.addRoute('contra-cheque', function(){
  carregaPagina("contra-cheque.html");
});

crossroads.addRoute('seleciona-matricula', function(){
  carregaPagina("seleciona-matricula.html");
});
 
//setup hasher
function parseHash(newHash, oldHash) {
	crossroads.parse(newHash);
}
hasher.initialized.add(parseHash); //parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change