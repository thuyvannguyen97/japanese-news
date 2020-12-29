angular.module('mazii')


.directive('ngKanjiDraw', function () {
    return {
        restrict: 'E',
        templateUrl: module.root + 'template/kanji-draw/kanji-draw-template.php',
        scope: {
            data: '=data'
        },
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function ($rootScope, $scope, $http, dictUtilSer) {
            
            function getOptionDrawSmall() {
                var option = {
                    skipLoad: false,
                    autoplay: true,
                    height: 250,
                    width: 250,
                    viewBox: {
                        x: 0,
                        y: 0,
                        w: 125,
                        h: 125
                    },
                    step: 0.01,
                    stroke: {
                        animated: {
                            drawing: true,
                            erasing: true
                        },
                        order: {
                            visible: true,
                            attr: {
                                "font-size": "8",
                                "fill": "#33B5E5"
                            }
                        },
                        attr: {
                            "active": "#CC0000",
                            // may use the keyword "random" here for random color
                            "stroke": "random", //#FF4444
                            "stroke-width": 3,
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                        }
                    },
                    grid: {
                        show: true,
                        attr: {
                            "stroke": "#CCCCCC",
                            "stroke-width": 0.5,
                            "stroke-dasharray": "--"
                        }
                    }
                };

                return option;
            }
            
            $scope.draw = function () {
                $("#image-holder").dmak($scope.data, getOptionDrawSmall());
            }
            
            $scope.resetDrawKanjiStroke = function () {
                var imageHolder = $("#image-holder");
                imageHolder.html("");
                if (imageHolder.data("plugin_dmak")){
                    imageHolder.dmak("reset");
                    imageHolder.data("plugin_dmak", null);
                }
                
                $scope.draw();
            }
            
            $scope.$watch("data", function (oldValue, newValue) {
                if (oldValue != newValue) {
                    $scope.resetDrawKanjiStroke();
                }
            })
            
            $scope.resetDrawKanjiStroke();
        }]
    }
})