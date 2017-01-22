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
            // Simulate async nature of real remote calls
            console.log(features);
            return $q.when(features);
        }
    };
}