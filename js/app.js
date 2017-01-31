"use strict";
function load(){
  ko.applyBindings(new ViewModel());
}

function ViewModel(){
  var current = this;
  this.placeentered = ko.observable("");
  this.locationList = ko.observableArray([]);
  map = new google.maps.Map(document.getElementById('map'),
  {
    zoom: 13,
    center:
    {
      lat: 37.928800,
      lng: -122.038004
    }
  });

  var Placename = function(data){
    this.stringURL = "";
    this.currentStreet = "";
    this.currentCity = "";
    var current = this;
    this.plname = data.plname;
    this.lon = data.lon;
    this.lat = data.lat;
    this.visible = ko.observable(true);
    var fsURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.lon + '&client_id=' + cid + '&client_secret=' + csid + '&v=20161016' + '&query=' + this.plname;
    $.getJSON(fsURL).done(function(data)
    {
      var fsresponse = data.response.venues[0];
      current.stringURL = fsresponse.url;
      if (typeof current.stringURL === "undefined")
      {
        current.stringURL = "";
        current.currentStreet = "";
        current.currentCity = "";
      }
      current.currentStreet = fsresponse.location.formattedAddress[0];
      current.currentCity = fsresponse.location.formattedAddress[1];
    })
    .fail(function()
    {
      alert('There was an error with the Foursquare API call. Please refresh the page.');
    });
    current.contentString = '<div class="info-window-content"><div class="title"><b>' + data.plname + "</b></div>" + '<div class="content">' + current.currentStreet + "</div>" + '<div class="content">' + current.currentCity + "</div>";
    current.infoWindow = new google.maps.InfoWindow(
    {
      content: current.contentString
    });
    current.marker = new google.maps.Marker(
    {
      position: new google.maps.LatLng(data.lat, data.lon),
      map: map,
    });
    current.showMarker = ko.computed(function()
    {
      if (current.visible() === true)
      {
        current.marker.setMap(map);
      }
      else
      {
        current.marker.setMap(null);
      }
      return true;
    }, current);
    

      
     
    this.marker.addListener('click',function()
    {
      current.contentString = '<div class="info-window-content"><div class="title"><b>' + data.plname + "</b></div>" + '<div class="content">' + current.currentStreet + "</div>" + '<div class="content">' + current.currentCity + "</div>";
      current.infoWindow.setContent(current.contentString);
      current.infoWindow.open(map, this);
      current.marker.setAnimation(google.maps.Animation.BOUNCE);
    });
    this.appear = function(place)
    {
      google.maps.event.trigger(current.marker, 'click');
    };
  };
  favloc.forEach(function(locationItem)
  {
    current.locationList.push(new Placename(locationItem));
  });
  this.filteredList = ko.computed(function()
  {
    var filterentry = current.placeentered().toLowerCase();
    if (filterentry === null)
    {
      current.locationList().forEach(function(locationItem)
      {
        locationItem.visible(true);
      });
      return current.locationList();
    }
    else
    {
      return ko.utils.arrayFilter(current.locationList(), function(locationItem)
      {
        var string = locationItem.plname.toLowerCase();
        var result = (string.search(filterentry) >= null);
        locationItem.visible(result);
        return result;
      });
    }
  }, current.locationList);
  this.mapElem = document.getElementById('map');
  this.mapElem.style.height = window.innerHeight - 100;
}