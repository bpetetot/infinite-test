import React,{Component}from"react";import PropTypes from"prop-types";var classCallCheck=function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),_extends=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},inherits=function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)},possibleConstructorReturn=function(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r},toConsumableArray=function(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)},range=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,r=arguments[1];return[].concat(toConsumableArray(Array(r-e).keys())).map(function(r){return r+e})},List=function(e){function r(){var e,t,o;classCallCheck(this,r);for(var n=arguments.length,i=Array(n),s=0;s<n;s++)i[s]=arguments[s];return t=o=possibleConstructorReturn(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(i))),o.handleRenderRow=function(e){var r=o.props,t=r.renderRow,n=r.rowHeight;return t({index:e,style:{position:"absolute",width:"100%",height:n+"px",top:e*n,left:0,boxSizing:"border-box",willChange:"top"},isScrolling:r.isScrolling})},o.renderList=function(){var e=o.props,r=e.startIndex,t=e.endIndex;return-1===r||-1===t?null:range(r,t+1).map(o.handleRenderRow)},possibleConstructorReturn(o,t)}return inherits(r,Component),createClass(r,[{key:"render",value:function(){var e=this.props,r=e.forwardedRef,t=e.height,o=e.className;return React.createElement("div",{ref:r,className:o,style:{position:"relative",overflow:"hidden",height:t+"px",boxSizing:"border-box"}},this.renderList())}}]),r}();List.propTypes={forwardedRef:PropTypes.any.isRequired,startIndex:PropTypes.number.isRequired,endIndex:PropTypes.number.isRequired,isScrolling:PropTypes.bool,height:PropTypes.number.isRequired,rowHeight:PropTypes.number.isRequired,renderRow:PropTypes.func.isRequired,className:PropTypes.string},List.defaultProps={isScrolling:!1,className:void 0};var ForwardRefList=function(e,r){return React.createElement(List,_extends({},e,{forwardedRef:r}))},List$1=React.forwardRef(ForwardRefList),Unlimited=function(e){function r(){var e,t,o;classCallCheck(this,r);for(var n=arguments.length,i=Array(n),s=0;s<n;s++)i[s]=arguments[s];return t=o=possibleConstructorReturn(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(i))),o.wrapper=React.createRef(),o.scroller=React.createRef(),o.state={startIndex:-1,endIndex:-1},o.getScroller=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:o.props).scrollerRef;return e||o.scroller.current},o.getScrollingData=function(){var e=o.getScroller(),r=o.wrapper.current;return o.isWindowScroll()?{wrapperTop:r.offsetTop,scrollTop:e.scrollY,scrollHeight:e.innerHeight}:{wrapperTop:r.offsetTop-e.offsetTop,scrollTop:e.scrollTop,scrollHeight:e.clientHeight}},o.getIndexPosition=function(e){var r=o.props,t=r.rowHeight,n=r.length,i=o.getScrollingData().wrapperTop;return e<0?i:e>=n?(n-1)*t+i:e*t+i},o.addListeners=function(e){var r=o.getScroller(e);o.scrollTicking=!1,r&&r.addEventListener("scroll",o.scrollListener),o.resizeTicking=!1,window.addEventListener("resize",o.resizeListener)},o.removeListeners=function(e){var r=o.getScroller(e);r&&r.removeEventListener("scroll",o.scrollListener),window.removeEventListener("resize",o.resizeListener)},o.isWindowScroll=function(){return o.getScroller()instanceof Window},o.isValidScroller=function(){var e=o.getScroller();return!!o.isWindowScroll()||!!e&&!!e.clientHeight&&e.clientHeight>0},o.scrollToIndex=function(e){var r=o.getIndexPosition(e);o.isWindowScroll()?setTimeout(function(){return window.scrollTo(0,r)}):o.getScroller().scrollTop=r},o.scrollListener=function(){o.scrollTicking||window.requestAnimationFrame(function(){o.updateList(),o.scrollTicking=!1}),o.scrollTicking=!0},o.resizeListener=function(){o.resizeTicking||window.requestAnimationFrame(function(){o.updateList(),o.resizeTicking=!1}),o.resizeTicking=!0},o.updateList=function(){var e=o.props,r=e.length,t=e.overscan,n=e.rowHeight,i=e.onLoadMore,s=o.getScrollingData(),l=s.scrollTop,a=s.scrollHeight,c=s.wrapperTop,p=Math.floor((l-c)/n),u=p+Math.floor(a/n);i&&u+t>=r&&i(),o.setState({startIndex:p-t>=0?p-t:0,endIndex:u+t<r?u+t:r-1})},o.renderList=function(e){var r=o.props,t=r.length,n=r.renderRow,i=r.rowHeight,s=o.state,l=s.startIndex,a=s.endIndex;return React.createElement(List$1,{ref:o.wrapper,startIndex:l,endIndex:a,height:i*t,rowHeight:i,renderRow:n,className:e})},possibleConstructorReturn(o,t)}return inherits(r,Component),createClass(r,[{key:"componentDidMount",value:function(){var e=this.props.scrollToIndex;this.isValidScroller()&&(this.addListeners(),e?this.scrollToIndex(e):this.updateList())}},{key:"componentDidUpdate",value:function(e){var r=this.props,t=r.scrollToIndex,o=r.length;this.isValidScroller()&&(this.getScroller()!==this.getScroller(e)&&(this.removeListeners(e),this.addListeners()),o!==e.length&&this.updateList(),t&&t!==e.scrollToIndex&&this.scrollToIndex(t))}},{key:"componentWillUnmount",value:function(){this.removeListeners()}},{key:"render",value:function(){var e=this.props,r=e.scrollerRef,t=e.className;return r&&!this.isValidScroller()?(console.error("The scroller container (scrollerRef) has a clientHeight null or equals to 0."),null):r?this.renderList(t):React.createElement("div",{ref:this.scroller,className:t,style:{overflow:"auto",willChange:"scroll-position"}},this.renderList())}}]),r}();Unlimited.propTypes={length:PropTypes.number.isRequired,rowHeight:PropTypes.number.isRequired,renderRow:PropTypes.func.isRequired,scrollerRef:PropTypes.any,overscan:PropTypes.number,scrollToIndex:PropTypes.number,onLoadMore:PropTypes.func,className:PropTypes.string},Unlimited.defaultProps={scrollerRef:void 0,overscan:10,scrollToIndex:void 0,onLoadMore:void 0,className:void 0};export default Unlimited;
