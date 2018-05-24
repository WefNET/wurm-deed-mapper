import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ExpansionCase } from '@angular/compiler';

import { Translator } from './translator.module'
import { WallStyles } from './styles/wall-styles'


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
  treeLayer: any;
  wallLayer: any;
  wallStyle: any;

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

    let translator = new Translator();
    let wallStyles = new WallStyles();

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
    var tileIcons = new Array(iconCount);

    var cnv = document.createElement('canvas');
    var ctx = cnv.getContext('2d');
    var grass = new Image();
    grass.src = "/assets/grass.jpg";
    
    grass.onload = function() {
      var pattern = ctx.createPattern(grass, 'repeat');

      for (let i = 0; i < iconCount; ++i) {
        var info = iconInfo[i];
        tileIcons[i] = {
          style: new ol.style.RegularShape({
            points: 4,
            radius: info.radius,
            angle: Math.PI / 4,
            fill: new ol.style.Fill({
              color: pattern
            }),
          }),
          reso: info.reso
        };
      }
    }


    var tileSrc = new ol.source.Vector();
    var treeSrc = new ol.source.Vector();
    var wallSrc = new ol.source.Vector();

    // main interator
    for (let tile of json.map.tile) {
      let x: number = parseInt(tile.x) * 16;
      let y: number = parseInt(tile.y) * 16;
      let tileGroundJSON: any = translator.TileFromID(tile.ground.id);

      var tileFeature = new ol.Feature({
        geometry: new ol.geom.Point([x, y]),
        ground: tileGroundJSON.Ground,
        color: tileGroundJSON.Color,
        tile: tile
      });

      tileSrc.addFeature(tileFeature);

      // level stuff
      let levels: any[] = tile.level;

      if (levels.length > 0) {
        var firstFloor: any = levels[0]

        if (firstFloor.hWall) {
          let wallJSON = translator.WallFromID(firstFloor.hWall.id);

          var wallFeature = new ol.Feature({
            geometry: new ol.geom.LineString([[x - 8, y - 8], [x + 8, y - 8]]),
            type: wallJSON.Type,
            wall: wallJSON.Wall
          })

          wallSrc.addFeature(wallFeature)
        }

        if (firstFloor.vWall) {
          let wallJSON = translator.WallFromID(firstFloor.vWall.id)

          var wallFeature = new ol.Feature({
            geometry: new ol.geom.LineString([[x - 8, y - 8], [x - 8, y + 8]]),
            type: wallJSON.Type,
            wall: wallJSON.Wall
          })

          wallSrc.addFeature(wallFeature)
        }
      }

      if (tile.level.hWall) {
        // console.log("Tile level hWall: ", tile.level.hWall);
        var wallJSON = translator.WallFromID(tile.level.hWall.id);

        var coords = tile.level.hWall.id == "wFenceG" ? [[x - 8, y - 8], [x + 4, y - 12]] : [[x - 8, y - 8], [x + 8, y - 8]]

        var wallFeature = new ol.Feature({
          geometry: new ol.geom.LineString(coords),
          type: wallJSON.Type,
          wall: wallJSON.Wall
        })

        wallSrc.addFeature(wallFeature)
      }

      if (tile.level.vWall) {
        // console.log("Tile level vWall: ", tile.level.vWall);
        var wallJSON = translator.WallFromID(tile.level.vWall.id);

        var wallFeature = new ol.Feature({
          geometry: new ol.geom.LineString([[x - 8, y - 8], [x - 8, y + 8]]),
          type: wallJSON.Type,
          wall: wallJSON.Wall
        })

        wallSrc.addFeature(wallFeature)
      }

      if (tile.level.object != null) {
        // console.log("Tree?", tile.level.object);

        var treeData = translator.TreeFromID(tile.level.object.id);

        var treeFeature = new ol.Feature({
          geometry: new ol.geom.Circle([x, y], 4),
          tree: treeData.Tree,
          color: treeData.Color
        })

        treeSrc.addFeature(treeFeature);
      }
    }

    var tileStyleFunction = function (feature, resolution) {
      // console.log("Reso", resolution);
      var type = feature.get('ground');
      var color = feature.get('color');

      // http://jsfiddle.net/vkm2rg46/3/
      if (type == "Grass") {
        return [
          new ol.style.Style({
            image: tileIcons.find(x => x.reso == resolution).style
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
    };

    var treeStyleFunction = function (feature, resolution) {
      return [
        new ol.style.Style({
          fill: new ol.style.Fill({
            color: feature.get('color')
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(105, 105, 105, .2)'
          }),
        })
      ]
    }



    var wallStyleFunction = function (feature, resolution) {
      let wallType: string = feature.get('type');

      // if (wallType) console.log("Wall Type passed to style: ", wallType);

      if (wallType == "Curb") {
        return wallStyles.greyPebble(resolution)
      }
      else if (wallType == "Wood Fence") {
        return wallStyles.woodFence(resolution);
      }
      else if (wallType == "Stone House Wall") {
        return wallStyles.stoneBrick(resolution);
      }
      else if (wallType && wallType.lastIndexOf("Hedge") > 0) {
        return [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgb(0, 77, 0)", width: 1 / resolution, lineCap: 'miter' }),
          })
        ]
      }
      else {
        return [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'black', width: 1 / resolution, lineCap: 'miter' })
          })
        ]
      }
    }

    this.tileLayer = new ol.layer.Vector({
      source: tileSrc,
      name: "tiles",
      style: tileStyleFunction,
      renderMode: 'image'
    });

    this.treeLayer = new ol.layer.Vector({
      source: treeSrc,
      style: treeStyleFunction,
      renderMode: 'image'
    });

    this.wallLayer = new ol.layer.Vector({
      source: wallSrc,
      style: wallStyleFunction,
      renderMode: 'image'
    })


    this.map = new ol.Map({
      layers: [
        this.tileLayer,
        this.treeLayer,
        this.wallLayer
      ],
      target: 'map',
      // renderer: 'webgl',
      controls: controls,
      view: new ol.View({
        center: [mapwidth / 2, mapHeight / 2],
        zoom: 4,
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

      let tile: string = feature.get('tile');
      let groundId: string = feature.get('ground');
      let treeId: string = feature.get('tree');
      let wallId: string = feature.get('wall');

      if (tile) {
        console.log("Tile:", tile);
      }


      var info = document.getElementById('info');
      if (groundId) {
        info.innerHTML = 'Ground ID : ' + groundId;
      } else if (treeId) {
        info.innerHTML = 'Tree ID : ' + treeId;
      } else if (wallId) {
        info.innerHTML = 'Wall ID : ' + JSON.stringify(wallId);
      } else {
        info.innerHTML = '&nbsp;';
      }
    });

  }
}