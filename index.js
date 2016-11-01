var mymap = L.map('map').setView([46.524, 6.582], 15);

// Limiter la carte au campus de l'UNIL:
mymap.setMaxBounds([[46.511, 6.554], [46.541, 6.606]]);
mymap.setMinZoom(14);

// Définir les différentes couches de base:
var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
var osmNoirBlanc = L.tileLayer(
  'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', { 
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }
);
var mapboxStreets = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2thaXNlciIsImEiOiJaS2cxcmVzIn0.IVsFCwYP0dpDlCdpsAGEcQ', {
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors'
  }
);
var esriImagery = L.tileLayer(
  'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/t\ile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="http://www.esri.com">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
);

// Ajouter la couche de base par défaut à la carte.
osmNoirBlanc.addTo(mymap);


// Créer les icônes pour nos marqueurs
var icones = {};

icones['rouge'] = L.icon({
  iconUrl: 'https://github.com/christiankaiser/map-marker-icons/raw/master/icons/plain-red.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

icones['bleu'] = L.icon({
  iconUrl: 'https://github.com/christiankaiser/map-marker-icons/raw/master/icons/plain-blue.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

icones['vert'] = L.icon({
  iconUrl: 'https://github.com/christiankaiser/map-marker-icons/raw/master/icons/plain-green.png',
  iconSize: [28, 41],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, -40]
});

 
// Créer les marqueurs et les afficher sur la carte (avec une info-bulle)
var batiments = {
  GEO: { nom: "Géopolis", icone: "rouge", descr: "...", coords: [46.52654, 6.57967] },
  ANT: { nom: "Anthropole", icone: "bleu", descr: "...", coords: [46.52368, 6.58449] },
  MAX: { nom: "Amphimax", icone: "bleu", descr: "...", coords: [46.52134, 6.57416] },
  POL: { nom: "Amphipole", icone: "", descr: "...", coords: [46.52158, 6.57558] }
};

for (var k in batiments){
  var bati = batiments[k];
  var iconeMarqueur = icones['vert'];
  if (bati.icone == 'rouge' || bati.icone == 'bleu') {
    iconeMarqueur = icones[bati.icone];
  }
  var marqueur = L.marker(bati.coords, {icon: iconeMarqueur}).addTo(mymap);
  marqueur.batiment = bati;
  marqueur.on('click', function(e){
    var bati = e.target.batiment;
    var html = '<table cellpadding="3">';
    html += '     <tr>';
    html += '       <td><b>Bâtiment:</b></td>';
    html += '       <td>' + bati.nom + '</td>';
    html += '      </tr>';
    html += '      <tr>';
    html += '        <td><b>Description:</b></td>';
    html += '        <td>' + bati.descr + '</td>';
    html += '      </tr>';
    html += '    </table>';
    $('.infobox').html(html);
  });
}


// Créer les boutons pour changer la couche de base
var baseLayers = {
  "OpenStreetMap": osmLayer,
  "OpenStreetMap noir/blanc": osmNoirBlanc,
  "Mapbox Streets": mapboxStreets,
  "Photos aériennes ESRI": esriImagery
};
var overlays = {};
L.control.layers(baseLayers, overlays).addTo(mymap);


for (var i in cheminsUnil.features) {
  var feature = cheminsUnil.features[i];
  var cheminStyle = {
    "color": feature.properties.color,
  	"weight": 3,
  	"opacity": 0.7
  };
  L.geoJSON(feature, cheminStyle).addTo(mymap);
}


mymap.on('mousemove', function(e){
  var coord = e.latlng;
  $('#coordonnees').html('Coordonnées: ' + coord.lat.toFixed(5) +' / '+ coord.lng.toFixed(5));
});


$('.recherche select').on('change', function(e){
  var id_batiment = $('.recherche select').val();
  if (id_batiment == "") return;
  var bati = batiments[id_batiment];
  mymap.panTo(bati.coords, {animate: true});
});


