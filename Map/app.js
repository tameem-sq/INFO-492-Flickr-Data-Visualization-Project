// Initialize the map with a zoom level appropriate for the entire U.S.
var map = L.map('map').setView([37.0902, -95.7129], 4);  // Centered on the US, zoom level 4

// Add tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add cluster group to hold the markers
var markers = L.markerClusterGroup();

// Function to load and display photos based on the visible bounds
function loadPhotos() {
    // Get the current map bounds
    var bounds = map.getBounds();

    // Clear existing markers
    markers.clearLayers();

    // Filter photos based on bounds (latitude and longitude)
    d3.csv("data.csv").then(function(data) {
        data.forEach(function(photo) {
            var lat = parseFloat(photo.latitude);
            var lon = parseFloat(photo.longitude);

            // Check if photo is inside the current map bounds
            if (bounds.contains([lat, lon])) {
                // Create a marker for the photo's location
                var marker = L.marker([lat, lon]);

                // Bind a popup with the thumbnail image
                marker.bindPopup("<img src='" + photo.url_s + "' alt='" + photo.title + "' width='100px'>");

                // Add the marker to the cluster group
                markers.addLayer(marker);
            }
        });

        // Add the markers to the map
        map.addLayer(markers);
    });
}

// Load photos when the map is first loaded
loadPhotos();

// Reload photos when the map is moved or zoomed
map.on('moveend', function() {
    loadPhotos();
});
