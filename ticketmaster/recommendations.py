import requests
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Count
from django.core.exceptions import BadRequest

from .models import search_history


def index(request):
    # if the request method is a post
    print(request.method)

    if request.method == 'GET':
        # get the search term and location

        searchHistory = search_history.objects.all()
        locations = searchHistory.values('location')
        searches = searchHistory.values('search')

        #for location in locations:
        print(locations.annotate(count=Count('location')).order_by("-count"))



        if searchHistory.count() == 0:
            return render(request, 'add.html', {'data': []})

        searchTerm = searches.annotate(count=Count('search')).order_by("-count")[0]['search']
        location = locations.annotate(count=Count('location')).order_by("-count")[0]['location']

        data = get_events(location, searchTerm)
        if "_embedded" not in data:
            return render(request, 'add.html', {'data': []})
        if not search_history.objects.filter(search__icontains=searchTerm, location__icontains=location):
            search_history.objects.create(search=searchTerm, location=location)
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
                'url': event['url'],
                'date': event['dates']['start']['localDate'],
                'time': time
            }

            events.append(context)
        print(events)

        return render(request, 'add.html', {'data': events})

    else:
        return BadRequest()


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


def recommendations(request):
    if request == 'GET':
        history = search_history.objects.all()

        i = 0
        events = []

        for event in history:
            data = get_events(history.latestSearch[i], history.latestLocation[i])
            data = data["_embedded"]["events"]

            response = JsonResponse(data, status=200, safe=False)
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
            i = i + 1
        return render(request, 'add.html', {'data': events})
