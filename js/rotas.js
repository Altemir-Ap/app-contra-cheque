//setup crossroads
crossroads.addRoute('/', function () {
	carregaPagina("login.html");
});

crossroads.addRoute('outra', function(){
  carregaPagina("outra.html");
});


 
//setup hasher
function parseHash(newHash, oldHash) {
	crossroads.parse(newHash);
}
hasher.initialized.add(parseHash); //parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change