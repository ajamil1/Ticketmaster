// event listener for the search button
const search = document.getElementById("search");
search.addEventListener("click", function () {
    // clear the container before adding new cards
    $('#results').empty();
    $('#events').empty();
    $('#alert').empty();

// get values from the search bars
    const searchTerm = $('input[name=searchTerm]').val();
    const location = $('input[name=location]').val();
    const searchForm = $('#searchForm').serialize();

/* -------------------------------------------------------------------------------------------------------------------------*/
    // INPUT EMPTY conditions
    // check if search term input is empty
    if (searchTerm === undefined) {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        return;
    }
    if ($.trim(searchTerm) === "") {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        $('#alert').append('Search term cannot be empty. Please enter a search term.');
        return;
    }
    // check if location input is empty
    if (location === undefined) {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        return;
    }
    if ($.trim(location) === "") {
        $('#alert').removeClass('d-none');
        $('#content').addClass('d-none');
        $('#alert').append('City cannot be empty. Please enter a city.');
        return;
    }
/* -------------------------------------------------------------------------------------------------------------------------*/
    // get and parse the data using AJAX
    $.ajax({
        type: "POST",
        url: `/ticketmaster/`,
        async: true,
        data: searchForm,
        success: function (data) {
            console.log(data);
            // Grab the results from the API JSON return
            $('#content').removeClass('d-none');
            $('#alert').addClass('d-none');
            $('#results').append(data);
        }, // end of success function

        error: function (xhr, status, error) {
            if (xhr.status === 403) {
                alert("Please read the description carefully!!! Please first enable cross-origin request by visiting https://cors-anywhere.herokuapp.com/ as described in the source code");
            }
        } // end of error function
    }); // end of AJAX (given by ticketmaster API website)
}); // end of search button function


