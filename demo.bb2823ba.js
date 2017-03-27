webpackJsonp([0,1],{"+iyJ":function(e,n){e.exports="var _this = this,\n    _store$handleActions;\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\n/** @jsx h */\nimport './style.css';\nimport { render, h, Component } from 'preact';\nimport { Provider, connect } from 'preact-smitty';\nimport { createStore } from '../../src';\nimport source from 'raw-loader!./App.js';\n\nvar store = createStore({\n  camera: {\n    recording: false,\n    stream: new window.MediaStream(),\n    images: []\n  }\n});\n\nstore.createActions({\n  startMediaStream: function startMediaStream() {\n    return function () {\n      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(store) {\n        var stream;\n        return regeneratorRuntime.wrap(function _callee$(_context) {\n          while (1) {\n            switch (_context.prev = _context.next) {\n              case 0:\n                _context.prev = 0;\n                _context.next = 3;\n                return navigator.mediaDevices.getUserMedia({\n                  audio: false,\n                  video: true\n                });\n\n              case 3:\n                stream = _context.sent;\n\n                store.actions.mediaStreamSuccess(stream);\n                _context.next = 10;\n                break;\n\n              case 7:\n                _context.prev = 7;\n                _context.t0 = _context['catch'](0);\n\n                store.actions.mediaStreamError(_context.t0);\n\n              case 10:\n              case 'end':\n                return _context.stop();\n            }\n          }\n        }, _callee, _this, [[0, 7]]);\n      }));\n\n      return function (_x) {\n        return _ref.apply(this, arguments);\n      };\n    }();\n  },\n  mediaStreamSuccess: 'camera/STREAM_SUCCESS',\n  mediaStreamError: 'camera/STREAM_ERROR',\n  saveImage: 'camera/ADD_IMAGE'\n});\n\nstore.handleActions((_store$handleActions = {}, _store$handleActions[store.actions.mediaStreamSuccess] = function (state, stream) {\n  state.camera.stream = stream;\n}, _store$handleActions[store.actions.mediaStreamError] = function (state, error) {\n  state.camera.streamError = error;\n}, _store$handleActions[store.actions.saveImage] = function (state, image) {\n  state.camera.images.push(image);\n}, _store$handleActions));\n\nvar pp = function pp(obj) {\n  return JSON.stringify(obj, null, 2);\n};\n\nvar Camera = connect(function (state) {\n  return {\n    stream: state.camera.stream,\n    streamError: state.camera.streamError\n  };\n})(function (_Component) {\n  _inherits(Camera, _Component);\n\n  function Camera() {\n    var _temp, _this2, _ret;\n\n    _classCallCheck(this, Camera);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this2), _this2.video = null, _this2.canvas = null, _this2.handleClick = function () {\n      var canvas = _this2.canvas;\n      var ctx = canvas.getContext('2d');\n      var width = _this2.video.videoWidth;\n      var height = _this2.video.videoHeight;\n      canvas.width = width;\n      canvas.height = height;\n      ctx.fillRect(0, 0, width, height);\n      ctx.drawImage(_this2.video, 0, 0, width, height);\n\n      _this2.context.store.actions.saveImage(canvas.toDataURL('image/webp'));\n    }, _temp), _possibleConstructorReturn(_this2, _ret);\n  }\n\n  Camera.prototype.componentDidMount = function componentDidMount() {\n    this.context.store.actions.startMediaStream('test');\n  };\n\n  Camera.prototype.render = function render(_ref2) {\n    var _this3 = this;\n\n    var streamError = _ref2.streamError;\n\n    return h(\n      'div',\n      {\n        style: {\n          paddingTop: 16,\n          paddingRight: 16,\n          paddingBottom: 16,\n          paddingLeft: 16\n        }\n      },\n      h(\n        'h3',\n        { style: {\n            height: streamError ? 24 : 0,\n            lineHeight: '1.2',\n            marginBottom: 16,\n            textAlign: 'center', color: '#ff6b6b',\n            opacity: streamError ? 1 : 0,\n            transition: 'all 250ms ease-in-out'\n          } },\n        streamError ? streamError.name : ''\n      ),\n      h('video', {\n        ref: function ref(node) {\n          _this3.video = node;\n        },\n        style: {\n          width: '100%',\n          maxHeight: 'calc(50vh - 16px)',\n          background: '#212529',\n          cursor: 'pointer'\n        },\n        src: window.URL ? window.URL.createObjectURL(this.props.stream) : this.props.stream,\n        autoplay: true,\n        muted: true,\n        onClick: this.handleClick\n      }),\n      h('canvas', {\n        ref: function ref(node) {\n          _this3.canvas = node;\n        },\n        style: { display: 'none' }\n      }),\n      h(\n        'div',\n        {\n          style: {\n            display: 'flex',\n            alignItems: 'center',\n            justifyContent: 'center',\n            width: '100%',\n            marginTop: 16,\n            marginBottom: 16\n          }\n        },\n        h(\n          'button',\n          {\n            style: {\n              paddingTop: 8,\n              paddingRight: 16,\n              paddingBottom: 8,\n              paddingLeft: 16,\n              margin: '0 auto',\n              fontSize: 20,\n              lineHeight: '1.6',\n              color: '#adb5bd',\n              background: '#343a40',\n              border: 'none',\n              outline: 'none',\n              boxShadow: 'none',\n              borderRadius: 5,\n              cursor: 'pointer',\n              opacity: streamError ? 0 : 1,\n              transition: 'all 250ms ease-in-out'\n            },\n            disabled: streamError,\n            type: 'button',\n            onClick: this.handleClick\n          },\n          'Take Picture'\n        )\n      )\n    );\n  };\n\n  return Camera;\n}(Component));\n\nvar ImageList = connect(function (state) {\n  return {\n    images: state.camera.images\n  };\n})(function ImageList(_ref3) {\n  var images = _ref3.images;\n\n  return h(\n    'div',\n    {\n      style: {\n        display: 'flex',\n        flexFlow: 'wrap'\n      }\n    },\n    images.map(function (image, i) {\n      return h(Image, { image: image, index: i });\n    })\n  );\n});\n\nfunction Image(_ref4) {\n  var image = _ref4.image,\n      index = _ref4.index;\n\n  return h(\n    'a',\n    {\n      style: {\n        position: 'relative',\n        flex: '0 0 auto',\n        width: '33%',\n        order: index * -1\n      },\n      href: image\n    },\n    h('img', { src: image, style: { width: '100%' } })\n  );\n}\n\nfunction GithubRibbon() {\n  return h('iframe', {\n    src: 'https://ghbtns.com/github-btn.html?user=tkh44&repo=smitty&type=star&count=true&size=large',\n    frameborder: '0',\n    scrolling: '0',\n    width: '160px',\n    height: '30px',\n    style: { marginLeft: 'auto' }\n  });\n}\n\nvar App = connect(function (state) {\n  return state;\n})(function (props) {\n  var _ref5;\n\n  return h(\n    'div',\n    { style: { display: 'flex' } },\n    h(\n      'div',\n      {\n        style: (_ref5 = {\n          flex: '1 0 50%',\n          height: '100vh',\n          background: '#212529',\n          overflow: 'auto',\n          WebkitOverflowScrolling: 'touch'\n        }, _ref5['background'] = props.camera.streamError ? '#f8f9fa' : '#212529', _ref5.cursor = 'pointer', _ref5.transition = 'all 250ms ease-in-out', _ref5)\n      },\n      h(Camera, null)\n    ),\n    h(\n      'div',\n      {\n        style: {\n          flex: '1 0 50%',\n          height: '100vh',\n          background: '#f8f9fa',\n          borderLeft: '1px solid #dee2e6',\n          overflow: 'auto',\n          WebkitOverflowScrolling: 'touch'\n        }\n      },\n      h(\n        'div',\n        {\n          style: {\n            display: 'flex',\n            alignItems: 'center',\n            borderBottom: '1px solid #dee2e6',\n            paddingRight: 8,\n            paddingLeft: 8\n          }\n        },\n        h(\n          'h2',\n          null,\n          'Smitty Demo'\n        ),\n        h(\n          'a',\n          {\n            href: 'https://github.com/tkh44/smitty/tree/master/demo/src',\n            style: { fontSize: '1rem', color: '#329af0', marginLeft: 8 },\n            target: '_blank'\n          },\n          'source'\n        ),\n        h(GithubRibbon, null)\n      ),\n      h(ImageList, null)\n    )\n  );\n});\n\nvar Root = function Root(props) {\n  return h(\n    Provider,\n    { store: store },\n    h(App, null)\n  );\n};\n\nexport default Root;"},0:function(e,n,t){e.exports=t("ctQG")},"97Jz":function(e,n,t){function r(e){function n(n,t){if("function"==typeof e)return e(t.store.state,n)}return function(e){return function(t){function r(e,r){var o=this;t.call(this,e,r),this.state=n(e,r),this.handleStoreUpdate=function(){o.updateAnimId=setTimeout(function(){o.setState(n(o.props,o.context))})},r.store.on("*",this.handleStoreUpdate)}return t&&(r.__proto__=t),r.prototype=Object.create(t&&t.prototype),r.prototype.constructor=r,r.prototype.componentWillUnmount=function(){window.clearTimeout(this.updateAnimId),this.context.store.off("*",this.handleStoreUpdate)},r.prototype.render=function(n,t){return o.h(e,Object.assign({},Object.assign({},n),t,{emit:this.context.store.emit}))},r}(o.Component)}}Object.defineProperty(n,"__esModule",{value:!0});var o=t("EF6w"),i=function(e){function n(){e.apply(this,arguments)}return e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n,n.prototype.getChildContext=function(){return{store:this.props.store}},n.prototype.render=function(e){return e.children[0]},n}(o.Component);n.Provider=i,n.connect=r},EF6w:function(e,n,t){!function(e,t){t(n)}(this,function(e){function n(e,n,t){this.nodeName=e,this.attributes=n,this.children=t,this.key=n&&n.key}function t(e,t){var r,o,i,a,s;for(s=arguments.length;s-- >2;)D.push(arguments[s]);for(t&&t.children&&(D.length||D.push(t.children),delete t.children);D.length;)if((i=D.pop())instanceof Array)for(s=i.length;s--;)D.push(i[s]);else null!=i&&i!==!0&&i!==!1&&("number"==typeof i&&(i=String(i)),a="string"==typeof i,a&&o?r[r.length-1]+=i:((r||(r=[])).push(i),o=a));var c=new n(e,t||void 0,r||W);return B.vnode&&B.vnode(c),c}function r(e,n){if(n)for(var t in n)e[t]=n[t];return e}function o(e){return r({},e)}function i(e,n){for(var t=n.split("."),r=0;r<t.length&&e;r++)e=e[t[r]];return e}function a(e){return"function"==typeof e}function s(e){return"string"==typeof e}function c(e){var n="";for(var t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function u(e,n){return t(e.nodeName,r(o(e.attributes),n),arguments.length>2?[].slice.call(arguments,2):e.children)}function l(e,n,t){var r=n.split(".");return function(n){for(var o=n&&n.target||this,a={},c=a,u=s(t)?i(n,t):o.nodeName?o.type.match(/^che|rad/)?o.checked:o.value:n,l=0;l<r.length-1;l++)c=c[r[l]]||(c[r[l]]=!l&&e.state[r[l]]||{});c[r[l]]=u,e.setState(a)}}function f(e){!e._dirty&&(e._dirty=!0)&&1==Q.push(e)&&(B.debounceRendering||F)(d)}function d(){var e,n=Q;for(Q=[];e=n.pop();)e._dirty&&M(e)}function p(e){var n=e&&e.nodeName;return n&&a(n)&&!(n.prototype&&n.prototype.render)}function m(e,n){return e.nodeName(g(e),n||V)}function h(e,n){return s(n)?e instanceof Text:s(n.nodeName)?!e._componentConstructor&&v(e,n.nodeName):a(n.nodeName)?!e._componentConstructor||e._componentConstructor===n.nodeName||p(n):void 0}function v(e,n){return e.normalizedNodeName===n||H(e.nodeName)===H(n)}function g(e){var n=o(e.attributes);n.children=e.children;var t=e.nodeName.defaultProps;if(t)for(var r in t)void 0===n[r]&&(n[r]=t[r]);return n}function y(e){var n=e.parentNode;n&&n.removeChild(e)}function _(e,n,t,r,o){if("className"===n&&(n="class"),"class"===n&&r&&"object"==typeof r&&(r=c(r)),"key"===n);else if("class"!==n||o)if("style"===n){if((!r||s(r)||s(t))&&(e.style.cssText=r||""),r&&"object"==typeof r){if(!s(t))for(var i in t)i in r||(e.style[i]="");for(var i in r)e.style[i]="number"!=typeof r[i]||J[i]?r[i]:r[i]+"px"}}else if("dangerouslySetInnerHTML"===n)r&&(e.innerHTML=r.__html||"");else if("o"==n[0]&&"n"==n[1]){var u=e._listeners||(e._listeners={});n=H(n.substring(2)),r?u[n]||e.addEventListener(n,x,!!K[n]):u[n]&&e.removeEventListener(n,x,!!K[n]),u[n]=r}else if("list"!==n&&"type"!==n&&!o&&n in e)b(e,n,null==r?"":r),null!=r&&r!==!1||e.removeAttribute(n);else{var l=o&&n.match(/^xlink\:?(.+)/);null==r||r===!1?l?e.removeAttributeNS("http://www.w3.org/1999/xlink",H(l[1])):e.removeAttribute(n):"object"==typeof r||a(r)||(l?e.setAttributeNS("http://www.w3.org/1999/xlink",H(l[1]),r):e.setAttribute(n,r))}else e.className=r||""}function b(e,n,t){try{e[n]=t}catch(e){}}function x(e){return this._listeners[e.type](B.event&&B.event(e)||e)}function C(e){if(y(e),e instanceof Element){e._component=e._componentConstructor=null;var n=e.normalizedNodeName||H(e.nodeName);(q[n]||(q[n]=[])).push(e)}}function w(e,n){var t=H(e),r=q[t]&&q[t].pop()||(n?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e));return r.normalizedNodeName=t,r}function S(){for(var e;e=X.pop();)B.afterMount&&B.afterMount(e),e.componentDidMount&&e.componentDidMount()}function k(e,n,t,r,o,i){Y++||(Z=o&&void 0!==o.ownerSVGElement,ee=e&&!($ in e));var a=E(e,n,t,r);return o&&a.parentNode!==o&&o.appendChild(a),--Y||(ee=!1,i||S()),a}function E(e,n,t,r){for(var o=n&&n.attributes&&n.attributes.ref;p(n);)n=m(n,t);if(null==n&&(n=""),s(n))return e&&e instanceof Text&&e.parentNode?e.nodeValue!=n&&(e.nodeValue=n):(e&&R(e),e=document.createTextNode(n)),e;if(a(n.nodeName))return T(e,n,t,r);var i=e,c=String(n.nodeName),u=Z,l=n.children;if(Z="svg"===c||"foreignObject"!==c&&Z,e){if(!v(e,c)){for(i=w(c,Z);e.firstChild;)i.appendChild(e.firstChild);e.parentNode&&e.parentNode.replaceChild(i,e),R(e)}}else i=w(c,Z);var f=i.firstChild,d=i[$];if(!d){i[$]=d={};for(var h=i.attributes,g=h.length;g--;)d[h[g].name]=h[g].value}return!ee&&l&&1===l.length&&"string"==typeof l[0]&&f&&f instanceof Text&&!f.nextSibling?f.nodeValue!=l[0]&&(f.nodeValue=l[0]):(l&&l.length||f)&&N(i,l,t,r,!!d.dangerouslySetInnerHTML),A(i,n.attributes,d),o&&(d.ref=o)(i),Z=u,i}function N(e,n,t,r,o){var i,a,s,c,u=e.childNodes,l=[],f={},d=0,p=0,m=u.length,v=0,g=n&&n.length;if(m)for(var _=0;_<m;_++){var b=u[_],x=b[$],C=g?(a=b._component)?a.__key:x?x.key:null:null;null!=C?(d++,f[C]=b):(ee||o||x||b instanceof Text)&&(l[v++]=b)}if(g)for(var _=0;_<g;_++){s=n[_],c=null;var C=s.key;if(null!=C)d&&C in f&&(c=f[C],f[C]=void 0,d--);else if(!c&&p<v)for(i=p;i<v;i++)if((a=l[i])&&h(a,s)){c=a,l[i]=void 0,i===v-1&&v--,i===p&&p++;break}c=E(c,s,t,r),c&&c!==e&&(_>=m?e.appendChild(c):c!==u[_]&&(c===u[_+1]&&y(u[_]),e.insertBefore(c,u[_]||null)))}if(d)for(var _ in f)f[_]&&R(f[_]);for(;p<=v;)(c=l[v--])&&R(c)}function R(e,n){var t=e._component;if(t)L(t,!n);else{e[$]&&e[$].ref&&e[$].ref(null),n||C(e);for(var r;r=e.lastChild;)R(r,n)}}function A(e,n,t){var r;for(r in t)n&&r in n||null==t[r]||_(e,r,t[r],t[r]=void 0,Z);if(n)for(r in n)"children"===r||"innerHTML"===r||r in t&&n[r]===("value"===r||"checked"===r?e[r]:t[r])||_(e,r,t[r],t[r]=n[r],Z)}function j(e){var n=e.constructor.name,t=ne[n];t?t.push(e):ne[n]=[e]}function O(e,n,t){var r=new e(n,t),o=ne[e.name];if(P.call(r,n,t),o)for(var i=o.length;i--;)if(o[i].constructor===e){r.nextBase=o[i].nextBase,o.splice(i,1);break}return r}function U(e,n,t,r,o){e._disable||(e._disable=!0,(e.__ref=n.ref)&&delete n.ref,(e.__key=n.key)&&delete n.key,!e.base||o?e.componentWillMount&&e.componentWillMount():e.componentWillReceiveProps&&e.componentWillReceiveProps(n,r),r&&r!==e.context&&(e.prevContext||(e.prevContext=e.context),e.context=r),e.prevProps||(e.prevProps=e.props),e.props=n,e._disable=!1,0!==t&&(1!==t&&B.syncComponentUpdates===!1&&e.base?f(e):M(e,1,o)),e.__ref&&e.__ref(e))}function M(e,n,t,i){if(!e._disable){var s,c,u,l,f=e.props,d=e.state,h=e.context,v=e.prevProps||f,y=e.prevState||d,_=e.prevContext||h,b=e.base,x=e.nextBase,C=b||x,w=e._component;if(b&&(e.props=v,e.state=y,e.context=_,2!==n&&e.shouldComponentUpdate&&e.shouldComponentUpdate(f,d,h)===!1?s=!0:e.componentWillUpdate&&e.componentWillUpdate(f,d,h),e.props=f,e.state=d,e.context=h),e.prevProps=e.prevState=e.prevContext=e.nextBase=null,e._dirty=!1,!s){for(e.render&&(c=e.render(f,d,h)),e.getChildContext&&(h=r(o(h),e.getChildContext()));p(c);)c=m(c,h);var E,N,A=c&&c.nodeName;if(a(A)){var j=g(c);u=w,u&&u.constructor===A&&j.key==u.__key?U(u,j,1,h):(E=u,u=O(A,j,h),u.nextBase=u.nextBase||x,u._parentComponent=e,e._component=u,U(u,j,0,h),M(u,1,t,!0)),N=u.base}else l=C,E=w,E&&(l=e._component=null),(C||1===n)&&(l&&(l._component=null),N=k(l,c,h,t||!b,C&&C.parentNode,!0));if(C&&N!==C&&u!==w){var T=C.parentNode;T&&N!==T&&(T.replaceChild(N,C),E||(C._component=null,R(C)))}if(E&&L(E,N!==C),e.base=N,N&&!i){for(var P=e,I=e;I=I._parentComponent;)(P=I).base=N;N._component=P,N._componentConstructor=P.constructor}}!b||t?X.unshift(e):s||(e.componentDidUpdate&&e.componentDidUpdate(v,y,_),B.afterUpdate&&B.afterUpdate(e));var D,W=e._renderCallbacks;if(W)for(;D=W.pop();)D.call(e);Y||i||S()}}function T(e,n,t,r){for(var o=e&&e._component,i=o,a=e,s=o&&e._componentConstructor===n.nodeName,c=s,u=g(n);o&&!c&&(o=o._parentComponent);)c=o.constructor===n.nodeName;return o&&c&&(!r||o._component)?(U(o,u,3,t,r),e=o.base):(i&&!s&&(L(i,!0),e=a=null),o=O(n.nodeName,u,t),e&&!o.nextBase&&(o.nextBase=e,a=null),U(o,u,1,t,r),e=o.base,a&&e!==a&&(a._component=null,R(a))),e}function L(e,n){B.beforeUnmount&&B.beforeUnmount(e);var t=e.base;e._disable=!0,e.componentWillUnmount&&e.componentWillUnmount(),e.base=null;var r=e._component;if(r)L(r,n);else if(t){t[$]&&t[$].ref&&t[$].ref(null),e.nextBase=t,n&&(y(t),j(e));for(var o;o=t.lastChild;)R(o,!n)}e.__ref&&e.__ref(null),e.componentDidUnmount&&e.componentDidUnmount()}function P(e,n){this._dirty=!0,this.context=n,this.props=e,this.state||(this.state={})}function I(e,n,t){return k(t,e,{},!1,n)}var B={},D=[],W=[],z={},H=function(e){return z[e]||(z[e]=e.toLowerCase())},G="undefined"!=typeof Promise&&Promise.resolve(),F=G?function(e){G.then(e)}:setTimeout,V={},$="undefined"!=typeof Symbol?Symbol.for("preactattr"):"__preactattr_",J={boxFlex:1,boxFlexGroup:1,columnCount:1,fillOpacity:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,fontWeight:1,lineClamp:1,lineHeight:1,opacity:1,order:1,orphans:1,strokeOpacity:1,widows:1,zIndex:1,zoom:1},K={blur:1,error:1,focus:1,load:1,resize:1,scroll:1},Q=[],q={},X=[],Y=0,Z=!1,ee=!1,ne={};r(P.prototype,{linkState:function(e,n){var t=this._linkedStates||(this._linkedStates={});return t[e+n]||(t[e+n]=l(this,e,n))},setState:function(e,n){var t=this.state;this.prevState||(this.prevState=o(t)),r(t,a(e)?e(t,this.props):e),n&&(this._renderCallbacks=this._renderCallbacks||[]).push(n),f(this)},forceUpdate:function(){M(this,2)},render:function(){}}),e.h=t,e.cloneElement=u,e.Component=P,e.render=I,e.rerender=d,e.options=B})},NNls:function(e,n){},ctQG:function(e,n,t){"use strict";function r(){var e=t("jFIt").default;i=t.i(o.render)(t.i(o.h)(e,{test:"foo"}),document.querySelector("#demo"),i)}Object.defineProperty(n,"__esModule",{value:!0});var o=t("EF6w"),i=(t.n(o),void 0);r()},jFIt:function(e,n,t){"use strict";function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function o(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}function a(e){return function(){var n=e.apply(this,arguments);return new Promise(function(e,t){function r(o,i){try{var a=n[o](i),s=a.value}catch(e){return void t(e)}if(!a.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}return r("next")})}}function s(e){var n=e.image,r=e.index;return t.i(f.h)("a",{style:{position:"relative",flex:"0 0 auto",width:"33%",order:r*-1},href:n},t.i(f.h)("img",{src:n,style:{width:"100%"}}))}function c(){return t.i(f.h)("iframe",{src:"https://ghbtns.com/github-btn.html?user=tkh44&repo=smitty&type=star&count=true&size=large",frameborder:"0",scrolling:"0",width:"160px",height:"30px",style:{marginLeft:"auto"}})}Object.defineProperty(n,"__esModule",{value:!0});var u,l=t("NNls"),f=(t.n(l),t("EF6w")),d=(t.n(f),t("97Jz")),p=(t.n(d),t("lVK7")),m=t("+iyJ"),h=(t.n(m),this),v=t.i(p.a)({camera:{recording:!1,stream:new window.MediaStream,images:[]}});v.createActions({startMediaStream:function(){return function(){var e=a(regeneratorRuntime.mark(function e(n){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,navigator.mediaDevices.getUserMedia({audio:!1,video:!0});case 3:t=e.sent,n.actions.mediaStreamSuccess(t),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),n.actions.mediaStreamError(e.t0);case 10:case"end":return e.stop()}},e,h,[[0,7]])}));return function(n){return e.apply(this,arguments)}}()},mediaStreamSuccess:"camera/STREAM_SUCCESS",mediaStreamError:"camera/STREAM_ERROR",saveImage:"camera/ADD_IMAGE"}),v.handleActions((u={},u[v.actions.mediaStreamSuccess]=function(e, n){e.camera.stream=n},u[v.actions.mediaStreamError]=function(e, n){e.camera.streamError=n},u[v.actions.saveImage]=function(e, n){e.camera.images.push(n)},u));var g=t.i(d.connect)(function(e){return{stream:e.camera.stream,streamError:e.camera.streamError}})(function(e){function n(){var t,i,a;r(this,n);for(var s=arguments.length,c=Array(s),u=0; u<s; u++)c[u]=arguments[u];return t=i=o(this,e.call.apply(e,[this].concat(c))),i.video=null,i.canvas=null,i.handleClick=function(){var e=i.canvas,n=e.getContext("2d"),t=i.video.videoWidth,r=i.video.videoHeight;e.width=t,e.height=r,n.fillRect(0,0,t,r),n.drawImage(i.video,0,0,t,r),i.context.store.actions.saveImage(e.toDataURL("image/webp"))},a=t,o(i,a)}return i(n,e),n.prototype.componentDidMount=function(){this.context.store.actions.startMediaStream("test")},n.prototype.render=function(e){var n=this,r=e.streamError;return t.i(f.h)("div",{style:{paddingTop:16,paddingRight:16,paddingBottom:16,paddingLeft:16}},t.i(f.h)("h3",{style:{height:r?24:0,lineHeight:"1.2",marginBottom:16,textAlign:"center",color:"#ff6b6b",opacity:r?1:0,transition:"all 250ms ease-in-out"}},r?r.name:""),t.i(f.h)("video",{ref:function(e){n.video=e},style:{width:"100%",maxHeight:"calc(50vh - 16px)",background:"#212529",cursor:"pointer"},src:window.URL?window.URL.createObjectURL(this.props.stream):this.props.stream,autoplay:!0,muted:!0,onClick:this.handleClick}),t.i(f.h)("canvas",{ref:function(e){n.canvas=e},style:{display:"none"}}),t.i(f.h)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",marginTop:16,marginBottom:16}},t.i(f.h)("button",{style:{paddingTop:8,paddingRight:16,paddingBottom:8,paddingLeft:16,margin:"0 auto",fontSize:20,lineHeight:"1.6",color:"#adb5bd",background:"#343a40",border:"none",outline:"none",boxShadow:"none",borderRadius:5,cursor:"pointer",opacity:r?0:1,transition:"all 250ms ease-in-out"},disabled:r,type:"button",onClick:this.handleClick},"Take Picture")))},n}(f.Component)),y=t.i(d.connect)(function(e){return{images:e.camera.images}})(function(e){var n=e.images;return t.i(f.h)("div",{style:{display:"flex",flexFlow:"wrap"}},n.map(function(e,n){return t.i(f.h)(s,{image:e,index:n})}))}),_=t.i(d.connect)(function(e){return e})(function(e){var n;return t.i(f.h)("div",{style:{display:"flex"}},t.i(f.h)("div",{style:(n={flex:"1 0 50%",height:"100vh",background:"#212529",overflow:"auto",WebkitOverflowScrolling:"touch"},n.background=e.camera.streamError?"#f8f9fa":"#212529",n.cursor="pointer",n.transition="all 250ms ease-in-out",n)},t.i(f.h)(g,null)),t.i(f.h)("div",{style:{flex:"1 0 50%",height:"100vh",background:"#f8f9fa",borderLeft:"1px solid #dee2e6",overflow:"auto",WebkitOverflowScrolling:"touch"}},t.i(f.h)("div",{style:{display:"flex",alignItems:"center",borderBottom:"1px solid #dee2e6",paddingRight:8,paddingLeft:8}},t.i(f.h)("h2",null,"Smitty Demo"),t.i(f.h)("a",{href:"https://github.com/tkh44/smitty/tree/master/demo/src",style:{fontSize:"1rem",color:"#329af0",marginLeft:8},target:"_blank"},"source"),t.i(f.h)(c,null)),t.i(f.h)(y,null)))}),b=function(e){return t.i(f.h)(d.Provider,{store:v},t.i(f.h)(_,null))};n.default=b},lVK7:function(e,n,t){"use strict";function r(e){var n=e;this.actions={},this.events=a()(),this.on=this.events.on,this.off=this.events.off,this.emit=this.emit.bind(this),this.handleActions=this.handleActions.bind(this),Object.defineProperty(this,"state",{get:function(){return n},set:function(e){n=e}})}function o(e){return new r(e)}var i=t("tNdy"),a=t.n(i);n.a=o,Object.assign(r.prototype,{get state(){return this._state},set state(e){this._state=e},emit:function(e, n){if("function"==typeof e)return e(this);this.events.emit(e,n)},createAction:function(e){var n=this;if("function"==typeof e)return function(t){return n.emit(e(t))};var t=function(t){return n.emit(e,t)};return t.toString=function(){return e.toString()},t},createActions:function(e){for(var n in e)this.actions[n]=this.createAction(e[n])},handleActions:function(e){var n=this,t=function(t){var r=function(r, o){"store:"!==r.substring(0,6)&&(n.state=e[t](n.state,o,r)||n.state,n.events.emit("store:change",n.state))};"*"!==t&&(r=r.bind(null,t)),n.events.on(t,r)};for(var r in e)t(r)}})},tNdy:function(e, n){function t(e){return e=e||Object.create(null),{on:function(n, t){(e[n]||(e[n]=[])).push(t)},off:function(n, t){var r=e[n]||(e[n]=[]);r.splice(r.indexOf(t)>>>0,1)},emit:function(n, t){(e[n]||[]).map(function(e){e(t)}),(e["*"]||[]).map(function(e){e(n,t)})}}}e.exports=t}},[0]);
//# sourceMappingURL=demo.bb2823ba.js.map
