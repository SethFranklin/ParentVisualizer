
var Upload;
var Zips;
var Date1;
var Date2;
var SelectionUI;
var FilterButton;
var TableDiv;
var EmailDiv;
var AllButton;
var NoneButton;
var MakeButton;
var EmailList;
var Parents = [];

function DisplayParents()
{

	var HTMLString = "<tr><th>Check</th><th>Name</th><th>Email</th><th>Youngest</th><th>Zip</th><th>Due Date</th></tr>";

	console.log(Parents);

	var d1 = null;
	var d2 = null;
	var z = [];

	if (!isNaN(Date.parse(Date1.value))) d1 = new Date(Date1.value);
	if (!isNaN(Date.parse(Date2.value))) d2 = new Date(Date2.value);

	if (Zips.value.length > 0)
	{

		z = Zips.value.replace(/\n/g, ",").replace(/\s/g, "").split(",");

		var i = 0;

		while (i < z.length)
		{

			if (z[i].length == 0) z.splice(i, 1);
			else i++;

		}

	}

	for (var i = 0; i < Parents.length; i++)
	{

		if (((d1 == null || d2 == null) || (Parents[i].date != "" && Parents[i].date >= d1 && Parents[i].date <= d2)) && (z.length == 0 || z.includes(Parents[i].zip)))
		{

			var ds = "";
			if (Parents[i].date != "") ds = (Parents[i].date.getMonth() + 1).toString().padStart(2, "0") + "/" + Parents[i].date.getDate().toString().padStart(2, "0") + "/" + Parents[i].date.getFullYear().toString().padStart(4, "0");
			HTMLString += "<tr><td><input type=\"checkbox\"></td><td>" + Parents[i].name + "</td><td>" + Parents[i].email + "</td><td>" + Parents[i].young + "</td><td>" + Parents[i].zip + "</td><td>" + ds + "</td></tr>";

		}

	}

	TableDiv.innerHTML = HTMLString;
	EmailDiv.style.visibility = "visible";

}

window.onload = function()
{

	Upload = document.getElementById("upload");
	Zips = document.getElementById("zips");
	Date1 = document.getElementById("date1");
	Date2 = document.getElementById("date2");
	SelectionUI = document.getElementById("selection");
	FilterButton = document.getElementById("filterbutton");
	TableDiv = document.getElementById("table");
	EmailDiv = document.getElementById("emaildiv");
	AllButton = document.getElementById("selectall");
	NoneButton = document.getElementById("selectnone");
	MakeButton = document.getElementById("makelist");
	EmailList = document.getElementById("emaillist");

	FilterButton.onclick = function(e)
	{

		DisplayParents();

	}

	AllButton.onclick = function(e)
	{

		for (var i = 1; i < TableDiv.rows.length; i++)
		{

			TableDiv.rows[i].cells[0].children[0].checked = true;

		}

	}
	
	NoneButton.onclick = function(e)
	{

		for (var i = 1; i < TableDiv.rows.length; i++)
		{

			TableDiv.rows[i].cells[0].children[0].checked = false;

		}

	}

	MakeButton.onclick = function(e)
	{

		var ret = [];

		for (var i = 1; i < TableDiv.rows.length; i++)
		{

			if (TableDiv.rows[i].cells[0].children[0].checked) ret.push(TableDiv.rows[i].cells[2].innerHTML);

		}

		EmailList.value = ret.join();

	}

	Upload.onchange = function(e)
	{

		var file = e.target.files[0];
		var re = /(?:\.([^.]+))?$/;

		if (re.exec(file.name)[1] == "csv")
		{

			var read = new FileReader();

			read.onload = function(e2)
			{

				var lines = e2.target.result.split("\n");
				var iname = -1;
				var iemail = -1;
				var izip1 = -1
				var izip2 = -1
				var idate = -1;
				var iyoung = -1;
				var icheck = -1;

				var first = lines[0] + ",";

				var del = false;
				var commas = [-1]

				Parents = [];

				for (var i = 0; i < first.length; i++)
				{

					if (first[i] == "\"") del = !del;
					else if (!del && first[i] == ",") commas.push(i);

				}

				var firstsplit = [];
				
				for (var i = 0; i < commas.length - 1; i++)
				{

					firstsplit.push(first.slice(commas[i] + 1, commas[i + 1]));

				}

				for (var i = 0; i < firstsplit.length; i++)
				{

					if (iname == -1 && firstsplit[i] == "Name") iname = i;
					else if (iemail == -1 && firstsplit[i] == "Email") iemail = i;
					else if (izip1 == -1 && firstsplit[i].includes("address_zip")) izip1 = i;
					else if (izip2 == -1 && firstsplit[i].includes("Zip/Postal")) izip2 = i;
					else if (icheck == -1 && firstsplit[i].includes("due/have")) icheck = i;
					else if (iyoung == -1 && firstsplit[i].includes("(if none,")) iyoung = i;
					else if (idate == -1 && firstsplit[i].includes("MM/DD/YYYY")) idate = i;

				}

				for (var i = 1; i < lines.length; i++)
				{

					if (lines[i].length > 0)
					{

						var split = lines[i].split(",");

						if (split[icheck] == "1")
						{
						
							var obj = {};

							obj.name = split[iname];
							obj.email = split[iemail];
							if (split[izip1].length > 0) obj.zip = split[izip1].replace(/\s/g, "");
							if (split[izip2].length > 0) obj.zip = split[izip2].replace(/\s/g, "");
							obj.young = split[iyoung];
							obj.date = split[idate];
							if (obj.date.length > 0) obj.date = new Date(obj.date);

							Parents.push(obj);

						}

					}

				}

				Parents.sort(function(a, b)
				{
			
					if (a.date == "" && b.date == "") return 0;
					if (a.date == "") return 1;
					if (b.date == "") return -1;
					if (a.date > b.date) return 1;
					if (b.date < a.date) return -1;
					return 0
			
				});

				SelectionUI.style.visibility = "visible";
				DisplayParents();

			};

			read.readAsText(file);

		}

	};

}

