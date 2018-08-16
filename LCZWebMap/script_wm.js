// Setting source for geolocation marker

var markerSource = new ol.source.Vector ();

// Setting source for the GeoJSON code imported from another JS file

var polygonSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
});

// ---------------------------------------- !!! - STYLE START - !!! -----------------------------------------


// Creating default style in case some feature wouldn't
// had attribute

var defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [250,250,250,1]
    }),
    stroke: new ol.style.Stroke({
      color: [220,220,220,1],
      width: 1
    })
});


// Setting color for categories based on LCZ influence on temperature

var level0 = [255, 0, 0, 0];  // Not urban climate zone - so no coloring
var level1 = [51, 204, 51, 0.5]; // Green color - little to no effect
var level2 = [153, 255, 51, 0.5];
var level3 = [255, 255, 0, 0.5]; // Yellow color - medium effect
var level4 = [255, 128, 0, 0.5];
var level5 = [255, 0, 0, 0.5]; // Red color - high effect


var heatDevCat = {
    
    'level0': level0,
    'level1': level1,
    'level2': level2,
    'level3': level3,
    'level4': level4,
    'level5': level5
};



// Setting RGBA color codes as variables for different LCZ attribute styling
// Not all of the codes used, but it is defined for later usage/ development

var lcz_2_col = [170, 0, 0, 0.5];   // LCZ 2 - Comopact mid-rise
var lcz_3_col = [255, 0, 0, 0.5];   // LCZ 3 - Comopact low-rise
var lcz_5_col = [170, 85, 255, 0.5];   // LCZ 5 - Open mid-rise
var lcz_6_col = [255, 255, 0, 0.5];   // LCZ 6 - Open low-rise
var lcz_7_col = [255, 170, 255, 0.5];   // LCZ 7 - Lightweight low-rise
var lcz_8_col = [108, 108, 108, 0.5];   // LCZ 8 - Large low-rise
var lcz_9_col = [255, 255, 127, 0.5];   // LCZ 9 - Sparsely built
var lcz_11_col = [0, 85, 0, 0.5];   // LCZ A - Dense trees
var lcz_12_col = [0, 170, 0, 0.5];   // LCZ B - Scattered trees
var lcz_13_col = [0, 255, 0, 0.5];   // LCZ C - Bush, scrub
var lcz_14_col = [170, 255, 0, 0.5];   // LCZ D - Low plants
var lcz_15_col = [170, 170, 127, 0.5];   // LCZ E - Bare rock /paved
var lcz_16_col = [170, 85, 0, 0.5];   // LCZ F - Bare soil /sand
var lcz_17_col = [0, 0, 127, 0.5];   // LCZ G - Water

// LCZ colors and attribute names paired in dictionary variable

var lczColorSet = {
    'LCZ 2 - Compact mid-rise':lcz_2_col,
    'LCZ 3 - Compact low-rise':lcz_3_col,
    'LCZ 5 - Open mid-rise':lcz_5_col,
    'LCZ 6 - Open low-rise':lcz_6_col,
    'LCZ 8 - Large low-rise':lcz_8_col,
    'LCZ 9 - Sparsely built':lcz_9_col,
    'LCZ A - Dense trees':lcz_11_col,
    'LCZ B - Scattered trees':lcz_12_col,
    'LCZ D - Low plants':lcz_14_col,
    'LCZ G - Water':lcz_17_col
    
};



// Creating a cache for styles to make the whole thing faster

var styleCache = {};


// Creating a function for LCZ based coloring which will decide the styling
// Used as value of 'style' key later when creating GeoJSON based vector layer

function lczStyleFunction(feature){
    
    var zone = feature.get('Zone');     // gets LCZ type
    
    if (!zone || !lczColorSet[zone]) {  // if LCZ type is not given, use default style
        
        return [defaultStyle];          
        
    }
    
    if (!styleCache[zone]){
        
        styleCache[zone] = new ol.style.Style({  // if LCZ type exists it'll be read from lczColorSet dictionary based on zone attribute
            fill: new ol.style.Fill({
                color: lczColorSet[zone]
            }),
            stroke: defaultStyle.stroke
        });
        
    }
    
    // Now the styleCache contains the style and can be returned by function
    return [styleCache[zone]];
    
    
};

function heatDevStyleFunction(feature){
    
    var bias = feature.get('mean_bias');
    
    if(bias == null){
        
        bias = 'level0';
    }
    
    else if(bias >= 0 && bias <= 0.2){
        
        bias = 'level1';    
    }
    
    else if(bias > 0.2 && bias <= 0.4){
        
        bias = 'level2';    
    }
    
    else if(bias > 0.4 && bias <= 0.6){
        
        bias = 'level3';    
    }
    
    else if(bias > 0.6 && bias <= 0.8){
        
        bias = 'level4';    
    }
    
    else if(bias > 0.8){
        
        bias = 'level5';    
    }
    
    
    
    
    if (!bias || !heatDevCat[bias]) {  // if value is not given, use default style
        
        return [defaultStyle];
        
    }
    
    
    if (!styleCache[bias]){
        
        styleCache[bias] = new ol.style.Style({  // if bias value exists it'll be read from heatDevCat dictionary based on bias attribute
            fill: new ol.style.Fill({
                color: heatDevCat[bias]
            }),
            stroke: defaultStyle.stroke
        });
        
    }
    
    // Now the styleCache contains the style and can be returned by function
    return [styleCache[bias]];
    
};


// defining a variable that refers to one of the styles - later this variables value will be changed by clicking on the style switch button

var actualStyle = lczStyleFunction;

// ---------------------------------------- !!! - STYLE END - !!! -------------------------------------------



function init () {
    
    // Showing current position based on wheter user accepts it
    
    navigator.geolocation.getCurrentPosition(drawCurrentPosition);

    function drawCurrentPosition(currentPosition) {
            var currentLat = currentPosition.coords.latitude;
            var currentLon = currentPosition.coords.longitude;
            var currentPosition = ol.proj.transform ([currentLon, currentLat], 'EPSG:4326', 'EPSG:3857');
            drawMarker(currentPosition);
    }
    
    
   
    
    // Defining variable as starting position - later used in 'map' variable, as value of 'center' key
    
    var startingPosition = ol.proj.transform ([20.1460587, 46.2522134], 'EPSG:4326', 'EPSG:3857');

    
    
    
    
    

// ---------- Defining the geolocation marker and GeoJSON based vector layers ----------

    var markerLayer = new ol.layer.Vector ({
        title: 'Markers',
        visible: true,
        source: markerSource
    });
    

    var vector = new ol.layer.Vector({
             title: 'Polygons',
             visible: true,
      source: polygonSource,
      style: actualStyle      // using the styling function created above: heatDevStyleFunction  -- lczStyleFunction
    });
	
	vector.setZIndex(0);
    markerLayer.setZIndex(1);	

    
// ------------ Defining the basemaps ------------

    var bingAPIKey = "ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp";
    
    // OSM basemap
    
    var osm = new ol.layer.Tile({
        title: 'OSM',
        type: 'base',
        visible: true,
        source: new ol.source.OSM()
    });

    // Bing Aerial basemap
    
    var bingMapsAerial = new ol.layer.Tile({
        title: 'Aerial map',
        type: 'base',
        visible: false,
        source: new ol.source.BingMaps({
            culture:'hu',
            key: bingAPIKey,
            imagerySet:'Aerial'
        })
    });

    // Bing Roads basemap

    var bingMapsRoad = new ol.layer.Tile({
        title: 'Road map',
        type: 'base',
        visible: false,
        source: new ol.source.BingMaps({
            culture:'hu',
            key: bingAPIKey,
            imagerySet:'Road'
        })
    });
    
    
    
    
    
    // Create basic map
    
    // Creating 2 layer groups - basemaps (OSM and Bing Maps) and overlays (marker and GeoJSON layer)
    
    var map = new ol.Map({
        layers: [
            new ol.layer.Group({

                'title': 'Base maps',

                layers: [

                    osm,
                    bingMapsAerial,
                    bingMapsRoad

                ]
            }),

            new ol.layer.Group({

                'title': 'Overlays',

                layers: [
                    
                    markerLayer,
                    vector

                ]
            })

        ],

        // Basic control functions - zoom in/out
        
        controls: ol.control.defaults({
            attributionOptions:({
                    collapsible: true
            })
        }),

        // Setting the 'map' HTML div element as target of variable
        
        target: 'map',

        // Setting the city of Szeged as starting location
        
        view: new ol.View({
            center: startingPosition,
            zoom: 10
        })
    });


    //  Creating Layer Switcher variable and add to the map as a new control function
    
    var layerSwitcher = new ol.control.LayerSwitcher ({
        tipLabel: 'Layers'
    });
    map.addControl (layerSwitcher);
    
    
    
    // Adding a scale line to the map so the viewers can be more 'in the picture' when its coming to distances
    
    var scaleLine = new ol.control.ScaleLine();
    
    map.addControl (scaleLine);
    
    
    // Also adding a zoom slider to be able to zoom more finely
    
    var zoomSlider = new ol.control.ZoomSlider();
    
    map.addControl(zoomSlider);



    // Creating variable to access the div 'attributes', enables further to show the attribute information in the div
    
    var infowin = document.getElementById('attributes');	

    // Create a select interaction and add it to the map - available for layer 'vector' (GeoJSON layer)
    
    var select = new ol.interaction.Select({
      layers: [vector]
    });
    map.addInteraction(select);
    

    // Use the features Collection to detect when a feature is selected,
    // the collection will emit the add event
    
    var selectedFeatures = select.getFeatures();
    
    selectedFeatures.on('add', function(event) {
        
        // the event.target.item enables accessing the feature properties of the selected vector layer (GeoJSON)
        var feature = event.target.item(0);
        
        // Creating variables which contain the properties
        
        var lcz = feature.get('Zone');
        var mean = feature.get('ta');
        var min = feature.get('tmin');
        var max = feature.get('tmax');
        var lczMean = feature.get('LCZ_t_mean');
        var lczMin = feature.get('LCZ_t_min');
        var lczMax = feature.get('LCZ_t_max');
        
        // innerHTML translates the variable into a string and adds it to the div 'attributes', also adding a description
        
        infowin.innerHTML = '<h1>Climate Zone Data:</h1>'+ '<hr><br/><br/>' +
                            'Climate zone ID: ' + lcz + '<br/><hr><br/>' +
                            'Rural / Urban mean temperature (°C): ' + mean + ' / ' + lczMean + '<br/><hr><br/>' +
                            'Rural / Urban min temperature (°C): ' + min + ' / ' + lczMin + '<br/><hr><br/>' +
                            'Rural / Urban max temperature (°C): ' + max + ' / ' + lczMax;
        
    });

    // closing function init()
    
}

function drawMarker (posMarker) {
    var marker = new ol.Feature ({
        geometry: new ol.geom.Point (posMarker)
    });

    var markerStyle = new ol.style.Style ({
        image: new ol.style.Icon (({
            scale: 0.1,
            src: 'marker.png'
        }))
    });
    marker.setStyle (markerStyle);

    markerSource.addFeature (marker);
}


/*

function styleSwitcher(){
        
        if (actualStyle == lczStyleFunction){
            
            actualStyle = heatDevStyleFunction;
            
        }
        
        else if (actualStyle == heatDevStyleFunction){
            
            actualStyle = lczStyleFunction;
            
        }
        
        init();
        
    }
    */
