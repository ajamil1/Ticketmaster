from django.shortcuts import render, redirect
from .models import search_history

from django.http import HttpResponse, JsonResponse
import requests



def index(request):
    # if the request method is a post
    print(request.method)

    if request.method == 'POST':
        # get the search term and location
        searchTerm = request.POST['searchTerm']
        location = request.POST['location']
        if searchTerm == "" and location == "":
            return recommendations(request)
        else:
            data = get_events(location, searchTerm)
            if "_embedded" not in data:
                return render(request, 'add.html', {'data': []})
            search_history.objects.create(latestSearch=searchTerm, latestLocation=location)
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
        return render(request, 'add.html', {'data':events})
