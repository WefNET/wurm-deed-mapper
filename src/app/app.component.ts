import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from "@angular/common/http";

declare var ol: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  mapJson;
  map: any;
  tileLayer: any;

  constructor(private http: HttpClient) {
    this.getParseMap();
  }

  getParseMap(): any {
    this.http.get('assets/AE.json')
      .subscribe((data) => {
        this.renderMapData(data);
      });
  }

  groudColor(id: string): string {
    switch (id) {
      case "gr":
        return "rgba(46, 204, 56, 0.5)"
      case "lw":
        return "rgba(46, 204, 56, 0.5)"
      case "pd":
        return "rgba(254,235,206, 0.5)"
      case "ro":
        return "rgba(168,168,168, 0.5)"
      case "di":
        return "rgba(138,68,19, 0.5)"
      case "csr":
        return "rgba(111,127,142, 0.5)"
      case "cs":
        return "rgba(111,127,142, 0.5)"
      case "gv":
        return "rgba(210,210,210, 0.5)"
      case "eg":
        return "rgba(46,204,56, 0.5)"
      case "sa":
        return "rgba(243,162,98, 0.5)"
      default:
        return "rgba(8,191,252, 0.5)"
    }
  }

  renderMapData(json: any) {
    console.log("Map data:", json);

    let mapHeight: number = parseInt(json.map.height) * 16;
    let mapwidth: number = parseInt(json.map.width) * 16;

    let negExtentY = 0 - mapHeight;

    // oh shit the real map code kinda starts here!
    var mapExtent = [0, negExtentY, mapwidth, 0];
    var mapMinZoom = 5;
    var mapMaxZoom = 9;
    var mapMaxResolution = 1.00000000;
    var tileExtent = [0, negExtentY, mapwidth, 0];

    var mapResolutions = [];

    for (var z = 0; z <= mapMaxZoom; z++) {
      mapResolutions.push(Math.pow(2, mapMaxZoom - z) * mapMaxResolution);
    }

    var mapTileGrid = new ol.tilegrid.TileGrid({
      extent: tileExtent,
      minZoom: mapMinZoom,
      resolutions: mapResolutions
    });

    var controls = [
      new ol.control.MousePosition({
        undefinedHTML: 'outside',
        coordinateFormat: function (coordinate) {
          return ol.coordinate.format(coordinate, '{x}, {y}', 0);
        }
      }),
      new ol.control.Zoom(),
      new ol.control.FullScreen(),
    ];

    var iconInfo = [];
  
    let s: number = 16

    while (s > 0.004) {
      iconInfo.push({
        reso: s,
        radius: 11 / s
      });

      s = s / 2;
    } 
    
    var iconCount = iconInfo.length;
    var icons = new Array(iconCount);

    for (let i = 0; i < iconCount; ++i) {
      var info = iconInfo[i];
      icons[i] = {
        style: new ol.style.RegularShape({
          points: 4,
          radius: info.radius,
          angle: Math.PI / 4,
          fill: new ol.style.Fill({
            color: "rgba(46, 204, 56, 0.5)"
          }),
        }),
        reso: info.reso
      };
    }

    console.log("Icons", icons);

    var tileSrc = new ol.source.Vector();

    // main interator
    for (let tile of json.map.tile) {
      let x: number = parseInt(tile.x) * 16;
      let y: number = parseInt(tile.y) * 16;

      var tileFeature = new ol.Feature({
        geometry: new ol.geom.Point([x, y]),
        // geometry: new ol.geom.Circle([x, y], 8),
        ground: tile.ground.id,
        color: this.groudColor(tile.ground.id)
      });

      tileSrc.addFeature(tileFeature);

      // level stuff
      let levels: any[] = tile.level;

      if (levels.length > 2) {
        // console.log("Levels", levels);
      }
      else {
        // console.log("Levels", levels);
      }
    }

    var tileStyleFunction = function (feature, resolution) {
      // console.log("Reso", resolution);
      var type = feature.get('ground');
      var color = feature.get('color');

      // http://jsfiddle.net/vkm2rg46/3/
      if (type == "gr" || type == "lw") {
        return [
          new ol.style.Style({
            image: icons.find(x => x.reso == resolution).style
          })
        ]
      } else {
        return [
          new ol.style.Style({
            image: new ol.style.RegularShape({
              points: 4,
              radius: 11 / resolution,
              angle: Math.PI / 4,
              fill: new ol.style.Fill({
                color: color
              }),
            })
          })
        ]
      }

      // Circle
      // return [
      //   new ol.style.Style({

      //     fill: new ol.style.Fill({
      //       color: color
      //     }),
      //   })
      // ]
    };

    this.tileLayer = new ol.layer.Vector({
      source: tileSrc,
      name: "farts",
      style: tileStyleFunction,
      renderMode: 'image'
    });

    this.map = new ol.Map({
      layers: [
        this.tileLayer
      ],
      target: 'map',
      renderer: 'webgl',
      controls: controls,
      view: new ol.View({
        center: [mapwidth / 2, mapHeight / 2],
        zoom: 5,
        minZoom: 5,
        maxZoom: 9,
        maxResolution: mapTileGrid.getResolution(mapMinZoom)
      })
    });

    this.map.on('click', function (evt) {
      // displayFeatureInfo(evt.pixel);

      var feature = evt.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        return feature;
      });

      var info = document.getElementById('info');
      if (feature) {
        info.innerHTML = 'Ground ID : ' + feature.get('ground');
      } else {
        info.innerHTML = '&nbsp;';
      }
    });

  }

}