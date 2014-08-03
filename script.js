window.addEventListener("load", function()
{
	document.getElementById("login").value = localStorage.login;
	document.getElementById("password").value = localStorage.password;
	document.getElementById("loginForm").onsubmit = function(event)
	{
		event.preventDefault();
		localStorage.login = document.getElementById("login").value;
		localStorage.password = document.getElementById("password").value;
		chrome.alarms.create("update",
		{
			when: Date.now()
		});
		window.close();
	};
}, false);
