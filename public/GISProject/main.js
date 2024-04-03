// adding the modal to the map
console.log(" I am invoked ")
var modal = document.getElementById("myModal");
var inputList = []
  function createModal(data) {
    var modal = document.createElement("div");
    modal.classList.add("modal");

    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    var closeBtn = document.createElement("span");
    closeBtn.classList.add("close");  
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    modalContent.appendChild(closeBtn);

    // Create a table element and a table body
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");

    // Create labels for the table columns
    var labels = ["Pole ID", "Latitude", "Longitude", "Load Capacity", "distance"];

    // Create a table row for labels (thead)
    var labelRow = document.createElement("tr");
    for (let label of labels) {
        var th = document.createElement("th");
        th.textContent = label;
        labelRow.appendChild(th);
    }
    thead.appendChild(labelRow);
    // console.log(data)

    for (let item of data) {
      // Create a table row for each item in the data array
      var row = document.createElement("tr");
    
      // Assuming each data item is an object with key-value pairs, you can loop through the labels
      for (let label of labels) {
        var cell = document.createElement("td");
        if (label === "distance") { // Check if the label is "Distance"
          console.log("i am running")
          cell.innerText = typeof item[label] === "number" ? parseFloat(item[label]) : "N/A";
          console.log(item[label])
        } else {
          cell.innerText = item[label] !== undefined ? item[label] : "N/A";
        }
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    
    }
    

    

    // Append the thead and tbody to the table, and the table to the modal content
    table.appendChild(thead);
    table.appendChild(tbody);
    modalContent.appendChild(table);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    modal.style.display = "block";
  }



document.addEventListener("keydown", function(event) {
  // Check if the "M" key is pressed (you can modify this condition as needed)
  if (event.key === "m") {
    console.log("i am invoked")
    
    createModal(inputList)
  }
});


mapView = new ol.View({
  center: ol.proj.fromLonLat([77.11105431261787, 28.67540484549437]),
  zoom: 16,
});

var map = new ol.Map({
  target: "map",
  view: mapView,
  controls:[]
});


var noneTile = new ol.layer.Tile({
    title:'None',
    type: 'base',
    visible:false,

})
var osmTile = new ol.layer.Tile({
  title: "Background",  
  visible: true,
  type: 'base',
  source: new ol.source.OSM(),
});

// map.addLayer(osmTile);

var baseGroup=new ol.layer.Group({
  title:'Base Maps',
  fold: true,
  layers: [osmTile, noneTile]
});

map.addLayer(baseGroup);

var IndiaStTile = new ol.layer.Tile({
  title: "Paschim Vihar Buildings",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/os/wms",
    params: { LAYERS: "os:osbuildings", TILED: true },
    serverType: "geoserver",
    visible: true,
  }),
});
 
//map.addLayer(IndiaStTile);

var DelhiTile = new ol.layer.Tile({
  title: "Paschim Vihar Roads",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/os/wms",
    params: { LAYERS: "os:osroads", TILED: true },
    serverType: "geoserver",
    visible: true,
  }),
});

//map.addLayer(DelhiTile);


var OverlayGroup=new ol.layer.Group({
   title: "Overlays",
   fold:true,
   layers:[DelhiTile,IndiaStTile]

});

map.addLayer(OverlayGroup);

var mousePosition = new ol.control.MousePosition({
  className: "mousePosition",
  projection: "EPSG:4326",
  coordinateFormat: function (coordinate) {
    return ol.coordinate.format(coordinate, "{y} , {x}", 6);
  },
});

map.addControl(mousePosition);

var scaleControl = new ol.control.ScaleLine({
  className: "scaleControl",
  bar: true,
  text: true,
});
map.addControl(scaleControl);

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

map.addOverlay(popup);

closer.onclick = function () {
  popup.setPosition(undefined);
  closer.blur();
  return false;
};

var homeButton=document.createElement("button");
homeButton.innerHTML = '<img src ="resources/image/61972.png"; alt="" style="width:20px; filter:brightness(0) invert(1);vertical-align:middle"></img>';
homeButton.className='myButton';

var homeElement = document.createElement("div");
homeElement.className='homeButtonDiv';
homeElement.appendChild(homeButton);

var homeControl=new ol.control.Control({
  element: homeElement
})

homeButton.addEventListener("click", ()=>{
  location.href = "index.html";
})
map.addControl(homeControl);

 var fsButton = document.createElement("button");
 fsButton.innerHTML='<img src ="resources/image/3.png"; alt="" style="width:20px;height:20px; filter:brightness(0) invert(1);vertical-align:middle"></img>';
 fsButton.className='myButton';

var fsElement = document.createElement("div");
fsElement.className = "fsButtonDiv";
fsElement.appendChild(fsButton);

var fsControl=new ol.control.Control({
  element: fsElement
})

fsButton.addEventListener("click", () => {
   var mapEle=document.getElementById("map");
   if(mapEle.requestFullscreen){
    mapEle.requestFullscreen();
   } else if(mapEle.msRequestFullscreen){
    mapEle.msRequestFullscreen();
   }
   else if(mapEle.mozRequestFullscreen){
    mapEle.mozRequestFullscreen();
   }
   else if(mapEle.webkitRequestFullscreen){
    mapEle.webkitRequestFullscreen(); 
  }
})

map.addControl(fsControl);


// zoomin start
var zoomInInteraction = new ol.interaction.DragBox();

zoomInInteraction.on('boxend',function() {
  var zoomInExtent=zoomInInteraction.getGeometry().getExtent();
  map.getView().fit(zoomInExtent);
});

var ziButton = document.createElement("button");
ziButton.innerHTML='<img src ="resources/image/4.png"; alt="" style="width:18px;height:18px;transform:rotate(270deg); filter:brightness(0) invert(1);vertical-align:middle"></img>';
ziButton.className='myButton';
ziButton.id='ziButton';

var ziElement = document.createElement('div');
ziElement.className='ziButtonDiv';
ziElement.appendChild(ziButton);

var ziControl=new ol.control.Control({
  element: ziElement
})
var zoomInFlag = false;
ziButton.addEventListener("click",()=>{
  ziButton.classList.toggle('clicked');
  zoomInFlag = !zoomInFlag;
  if(zoomInFlag){
    document.getElementById('map').style.cursor='zoom-in';
    map.addInteraction(zoomInInteraction);
  }else{
    map.removeInteraction(zoomInInteraction);
    document.getElementById('map').style.cursor='default';
  }
})

map.addControl(ziControl);

//end zoomin

//zoom out

var zoomOutInteraction = new ol.interaction.DragBox();

zoomOutInteraction.on('boxend',function() {
  var zoomOutExtent=zoomOutInteraction.getGeometry().getExtent();
  map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));

  mapView.setZoom(mapView.getZoom()-1)
});

var zoButton = document.createElement("button");
zoButton.innerHTML='<img src ="resources/image/5.png"; alt="" style="width:18px;height:18px;transform:rotate(270deg); filter:brightness(0) invert(1);vertical-align:middle"></img>';
zoButton.className='myButton';
zoButton.id='zoButton';

var zoElement = document.createElement('div');
zoElement.className='ziButtonDiv';
zoElement.appendChild(zoButton);

var zoControl=new ol.control.Control({
  element: zoElement
})
var zoomOutFlag = false;
zoButton.addEventListener("click",()=>{
  zoButton.classList.toggle('clicked');
  zoomOutFlag = !zoomOutFlag;
  if(zoomOutFlag){
    document.getElementById('map').style.cursor='zoom-out';
    map.addInteraction(zoomOutInteraction);
  }else{
    map.removeInteraction(zoomOutInteraction);
    document.getElementById('map').style.cursor='default';
  }
})

map.addControl(zoControl);

//zoomout end

var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML='<img src ="resources/image/2.png"; alt="" style="width:20px;height:20px; filter:brightness(0) invert(1);vertical-align:middle"></img>';
featureInfoButton.className='myButton';
featureInfoButton.id='featureInfoButton';

var featureInfoElement = document.createElement('div');
featureInfoElement.className='featureInfoDiv';
featureInfoElement.appendChild(featureInfoButton);

var featureInfoControl=new ol.control.Control({
  element: featureInfoElement
})

var featureInfoFlag=false;
featureInfoButton.addEventListener('click', ()=>{
  featureInfoButton.classList.toggle('clicked');
  featureInfoFlag=!featureInfoFlag;
})

map.addControl(featureInfoControl);

map.on('singleclick', function (evt) {
   if(featureInfoFlag){
    content.innerHTML = '';
    var resolution = mapView.getResolution();
    var url = IndiaStTile.getSource().getFeatureInfoUrl(
      evt.coordinate,
      resolution,
      "EPSG:3857",
      {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'osm_id'
      });
  
      if (url) {
        $.getJSON(url, function (data) {
          var feature = data.features[0];
          var props = feature.properties;
          content.innerHTML =
            "<h3> fid: </h3> <p>" +
            props.fid +
            "</p> <br> <h3> osm_id : </h3> <p>" +
            props.osm_id +
            "</p>";
          popup.setPosition(evt.coordinate);
        })
      } else {
        popup.setPosition(undefined);
      }
   }
  });

var lengthButton = document.createElement('button');
lengthButton.innerHTML='<img src ="resources/image/7.png" alt="" style="width:17px;height:17 px; filter:brightness(0) invert(1);vertical-align:middle"></img>';
lengthButton.className ='myButton';
lengthButton.id='lengthButton';

var lengthElement=document.createElement('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendChild(lengthButton);

var lengthControl=new ol.control.Control({
  element: lengthElement
});

var lengthFlag=false;
lengthButton.addEventListener('click', () => {
  //disableOtherInteraction('lengthButton');
  lengthButton.classList.toggle('clicked');
  lengthFlag=!lengthFlag;
  document.getElementById('map').style.cursor='default';
  if (lengthFlag){
    map.removeInteraction(draw);
    addInteraction('LineString');
  }
  else{
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName('ol-tooltip ol-tooltip-static');
    while(elements.length>0) elements[0].remove();
  }
});

map.addControl(lengthControl);

var areaButton = document.createElement('button');
areaButton.innerHTML='<img src ="resources/image/8.png" alt="" style="width:17px;height:17 px; filter:brightness(0) invert(1);vertical-align:middle"></img>';
areaButton.className ='myButton';
areaButton.id='areaButton';

var areaElement=document.createElement('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendChild(areaButton);

var areaControl=new ol.control.Control({
  element: areaElement
});

var areaFlag=false;
areaButton.addEventListener('click', () => {
  //disableOtherInteraction('areaButton');
  areaButton.classList.toggle('clicked');
  areaFlag=!areaFlag;
  document.getElementById('map').style.cursor='default';
  if (areaFlag){
    map.removeInteraction(draw);
    addInteraction('Polygon');
  }
  else{
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName('ol-tooltip ol-tooltip-static');
    while(elements.length>0)elements[0].remove();
  }
});

map.addControl(areaControl);
/**
 * @type {string}
 */
var continuePolygonMsg='click to continue Polygon, Double Click to complete';
/**
 *@type {string} 
 */
 var continueLineMsg='click to continue line, Double Click to complete line';

 var draw;

 var source=new ol.source.Vector({wrapX: false});
 var vector=new ol.layer.Vector({
  source: source,
  style:new ol.style.Style({
      fill:new ol.style.Fill({
        color:'rgba(255,255,255,0.2)'
      }),
      stroke:new ol.style.Stroke({
         color:'#ffcc33',
         width:2,
      }),
      image: new ol.style.Circle({
         radius:7,
         fill:new ol.style.Fill({
          color:'#ffcc33',
         }),
      }),
   }),
 });

 map.addLayer(vector);

 function addInteraction(intType){

  draw=new ol.interaction.Draw({
    source: source,
    type: intType,
    style:new ol.style.Style({
      fill:new ol.style.Fill({
        color:'rgba(200,200,200,0.6)',
      }),
      stroke:new ol.style.Stroke({
        color:'rgba(0,0,0,0.5)',
        lineDash:[10,10],
        width:2.
      }),
      image:new ol.style.Circle({
        radius:5,
        stroke:new ol.style.Stroke({
          color:'rgba(0,0,0,0.7)',
        }),
        fill: new ol.style.Fill({
          color:'rgba(255,255,255,0.2)',
        }),
      }),
    }),
  });
  map.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

 /**
  * Currently drawn feature.
  * @type {import("../src/ol/Feature.js").default}
  */
var sketch;

/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */

var pointerMoveHandler = function(evt) {
  if(evt.dragging){
    return;
  }
  /**@type {string} */
  var helpMsg='click to start drawing';

  if(sketch){
    var geom =sketch.getGeometry();    
  }
};

map.on('pointermove', pointerMoveHandler);

draw.on('drawstart',function(evt){
  sketch=evt.feature;

  /**@type {import("../src/ol/coordinate.js").Coordinate|undefined} */
  var tooltipCoord = evt.coordinate;

  sketch.getGeometry().on('change',function(evt){
    var geom = evt.target;
    var output;
    if(geom instanceof ol.geom.Polygon){
      output = formatArea(geom);
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if(geom instanceof ol.geom.LineString){
      output = formatLength(geom);
      tooltipCoord=geom.getLastCoordinate();
    }
    measureTooltipElement.innerHTML=output;
    measureTooltip.setPosition(tooltipCoord);
  });
});

draw.on('drawend', function(){
  measureTooltipElement.className='ol-tooltip ol-tooltip-static';
  measureTooltip.setOffset([0,-7]);
  sketch=null;
  measureTooltipElement=null;
  createMeasureTooltip();
});
} 

/**
 * @type {HTMLElement}
 */
var helpTooltipElement;

/**
 * @type  {Overlay}
 */
var helpTooltip;

function createHelpTooltip(){
  if(helpTooltipElement){
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement=document.createElement('div');
  helpTooltipElement.className='ol-tooltip hidden';
  helpTooltip=new ol.Overlay({
    element: helpTooltipElement,
    offset:[15,0],
    positioning:'center-left',
  });
  map.addOverlay(helpTooltip);
}
map.getViewport().addEventListener('mouseout', function(){
  helpTooltipElement.classList.add('hidden');
});


/**
 * @type {HTMLElement}
 */
var measureTooltipElement;

/**
 * @type {Overlay}  
 */
var measureTooltip;

function createMeasureTooltip(){
  if(measureTooltipElement){
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement=document.createElement('div');
  measureTooltipElement.className='ol-tooltip ol-tooltip-measure';
  measureTooltip=new ol.Overlay({
    element: measureTooltipElement,
    offset:[0,-15],
    positioning:'bottom-center',
  });
  map.addOverlay(measureTooltip);
}

/**
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */

var formatDistance=function(line){
  
  
};

/**
 * @param {Polygon} polygon The line.
 * @return {string} The formatted area.
 */

var formatArea=function(polygon){
  var area=ol.sphere.getArea(polygon);
  var output;
  if(area>10000){
    output=Math.round((area/1000000)*100)/100 + ' ' + 'km<sup>2</sup>';
  }else{
    output=Math.round(area*100)/100 + ' ' + 'm<sup>2</sup>';
  }
  return output;
};




  var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
 startActive: false,
 groupSelectStyle:'children'
 });
 
 map.addControl(layerSwitcher);
 
 

 function logCoordinates(evt) {
  var coordinates = evt.coordinate;
  var lonLat = ol.proj.toLonLat(coordinates);
  console.log("Clicked at Longitude:", lonLat[0], "Latitude:", lonLat[1]);
  var data = {
    latitude: lonLat[1], // Swap latitude and longitude as per the MongoDB query
    longitude: lonLat[0], // Swap latitude and longitude as per the MongoDB query
  };

  fetch('/save-coordinates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      inputList = result
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
}
map.on('click', logCoordinates)


var marker = new ol.Feature({
  geometry: ol.geom.Point([77.1089,28,6768]),
  type:'poles',
  name:'test'
});

var vectorLayer = new ol.layer.Vector({
  title:"POI",
  source:new ol.source.Vector({
    features: [marker]
  })
})

map.addLayer(vectorLayer);




 
