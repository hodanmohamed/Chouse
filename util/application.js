$(document).ready(function () {

	// FORMAT PROPERTY SLIDESHOW
	$("#prop-slideshow > div:gt(0)").hide();

	setInterval(function () {
		$('#prop-slideshow > div:first')
			.fadeOut(100)
			.next()
			.fadeIn(100)
			.end()
			.appendTo('#prop-slideshow');
	}, 2000);

	// FORMAT PRICE FROM INTEGAR VALUE TO CURRENCY
	var formatter = new Intl.NumberFormat('en-UK', {
		style: 'currency',
		currency: 'GBP',
		maximumFractionDigits: 0,
	});


	// GET JSON ARRAY
	function propsData(callback) {
		$.getJSON("/util/property.json", function (data) {
			callback(data);
		});
	}

	// SHOWCASE FEATURED PROPERTIES
	propsData(function (data) {
		let brm = 'Bedrooms';
		let bth = 'Bathrooms';
		var output = "<div class='col'>";
		for (var i in data) {
			if (data[i].featured === true) {

				if (data[i].bedrooms < 2 || data[i].bathrooms < 2) {
					brm = "Bedroom";
					bth = "Bathroom";
				} else if (data[i].bedrooms == "Studio") {
					brm = '';
				}

				output += "<div class='polaroid'>" +
					"<img src=" + data[i].picture + " alt='prop'>" +
					"<div class='container'>" +
					"<p><a href='" + data[i].url + "'>" + data[i].location + "</a></p>" +
					"<p class='pricing'>" + formatter.format(data[i].price) + "</p>" +
					"<p class='detailing'>" + data[i].tenure + " &#9642; " + data[i].bedrooms + " " + brm + " &#9642; " + data[i].bathrooms + " " + bth + "</p>"
					+ "<p class='infoing'>" + data[i].description + "</p>" +
					"</div>" + "</div>";
			}
		}
		output += "</div>";
		document.getElementById("home-flex-box").innerHTML = output;
	})

	// SHOWCASE PROPERTIES FOR SEARCH PAGE
	let totalProps = 0;
	$("#results").css('display', 'none');

	propsData(function (data) {
		// When user clicks search button
		$("#search").on("click", function () {

			// Get values from user
			var tenure = $("#tenure option:selected").val();
			var property = $("#property option:selected").val();
			var minPrice = $("#slider-range").slider("option", "values")[0];
			var maxPrice = $("#slider-range").slider("option", "values")[1];
			var added = $("#added option:selected").val();
			var bedrooms = $("#bedrooms option:selected").val();
			var bathrooms = $("#bathrooms option:selected").val();

			if (tenure === 'tenure' || property === 'property'
				|| added === 'added' || bedrooms === 'bedrooms'
				|| bedrooms === 'bedrooms' || bathrooms === 'bathrooms') {

				$(".alert").css('display', 'inline');
			}
			else {
				var output = "<div class='col'>";


				$(".alert").css('display', 'none');

				let newProps = []

				// Filter JSON array based on user parameters
				for (var i in data) {
					if (((property == data[i].property) || (property == "Any")) &&
						((tenure == data[i].tenure) || (tenure == "Any")) &&
						((added == data[i].added) || (added == "Any")) &&
						((bedrooms == data[i].bedrooms) || (bedrooms == "Any")) &&
						((bathrooms == data[i].bathrooms) || (bathrooms == "Any")) &&
						((data[i].price >= minPrice && data[i].price <= maxPrice))) {

						$("#results").css('display', 'inline');

						// Add to new property array with filtered list
						newProps.push(data[i]);

						// Display filtered array into HTML 
						let brm = 'Bedrooms';
						let bth = 'Bathrooms';
						let numTitleProps = "Properties";

						if (data[i].bedrooms < 2 || data[i].bathrooms < 2) {
							brm = "Bedroom";
							bth = "Bathroom";
							numTitleProps = "Property";
						} else if (data[i].bedrooms == "Studio") {
							brm = '';
						}

						output += "<div class='polaroid'>" +
							"<img src=" + data[i].picture + " alt='prop'>" +
							"<div class='container'>" +
							"<p><a href='" + data[i].url + "'>" + data[i].location + "</a></p>" +
							"<p class='pricing'>" + formatter.format(data[i].price) + "</p>" +
							"<p class='detailing'>" + data[i].tenure + " &#9642; " + data[i].bedrooms + " " + brm + " &#9642; " + data[i].bathrooms + " " + bth + "</p>"
							+ "<p class='infoing'>" + data[i].description + "</p>" +
							"</div>" + "</div>";
					}
				}

				if (newProps.length == 0) {
					$(".alert").css('display', 'inline');
					document.getElementById("alertmsg").innerHTML = 'Unable to find a property :(';
					$("#results").css('display', 'none');
				} else {
					$("#results").css('display', 'inline');
					$('html, body').animate({
						scrollTop: $("#results-title").offset().top
					}, 2000);
				}

				totalProps = newProps.length;
				output += "</div>";
				document.getElementById("numOfProperties").innerHTML = totalProps;
				document.getElementById("flex-box").innerHTML = output;
			}
		});

	});


	// JQUERY UI with slider range
	$("#tenure").selectmenu({
		width: 350
	});
	$("#bedrooms").selectmenu({
		width: 350
	});
	$("#property").selectmenu({
		width: 350
	});
	$("#added").selectmenu({
		width: 350
	});
	$("#bathrooms").selectmenu({
		width: 350
	});

	$(function () {
		$("#tabs").tabs();

		$(function () {
			$("#slider-range").slider({
				range: true,
				min: 0,
				max: 800000,
				width: 250,
				values: [100000, 300000],
				slide: function (event, ui) {
					$("#price").val("   " + formatter.format(ui.values[0]) + " - " + formatter.format(ui.values[1]));
				}
			});

			$("#price").val("   Price Range");
		});
	});
});
