angular.module('mazii')


.directive('ngExample', function () {
    return {
        restrict: 'E',
        templateUrl: module.root + 'template/example/example-template.php',
        scope: {
            data: '=data',
            index: '@'
        },
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function ($rootScope, $scope, $http, dictUtilSer) {
            var html, id, j, jap, pos, reading, word, writing, i, len, ref, ref1;
            jap = $scope.data.mean;
            html = '';
            ref = jap.split('\t');
            for (i = 0, len = ref.length; i < len; i++) {
              j = ref[i];
              ref1 = j.split(' '), writing = ref1[0], pos = ref1[1], reading = ref1[2];
              word = writing;
              if (pos != null) {
                if ((reading == null) || reading === '') {
                  //reading = writing;
                } else {
                    word = '<ruby><rb>' + writing + '</rb><rt>' + reading + '</rt></ruby>'; 
                }
              }
              html += word;
            }
            
            $scope.data.mean = html;
        }]
    }
})