myApp.controller("GameBoardController", ["$scope", "$http", "$window", "$document", "$timeout", "$location",
    function($scope, $http, $window, $document, $timeout, $location) {

        //BUG: At certain screen sizes the div's dont
        //window resizeing functionality
        $window.addEventListener('resize', resizeGame, false);
        $window.addEventListener('orientationchange', resizeGame, false);

        $scope.gameBoard = {};
        $scope.cameraZoom = 35;
        $scope.zoomOut = function(){
          $scope.cameraZoom = $scope.cameraZoom + 5;
          if ($scope.cameraZoom > 75){
            $scope.cameraZoom = 75;
          }
          resizeGame();
        }
        $scope.zoomIn = function(){
          $scope.cameraZoom = $scope.cameraZoom - 5;
          if ($scope.cameraZoom < 10){
            $scope.cameraZoom = 10;
          }
          resizeGame();
        }
        $scope.divPositions = [];
        function getDivPositions(){

          var divPositions = [];
          var zoom = $scope.cameraZoom;
          var divCount = zoom * zoom;
          var tilePercentSize = 100 / zoom;

          var xCount = 0;
          var yCount = 0;
          for(var y = 0; y < zoom; y++){
            for(var x = 0; x < zoom; x++){
              xCount += tilePercentSize;
              divPositions.push({xPos: x * tilePercentSize, yPos: y * tilePercentSize})
            }
          }


            // divPositions.push({xPos: i, yPos: i});

          return divPositions;
        }



        function resizeGame() {
            var gameArea = document.getElementById('gameArea');
            var widthToHeight = 5 / 5;

            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight;

            var newWidthToHeight = newWidth / newHeight;

            if (newWidthToHeight > widthToHeight) {
                // window width is too wide relative to desired game width
                newWidth = newHeight * widthToHeight;
                gameArea.style.height = newHeight + 'px';
                gameArea.style.width = newWidth + 'px';
            } else { // window height is too high relative to desired game height
                newHeight = newWidth / widthToHeight;
                gameArea.style.width = newWidth + 'px';
                gameArea.style.height = newHeight + 'px';
            }

            gameArea.style.marginTop = (-newHeight / 2) + 'px';
            gameArea.style.marginLeft = (-newWidth / 2) + 'px';

            //gameArea.style.fontSize = (newWidth / 400) + 'em';

            var gameCanvas = document.getElementById('gameCanvas');
            gameCanvas.width = newWidth;
            gameCanvas.height = newHeight;

            $timeout(function() {
                $scope.gameBoard = {
                    width: newWidth,
                    height: newHeight
                };
                worldMap = worldMap.map(function(row) {
                    return row.map(function(tile) {
                        tile.width = newWidth / $scope.cameraZoom;
                        tile.height = newHeight / $scope.cameraZoom;
                        return tile;
                    })
                })
                $scope.divPositions = getDivPositions();



                $scope.camera = findCurrentView($scope.cameraPosition);

            }, 0)




        }

            resizeGame();

        var worldMap = [];


        //holds all tiles in view;
        $scope.camera = [];
        $scope.cameraPosition = {
            x: 501,
            y: 501
        }; //init
        //holds full world map
        var worldMap = makeTileGrid();
        console.log(worldMap);





        //MARK: CAMERA
        function findCurrentView(position) {
            var x = position.x;
            var y = position.y;


            var view = worldMap.slice(y - ($scope.cameraZoom / 2) , y + ($scope.cameraZoom / 2));
            view = view.map(row => {
                return row.slice(x - ($scope.cameraZoom / 2), x + ($scope.cameraZoom / 2));
            });

            var camera = [];
            view.forEach(row => {
                camera.push(...row);
            })

            return camera;
        }
        $scope.camera = findCurrentView($scope.cameraPosition); //init

        //MARK: MAP BUILDING FUNCTIONS
        function getTexture(x, y) {
            // console.log(x,y);
            if (y % 5 == 0 && x % 5 == 0 || x % 10 == 0 || y % 10 == 0) {
                return 'grass.png'
            }
            return 'water.png'
        }




        function makeTileGrid() {

            var gameMap = [];
            var row = [];
            var cols = 1000;
            var rows = 1000;
            var texture = '';

            //assuming width is > height;
            var tileSize = ($scope.gameBoard.width / $scope.cameraZoom)
            var width = tileSize;
            var height = tileSize;




            for (var x = 0; x < cols; x++) {
                row = [];
                for (var y = 0; y < rows; y++) {


                    var items = [];
                    texture = getTexture(x, y)
                    row.push({
                        x: x,
                        y: y,
                        width: width,
                        height: height,
                        texture: texture,
                        items: items
                    });
                }
                gameMap.push(row);
            }

            return gameMap;
        }



        $document.bind("keydown", function(event) {
            console.log(event.key);

            switch (event.key) {
                case "w":
                    if ($scope.cameraPosition.y != 11) {
                        $scope.cameraPosition.y -= 1;
                        console.log($scope.cameraPosition);
                        $scope.$apply(function() {
                            $scope.camera = findCurrentView($scope.cameraPosition)
                        })
                    }
                    break;
                case "s":
                    if ($scope.cameraPosition.y != 989) {
                        $scope.cameraPosition.y += 1;
                        console.log($scope.cameraPosition);
                        $scope.$apply(function() {
                            $scope.camera = findCurrentView($scope.cameraPosition)
                        })
                    }
                    break;
                case "a":
                    if ($scope.cameraPosition.x != 20) {
                        $scope.cameraPosition.x -= 1;
                        console.log($scope.cameraPosition);
                        $scope.$apply(function() {
                            $scope.camera = findCurrentView($scope.cameraPosition)
                        })
                    }
                    break;
                case "d":
                    if ($scope.cameraPosition.x != 980) {
                        $scope.cameraPosition.x += 1;
                        console.log($scope.cameraPosition);
                        $scope.$apply(function() {
                            $scope.camera = findCurrentView($scope.cameraPosition)
                        })
                    }
                    break;

                case "e":
                    $scope.$apply(function() {
                        showTileEditor();
                    })

                    break;

                case "Tab":
                    event.preventDefault();
                    $scope.$apply(function() {
                        $scope.showUserSettings = !$scope.showUserSettings;

                    })

            }
            // if (event.key == "ArrowUp") {
            //
            //     event.preventDefault(); //would prevent from tabbing all over the screen
            // }
        });




    }
]);


// var bioms = [{key: 'w', texture: 'water.png'}, {key: 'g', texture: 'grass.png', key: 'm', texture: 'mountain.png'}]
//
//
// //holds full world map
// $scope.worldMap = makeTileGrid(4152);
//
// //MARK: CLICK FUNCTIONS
//
//
// //MARK: MAP BUILDING FUNCTIONS
//
// function makeTileGrid(seed) {
//     var cols = 1000;
//     var rows = 1000;
//     var map = [];
//
//     //builds map array with cords.
//     for(x=0;x<cols;x++){
//       var row = [];
//       for(y=0;y<rows;y++){
//         row.push({x: x, y: y, texture: 'grass.png'})
//       }
//       map.push(row);
//     }
//     // console.log(map[4][10]) // Object {x: 4, y: 10}
//
//     var eastCoast = map.slice(900)
//     var westCoast = map.slice(0,100);
//     var northCoast = map.map(col=>{
//       return col.slice(0,100);
//     })
//     var southCoast = map.map(col=>{
//       return col.slice(900);
//     })
//
//     var coasts = [eastCoast, westCoast, northCoast, southCoast]
//     coasts = coasts.map(coast=>{
//       return coast.map(col=>{
//         return col.map(tile=>{
//           tile.texture = 'water.png'
//         })
//       })
//     })
//
//     return seed
// }

function makeWaterSeed() {
    //wip
    var waterSeed = [Math.floor((Math.random() * 300) + 1), Math.floor((Math.random() * 300) + 1)];
    var waterWidth = Math.floor((Math.random() * 100) + 1)
    var waterHeight = Math.floor((Math.random() * 100) + 1)
    return null;
}
