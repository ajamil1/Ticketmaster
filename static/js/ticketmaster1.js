const search = document.getElementById("search");
search.addEventListener("click", function () {
    $('#results').empty();
    $('#events').empty();
    $('#alert').empty();


    const searchTerm = $('input[name=searchTerm]').val();
    const location = $('input[name=location]').val();
    const searchForm = $('#searchForm').serialize();

    //console.log(searchTerm);
    if (searchTerm == undefined) {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        $('#alert').append('Search term cannot be empty. Please enter a search term.');
        return;
    }
    if ($.trim(searchTerm) == "") {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        $('#alert').append('Search term cannot be empty. Please enter a search term.');
        return;
    }

    if (location == undefined) {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        $('#alert').append('City cannot be empty. Please enter a city.');
        return;
    }
    if ($.trim(location) == "") {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        $('#alert').append('City cannot be empty. Please enter a city.');
        return;
    }

    $.ajax({

        type: "POST",
        url: `/ticketmaster/`,
        async: true,
        data: searchForm,


        success: function (data) {
            console.log("test");
            console.log(data);
            // Grab the results from the API JSON return
            $('#content').removeClass('d-none');
            $('#alert').addClass('d-none');
            $('#results').append(data);


        },
        error: function (xhr, status, error) {
            // This is the error callback function
            // xhr: The XMLHttpRequest object
            // - xhr.status: HTTP status code (e.g., 404 for "Not Found")
            // - xhr.statusText: HTTP status text (e.g., "Not Found")
            // - xhr.responseText: The response text from the server

            // status: A string describing the type of error
            // - "error": General error
            // - "timeout": Request timeout
            // - "parsererror": JSON parsing error

            // error: A textual description of the error

            if (xhr.status === 403) {
                alert("Please read the description carefully!!! Please first enable cross-origin request by visiting https://cors-anywhere.herokuapp.com/ as described in the source code");
            }
        }
    });
});

function displayData(data) {
    if (data._embedded == undefined) {
        $('#events').append('Sorry... No results were found for the entered search term and city.');
        return;
    }
    const totalResults = data._embedded.events.length;
    const formatter = new Intl.DateTimeFormat('en-US', {day: '2-digit', month: '2-digit', year: 'numeric'});
    // If our results are greater than 0, continue
    if (totalResults > 0) {
        $('#events').append(`${totalResults} events found!`);
        $.each(data._embedded.events, function (i, item) {
            console.log(item);
            // Store each event's object in a variable
            const image = item.images[0].url;
            const name = item.name;
            const venue = item._embedded.venues[0].name;
            const address = item._embedded.venues[0].address.line1;
            const city = item._embedded.venues[0].city.name;
            const state = item._embedded.venues[0].state.stateCode;
            const ticket = item.url;
            const date = item.dates.start.localDate;
            const time = item.dates.start.localTime;


            const dSplit = date.split('-');

            let year = dSplit[0];
            let month = dSplit[1];
            let day = dSplit[2];

            //console.log(month + " " + day + " " + year);

            switch (month) {
                case "01":
                    month = "January";
                    break;
                case "02":
                    month = "February";
                    break;
                case "03":
                    month = "March";
                    break;
                case "04":
                    month = "April";
                    break;
                case "05":
                    month = "May";
                    break;
                case "06":
                    month = "June";
                    break;
                case "07":
                    month = "July";
                    break;
                case "08":
                    month = "August";
                    break;
                case "09":
                    month = "September";
                    break;
                case "10":
                    month = "October";
                    break;
                case "11":
                    month = "November";
                    break;
                case "12":
                    month = "December";
                    break;
                default:
                    month = "FAIL: " + month;
                    break;
            }

            let formattedDate = month + ' ' + day + ', ' + year;
            let tSplit = time.substring(0, 5);

            let hour = time.substring(0, 2)

            let integer = parseInt(hour);

            if (hour < 12) {
                tSplit = tSplit + " AM";
            } else {
                hour -= 12;
                tSplit = time.substring(2, 5);
                tSplit = hour.toString() + tSplit + " PM";
            }


            //if (hour >= 12) {
            ///
            //}

            const startDate = formattedDate;
            const startTime = tSplit;
            /*
            console.log(image);
            console.log(name);
            console.log(venue);
            console.log(address);
            console.log(city);
            console.log(state);
            console.log(ticket);
            console.log(startDate);
            console.log(startTime);
            */

            // Append our result into our page
            //$('#results').append('test');

            $('#results').append(data)
        });
    } else {
        // If our results are 0; no businesses were returned by the JSON therefore we display on the page no results were found
        $('#events').append('Sorry... No results were found for the entered search term and city.');
    }
}
