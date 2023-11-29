from django.shortcuts import render

from django.http import HttpResponse, JsonResponse
import requests

def index(request):
    # if the request method is a post
    print(request.method)

    if request.method == 'POST':
        # get the search term and location
        searchTerm = request.POST['searchTerm']
        location = request.POST['location']


        data = get_events(location, searchTerm)
        if "_embedded" not in data:
            return render(request, 'add.html', {'data': []})
        data = data["_embedded"]["events"]
        response = JsonResponse(data, status=200, safe=False)
        events = []
        for event in data:
            time = ""
            if "localTime" in event['dates']['start']:
                time = event['dates']['start']['localTime']

            context = {
                'image': event['images'][0]['url'],
                'name': event['name'],
                'venue': event['_embedded']['venues'][0]['name'],
                'address': event['_embedded']['venues'][0]['address']['line1'],
                'city': event['_embedded']['venues'][0]['city']['name'],
                'state': event['_embedded']['venues'][0]['state']['stateCode'],
                'ticket': event['url'],
                'date': event['dates']['start']['localDate'],
                'time': time
            }

            events.append(context)


        return render(request, 'add.html', {'data':events})
    else:
        return render(request, 'base.html')



def get_events(location, searchTerm):
    try:
        url = "https://app.ticketmaster.com/discovery/v2/events.json"
        parameters = {
            "city": location,
            "keyword": searchTerm,
            "sort": "date,asc",
            "apikey": "5XwI0TRHSPM0s5Iu5bbB0HuMcYgSmoX7"
        }

        response = requests.get(url, params=parameters)
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Request Failed: {e}")
        return None


