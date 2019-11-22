
export default `
  (function() {

    window.isPadApp = true;

    var open = window.open;
    var store = localStorage;
    var origin = location.origin;
    var doc = document;
    var body = doc.body;

    function createElement( tag ) {
      return doc.createElement( tag );
    }

    function addEvent( dom, event, callback ) {
      return dom.addEventListener( event, callback, false );
    }

    var makeLocation = function( key, defaultValue ) {
      var obj = {};
      var internalValue = defaultValue;
      Object.defineProperty( obj, key, {
        get: function() {
          return internalValue;
        },
        set: function( newValue ) {
          internalValue = newValue;
        }
      })
      return obj;
    };

    window.open = function( url, opt ) {
      if ( opt !== '_self' ) {
        const iframe = createElement( 'iframe' );
        iframe.style.display = 'none';
        iframe.src = url;
        body.appendChild( iframe );
        addEvent( iframe, 'load', function() {
          window.ReactNativeWebView.postMessage( JSON.stringify({
            url: iframe.contentDocument.location.href,
            baseUrl: location.href,
            type: 'href'
          }));
          body.removeChild( iframe );
        });
        window.ReactNativeWebView.postMessage( JSON.stringify({
          url: url,
          baseUrl: location.href,
          type: 'add'
        }));
        return iframe.contentWindow;
      } else {
        return open( url, '_self' );
      }
    }

  })();
`;
