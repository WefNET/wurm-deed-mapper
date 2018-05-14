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

  renderMapData(json: any) {
    console.log("Map data:", json);

    let mapHeight: number = parseInt(json.map.height);
    let mapwidth: number = parseInt(json.map.width);

    // oh shit the real map code kinda starts here!
    var mapExtent = [0, -200, 200, 0];
    var mapMinZoom = 0;
    var mapMaxZoom = 5;
    var mapMaxResolution = 1.00000000;
    var tileExtent = [0, -200, 200, 0]

    // console.log("Extent", mapExtent);

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
      // new ol.control.Attribution(),
      new ol.control.MousePosition({
        undefinedHTML: 'outside',
        coordinateFormat: function (coordinate) {
          return ol.coordinate.format(coordinate, '{x}, {y}', 0);
        }
      }),
      new ol.control.Zoom(),
      new ol.control.FullScreen(),
    ];

    var tileSrc = new ol.source.Vector();

    for (let tile of json.map.tile) {
      let x: number = parseInt(tile.x);
      let y: number = parseInt(tile.y);

      if (y == 75 && x == 75) {
        console.log("75^2 Tile Ground ID", tile.ground.id);
      }

      var tileFeature = new ol.Feature({
        // geometry: new ol.geom.Point([x, y]),
        geometry: new ol.geom.Circle([x, y], .5),
        ground: tile.ground.id
      });

      tileSrc.addFeature(tileFeature);
    }

    var tileStyleFunction = function (feature, resolution) {
      var type = feature.get('ground');

      if (type === "gr") {
        return [
          new ol.style.Style({

            fill: new ol.style.Fill({
              color: 'rgba(0, 255, 0, 1)'
            }),
          })
        ]
      }
      else if (type === "csr") {
        return [
          new ol.style.Style({

            fill: new ol.style.Fill({
              color: 'rgba(105, 105, 105, 1)'
            }),
          })
        ]
      }
      else {
        return [
          new ol.style.Style({

            fill: new ol.style.Fill({
              color: 'rgba(0, 0, 255, 1)'
            }),
          })
        ]
      }
    };

    this.tileLayer = new ol.layer.Vector({
      source: tileSrc,
      name: "farts",
      style: tileStyleFunction
    });

    this.map = new ol.Map({
      layers: [
        this.tileLayer
      ],
      target: 'map',
      controls: controls,
      view: new ol.View({
        center: [43, 70],
        zoom: 8,
        maxResolution: mapTileGrid.getResolution(mapMinZoom)
      })
    });

  }

}