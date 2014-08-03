(function()
{
	chrome.runtime.onInstalled.addListener(function()
	{
		if (!localStorage.login)
		{
			localStorage.login = "";
		}
		if (!localStorage.password)
		{
			localStorage.password = "";
		}
	});

	var post = function(url, data, callback)
	{
		var r = new XMLHttpRequest();
		r.open("POST", url, true);
		r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		r.onreadystatechange = function()
		{
			if (r.readyState == 4) {
				callback(r.responseText);
			}
		}
		r.send(data);
	}

	var setBrowserActionInfo = function(text, color, title)
	{
		chrome.browserAction.setBadgeText(
		{
			text: text
		});
		chrome.browserAction.setBadgeBackgroundColor(
		{
			color: color
		});
		chrome.browserAction.setTitle(
		{
			title: title
		})
	}

	chrome.alarms.onAlarm.addListener(function()
	{
		if (!localStorage.login || !localStorage.password)
		{
			setBrowserActionInfo("...", "gray", "Не указан логин/пароль");
			return;
		}
	
		post("http://cabinet.telecom.mipt.ru/", "login=" + encodeURIComponent(localStorage.login) + "&password=" + encodeURIComponent(localStorage.password), function(data)
		{
			var temp = document.createElement("div");
			temp.innerHTML = data;
			temp = temp.querySelectorAll("table td span");
			if (temp.length)
			{
				balance = parseFloat(temp[0].innerHTML.split("&")[0]);
				setBrowserActionInfo(Math.floor(balance) + "", balance >= 0 ? "#090" : "#C00", balance + " руб. (" + localStorage.login + ")");
			}
			else
			{
				setBrowserActionInfo("...", "gray", "Неверный логин/пароль (" + localStorage.login + ")");
			}
			post("http://cabinet.telecom.mipt.ru/exit/", "", function () {});
		});
	});

	chrome.alarms.create(
	{
		periodInMinutes: 5,
	});

	chrome.alarms.create("update",
	{
		when: Date.now()
	});
})();
