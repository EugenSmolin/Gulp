console.log('Test gulp!');

document.getElementById('btn').onclick = function() {
	let input = document.getElementById('input').value;
	alert(input);
}

document.getElementById('input').oncontextmenu = function() {
	return false;
}