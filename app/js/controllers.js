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
        console.log("Add Function Returns City: " + city);
        $scope.city = city;
        upcomingTripService.setCity(city);

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
        // console.log("console attributes: "); 

        // console.log($scope.attractions); 
    };


    console.log("woohoo seeing my trips");

    $scope.markTripCompleted = function(trip, index) {

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
                var day_trips = [];
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
                    image: 'images/noimage.png',
                    start_date: new Date('2018', '11', '22'),
                    end_date: new Date('2018', '11', '27'),
                    attractions: city_attractions,
                    days: day_trips
                }

                console.log("the new trip info: ");
                console.log(new_trip);

                console.log("SHARED PROPERTY: " + upcomingTripService.setProperty(new_trip));

                // $scope.upcomingTrips.push(new_trip);
                console.log("New Trip Created!");
                window.location.href = "/#/mytrips";

            })

        });


    };

    $scope.submitNewDay = function(event) {

        console.log("day added: ");
        upcomingTripService.addDay();
    };
    $scope.redirect = function(index) {
        window.location.href = "/#/tripagenda";
    };

    $scope.setCurrentTripContent = function(trip, $index) {
        $scope.current_trip = trip;
        console.log("current trip content: ");
        console.log($scope.current_trip);

        upcomingTripService.setCurrentTrip(trip, $index);


    };

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

        var myEl = angular.element( document.querySelector( '#'+$scope.id ) );
        myEl.append('<div class="day-activity"><p>'+$scope.selectedPlace.name+'</p></div>'); 
        var lastChar = $scope.id.substr($scope.id.length - 1); 
        upcomingTripService.addDayToCurrentTrip(lastChar,$scope.selectedPlace.name);
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
        },
        {
            title: 'Off to Toronto',
            place: 'Toronto',
            image: 'images/torontotrip.png',
            start_date: new Date('2018', '06', '03'),
            end_date: new Date('2018', '06', '15'),
        }
    ];

    var completedTrips = [{
            title: 'Tokyo and Kyoto',
            place: 'Tokyo',
            image: 'images/japantrip.png',
            start_date: new Date('2017', '07', '02'),
            end_date: new Date('2017', '07', '11'),
        },
        {
            title: 'Heading to India!',
            place: 'Udaipur',
            image: 'images/udaipurtrip.png',
            start_date: new Date('2017', '02', '10'),
            end_date: new Date('2017', '02', '23'),
        },
        {
            title: 'Ski Trip!',
            place: 'Aspen',
            image: 'images/skitrip.png',
            start_date: new Date('2016', '11', '22'),
            end_date: new Date('2016', '11', '27'),
        },
        {
            title: 'Visiting the Capital',
            place: 'Washington DC',
            image: 'images/dctrip.jpg',
            start_date: new Date('2016', '05', '16'),
            end_date: new Date('2016', '05', '18'),
        }
    ];

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
        addDayToCurrentTrip: addDayToCurrentTrip
    };
    // setProperty: function(value){ 
    //   property = value; 
    // }

    function addDayToCurrentTrip(lastChar,place){
        console.log(current_trip.days[lastChar].day);
        // current_trip.days[lastChar].day.push(place);
        console.log(current_trip);
        console.log(current_trip.index);

        // console.log(upcomingTrips[current_trip.index].days[lastChar]);
        upcomingTrips[current_trip.index].days[lastChar].push(place);
        angular.copy(upcomingTrips, result_trips);

        angular.copy(current_trip, current_trip_results);

    }

    function setProperty(value) {
        upcomingTrips.push(value);
        angular.copy(upcomingTrips, result_trips);

        property = value;
    }

    function setCurrentTrip(trip, $index) {
        current_trip = trip;
        current_trip.index = $index;
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

    function completeTrip(trip, index) {
        // upcomingTrips.push(value);
        upcomingTrips.splice(index, 1);
        angular.copy(upcomingTrips, result_trips);

        completedTrips.push(trip);
        angular.copy(completedTrips, result_completed);
        // property = value; 
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
