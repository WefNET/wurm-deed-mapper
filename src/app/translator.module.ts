export interface TranslatorModule {
    TileFromID(id: string);
    TreeFromID(id: string);
    WallFromID(id: string);
}

// translation matrices taken directly from Deed planner.. thanks Warlander!
export class Translator implements TranslatorModule {
    TileFromID(id: string): any {

        switch (id) {
            case "gr":
                return { Ground: "Grass", Color: "rgba(46, 204, 56, 1)" }
            case "di":
                return { Ground: "Dirt", Color: "rgba(138,68,19, 1)" }
            case "pd":
                return { Ground: "Packed Dirt", Color: "rgba(254,235,206, 1)" }
            case "sa":
                return { Ground: "Sand", Color: "rgba(243,162,98, 1)" }
            case "wa":
                return { Ground: "Water", Color: "rgb(0, 51, 153)" }
            case "fo":
                return { Ground: "Forest", Color: "rgb(0, 102, 0)" }
            case "ma":
                return { Ground: "Marsh", Color: "rgb(84,79,27)" }
            case "st":
                return { Ground: "Steppe", Color: "rgb(88,79,57)" }
            case "tu":
                return { Ground: "Tundra", Color: "rgb(91,46,35)" }
            case "fi":
                return { Ground: "Field", Color: "rgb(53,88,53)" }
            case "gv":
                return { Ground: "Gravel", Color: "rgba(210,210,210, 1)" }
            case "cs":
                return { Ground: "Cobble Stone", Color: "rgba(111,127,142, 1)" }
            case "rcs":
                return { Ground: "Rough Cobble Stone", Color: "rgba(131,147,162, 1)" }
            case "csr":
                return { Ground: "Round Cobble Stone", Color: "rgba(111,127,142, 1)" }
            case "sl":
                return { Ground: "Stone Slab", Color: "rgba(121,137,152, 1)" }
            case "msl":
                return { Ground: "Marble Slab", Color: "rgba(181,197,212, 1)" }
            case "mb":
                return { Ground: "Marble Brick", Color: "rgba(181,197,212, 1)" }
            case "ssl2":
                return { Ground: "Slate Slab", Color: "rgb(64, 64, 64)" }
            case "ssl":
                return { Ground: "Slate Brick", Color: "rgb(64, 64, 64)" }
            case "sas":
                return { Ground: "Sandstone Slab", Color: "rgb(255, 238, 204)" }
            case "sab":
                return { Ground: "Sandstone Brick", Color: "rgb(255, 204, 102)" }
            case "pl":
                return { Ground: "Planks", Color: "rgb(134, 89, 45)" }
            case "eg":
                return { Ground: "Enchanted Grass", Color: "rgba(46,244,56, 1)" }
            case "lw":
                return { Ground: "Lawn", Color: "rgba(46, 204, 56, 1)" }
            case "ro":
                return { Ground: "Rock", Color: "rgba(168,168,168, 1)" }
            case "cy":
                return { Ground: "Clay", Color: "rgb(191, 191, 191)" }
            case "mo":
                return { Ground: "Moss", Color: "rgb(179, 255, 26)" }
            case "pe":
                return { Ground: "Peat", Color: "rgb(44,43,38)" }
            case "ta":
                return { Ground: "Tar", Color: "rgb(55,55,55)" }
            default:
                return { Ground: id, Color: "rgba(8,191,252, 1)" }
        }
    }

    TreeFromID(id: string): any {
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
                    Tree: "Unknown Tree Id: " + id,
                    Color: "rgba(8,191,252, 1)"
                }
        }
    }

    WallFromID(id: string): any {
        switch (id) {
            case "curb":
                return {
                    Type: "Curb",
                    Wall: "Curb"
                }
            case "wFence":
                return {
                    Type: "Wood Fence",
                    Wall: "Wooden Fence"
                }
            case "wFenceG":
                return {
                    Type: "Wood Fence",
                    Wall: "Wooden Fence Gate"
                }
            case "sWall":
                return {
                    Type: "Stone House Wall",
                    Wall: "Stone House Wall"
                }
            case "sDoor":
                return {
                    Type: "Stone House Wall",
                    Wall: "Stone House Door"
                }
            default:
                return {
                    Wall: "Unknown Wall Id: " + id
                }
        }
    }
}