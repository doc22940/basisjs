module.exports = {
  name: 'update',
  init: function(){
    var router = basis.require('basis.router');
    var type = basis.require('basis.type');
    var catchWarnings = basis.require('./helpers/common.js').catchWarnings;
  },
  test: [
    {
      name: 'simple case',
      test: function(){
        var route = router.route('page(/:str)', {
          params: {
            str: type.string
          }
        });

        router.navigate('page');

        route.update({
          str: 'someother'
        });

        assert(location.hash === '#page/someother');

        route.destroy();
      }
    },
    {
      name: 'it should fire only one location change on multiple params update',
      test: function(){
        var route = router.route(':first(/:second)(/:third)', {
          params: {
            first: type.string,
            second: type.string,
            third: type.string
          }
        });


        var counter = 0;
        var handler = function(first, second, third){
          counter++;
        };
        route.add(handler);

        router.navigate('foo/bar/baz');

        assert(counter === 1);

        route.update({
          first: 'first',
          second: 'second',
          third: 'third'
        });

        assert(location.hash === '#first/second/third');

        route.destroy();
      }
    },
    {
      name: 'update when not matched - warning and ignore',
      test: function(){
        var route = router.route('page/:str', {
          params: {
            str: type.string
          }
        });

        router.navigate('something-different');

        assert(route.params.str.value === '');

        var warned = catchWarnings(function(){
          route.update({
            str: 'str'
          });
        });

        assert(warned);
        assert(route.params.str.value === '');
        assert(location.hash === '#something-different');

        route.destroy();
      }
    },
    {
      name: 'passing key not presented in params config - warning',
      test: function(){
        var route = router.route('base/:str', {
          params: {
            str: type.string
          }
        });

        router.navigate('base/a');

        var warned = catchWarnings(function(){
          route.update({
            str: 'b',
            missing: 'c'
          });
        });

        assert(warned);
        assert(route.params.str.value === 'b');
        assert(location.hash === '#base/b');

        route.destroy();
      }
    },
    {
      name: 'triggers paramsChanged event',
      test: function(){
        var lastDelta;
        var route = router.route('offers/', {
          params: {
            first: type.number,
            second: type.number,
            third: type.number
          }
        });

        route.add({
          paramsChanged: function(delta){
            lastDelta = delta;
          }
        });

        router.navigate('offers/?first=1&second=2');

        route.update({
          first: 10,
          second: 2,
          third: 24
        });

        assert({ first: 1, third: 0 }, lastDelta);

        route.destroy();
      }
    }
  ]
};
