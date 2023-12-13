from django.shortcuts import render, redirect, get_object_or_404
from .models import search_history
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests
from .models import FavoritedEvent


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
        return render(request, 'add.html', {'data': events})


def add_to_favorites(request):
    if request.method == 'POST':
        venue = request.POST.get('venue')
        name = request.POST.get('name')
        date = request.POST.get('date')
        time = request.POST.get('time')
        url = request.POST.get('url')

        # Save to FavoritedEvent model
        FavoritedEvent.objects.create(venue=venue, name=name, date=date, time=time, url=url)

        return JsonResponse({'message': 'Event added to favorites successfully.'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)


def clear_favorites(request):
    # Assuming you have a model named FavoritedEvent for storing favorites
    FavoritedEvent.objects.all().delete()

    return JsonResponse({
        'cleared': True,
        'message': 'Favorites cleared successfully'
    })


def delete_favorite(request, favorite_id):
    if request.method == 'POST':
        # Get the FavoritedEvent instance using the provided ID
        favorited_event = get_object_or_404(FavoritedEvent, id=favorite_id)

        # Delete the FavoritedEvent instance
        favorited_event.delete()

        return JsonResponse({'message': 'Favorite deleted successfully.'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)
