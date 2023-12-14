$(document).ready(function () {
    // Recommendations page
    $.ajax({
        type: "GET",
        url: "/api/recommendations",
        async: true,
        success: function (data) {
            if (!data.includes("Sorry, No events found!")) {
                $('#content').removeClass('d-none');
                $('#alert').addClass('d-none');
                $('#results').append(data);
            }
        }
    });
    // Clear favorites function
    function clearFavorites() {
        // Reset the counter and clear the liked cards set
        count = 0;
        likedCards.clear();
        countDisplay.textContent = count;

        // Clear the table entries
        tableBody.innerHTML = '';
    }

    // Search button event listener
    const search = document.getElementById("search");
    search.addEventListener("click", function () {
        // Check if there are liked items
        const hasLikedItems = likedCards.size > 0;

        // If there are liked items, ask for confirmation
        if (hasLikedItems) {
            const confirmClear = confirm("Are you sure you want a new search? Favorites will be cleared.");

            // If the user cancels, return and don't proceed with the search
            if (!confirmClear) {
                return;
            }

            // User confirmed, clear favorites
            clearFavorites();
        }

        // Clear the container before adding new cards
        $('#results').empty();
        $('#events').empty();
        $('#alert').empty();

        // Get values from the search bars
        const searchTerm = $('input[name=searchTerm]').val();
        const location = $('input[name=location]').val();
        const searchForm = $('#searchForm').serialize();

        // Input empty conditions
        if ($.trim(searchTerm) === "" && $.trim(location) === "") {
            // Both is empty|| debugging
            console.error('both cannot be empty. Please enter a valid search term.');
            // Both search term and city are empty
            $('#alert').removeClass('d-none');
            $('#content').addClass('d-none');
            $('#alert').append('Search term and city cannot be empty. Please enter valid values.');
            return;
        } else if ($.trim(searchTerm) === "") {
            // Search term is empty|| debugging
            console.error('search term cannot be empty. Please enter a valid search term.');
            // Search term is empty
            $('#alert').removeClass('d-none');
            $('#content').addClass('d-none');
            $('#alert').append('Search term cannot be empty. Please enter a valid search term.');
            return;
        } else if ($.trim(location) === "") {
            // location is empty || debugging
            console.error('location cannot be empty. Please enter a valid search term.');
            // City is empty
            $('#alert').removeClass('d-none');
            $('#content').addClass('d-none');
            $('#alert').append('City cannot be empty. Please enter a valid city.');
            return;
        }

        // Get CSRF token from the template
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        // AJAX request for search
        $.ajax({
            type: "POST",
            url: "/ticketmaster/",
            async: true,
            headers: {
                "X-CSRFToken": csrfToken
            },
            data: searchForm,
            success: function (data) {
                console.log(data);
                // Grab the results from the API JSON return
                $('#content').removeClass('d-none');
                $('#alert').addClass('d-none');
                $('#results').append(data);
            },
            error: function (xhr, status, error) {
                if (xhr.status === 403) {
                    alert("Please read the description carefully!!! Please first enable cross-origin request by visiting https://cors-anywhere.herokuapp.com/ as described in the source code");
                }
            }
        });
    });

    // count how many liked cards there are
    const countDisplay = document.getElementById('countValue');
    const likedCards = new Set();

    // Click event for liking cards
    $(document).on('click', '.btn-outline-danger', function () {
        const cardId = String($(this).data('card-id'));
        console.log('Clicked Card ID:', cardId);

        // Check if the card has already been liked
        if (!likedCards.has(cardId)) {
            likedCards.add(cardId);

            // Increment the counter || need toString or else error
            // This displays how many favorited and changes based on how many liked/cleared
            countDisplay.textContent = (parseInt(countDisplay.textContent) + 1).toString();

            const card = $(this).closest('.card');
            // Get text content from the '.venue', '.name', etc. elements within the found 'card'
            const venue = card.find('.venue').text();
            const name = card.find('.name').text();
            const date = card.find('.date').text();
            const time = card.find('.time').text();
            const url = card.find('.btn-primary').attr('href');  // Get the URL
            // Add ^ data to the favorites list
            addToFavoriteList({id: cardId, venue, name, date, time, url});
        } else {
            // Handle the case where the card is already liked
            alert('You have already liked this card.');
        }
    });


    // Add to favorites function
    function addToFavoriteList(item) {
        // create rows and place each data into a cell
        const tableRow = document.createElement('tr');
        // For Venue
        const venueCell = document.createElement('td');
        venueCell.textContent = item.venue;
        // For Name
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        // For Date
        const dateCell = document.createElement('td');
        dateCell.textContent = item.date;
        // For Time
        const timeCell = document.createElement('td');
        timeCell.textContent = item.time;
        // For URL
        const urlCell = document.createElement('td');

        // Create a table cell for the URL button
        const findTicketButton = document.createElement('button');
        findTicketButton.setAttribute('class', 'btn btn-primary');
        findTicketButton.setAttribute('onclick', `window.open('${item.url}', '_blank')`);
        // Set button name as Find Ticket
        findTicketButton.textContent = 'Find Ticket';
        /*note: appendChild() method is used to insert a new node or reposition an existing node
         as the last child of a particular parent node */
        urlCell.appendChild(findTicketButton);

        // Append the cells to the table row
        tableRow.appendChild(nameCell);
        tableRow.appendChild(venueCell);
        tableRow.appendChild(dateCell);
        tableRow.appendChild(timeCell);
        tableRow.appendChild(urlCell);

        // Create a table cell for the Clear button
        const clearButtonCell = document.createElement('td');
        const clearButton = document.createElement('button');
        clearButton.setAttribute('class', 'btn btn-outline-danger clear-btn');
        // Set button name as clear
        clearButton.textContent = 'Clear';
        // Event Listener for Clearbutton
        clearButton.addEventListener('click', function () {
            // Get the cardId from the data attribute
            const cardId = tableRow.getAttribute('data-card-id');
            // Call the clearRow function
            clearRow(cardId);
        });
        // Append the clear button
        clearButtonCell.appendChild(clearButton);
        // Append the clear button cell to the table row
        tableRow.appendChild(clearButtonCell);
        // Set the data-card-id attribute on the table row || gives each card the ID
        tableRow.setAttribute('data-card-id', item.id);
        // Append the table row to the table body
        tableBody.appendChild(tableRow);

        // Get CSRF token from the template
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        // AJAX request for adding to favorites
        $.ajax({
            type: "POST",
            url: "api/add_to_favorites/",
            // items we want to add from the API
            data: {
                venue: item.venue,
                name: item.name,
                date: item.date,
                time: item.time,
                url: item.url,
            },
            // needed csrfToken kept getting errors in console
            headers: {
                "X-CSRFToken": csrfToken
            },
            // debugging
            success: function (response) {
                console.log('Data saved successfully:', response);
            },
            error: function (error) {
                console.error('Error saving data:', error);
            }
        });
    }

    // access the table for favorites
    const tableBody = document.getElementById('tableBody');
    // Declare the count variable
    let count = 0;
    // Clear favorites function
    // Event listener for the "Clear" button
    $('#clearFavorites').on('click', function () {
        // Reset the counter and clear the liked cards set
        count = 0;
        likedCards.clear();
        countDisplay.textContent = count;

        // Clear the table entries
        tableBody.innerHTML = '';
    });

    // Add a function to clear a specific row
    function clearRow(cardId) {
        // Find the corresponding row and remove it
        const rowToRemove = $(`#tableBody tr[data-card-id="${cardId}"]`);
        rowToRemove.remove();

        // Remove the cardId from the likedCards set
        likedCards.delete(cardId);

        // Update the counter display
        countDisplay.textContent = likedCards.size.toString();
    }

    // Event listener for clearing a row
    $(document).on('click', '.clear-btn', function () {
        const cardId = String($(this).data('card-id'));
        // for debugging
        console.log('Clicked Clear Button for Card ID:', cardId);

        // Call the clearRow function
        clearRow(cardId);
    });

    // Save list to PDF when click save button
    document.getElementById('downloadButton').addEventListener('click', function () {
        // Check if there are items in the list
        const countDisplay = document.getElementById('countValue');
        // count the amount of items
        const itemCount = parseInt(countDisplay.textContent);
        // if there are 0 items then throw error
        if (itemCount === 0) {
            // Show an error message or handle it as needed
            alert('There are no items in the list. Add items before saving.');
            return;
        }
        // have element hold "table body" which is our favorites table ID
        const title = document.getElementById('Title');
        // have element hold "table body" which is our favorites table ID
        const table = document.getElementById('tableBody');
        // create a wrapper element which appends clones of the table and title to it
        const wrapElement = document.createElement('div');
        // append the title and table to the wrapper element ^
        wrapElement.appendChild(title.cloneNode(true));
        wrapElement.appendChild(table.cloneNode(true));
        // in the PDF show ^ tableBody and title
        // set the filename to 'favorites-list.pdf'
        html2pdf(wrapElement, {
            filename: 'favorites-list.pdf'
        });
    });

})






