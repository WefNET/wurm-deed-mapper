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
    var mapMinZoom = 0;
    var mapMaxZoom = 5;
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
      var type = feature.get('ground');
      var color = feature.get('color');

      return [
        new ol.style.Style({
          image: new ol.style.RegularShape({
            points: 4,
            radius: 8 / resolution,
            angle: Math.PI / 4,
            fill: new ol.style.Fill({
              color: color
            }),
            // stroke: new ol.style.Stroke({
            //     width: 2,
            //     color: 'rgba(0, 0, 0, 0.9)'
            // })
          })
        })
      ]


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