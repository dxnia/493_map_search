'use strict';


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDc0ygJS0wJMRhBtGI7iE_7nqVssNnWMpE",
    authDomain: "projectf-371d9.firebaseapp.com",
    databaseURL: "https://projectf-371d9.firebaseio.com",
    projectId: "projectf-371d9",
    storageBucket: "",
    messagingSenderId: "88915555052"
};

firebase.initializeApp(config);

var ref = firebase.database().ref();
var default_email = "test@example.com";

var secret_key = 'a^O\xff\t\xb5t\xc4\x14=\xe0p\xab\x18.y\xd5\xf9@f\xf4F\xd4\xd0';
/* Controllers */

var Final_Controllers = angular.module('Final_Controllers', ["firebase"]);

var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('email');
provider.addScope('user_friends');


function get_user() {
    var user = firebase.auth().currentUser;
    if (!user) {
        return -1;
    }
    return user;
}

function get_uid() {
    var user = get_user();
    if (user == -1) {
        return -1;
    }
    return user.providerData[0].uid;
}

//url in the form "?id=oi23i14h3tog813ghaosdjfo"
function checkToRedirect(url) {
    var uid = get_uid();
    if (uid == -1) {
        console.log("no one logged in")
        console.log(url);
        if (url) {
            console.log("/#/" + url)
            var location = "/#/" + url;
            window.location = location;
        } else {
            console.log("/")
            window.location = "/";
        }
    }

}


Final_Controllers.controller('searchPage', ['$scope', '$http', '$window', 'Places', 'LatLong', 'upcomingTripService', function($scope, $http, $window, Places, LatLong, upcomingTripService) {
    console.log("i got here");

    console.log("SHARED PROPERTY: " + upcomingTripService.getProperty());

    $scope.add = function(city) {
        window.location.href = "#/searchresults";
        upcomingTripService.clearAttractions();
        console.log("Add Function Returns City: " + city);
        $scope.city = city;
        upcomingTripService.setCity(city);
        $http({
            method: 'GET',
            dataType: 'jsonp',
            cache: false,
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=AIzaSyBsxawHW0CdThQYREPYasco9mJ9Ub3VXqk'

            // url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+city+'&key='+'AIzaSyAk2w4o27LZQzZrSk7QKq-erTQEGqZnnZo'
        }).then(function successCallback(response) {
            console.log("success " + response.data);
            var obj = JSON.stringify(response);
            console.log("object: " + obj);

            if (response.data.status != "ZERO_RESULTS") {
                console.log("there are results and we know this");
                window.location.href = "/#/searchresults";




                // alert("add function works " + city);
                Places.getData(city).then(function(response) {
                    console.log("response: " + response);
                    $scope.latlongobj = response;
                    $scope.lat = response.lat;
                    $scope.long = response.lng;

                    $http({
                        method: 'GET',
                        dataType: 'jsonp',
                        headers: {
                            "x-api-key": 'GwXHC0Tks21G6Y3T0PQbRacMXRNhsEOy8R8OqlTf'
                        },
                        url: 'https://api.sygictravelapi.com/1.0/en/places/list?area=' + $scope.lat + ',' + $scope.long + ',5000&categories=sightseeing&limit=4'
                    }).then(function successCallback(response) {
                        console.log(response);

                        upcomingTripService.setAttractions(response.data.data.places);
                        console.log("updated attractions");
                        $scope.attractions = upcomingTripService.getAttractions();

                        //     console.log($scope.attractions); 

                        //     upcomingTripService.setAttractions(response.data.data.places); 
                        //     $scope.attractions = upcomingTripService.getAttractions(); 


                    })

                    //   $http({
                    //     method: 'GET',
                    //     data: { action: 'query', list: 'search', srsearch: city, format: 'json' },
                    //     dataType: 'jsonp',
                    //     url: '//en.wikipedia.org/w/api.php'
                    //   }).then(function successCallback(response) {
                    //     console.log(response.data); 
                    //     console.log('title', response.query.search[0].snippet);

                    // }) 
                    $.ajax({
                        url: '//en.wikipedia.org/w/api.php',
                        data: { action: 'query', list: 'search', srsearch: city, format: 'json' },
                        dataType: 'jsonp',
                        success: function(x) {
                            upcomingTripService.setDesc(x.query.search[0].snippet);
                            // $scope.description = x.query.search[0].snippet; 
                            console.log('title', x.query.search[0].snippet);
                        }
                    });

                    //     console.log($scope.attractions); 

                    //     upcomingTripService.setAttractions(response.data.data.places); 
                    //     $scope.attractions = upcomingTripService.getAttractions(); 





                });


            } // console.log("console attributes: "); 
            else {}
        })
        // console.log($scope.attractions); 
    };


    console.log("woohoo seeing my trips");

    $scope.markTripDeleted = function(trip, index) {

        console.log("trip: " + trip);
        console.log("index:  " + index);
        upcomingTripService.deleteTrip(trip, index);


    }

    $scope.markTripCompleted = function(trip, index) {
        window.location.href = "#/mytrips";

        console.log("trip: " + trip);
        console.log("index:  " + index);
        upcomingTripService.completeTrip(trip, index);


    }

    $scope.viewAddTripForm = false;
    $scope.toggleModal = function() {
        $scope.viewAddTripForm = !$scope.viewAddTripForm;
    };

    $scope.submit = function(title, place) {
        $scope.title = title;
        $scope.place = place;
        console.log("place: " + place);

        if (place == undefined || title == undefined) {

            alert('Make sure your trip has a name and a place!');
            window.location.href = "/#/addtrip";
       } 

       else { 
        console.log("place added: " + place);


        // alert("add function works " + city);
        Places.getData(place).then(function(response) {
            console.log("response: " + response);

            var lat = response.lat;
            var long = response.lng;

            $http({
                method: 'GET',
                dataType: 'jsonp',
                headers: {
                    "x-api-key": 'GwXHC0Tks21G6Y3T0PQbRacMXRNhsEOy8R8OqlTf'
                },
                url: 'https://api.sygictravelapi.com/1.0/en/places/list?area=' + lat + ',' + long + ',5000&categories=sightseeing&limit=20'
            }).then(function successCallback(response) {
                console.log(response);

                // upcomingTripService.setAttractions(response.data.data.places); 
                console.log("updated attractions");
                var city_attractions = [];
                city_attractions = response.data.data.places;
                var empty_days = [];
                var day_trips = [];
                var check_list = [];

                if(city_attractions[0].thumbnail_url != null){ 
                   var image = city_attractions[0].thumbnail_url;
                 } 
                 else 
                    var image = 'images/noimage.png'; 
                //     console.log($scope.attractions); 

                //     upcomingTripService.setAttractions(response.data.data.places); 
                //     $scope.attractions = upcomingTripService.getAttractions(); 
                var form = document.getElementById("form");
                form.reset();
                var new_trip = {
                    title: $scope.title,
                    place: $scope.place,
                    latitude: lat,
                    longitude: long,
                    image: image,
                    start_date: new Date('2018', '11', '22'),
                    end_date: new Date('2018', '11', '27'),
                    attractions: city_attractions,
                    days: day_trips,
                    checkList: check_list
                }

                console.log("the new trip info: ");
                console.log(new_trip);

                console.log("SHARED PROPERTY: " + upcomingTripService.setProperty(new_trip));

                // $scope.upcomingTrips.push(new_trip);
                console.log("New Trip Created!");
                window.location.href = "/#/mytrips";

            })

        });
      } 
    };

    $scope.submitNewDay = function(event) {

        console.log("day added: ");
        upcomingTripService.addDay();
    };
    $scope.redirect = function(index) {
        window.location.href = "/#/tripagenda";
    };
    $scope.redirect = function(index) {
        window.location.href = "/#/tripagenda";
    };

    $scope.setCurrentTripContent = function(trip, $index, whichArray) {
        $scope.current_trip = trip;
        $scope.current_trip.whichArray = whichArray;
        console.log("current trip content: ");
        console.log($scope.current_trip);

        upcomingTripService.setCurrentTrip(trip, $index, whichArray);


    };


    $scope.addList = function() {
        // var myEl = angular.element( document.querySelector( '#'+$scope.id ) );
        // myEl.append('<div class="day-activity"><p>'+$scope.selectedPlace.name+'</p></div>'); 
        // var lastChar = $scope.id.substr($scope.id.length - 1); 
        // upcomingTripService.addDayToCurrentTrip(lastChar,$scope.selectedPlace.name);
        console.log("hi");

        // $scope.checkList.push({ 'title': $scope.newItem, 'done': false });        
        upcomingTripService.addItemToCheckList($scope.newItem);
        $scope.newItem = '';
    }
    // $scope.checked = {};

    $scope.itemsChecked = function(item,id) {    
       

        upcomingTripService.itemsChecked(item,id);
        
    }


    
    $scope.submitNewTrip = function() {
        console.log("Adding new trip!");
        window.location.href = "/#/addtrip";
    };

    $scope.submitNewTrip = function() {
        console.log("Adding new trip!");
        window.location.href = "/#/addtrip";
    };
    $scope.IsVisible = false;
    $scope.id;
    $scope.ShowHide = function(event) {
        //If DIV is visible it will be hidden and vice versa.
        $scope.id = event.target.parentElement.id;
        console.log($scope.id);
        $scope.IsVisible = $scope.IsVisible ? false : true;
    }

    $scope.addPlaceToDay = function(list) {
        console.log("hi");
        console.log(list);
        $scope.selectedPlace = list;
        console.log($scope.id);

        var myEl = angular.element(document.querySelector('#' + $scope.id));
        myEl.append('<div class="day-activity"><p>' + $scope.selectedPlace.name + '</p></div>');
        var lastChar = $scope.id.substr($scope.id.length - 1);
        upcomingTripService.addDayToCurrentTrip(lastChar, $scope.selectedPlace.name);
        // console.log(current_trip.days[lastChar]);
    }

    $scope.upcomingTrips = upcomingTripService.getProperty();
    console.log($scope.upcomingTrips);
    $scope.completedTrips = upcomingTripService.getCompleted();
    $scope.attractions = upcomingTripService.getAttractions();
    $scope.city = upcomingTripService.getCity();
    console.log($scope.city);
    $scope.description = upcomingTripService.getDesc();
    console.log("AHHHHH" + $scope.description);
    $scope.current_trip = upcomingTripService.getCurrentTrip();
    console.log("scope says the current trip is: ");
    console.log($scope.current_trip);
    // $scope.upcomingTripService.upcomingTrips = upcomingTripService.upcomingTrips;



}]);


Final_Controllers.factory('Places', function($http) {

    var descriptionData = "";

    return {
        getData: getData
    };

    function getData(city) {
        //storyInfo = newWords;
        // console.log(artistName);
        // $scope.loading = true;
        console.log('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + city + '&key=' + 'AIzaSyBsxawHW0CdThQYREPYasco9mJ9Ub3VXqk');
        return $http({
            method: 'GET',
            dataType: 'jsonp',
            cache: false,
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=AIzaSyBsxawHW0CdThQYREPYasco9mJ9Ub3VXqk'

            // url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+city+'&key='+'AIzaSyAk2w4o27LZQzZrSk7QKq-erTQEGqZnnZo'
        }).then(function successCallback(response) {
            console.log("success " + response.data);
            var obj = JSON.stringify(response);
            console.log("object: " + obj);
            console.log("response object " + JSON.stringify(response.data.results[0].geometry.location));

            if (response.data != null) {
                // descriptionData = response.data.predictions[0].description;
                // locationId = response.data.predictions[0].id; 
                // predictions = response.data.predictions; 
            } else {
                descriptionData = "Sorry, no description found";
            }
            return response.data.results[0].geometry.location;
        })
    }

});

Final_Controllers.factory('LatLong', function($http) {

    var descriptionData = "";

    return {
        getData: getData
    };

    function getData(latlong) {
        //storyInfo = newWords;
        // console.log(artistName);
        // $scope.loading = true;
        console.log("PLACE URL " + 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + latlong.lat + ',' + latlong.long + '&radius=5000&key=AIzaSyBsxawHW0CdThQYREPYasco9mJ9Ub3VXqk');
        console.log("should be longitude: " + latlong.long);
        return $http({
            method: 'GET',
            dataType: 'jsonp',
            url: 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + latlong.lat + ',' + latlong.long + '&radius=5000&key=AIzaSyBsxawHW0CdThQYREPYasco9mJ9Ub3VXqk'
        }).then(function successCallback(response) {
            console.log("success " + response);
            console.log("response object " + response.data);
            var obj = JSON.stringify(response);
            console.log("object: " + obj);
            console.log("photo object " + JSON.stringify(response.data.results.photos));
            if (response.data != null) {
                descriptionData = response.data[0].description;
            } else {
                descriptionData = "Sorry, no description found";
            }
            return descriptionData;
        })

    }

});


Final_Controllers.service('upcomingTripService', function() {
    var current_trip = [];

    var property = 'First';
    var city = "";
    var desc = [

        {
            name: 'empty'

        }
    ];
    var attractions = [

        {
            name: 'empty'

        }
    ];

    var upcomingTrips = [{
            title: 'South East Asia Travels',
            place: 'Singapore',
            image: 'images/SEAtravelstrip.png',
            start_date: new Date('2018', '02', '18'),
            end_date: new Date('2018', '02', '29'),
            latitude: 1.352083,
            longitude: 103.819836,
            days: [],
            checkList: [],
            attractions: [
                {
                  "id": "poi:21449",
                  "level": "poi",
                  "rating": 0.31966265060241,
                  "quadkey": "132232231101322011",
                  "location": {
                    "lat": 1.3284306,
                    "lng": 103.8469406
                  },
                  "bounding_box": null,
                  "name": "Burmese Buddhist Temple",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:21449",
                  "marker": "other:place_of_worship:temple",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": "Also called Maha Sasana Ramsi, this is the oldest Theravada temple in Singapore.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:21449",
                  "$$hashKey": "object:19"
                },
                {
                  "id": "poi:21445",
                  "level": "poi",
                  "rating": 0.23452208835341,
                  "quadkey": "132232231103001122",
                  "location": {
                    "lat": 1.3140124,
                    "lng": 103.8159507
                  },
                  "bounding_box": null,
                  "name": "Botanic Gardens",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:21445",
                  "marker": "relaxing:park:garden",
                  "categories": [
                    "hiking",
                    "relaxing",
                    "sightseeing",
                    "discovering"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": "Established in 1859, this historical tropical garden is a vast haven for all nature lovers.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:21445",
                  "$$hashKey": "object:20"
                },
                {
                  "id": "poi:21443",
                  "level": "poi",
                  "rating": 0.063979699178739,
                  "quadkey": "132232231103001032",
                  "location": {
                    "lat": 1.3128533,
                    "lng": 103.8133493
                  },
                  "bounding_box": null,
                  "name": "National Orchid Garden",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:21443",
                  "marker": "hiking:park:nature",
                  "categories": [
                    "hiking",
                    "sightseeing",
                    "relaxing"
                  ],
                  "parent_ids": [
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": "A part of the large complex of Botanic Gardens, this place is home to more than 1000 orchid species.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:21443",
                  "$$hashKey": "object:21"
                },
                {
                  "id": "poi:8743268",
                  "level": "poi",
                  "rating": 0.0034096385542169,
                  "quadkey": "132232231103011301",
                  "location": {
                    "lat": 1.3120898,
                    "lng": 103.839515
                  },
                  "bounding_box": null,
                  "name": "Newton Food Centre",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:8743268",
                  "marker": "eating:restaurant",
                  "categories": [
                    "eating",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:22"
                },
                {
                  "id": "poi:6037721",
                  "level": "poi",
                  "rating": 0.002816695431011,
                  "quadkey": "132232231103001033",
                  "location": {
                    "lat": 1.313753,
                    "lng": 103.8150439
                  },
                  "bounding_box": null,
                  "name": "Shaw Foundation Symphony Stage",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:6037721",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:23"
                },
                {
                  "id": "poi:8827421",
                  "level": "poi",
                  "rating": 0.0026064257028112,
                  "quadkey": "132232231103001213",
                  "location": {
                    "lat": 1.3108969,
                    "lng": 103.8150737
                  },
                  "bounding_box": null,
                  "name": "Ginger Garden",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:8827421",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:24"
                },
                {
                  "id": "poi:13346014",
                  "level": "poi",
                  "rating": 0.002,
                  "quadkey": "132232231101231123",
                  "location": {
                    "lat": 1.3354249,
                    "lng": 103.8387222
                  },
                  "bounding_box": null,
                  "name": "Seah Eu Chin's grave on Grave Hill",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:13346014",
                  "marker": "sightseeing:tomb",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": "Seah Eu Chin was an immigrant from South China to Singapore, later becoming a successful merchant and leader in the Overseas Chinese…",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:25"
                },
                {
                  "id": "poi:8835222",
                  "level": "poi",
                  "rating": 0.0018562376915832,
                  "quadkey": "132232231103001102",
                  "location": {
                    "lat": 1.3166691,
                    "lng": 103.815717
                  },
                  "bounding_box": null,
                  "name": "Evolution Garden",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:8835222",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:26"
                },
                {
                  "id": "poi:8822706",
                  "level": "poi",
                  "rating": 0.0018032128514056,
                  "quadkey": "132232231103001320",
                  "location": {
                    "lat": 1.3099652,
                    "lng": 103.8162532
                  },
                  "bounding_box": null,
                  "name": "Bonsai",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:8822706",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:27"
                },
                {
                  "id": "poi:8821104",
                  "level": "poi",
                  "rating": 0.0018032128514056,
                  "quadkey": "132232231101223320",
                  "location": {
                    "lat": 1.3203161,
                    "lng": 103.8156956
                  },
                  "bounding_box": null,
                  "name": "Spices",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:8821104",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:28"
                },
                {
                  "id": "poi:10418995",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231103001332",
                  "location": {
                    "lat": 1.3085082,
                    "lng": 103.8181311
                  },
                  "bounding_box": null,
                  "name": "Orchid Breeding and Micropropagation Lab",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:10418995",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:29"
                },
                {
                  "id": "poi:18899515",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231100310002",
                  "location": {
                    "lat": 1.3606982,
                    "lng": 103.7773777
                  },
                  "bounding_box": null,
                  "name": "Former Power Station",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:18899515",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61342",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:30"
                },
                {
                  "id": "poi:19812437",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231100310211",
                  "location": {
                    "lat": 1.3565221,
                    "lng": 103.7822265
                  },
                  "bounding_box": null,
                  "name": "Pipes",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:19812437",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61342",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:31"
                },
                {
                  "id": "poi:13037430",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231101203030",
                  "location": {
                    "lat": 1.3482053,
                    "lng": 103.8138502
                  },
                  "bounding_box": null,
                  "name": "Purification Tub",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:13037430",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:32"
                },
                {
                  "id": "poi:17033896",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231100333322",
                  "location": {
                    "lat": 1.3190684,
                    "lng": 103.7944943
                  },
                  "bounding_box": null,
                  "name": "Astrid meadows",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:17033896",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61342",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:33"
                },
                {
                  "id": "poi:19297441",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231103001102",
                  "location": {
                    "lat": 1.3167893,
                    "lng": 103.8158614
                  },
                  "bounding_box": null,
                  "name": "Evolution Garden",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:19297441",
                  "marker": "relaxing:park:garden",
                  "categories": [
                    "sightseeing",
                    "relaxing"
                  ],
                  "parent_ids": [
                    "city:3355",
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:34"
                },
                {
                  "id": "poi:18753797",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231101203013",
                  "location": {
                    "lat": 1.3488032,
                    "lng": 103.8150064
                  },
                  "bounding_box": null,
                  "name": "Pumping House",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:18753797",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:35"
                },
                {
                  "id": "poi:19812309",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231100303133",
                  "location": {
                    "lat": 1.3459379,
                    "lng": 103.7766647
                  },
                  "bounding_box": null,
                  "name": "Ruins",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:19812309",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61342",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:36"
                },
                {
                  "id": "poi:19812438",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231100310321",
                  "location": {
                    "lat": 1.3528888,
                    "lng": 103.7841164
                  },
                  "bounding_box": null,
                  "name": "Pipes",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:19812438",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61342",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:37"
                },
                {
                  "id": "poi:19427905",
                  "level": "poi",
                  "rating": 0.001,
                  "quadkey": "132232231101210003",
                  "location": {
                    "lat": 1.3603133,
                    "lng": 103.8233783
                  },
                  "bounding_box": null,
                  "name": "Ruins",
                  "name_suffix": "Singapore, Singapore",
                  "url": "https://travel.sygic.com/go/poi:19427905",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "region:61340",
                    "region:1976232",
                    "country:84",
                    "continent:4"
                  ],
                  "perex": null,
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": null,
                  "$$hashKey": "object:38"
                }],
            whichArray: "upcoming",
        },
        {
            title: 'Off to Toronto',
            place: 'Toronto',
            image: 'images/torontotrip.png',
            start_date: new Date('2018', '06', '03'),
            end_date: new Date('2018', '06', '15'),
            latitude: 43.653226,
            longitude: -79.3831843,
            whichArray: "upcoming",
            days: [],
            checkList: [],
            attractions: [
                {
                  "id": "poi:19451",
                  "level": "poi",
                  "rating": 0.65645312098639,
                  "quadkey": "030223131222110002",
                  "location": {
                    "lat": 43.6425896,
                    "lng": -79.3870873
                  },
                  "bounding_box": null,
                  "name": "CN Tower",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19451",
                  "marker": "sightseeing:tower:lookout:observation",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "With its 553 meters, it was once the highest building in the world and is one of the modern Seven Wonders of the World now.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19451",
                  "$$hashKey": "object:352"
                },
                {
                  "id": "poi:27594",
                  "level": "poi",
                  "rating": 0.33231726907631,
                  "quadkey": "030223131220320312",
                  "location": {
                    "lat": 43.6543165,
                    "lng": -79.4006599
                  },
                  "bounding_box": null,
                  "name": "Kensington Market",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:27594",
                  "marker": "eating:cafe",
                  "categories": [
                    "eating",
                    "shopping",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Kensington Market is a distinctive multicultural neighbourhood in Downtown Toronto, Ontario, Canada.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:27594",
                  "$$hashKey": "object:353"
                },
                {
                  "id": "poi:19446",
                  "level": "poi",
                  "rating": 0.31467051973628,
                  "quadkey": "030223131220033313",
                  "location": {
                    "lat": 43.6780934,
                    "lng": -79.4093974
                  },
                  "bounding_box": null,
                  "name": "Casa Loma",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19446",
                  "marker": "discovering:museum",
                  "categories": [
                    "discovering",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Casa Loma is a Gothic Revival style house and gardens in midtown Toronto, Ontario, Canada, that is now a museum and landmark.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19446",
                  "$$hashKey": "object:354"
                },
                {
                  "id": "poi:19508",
                  "level": "poi",
                  "rating": 0.27060173479745,
                  "quadkey": "030223131220303010",
                  "location": {
                    "lat": 43.6676981,
                    "lng": -79.3947038
                  },
                  "bounding_box": null,
                  "name": "Royal Ontario Museum",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19508",
                  "marker": "sightseeing:architecture:modern",
                  "categories": [
                    "sightseeing",
                    "discovering"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The Royal Ontario Museum is a museum of art, world culture and natural history in Toronto, Ontario, Canada.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19508",
                  "$$hashKey": "object:355"
                },
                {
                  "id": "poi:19518",
                  "level": "poi",
                  "rating": 0.27014615977395,
                  "quadkey": "030223131220333033",
                  "location": {
                    "lat": 43.6486907,
                    "lng": -79.3715544
                  },
                  "bounding_box": null,
                  "name": "St. Lawrence Market South",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19518",
                  "marker": "shopping:market",
                  "categories": [
                    "eating",
                    "shopping",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "St. Lawrence Market is a major public market in Toronto, Ontario, Canada. It is located at Front St.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19518",
                  "$$hashKey": "object:356"
                },
                {
                  "id": "poi:60865",
                  "level": "poi",
                  "rating": 0.20764080828838,
                  "quadkey": "030223131222110002",
                  "location": {
                    "lat": 43.6424618,
                    "lng": -79.3861548
                  },
                  "bounding_box": null,
                  "name": "Ripley's Aquarium of Canada",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:60865",
                  "marker": "discovering:museum",
                  "categories": [
                    "discovering",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Ripley's Aquarium of Canada is a public aquarium in Toronto, Ontario, Canada.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:60865",
                  "$$hashKey": "object:357"
                },
                {
                  "id": "poi:60935",
                  "level": "poi",
                  "rating": 0.203,
                  "quadkey": "030223131221222102",
                  "location": {
                    "lat": 43.6502803,
                    "lng": -79.3595767
                  },
                  "bounding_box": null,
                  "name": "Distillery District",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:60935",
                  "marker": "discovering",
                  "categories": [
                    "discovering",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The Distillery District is a commercial and residential district in Toronto, Ontario, Canada.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:60935",
                  "$$hashKey": "object:358"
                },
                {
                  "id": "poi:19474",
                  "level": "poi",
                  "rating": 0.19678056657747,
                  "quadkey": "030223131222110213",
                  "location": {
                    "lat": 43.6385065,
                    "lng": -79.3830779
                  },
                  "bounding_box": null,
                  "name": "Harbourfront Centre",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19474",
                  "marker": "going_out",
                  "categories": [
                    "sightseeing",
                    "doing_sports"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Harbourfront Centre is a key cultural organization on the waterfront of Toronto, Ontario, Canada, situated at 235 Queens Quay West.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19474",
                  "$$hashKey": "object:359"
                },
                {
                  "id": "poi:60889",
                  "level": "poi",
                  "rating": 0.17510377600822,
                  "quadkey": "030223131220330232",
                  "location": {
                    "lat": 43.65222,
                    "lng": -79.3837416
                  },
                  "bounding_box": null,
                  "name": "Nathan Phillips Square",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:60889",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Nathan Phillips Square is an urban plaza in Toronto, Ontario, Canada. It forms the forecourt to Toronto City Hall, or New City Hall, at the…",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:60889",
                  "$$hashKey": "object:360"
                },
                {
                  "id": "poi:19445",
                  "level": "poi",
                  "rating": 0.13956916120698,
                  "quadkey": "030223131220332200",
                  "location": {
                    "lat": 43.647325,
                    "lng": -79.386081
                  },
                  "bounding_box": null,
                  "name": "Canada's Walk of Fame",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19445",
                  "marker": "sightseeing:memorial",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Canada's Walk of Fame in Toronto, Ontario, Canada, is a walk of fame that acknowledges the achievements and accomplishments of Canadians.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19445",
                  "$$hashKey": "object:361"
                },
                {
                  "id": "poi:19497",
                  "level": "poi",
                  "rating": 0.12711742846525,
                  "quadkey": "030223131220330233",
                  "location": {
                    "lat": 43.6526458,
                    "lng": -79.3817617
                  },
                  "bounding_box": null,
                  "name": "Old City Hall",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19497",
                  "marker": "sightseeing:building:court",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The Old City Hall is a Romanesque civic building and court house in Toronto, Ontario, Canada.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19497",
                  "$$hashKey": "object:362"
                },
                {
                  "id": "poi:60876",
                  "level": "poi",
                  "rating": 0.12287327682165,
                  "quadkey": "030223131220303022",
                  "location": {
                    "lat": 43.6640219,
                    "lng": -79.3981917
                  },
                  "bounding_box": null,
                  "name": "University of Toronto",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:60876",
                  "marker": "other:information:board:map",
                  "categories": [
                    "sightseeing",
                    "traveling"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The University of Toronto is a public research university in Toronto, Ontario, Canada on the grounds that surround Queen's Park.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:60876",
                  "$$hashKey": "object:363"
                },
                {
                  "id": "poi:60890",
                  "level": "poi",
                  "rating": 0.12201703913006,
                  "quadkey": "030223131220330320",
                  "location": {
                    "lat": 43.653239,
                    "lng": -79.381334
                  },
                  "bounding_box": null,
                  "name": "The PATH",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:60890",
                  "marker": "shopping",
                  "categories": [
                    "shopping",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "A 29 km of underground pathways full of shops. The world's biggest underground shopping complex.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:60890",
                  "$$hashKey": "object:364"
                },
                {
                  "id": "poi:19431",
                  "level": "poi",
                  "rating": 0.11431089990581,
                  "quadkey": "030223131220321320",
                  "location": {
                    "lat": 43.6535571,
                    "lng": -79.3926255
                  },
                  "bounding_box": null,
                  "name": "Art Gallery of Ontario",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19431",
                  "marker": "discovering:gallery:art",
                  "categories": [
                    "discovering",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The Art Gallery of Ontario is an art museum in Toronto, Ontario, Canada.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19431",
                  "$$hashKey": "object:365"
                },
                {
                  "id": "poi:60924",
                  "level": "poi",
                  "rating": 0.0997548591489,
                  "quadkey": "030223131220333023",
                  "location": {
                    "lat": 43.6483804,
                    "lng": -79.3743252
                  },
                  "bounding_box": null,
                  "name": "Gooderham Building",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:60924",
                  "marker": "sightseeing:architecture:modern",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The Gooderham Building, also known as the Flatiron Building, is a historic office building at 49 Wellington Street East in Toronto, Ontario…",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:60924",
                  "$$hashKey": "object:366"
                },
                {
                  "id": "poi:19516",
                  "level": "poi",
                  "rating": 0.08091762993407,
                  "quadkey": "030223131220333003",
                  "location": {
                    "lat": 43.6505065,
                    "lng": -79.3739881
                  },
                  "bounding_box": null,
                  "name": "Cathedral Church of St. James",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19516",
                  "marker": "other:place_of_worship:church:cathedral",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Cathedral Church of St. James in Downtown Toronto, Ontario, Canada is the home of the oldest congregation in the city.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19516",
                  "$$hashKey": "object:367"
                },
                {
                  "id": "poi:19463",
                  "level": "poi",
                  "rating": 0.061224163027656,
                  "quadkey": "030223131222100302",
                  "location": {
                    "lat": 43.6389226,
                    "lng": -79.403319
                  },
                  "bounding_box": null,
                  "name": "Fort York",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:19463",
                  "marker": "discovering:museum",
                  "categories": [
                    "discovering",
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "Fort York is a historic site of military fortifications and related buildings on the west side of downtown Toronto, Ontario, Canada.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:19463",
                  "$$hashKey": "object:368"
                },
                {
                  "id": "poi:63740",
                  "level": "poi",
                  "rating": 0.060367925336073,
                  "quadkey": "030223131220303302",
                  "location": {
                    "lat": 43.662565,
                    "lng": -79.3916659
                  },
                  "bounding_box": null,
                  "name": "Ontario Legislative Building",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:63740",
                  "marker": "sightseeing",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The Ontario Legislative Building is a structure in central Toronto, Ontario that houses the Legislative Assembly of Ontario, as well as the…",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:63740",
                  "$$hashKey": "object:369"
                },
                {
                  "id": "poi:5051882",
                  "level": "poi",
                  "rating": 0.05750086293033,
                  "quadkey": "030223131220330230",
                  "location": {
                    "lat": 43.6535254,
                    "lng": -79.3839535
                  },
                  "bounding_box": null,
                  "name": "Toronto City Hall",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:5051882",
                  "marker": "sightseeing:town_hall:city_hall",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "The Toronto City Hall, or New City Hall, is the seat of the municipal government of Toronto, Ontario, Canada, and one of the city's most…",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:5051882",
                  "$$hashKey": "object:370"
                },
                {
                  "id": "poi:60877",
                  "level": "poi",
                  "rating": 0.039818220738077,
                  "quadkey": "030223131220332310",
                  "location": {
                    "lat": 43.6470304,
                    "lng": -79.3782645
                  },
                  "bounding_box": null,
                  "name": "Brookfield Place",
                  "name_suffix": "Toronto, Canada",
                  "url": "https://travel.sygic.com/go/poi:60877",
                  "marker": "sightseeing:architecture:modern",
                  "categories": [
                    "sightseeing"
                  ],
                  "parent_ids": [
                    "city:308",
                    "region:71",
                    "continent:6",
                    "country:49"
                  ],
                  "perex": "An office complex with interesting architecture, especially the Allen Lambert Galleria.",
                  "customer_rating": null,
                  "star_rating": null,
                  "star_rating_unofficial": null,
                  "thumbnail_url": "https://media-cdn.sygictraveldata.com/media/poi:60877",
                  "$$hashKey": "object:371"
                }],
        }
    ];

    var completedTrips = [{
            title: 'Tokyo Time',
            place: 'Tokyo',
            image: 'images/japantrip.png',
            start_date: new Date('2017', '07', '02'),
            end_date: new Date('2017', '07', '11'),
            latitude: 35.6894875,
            longitude: 139.6917064,
            days: [
              {
                "day": [
                  "Chidorigafuchi",
                  "Shinjuku Station"
                ]
              },
              {
                "day": [
                  "Shibuya Crossing",
                  "Hachikō",
                  "Shibuya Parco"
                ]
              },
              {
                "day": [
                  "Hanazono Jinja Shrine",
                  "Gokoku-ji",
                  "Konnou Hachimangu Shrine",
                  "Zenkoku-ji Temple"
                ]
              }
            ],
            checkList: [],
            whichArray: "completed",
            attractions: [],
        },
        {
            title: 'Heading to India!',
            place: 'Udaipur',
            image: 'images/udaipurtrip.png',
            start_date: new Date('2017', '02', '10'),
            end_date: new Date('2017', '02', '23'),
            latitude: 24.585445,
            longitude: 73.712479,
            days: [
              {
                "day": [
                  "City Palace",
                  "Jagdish Mandir"
                ]
              },
              {
                "day": [
                  "Ahar Museum",
                  "Amar Vilas"
                ]
              },
              {
                "day": [
                  "Lake Garden Palace",
                  "Sunset Point",
                  "Sukhadia Circle"
                ]
              }
            ],
            checkList: [],
            whichArray: "completed",
            attractions: [],
        },
        {
            title: 'Ski Trip!',
            place: 'Denver',
            image: 'images/skitrip.png',
            start_date: new Date('2016', '11', '22'),
            end_date: new Date('2016', '11', '27'),
            latitude: 39.7392358,
            longitude: -104.990251,
            days: [
              {
                "day": [
                  "Colorado State Capitol",
                  "Larimer Square"
                ]
              },
              {
                "day": [
                  "Denver Botanic Gardens",
                  "Denver Art Museum"
                ]
              }
            ],
            checkList: [],
            whichArray: "completed",
            attractions: [],
        },
        {
            title: 'Visiting the Capital',
            place: 'DC',
            image: 'images/dctrip.jpg',
            start_date: new Date('2016', '05', '16'),
            end_date: new Date('2016', '05', '18'),
            days: [
              {
                "day": [
                  "White House",
                  "United States Capitol"
                ]
              },
              {
                "day": [
                  "Washington Monument",
                  "National Mall",
                  "Lincoln Memorial"
                ]
              }
            ],
            checkList: [],
            latitude: 38.9071923,
            longitude: -77.0368707,
            whichArray: "completed",
            attractions: [],
        }
    ];

    var count = 0;
    var result_completed = [];
    angular.copy(completedTrips, result_completed);

    var result_trips = [];
    angular.copy(upcomingTrips, result_trips);

    var result_attr = [];
    angular.copy(attractions, result_attr);

    var city_service = [];
    angular.copy(city, city_service);

    var result_desc = "";
    angular.copy(desc, result_desc);

    var current_trip_results = {};

    return {
        getCompleted: getCompleted,
        completeTrip: completeTrip,
        getProperty: getProperty,
        setProperty: setProperty,
        getAttractions: getAttractions,
        setAttractions: setAttractions,
        setCity: setCity,
        getCity: getCity,
        getDesc: getDesc,
        setDesc: setDesc,
        getCurrentTrip: getCurrentTrip,
        setCurrentTrip: setCurrentTrip,
        addDay: addDay,
        addDayToCurrentTrip: addDayToCurrentTrip,
        addItemToCheckList: addItemToCheckList,
        clearAttractions: clearAttractions,
        deleteTrip: deleteTrip,
        itemsChecked: itemsChecked 
    };
    // setProperty: function(value){ 
    //   property = value; 
    // }
    function itemsChecked(item,id){
        console.log(current_trip.checkList[id].checked);
        if(current_trip.checkList[id].checked == true){
            current_trip.checkList[id].checked = false;
        }
        else{
            current_trip.checkList[id].checked = true;
        }

        if(upcomingTrips[current_trip.index].checkList[id].checked == true){
            upcomingTrips[current_trip.index].checkList[id].checked = false;
        }
        else{
            upcomingTrips[current_trip.index].checkList[id].checked = true;
        }
        
        
        angular.copy(upcomingTrips, result_trips);

        angular.copy(current_trip, current_trip_results);

    }
    function addDayToCurrentTrip(lastChar, place) {
        console.log(current_trip.days[lastChar].day);
        // current_trip.days[lastChar].day.push(place);
        console.log(current_trip);
        console.log(current_trip.index);

        // console.log(upcomingTrips[current_trip.index].days[lastChar]);
        upcomingTrips[current_trip.index].days[lastChar].push(place);
        angular.copy(upcomingTrips, result_trips);

        angular.copy(current_trip, current_trip_results);

    }

    function addItemToCheckList(item) {
        // console.log(current_trip[lastChar].day);
        current_trip.checkList.push({"item":item, "checked": false});
        console.log(current_trip.checkList);
        // console.log(current_trip.index);

        // console.log(upcomingTrips[current_trip.index].days[lastChar]);
        upcomingTrips[current_trip.index].checkList.push({"item":item, "checked": false});
        angular.copy(upcomingTrips, result_trips);

        angular.copy(current_trip, current_trip_results);

    }


    function setProperty(value) {
        upcomingTrips.push(value);
        angular.copy(upcomingTrips, result_trips);

        property = value;
    }

    function clearAttractions() {
        attractions = [];
        angular.copy(attractions, result_attr);

    }

    function setCurrentTrip(trip, $index, whichArray) {
        current_trip = trip;
        current_trip.index = $index;
        current_trip.whichArray = whichArray;
        console.log('the array this came from: ' + whichArray);
        angular.copy(current_trip, current_trip_results);
    }

    function addDay() {
        var empty_days = [];
        console.log(current_trip);
        // var id = current_trip.days.length;
        current_trip.days.push({ 'day': empty_days });
        console.log(current_trip);
        angular.copy(current_trip, current_trip_results);

        upcomingTrips[current_trip.index].days.push(empty_days);
        angular.copy(current_trip, current_trip_results);


    }


    function getCurrentTrip() {
        return current_trip_results;
    }

    function deleteTrip(trip, index) {
        // upcomingTrips.push(value);
        upcomingTrips[index] = null;
        // upcomingTrips.splice(index, 1);
        angular.copy(upcomingTrips, result_trips);

        // property = value; 
    }

    function completeTrip(trip, index) {

        // upcomingTrips.push(value);
        deleteTrip(trip, index);
        // upcomingTrips[index] = null;
        // angular.copy(upcomingTrips, result_trips);

        if (count == 0) {
            push(trip);
        }
        count++;

        // completedTrips.push(trip);
        // angular.copy(completedTrips, result_completed);
        // property = value; 
    }

    function push(trip, index) {
        completedTrips.push(trip);
        angular.copy(completedTrips, result_completed);

    }

    function setAttractions(value) {
        var attractions = value; //.push(value); 
        angular.copy(attractions, result_attr);
    }

    function getProperty() {
        return result_trips;
    }

    function getCompleted() {
        return result_completed;
    }

    function getAttractions() {
        return result_attr;
    }

    function setCity(city) {
        city_service[0] = city;
    }

    function getCity() {
        return city_service[0];
    }

    function setDesc(description) {
        desc = description;
    }

    function getDesc() {
        console.log('get desc log: ' + result_desc + ', ' + desc);
        return result_desc;

    }



});
