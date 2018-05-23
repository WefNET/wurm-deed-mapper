declare var ol: any;

export interface WallStylesModule {
    greyPebble(resolution);
    woodFence(resolution);
    stoneBrick(resolution);
}

export class WallStyles implements WallStylesModule {
    greyPebble(resolution: any): any {
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(101, 95, 90, .5)',
                    width: 1.5 / resolution,
                    lineCap: 'round'
                }),
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'grey',
                    width: 2 / resolution,
                    lineDash: [1, 3 / resolution]
                }),
            }),
        ]
    }

    woodFence(resolution: any): any {
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgb(204, 68, 0)",
                    width: 1 / resolution,
                    lineCap: 'miter'
                }),
            })
        ]
    }

    stoneBrick(resolution: any): any {
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(1, 1, 1, 1)',
                    width: 2 / resolution,
                    lineCap: 'butt'
                })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgb(255, 255, 255)",
                    width: .5 / resolution,
                    lineCap: 'miter'
                }),
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgb(134, 134, 172)',
                    width: 2 / resolution,
                    lineDash: [1, 4 / resolution],
                    lineCap: 'square'
                })
            })
        ]
    }
}

