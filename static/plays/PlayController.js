angular
    .module('playModule')
    .controller('PlayController', [
          'navBarService', '$routeParams', '$scope',
          PlayController])
    .service('navBarService', ['$q', NavBarService]);

/**
 * Controller for Play page
 * @param navBarService
 * @param $routeParams
 * @constructor
 */
function PlayController(navBarService, $routeParams, $scope) {
    var self = this;

    self.selected = "Summary";
    self.getPlayInfo = getPlayInfo;
    self.showFeature = showFeature;
    self.scope = $scope;

    // Load all registered users
    navBarService
        .loadAllFeatures()
        .then(function (features) {
            self.features = [].concat(features);
        });
    getPlayInfo($routeParams.file);

    function getPlayInfo(play_file) {
        var fileName = play_file;
        $scope.file = fileName;

        // Currently hard coded for Hamlet until JSON files fixed.
        $.ajax({
            dataType: "json",
            url: "./static/plays/json/" + String(fileName) + ".json",
            //data: String(fileName),
            //contentType: 'application/json;charset=UTF-8',
            success: function (data) {
                $.each(data, function (key, val) {
                    $scope.playName = data.name;
                    $scope.playChars = data.characters;
                    $scope.playSummary = data.summary;
                    $scope.playScenes = data.scenes;
                });
            }
        });
    }

    function showFeature(feature) {
        self.selected = feature;
    }
}

/**
 * Plays DataService
 * Uses embedded, hard-coded data model; acts asynchronously to simulate
 * remote data service call(s).
 *
 * @returns {{loadAll: Function}}
 * @constructor
 */
function NavBarService($q) {
    var features = [
        {
            name: 'Summary',
            avatar: 'svg-1'
      },
        {
            name: 'Visualizations',
            avatar: 'svg-2'
      },
        {
            name: 'Character List',
            avatar: 'svg-3'
      },
        {
            name: 'About',
            avatar: 'svg-4',
      }
    ];

    // Promise-based API
    return {
        loadAllFeatures: function () {
            return $q.when(features);
        }
    };
}