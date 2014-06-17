(function(e){e.widget("ui.sortable",e.ui.mouse,{options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3},_create:function(){var e=this.options;this.containerCache={};this.element.addClass("ui-sortable");this.refresh();this.floating=this.items.length?/left|right/.test(this.items[0].item.css("float")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var e=this.items.length-1;e>=0;e--)this.items[e].item.removeData("sortable-item");return this},_mouseCapture:function(t,n){if(this.reverting){return false}if(this.options.disabled||this.options.type=="static")return false;this._refreshItems(t);var r=null,i=this,s=e(t.target).parents().each(function(){if(e.data(this,"sortable-item")==i){r=e(this);return false}});if(e.data(t.target,"sortable-item")==i)r=e(t.target);if(!r)return false;if(this.options.handle&&!n){var o=false;e(this.options.handle,r).find("*").andSelf().each(function(){if(this==t.target)o=true});if(!o)return false}this.currentItem=r;this._removeCurrentsFromItems();return true},_mouseStart:function(t,n,r){var i=this.options,s=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(t);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(t);this.originalPageX=t.pageX;this.originalPageY=t.pageY;i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt);this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};if(this.helper[0]!=this.currentItem[0]){this.currentItem.hide()}this._createPlaceholder();if(i.containment)this._setContainment();if(i.cursor){if(e("body").css("cursor"))this._storedCursor=e("body").css("cursor");e("body").css("cursor",i.cursor)}if(i.opacity){if(this.helper.css("opacity"))this._storedOpacity=this.helper.css("opacity");this.helper.css("opacity",i.opacity)}if(i.zIndex){if(this.helper.css("zIndex"))this._storedZIndex=this.helper.css("zIndex");this.helper.css("zIndex",i.zIndex)}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML")this.overflowOffset=this.scrollParent.offset();this._trigger("start",t,this._uiHash());if(!this._preserveHelperProportions)this._cacheHelperProportions();if(!r){for(var o=this.containers.length-1;o>=0;o--){this.containers[o]._trigger("activate",t,s._uiHash(this))}}if(e.ui.ddmanager)e.ui.ddmanager.current=this;if(e.ui.ddmanager&&!i.dropBehaviour)e.ui.ddmanager.prepareOffsets(this,t);this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(t);return true},_mouseDrag:function(t){this.position=this._generatePosition(t);this.positionAbs=this._convertPositionTo("absolute");if(!this.lastPositionAbs){this.lastPositionAbs=this.positionAbs}if(this.options.scroll){var n=this.options,r=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<n.scrollSensitivity)this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+n.scrollSpeed;else if(t.pageY-this.overflowOffset.top<n.scrollSensitivity)this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-n.scrollSpeed;if(this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<n.scrollSensitivity)this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+n.scrollSpeed;else if(t.pageX-this.overflowOffset.left<n.scrollSensitivity)this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-n.scrollSpeed}else{if(t.pageY-e(document).scrollTop()<n.scrollSensitivity)r=e(document).scrollTop(e(document).scrollTop()-n.scrollSpeed);else if(e(window).height()-(t.pageY-e(document).scrollTop())<n.scrollSensitivity)r=e(document).scrollTop(e(document).scrollTop()+n.scrollSpeed);if(t.pageX-e(document).scrollLeft()<n.scrollSensitivity)r=e(document).scrollLeft(e(document).scrollLeft()-n.scrollSpeed);else if(e(window).width()-(t.pageX-e(document).scrollLeft())<n.scrollSensitivity)r=e(document).scrollLeft(e(document).scrollLeft()+n.scrollSpeed)}if(r!==false&&e.ui.ddmanager&&!n.dropBehaviour)e.ui.ddmanager.prepareOffsets(this,t)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(var i=this.items.length-1;i>=0;i--){var s=this.items[i],o=s.item[0],u=this._intersectsWithPointer(s);if(!u)continue;if(o!=this.currentItem[0]&&this.placeholder[u==1?"next":"prev"]()[0]!=o&&!e.ui.contains(this.placeholder[0],o)&&(this.options.type=="semi-dynamic"?!e.ui.contains(this.element[0],o):true)){this.direction=u==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(s)){this._rearrange(t,s)}else{break}this._trigger("change",t,this._uiHash());break}}this._contactContainers(t);if(e.ui.ddmanager)e.ui.ddmanager.drag(this,t);this._trigger("sort",t,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(t,n){if(!t)return;if(e.ui.ddmanager&&!this.options.dropBehaviour)e.ui.ddmanager.drop(this,t);if(this.options.revert){var r=this;var i=r.placeholder.offset();r.reverting=true;e(this.helper).animate({left:i.left-this.offset.parent.left-r.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:i.top-this.offset.parent.top-r.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){r._clear(t)})}else{this._clear(t,n)}return false},cancel:function(){var t=this;if(this.dragging){this._mouseUp();if(this.options.helper=="original")this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");else this.currentItem.show();for(var n=this.containers.length-1;n>=0;n--){this.containers[n]._trigger("deactivate",null,t._uiHash(this));if(this.containers[n].containerCache.over){this.containers[n]._trigger("out",null,t._uiHash(this));this.containers[n].containerCache.over=0}}}if(this.placeholder[0].parentNode)this.placeholder[0].parentNode.removeChild(this.placeholder[0]);if(this.options.helper!="original"&&this.helper&&this.helper[0].parentNode)this.helper.remove();e.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});if(this.domPosition.prev){e(this.domPosition.prev).after(this.currentItem)}else{e(this.domPosition.parent).prepend(this.currentItem)}return this},serialize:function(t){var n=this._getItemsAsjQuery(t&&t.connected);var r=[];t=t||{};e(n).each(function(){var n=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[-=_](.+)/);if(n)r.push((t.key||n[1]+"[]")+"="+(t.key&&t.expression?n[1]:n[2]))});return r.join("&")},toArray:function(t){var n=this._getItemsAsjQuery(t&&t.connected);var r=[];t=t||{};n.each(function(){r.push(e(t.item||this).attr(t.attribute||"id")||"")});return r},_intersectsWith:function(e){var t=this.positionAbs.left,n=t+this.helperProportions.width,r=this.positionAbs.top,i=r+this.helperProportions.height;var s=e.left,o=s+e.width,u=e.top,a=u+e.height;var f=this.offset.click.top,l=this.offset.click.left;var c=r+f>u&&r+f<a&&t+l>s&&t+l<o;if(this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]){return c}else{return s<t+this.helperProportions.width/2&&n-this.helperProportions.width/2<o&&u<r+this.helperProportions.height/2&&i-this.helperProportions.height/2<a}},_intersectsWithPointer:function(t){var n=e.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,t.top,t.height),r=e.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,t.left,t.width),i=n&&r,s=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();if(!i)return false;return this.floating?o&&o=="right"||s=="down"?2:1:s&&(s=="down"?2:1)},_intersectsWithSides:function(t){var n=e.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),r=e.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),i=this._getDragVerticalDirection(),s=this._getDragHorizontalDirection();if(this.floating&&s){return s=="right"&&r||s=="left"&&!r}else{return i&&(i=="down"&&n||i=="up"&&!n)}},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;return e!=0&&(e>0?"down":"up")},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;return e!=0&&(e>0?"right":"left")},refresh:function(e){this._refreshItems(e);this.refreshPositions();return this},_connectWith:function(){var e=this.options;return e.connectWith.constructor==String?[e.connectWith]:e.connectWith},_getItemsAsjQuery:function(t){var n=this;var r=[];var i=[];var s=this._connectWith();if(s&&t){for(var o=s.length-1;o>=0;o--){var u=e(s[o]);for(var a=u.length-1;a>=0;a--){var f=e.data(u[a],"sortable");if(f&&f!=this&&!f.options.disabled){i.push([e.isFunction(f.options.items)?f.options.items.call(f.element):e(f.options.items,f.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),f])}}}}i.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(var o=i.length-1;o>=0;o--){i[o][0].each(function(){r.push(this)})}return e(r)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data(sortable-item)");for(var t=0;t<this.items.length;t++){for(var n=0;n<e.length;n++){if(e[n]==this.items[t].item[0])this.items.splice(t,1)}}},_refreshItems:function(t){this.items=[];this.containers=[this];var n=this.items;var r=this;var i=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]];var s=this._connectWith();if(s){for(var o=s.length-1;o>=0;o--){var u=e(s[o]);for(var a=u.length-1;a>=0;a--){var f=e.data(u[a],"sortable");if(f&&f!=this&&!f.options.disabled){i.push([e.isFunction(f.options.items)?f.options.items.call(f.element[0],t,{item:this.currentItem}):e(f.options.items,f.element),f]);this.containers.push(f)}}}}for(var o=i.length-1;o>=0;o--){var l=i[o][1];var c=i[o][0];for(var a=0,h=c.length;a<h;a++){var p=e(c[a]);p.data("sortable-item",l);n.push({item:p,instance:l,width:0,height:0,left:0,top:0})}}},refreshPositions:function(t){if(this.offsetParent&&this.helper){this.offset.parent=this._getParentOffset()}for(var n=this.items.length-1;n>=0;n--){var r=this.items[n];var i=this.options.toleranceElement?e(this.options.toleranceElement,r.item):r.item;if(!t){r.width=i.outerWidth();r.height=i.outerHeight()}var s=i.offset();r.left=s.left;r.top=s.top}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this)}else{for(var n=this.containers.length-1;n>=0;n--){var s=this.containers[n].element.offset();this.containers[n].containerCache.left=s.left;this.containers[n].containerCache.top=s.top;this.containers[n].containerCache.width=this.containers[n].element.outerWidth();this.containers[n].containerCache.height=this.containers[n].element.outerHeight()}}return this},_createPlaceholder:function(t){var n=t||this,r=n.options;if(!r.placeholder||r.placeholder.constructor==String){var i=r.placeholder;r.placeholder={element:function(){var t=e(document.createElement(n.currentItem[0].nodeName)).addClass(i||n.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!i)t.style.visibility="hidden";return t},update:function(e,t){if(i&&!r.forcePlaceholderSize)return;if(!t.height()){t.height(n.currentItem.innerHeight()-parseInt(n.currentItem.css("paddingTop")||0,10)-parseInt(n.currentItem.css("paddingBottom")||0,10))}if(!t.width()){t.width(n.currentItem.innerWidth()-parseInt(n.currentItem.css("paddingLeft")||0,10)-parseInt(n.currentItem.css("paddingRight")||0,10))}}}}n.placeholder=e(r.placeholder.element.call(n.element,n.currentItem));n.currentItem.after(n.placeholder);r.placeholder.update(n,n.placeholder)},_contactContainers:function(t){var n=null,r=null;for(var i=this.containers.length-1;i>=0;i--){if(e.ui.contains(this.currentItem[0],this.containers[i].element[0]))continue;if(this._intersectsWith(this.containers[i].containerCache)){if(n&&e.ui.contains(this.containers[i].element[0],n.element[0]))continue;n=this.containers[i];r=i}else{if(this.containers[i].containerCache.over){this.containers[i]._trigger("out",t,this._uiHash(this));this.containers[i].containerCache.over=0}}}if(!n)return;if(this.currentContainer!=this.containers[r]){var s=1e4;var o=null;var u=this.positionAbs[this.containers[r].floating?"left":"top"];for(var a=this.items.length-1;a>=0;a--){if(!e.ui.contains(this.containers[r].element[0],this.items[a].item[0]))continue;var f=this.items[a][this.containers[r].floating?"left":"top"];if(Math.abs(f-u)<s){s=Math.abs(f-u);o=this.items[a]}}if(!o&&!this.options.dropOnEmpty)return;this.currentContainer=this.containers[r];o?this._rearrange(t,o,null,true):this._rearrange(t,null,this.containers[r].element,true);this._trigger("change",t,this._uiHash());this.containers[r]._trigger("change",t,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder)}this.containers[r]._trigger("over",t,this._uiHash(this));this.containers[r].containerCache.over=1},_createHelper:function(t){var n=this.options;var r=e.isFunction(n.helper)?e(n.helper.apply(this.element[0],[t,this.currentItem])):n.helper=="clone"?this.currentItem.clone():this.currentItem;if(!r.parents("body").length)e(n.appendTo!="parent"?n.appendTo:this.currentItem[0].parentNode)[0].appendChild(r[0]);if(r[0]==this.currentItem[0])this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};if(r[0].style.width==""||n.forceHelperSize)r.width(this.currentItem.width());if(r[0].style.height==""||n.forceHelperSize)r.height(this.currentItem.height());return r},_adjustOffsetFromHelper:function(t){if(typeof t=="string"){t=t.split(" ")}if(e.isArray(t)){t={left:+t[0],top:+t[1]||0}}if("left"in t){this.offset.click.left=t.left+this.margins.left}if("right"in t){this.offset.click.left=this.helperProportions.width-t.right+this.margins.left}if("top"in t){this.offset.click.top=t.top+this.margins.top}if("bottom"in t){this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&e.ui.contains(this.scrollParent[0],this.offsetParent[0])){t.left+=this.scrollParent.scrollLeft();t.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&e.browser.msie)t={top:0,left:0};return{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var e=this.currentItem.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else{return{top:0,left:0}}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t=this.options;if(t.containment=="parent")t.containment=this.helper[0].parentNode;if(t.containment=="document"||t.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,e(t.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(e(t.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(t.containment)){var n=e(t.containment)[0];var r=e(t.containment).offset();var i=e(n).css("overflow")!="hidden";this.containment=[r.left+(parseInt(e(n).css("borderLeftWidth"),10)||0)+(parseInt(e(n).css("paddingLeft"),10)||0)-this.margins.left,r.top+(parseInt(e(n).css("borderTopWidth"),10)||0)+(parseInt(e(n).css("paddingTop"),10)||0)-this.margins.top,r.left+(i?Math.max(n.scrollWidth,n.offsetWidth):n.offsetWidth)-(parseInt(e(n).css("borderLeftWidth"),10)||0)-(parseInt(e(n).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,r.top+(i?Math.max(n.scrollHeight,n.offsetHeight):n.offsetHeight)-(parseInt(e(n).css("borderTopWidth"),10)||0)-(parseInt(e(n).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(t,n){if(!n)n=this.position;var r=t=="absolute"?1:-1;var i=this.options,s=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&e.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,o=/(html|body)/i.test(s[0].tagName);return{top:n.top+this.offset.relative.top*r+this.offset.parent.top*r-(e.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():o?0:s.scrollTop())*r),left:n.left+this.offset.relative.left*r+this.offset.parent.left*r-(e.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():o?0:s.scrollLeft())*r)}},_generatePosition:function(t){var n=this.options,r=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&e.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,i=/(html|body)/i.test(r[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0])){this.offset.relative=this._getRelativeOffset()}var s=t.pageX;var o=t.pageY;if(this.originalPosition){if(this.containment){if(t.pageX-this.offset.click.left<this.containment[0])s=this.containment[0]+this.offset.click.left;if(t.pageY-this.offset.click.top<this.containment[1])o=this.containment[1]+this.offset.click.top;if(t.pageX-this.offset.click.left>this.containment[2])s=this.containment[2]+this.offset.click.left;if(t.pageY-this.offset.click.top>this.containment[3])o=this.containment[3]+this.offset.click.top}if(n.grid){var u=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1];o=this.containment?!(u-this.offset.click.top<this.containment[1]||u-this.offset.click.top>this.containment[3])?u:!(u-this.offset.click.top<this.containment[1])?u-n.grid[1]:u+n.grid[1]:u;var a=this.originalPageX+Math.round((s-this.originalPageX)/n.grid[0])*n.grid[0];s=this.containment?!(a-this.offset.click.left<this.containment[0]||a-this.offset.click.left>this.containment[2])?a:!(a-this.offset.click.left<this.containment[0])?a-n.grid[0]:a+n.grid[0]:a}}return{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(e.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():i?0:r.scrollTop()),left:s-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(e.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:r.scrollLeft())}},_rearrange:function(e,t,n,r){n?n[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?t.item[0]:t.item[0].nextSibling);this.counter=this.counter?++this.counter:1;var i=this,s=this.counter;window.setTimeout(function(){if(s==i.counter)i.refreshPositions(!r)},0)},_clear:function(t,n){this.reverting=false;var r=[],i=this;if(!this._noFinalSort&&this.currentItem[0].parentNode)this.placeholder.before(this.currentItem);this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var s in this._storedCSS){if(this._storedCSS[s]=="auto"||this._storedCSS[s]=="static")this._storedCSS[s]=""}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else{this.currentItem.show()}if(this.fromOutside&&!n)r.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside))});if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!n)r.push(function(e){this._trigger("update",e,this._uiHash())});if(!e.ui.contains(this.element[0],this.currentItem[0])){if(!n)r.push(function(e){this._trigger("remove",e,this._uiHash())});for(var s=this.containers.length-1;s>=0;s--){if(e.ui.contains(this.containers[s].element[0],this.currentItem[0])&&!n){r.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this))}}.call(this,this.containers[s]));r.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this))}}.call(this,this.containers[s]))}}}for(var s=this.containers.length-1;s>=0;s--){if(!n)r.push(function(e){return function(t){e._trigger("deactivate",t,this._uiHash(this))}}.call(this,this.containers[s]));if(this.containers[s].containerCache.over){r.push(function(e){return function(t){e._trigger("out",t,this._uiHash(this))}}.call(this,this.containers[s]));this.containers[s].containerCache.over=0}}if(this._storedCursor)e("body").css("cursor",this._storedCursor);if(this._storedOpacity)this.helper.css("opacity",this._storedOpacity);if(this._storedZIndex)this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);this.dragging=false;if(this.cancelHelperRemoval){if(!n){this._trigger("beforeStop",t,this._uiHash());for(var s=0;s<r.length;s++){r[s].call(this,t)}this._trigger("stop",t,this._uiHash())}return false}if(!n)this._trigger("beforeStop",t,this._uiHash());this.placeholder[0].parentNode.removeChild(this.placeholder[0]);if(this.helper[0]!=this.currentItem[0])this.helper.remove();this.helper=null;if(!n){for(var s=0;s<r.length;s++){r[s].call(this,t)}this._trigger("stop",t,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){if(e.Widget.prototype._trigger.apply(this,arguments)===false){this.cancel()}},_uiHash:function(t){var n=t||this;return{helper:n.helper,placeholder:n.placeholder||e([]),position:n.position,originalPosition:n.originalPosition,offset:n.positionAbs,item:n.currentItem,sender:t?t.element:null}}});e.extend(e.ui.sortable,{version:"@VERSION",eventPrefix:"sort"})})(jQuery)