import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ExpansionCase } from '@angular/compiler';

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
        return "rgba(46, 204, 56, 1)"
      case "lw":
        return "rgba(46, 204, 56, 1)"
      case "pd":
        return "rgba(254,235,206, 1)"
      case "ro":
        return "rgba(168,168,168, 1)"
      case "di":
        return "rgba(138,68,19, 1)"
      case "csr":
        return "rgba(111,127,142, 1)"
      case "cs":
        return "rgba(111,127,142, 1)"
      case "gv":
        return "rgba(210,210,210, 1)"
      case "eg":
        return "rgba(46,204,56, 1)"
      case "sa":
        return "rgba(243,162,98, 1)"
      default:
        return "rgba(8,191,252, 1)"
    }
  }

  treeFromId(id: string): any {
    switch (id) {
      case "app":
      case "appB":
      case "appS":
        return {
          Tree: "Apple",
          Color: "rgb(204, 0, 0)"
        }
      case "birch":
      case "birchB":
      case "birchS":
        return {
          Tree: "Birch",
          Color: "rgb(222, 222, 222)"
        }
      case "cam":
        return {
          Tree: "Camellia",
          Color: "rgb(190,12,53)"
        }
      case "cedar":
      case "cedarB":
      case "cedarS":
        return {
          Tree: "Cedar",
          Color: "rgb(51, 102, 0)"
        }
      case "cherry":
      case "cherryB":
      case "cherryS":
        return {
          Tree: "Cherry",
          Color: "rgb(255, 51, 0)"
        }
      case "chestnut":
      case "chestnutB":
      case "chestnutS":
        return {
          Tree: "Chestnut",
          Color: "rgb(122, 51, 51)"
        }
      case "fir":
      case "firB":
      case "firS":
        return {
          Tree: "Fir",
          Color: "rgb(46, 184, 46)"
        }
      case "grape":
        return {
          Tree: "Grape",
          Color: "rgb(153, 51, 153)"
        }
      case "laven":
      case "lavenB":
        return {
          Tree: "Lavender",
          Color: "rgb(170, 170, 238)"
        }
      case "lemon":
      case "lemonB":
      case "lemonS":
        return {
          Tree: "Lemon",
          Color: "rgb(255, 255, 153)"
        }
      case "linden":
      case "lindenB":
      case "lindenS":
        return {
          Tree: "Linden",
          Color: "rgb(138, 138, 92)"
        }
      case "maple":
      case "mapleB":
      case "mapleS":
        return {
          Tree: "Maple",
          Color: "rgb(102, 0, 0)"
        }
      case "oak":
      case "oakB":
      case "oakS":
        return {
          Tree: "Oak",
          Color: "rgb(204, 153, 0)"
        }
      case "olea":
        return {
          Tree: "Oleander",
          Color: "rgb(250,142,209)"
        }
      case "olive":
      case "oliveB":
      case "oliveS":
        return {
          Tree: "Olive",
          Color: "rgb(102,117,26)"
        }
      case "orange":
      case "orangeB":
      case "orangeS":
        return {
          Tree: "Orange",
          Color: "rgb(255, 153, 0)"
        }
      case "pine":
      case "pineB":
      case "pineS":
        return {
          Tree: "Pine",
          Color: "rgb(64, 128, 0)"
        }
      case "rose":
        return {
          Tree: "Rose",
          Color: "rgb(245, 10, 155)"
        }
      case "walnut":
      case "walnutB":
      case "walnutS":
        return {
          Tree: "Walnut",
          Color: "rgb(122, 31, 31)"
        }
      default:
        return {
          Tree: "Unknow Id: " + id,
          Color: "rgba(8,191,252, 1)"
        }
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
    var tileIcons = new Array(iconCount);

    for (let i = 0; i < iconCount; ++i) {
      var info = iconInfo[i];
      tileIcons[i] = {
        style: new ol.style.RegularShape({
          points: 4,
          radius: info.radius,
          angle: Math.PI / 4,
          fill: new ol.style.Fill({
            color: "rgba(46, 204, 56, 1)"
          }),
        }),
        reso: info.reso
      };
    }

    // console.log("Icons", tileIcons);

    var tileSrc = new ol.source.Vector();
    var treeSrc = new ol.source.Vector();
    var wallSrc = new ol.source.Vector();

    // main interator
    for (let tile of json.map.tile) {
      let x: number = parseInt(tile.x) * 16;
      let y: number = parseInt(tile.y) * 16;

      var tileFeature = new ol.Feature({
        geometry: new ol.geom.Point([x, y]),
        ground: tile.ground.id,
        color: this.groudColor(tile.ground.id),
        tile: tile
      });

      tileSrc.addFeature(tileFeature);

      // level stuff
      let levels: any[] = tile.level;

      if (levels.length > 0) {
        // console.log("Levels 2+", levels);

        var firstFloor: any = levels[0]

        if (firstFloor.hWall) {
          // console.log("Horiz. wall: ", firstFloor.hWall);

          var wallFeature = new ol.Feature({
            geometry: new ol.geom.LineString([[x - 8, y - 8], [x + 8, y - 8]]),
            type: firstFloor.hWall.id
          })

          wallSrc.addFeature(wallFeature)
        }

        if (firstFloor.vWall) {
          // console.log("Vert. wall: ", firstFloor.vWall);
          var wallFeature = new ol.Feature({
            geometry: new ol.geom.LineString([[x - 8, y - 8], [x - 8, y + 8]]),
            type: firstFloor.vWall.id
          })

          wallSrc.addFeature(wallFeature)
        }
      }

      if (tile.level.hWall) {

        var coords = tile.level.hWall.id == "wFenceG" ? [[x - 8, y - 8], [x + 4, y - 12]] : [[x - 8, y - 8], [x + 8, y - 8]]

        var wallFeature = new ol.Feature({
          geometry: new ol.geom.LineString(coords),
          type: tile.level.hWall.id
        })

        wallSrc.addFeature(wallFeature)
      }

      if (tile.level.vWall) {
        var wallFeature = new ol.Feature({
          geometry: new ol.geom.LineString([[x - 8, y - 8], [x - 8, y + 8]]),
          type: tile.level.vWall.id
        })

        wallSrc.addFeature(wallFeature)
      }

      if (tile.level.object != null) {
        // console.log("Tree?", tile.level.object);

        var treeData = this.treeFromId(tile.level.object.id);

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
      if (type == "gr" || type == "lw") {
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

      if (wallType == "curb") {
        return [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'grey', width: 1 / resolution, lineDash: [1, 8] }),
          })
        ]
      } else if (wallType == "wFence" || wallType == "wFenceG") {
        return [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgb(204, 68, 0)", width: 1 / resolution }),
          })
        ]
      } else if (wallType && wallType.lastIndexOf("Hedge") > 0) {
        return [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgb(0, 77, 0)", width: 1 / resolution }),
          })
        ]
      }
      else {
        return [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'black', width: 1 / resolution })
          })
        ]
      }
    }

    this.tileLayer = new ol.layer.Vector({
      source: tileSrc,
      name: "farts",
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
      let wallId: string = feature.get('type');

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