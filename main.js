
var Upload;
var Zips;
var Date1;
var Date2;
var Parents = [];

window.onload = function()
{

	Upload = document.getElementById("upload");
	Zips = document.getElementById("zips");
	Date1 = document.getElementById("date1");
	Date2 = document.getElementById("date2");

	Upload.onchange = function(e)
	{

		var file = e.target.files[0];

		if (file.type == "text/csv")
		{

			var read = new FileReader();

			read.onload = function(e2)
			{

				var lines = e2.target.result.split("\n");
				var iname = -1;
				var iemail = -1;
				var izip = -1
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
					else if (izip == -1 && firstsplit[i].includes("custom_5")) izip = i;
					else if (icheck == -1 && firstsplit[i].includes("custom_4")) icheck = i;
					else if (iyoung == -1 && firstsplit[i].includes("custom_3")) iyoung = i;
					else if (idate == -1 && firstsplit[i].includes("custom_2")) idate = i;

				}

				for (var i = 1; i < lines.length; i++)
				{

					if (lines[i].length > 0)
					{

						var split = lines[i].split(",");

						if (split[icheck] == "1" && split[idate].length > 0)
						{
						
							var obj = {};

							obj.name = split[iname];
							obj.email = split[iemail];
							obj.zip = split[izip];
							obj.young = split[iyoung];
							obj.date = split[idate];
							obj.date = new Date(obj.date);

							Parents.push(obj);

						}

					}

				}

				Parents.sort(function(a, b)
				{
			
					if (a.date > b.date) return 1;
					if (b.date < a.date) return -1;
					return 0
			
				});

				console.log(Parents);

			};

			read.readAsText(file);

		}

	};

}
