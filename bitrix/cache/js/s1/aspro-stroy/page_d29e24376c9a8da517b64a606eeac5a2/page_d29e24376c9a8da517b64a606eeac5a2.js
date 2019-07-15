
; /* Start:"a:4:{s:4:"full";s:82:"/bitrix/components/bitrix/photogallery/templates/.default/script.js?15197088146106";s:6:"source";s:67:"/bitrix/components/bitrix/photogallery/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function debug_info(text)
{
	container_id = 'debug_info_forum';
	var div = document.getElementById(container_id);
	if (!div || div == null)
	{
		div = document.body.appendChild(document.createElement("DIV"));
		div.id = container_id;
//		div.className = "forum-debug";
		div.style.position = "absolute";
		div.style.width = "170px";
		div.style.padding = "5px";
		div.style.backgroundColor = "#FCF7D1";
		div.style.border = "1px solid #EACB6B";
		div.style.textAlign = "left";
		div.style.zIndex = '7900'; 
		div.style.fontSize = '11px'; 
		
		div.style.left = document.body.scrollLeft + (document.body.clientWidth - div.offsetWidth) - 5 + "px";
		div.style.top = document.body.scrollTop + 5 + "px";
	}
	if (typeof text == "object")
	{
		for (var ii in text)
		{
			div.innerHTML += ii + ': ' + text[ii] + "<br />";
		}
	}
	else
	{
		div.innerHTML += text + "<br />";
	}
	return;
}
/************************************************/

function PhotoPopupMenu()
{
	var _this = this;
	this.active = null;
	this.just_hide_item = false;
	this.events = null;
	
	this.PopupShow = function(div, pos, set_width, set_shadow, events)
	{
		this.PopupHide();
		if (!div) { return; } 
		if (typeof(pos) != "object") { pos = {}; } 

		this.active = div.id;
		
		if (set_width !== false && !div.style.width)
		{
			div.style.width = div.offsetWidth + 'px';
		}
		
		this.events = ((events && typeof events == "object") ? events : null);

		var res = jsUtils.GetWindowSize();
		
		pos['top'] = (pos['top'] ? pos['top'] : parseInt(res["scrollTop"] + res["innerHeight"]/2 - div.offsetHeight/2));
		pos['left'] = (pos['left'] ? pos['left'] : parseInt(res["scrollLeft"] + res["innerWidth"]/2 - div.offsetWidth/2));
		
		jsFloatDiv.Show(div, pos["left"], pos["top"], set_shadow, true, false);
		div.style.display = '';
		
		jsUtils.addEvent(document, "keypress", _this.OnKeyPress);
		
		var substrate = document.getElementById("photo_substrate");
		if (!substrate)
		{
			substrate = document.createElement("DIV");
			substrate.id = 	"photo_substrate";
			substrate.style.position = "absolute";
			substrate.style.display = "none";
			substrate.style.background = "#052635";
			substrate.style.opacity = "0.5";
			substrate.style.top = "0";
			substrate.style.left = "0";
			if (substrate.style.MozOpacity)
				substrate.style.MozOpacity = '0.5';
			else if (substrate.style.KhtmlOpacity)
				substrate.style.KhtmlOpacity = '0.5';
			if (jsUtils.IsIE())
		 		substrate.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity=50)";
			document.body.appendChild(substrate);
		}
		
		substrate.style.width = res["scrollWidth"] + "px";
		substrate.style.height = res["scrollHeight"] + "px";
		substrate.style.zIndex = 7500;
		substrate.style.display = 'block';
	}

	this.PopupHide = function()
	{
		this.active = (this.active == null && arguments[0] ? arguments[0] : this.active);
		
		this.CheckEvent('BeforeHide');
		
		var div = document.getElementById(this.active);
		if (div)
		{
			jsFloatDiv.Close(div);
			div.style.display = 'none';
			if (!this.just_hide_item) {div.parentNode.removeChild(div); } 
		}
		var substrate = document.getElementById("photo_substrate");
		if (substrate) { substrate.style.display = 'none'; } 

		this.active = null;
		
		jsUtils.removeEvent(document, "keypress", _this.OnKeyPress);
		
		this.CheckEvent('AfterHide');
		this.events = null;
	}

	this.CheckClick = function(e)
	{
		var div = document.getElementById(_this.active);
		
		if (!div || !_this.IsVisible()) { return; }
		if (!jsUtils.IsIE() && e.target.tagName == 'OPTION') { return false; }
		
		var x = e.clientX + document.body.scrollLeft;
		var y = e.clientY + document.body.scrollTop;

		/*menu region*/
		var posLeft = parseInt(div.style.left);
		var posTop = parseInt(div.style.top);
		var posRight = posLeft + div.offsetWidth;
		var posBottom = posTop + div.offsetHeight;
		
		if (x >= posLeft && x <= posRight && y >= posTop && y <= posBottom) { return; }

		if(_this.controlDiv)
		{
			var pos = jsUtils.GetRealPos(_this.controlDiv);
			if(x >= pos['left'] && x <= pos['right'] && y >= pos['top'] && y <= pos['bottom'])
				return;
		}
		_this.PopupHide();
	}

	this.OnKeyPress = function(e)
	{
		if(!e) e = window.event
		if(!e) return;
		if(e.keyCode == 27)
			_this.PopupHide();
	},

	this.IsVisible = function()
	{
		return (document.getElementById(this.active).style.visibility != 'hidden');
	}, 
	
	this.CheckEvent = function()
	{
		if (!this.events || this.events == null)
		{
			return false;
		}
		
		eventName = arguments[0];
		
		if (this.events[eventName]) 
		{ 
			return this.events[eventName](arguments); 
		} 
		return true;
	}
}
var PhotoMenu;
if (!PhotoMenu) 
	PhotoMenu = new PhotoPopupMenu();

var jsUtilsPhoto = {
	GetElementParams : function(element)
	{
		if (!element) return false;
		if (element.style.display != 'none' && element.style.display != null)
			return {width: element.offsetWidth, height: element.offsetHeight};
		var originstyles = {position: element.style.position, visibility : element.style.visibility, display: element.style.display};
		element.style.position = 'absolute';
		element.style.visibility = 'hidden';
		element.style.display = 'block';
		var result = {width: element.offsetWidth, height: element.offsetHeight};
		element.style.display = originstyles.display;
		element.style.visibility = originstyles.visibility;
		element.style.position = originstyles.position;
		return result;
	}, 
	ClassCreate : function(parent, properties)
	{
		function oClass() { 
			this.init.apply(this, arguments); 
		}
		
		if (parent) 
		{
			var temp = function() { };
			temp.prototype = parent.prototype;
			oClass.prototype = new temp;
		}
		
		for (var property in properties)
			oClass.prototype[property] = properties[property];
		if (!oClass.prototype.init)
			oClass.prototype.init = function() {};
		
		oClass.prototype.constructor = oClass;
		
		return oClass;
	}, 
	ObjectsMerge : function(arr1, arr2)
	{
		var arr3 = {};
		for (var key in arr1)
			arr3[key] = arr1[key];
		for (var key in arr2)
			arr3[key] = arr2[key];
		return arr3;
	}
}; 

window.bPhotoMainLoad = true;
/* End */
;
; /* Start:"a:4:{s:4:"full";s:96:"/bitrix/components/bitrix/photogallery.section.edit/templates/.default/script.js?151970881417623";s:6:"source";s:80:"/bitrix/components/bitrix/photogallery.section.edit/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(window) {
	window.BXPhotoList = function(Params)
	{
		var _this = this;
		this.id = Params.id;
		this.Params = Params;
		this.MESS = Params.MESS;
		this.currentPage = 1;
		this.Items = [];
		this.ItemsIndex = {};
		this.pForm = BX('form_photo');
		this.Params.navPageCount = parseInt(this.Params.navPageCount) || 0;
		this.Params.navPageSize = parseInt(this.Params.navPageSize) || 0;
		this.Params.itemsCount = parseInt(this.Params.itemsCount) || 0;
		this.Params.thumbSize = parseInt(this.Params.thumbSize) || 0;

		if (this.Params.itemsCount > 0)
		{
			this.pMorePhoto = BX('more_photos' + this.id);
			if (this.pMorePhoto)
			{
				this.pMorePhoto.onclick = BX.proxy(this.ShowMore, this);
				this.pMorePhotoCont = this.pMorePhoto.parentNode;
			}
			this.pList = BX('bxph_elements_list' + this.id);
			this.thumbSize = parseInt(Params.thumbSize) || 100;
			this.pNfromM = BX('bxph_n_from_m' +  + this.id);
			this.pSellAll = BX('bxph_sel_all' + this.id);
			this.pSellAll.onclick = BX.proxy(this.SelectAll, this);

			this.pMultiMove = BX('bxph_multi_move' + this.id);
			this.pMultiDel = BX('bxph_multi_del' + this.id);
			this.pMultiMove.style.visibility = this.pMultiDel.style.visibility = "hidden";

			this.pMultiMoveCont = this.pMultiMove.parentNode;
			this.pMultiMove.onclick = function()
			{
				if (_this.pMultiMovePopup && _this.pMultiMovePopup.isOpen)
					_this.CloseMultipleMovePopup();
				else
					_this.ShowMultipleMovePopup();
			};
			this.pMultiDel.onclick = BX.proxy(this.MultipleDel, this);

			this.ShowNewItems(Params.items);
			this.bHiddenControls = true;

			if (this.Params.showTags)
			{
				this.pTagsControl = this.pForm.PHOTOS_TAGS;
				BX.bind(this.pTagsControl, "blur", BX.proxy(this.HideTagsInput, this));
				BX.bind(this.pTagsControl, "change", BX.proxy(this.SaveTags, this));
				BX.bind(this.pTagsControl, "keyup", BX.proxy(this.SaveTags, this));
			}
		}

		if (!this.Params.bAfterUpload)
		{
			this.pAddSetLink = BX('bxph_add_set_link' + this.id);
			this.pAddSetCont = BX('bxph_add_set_cont' + this.id);

			this.bShowedAddSet = false;
			this.pAddSetLink.onclick = function()
			{
				_this.bShowedAddSet = !_this.bShowedAddSet;
				if (_this.bShowedAddSet)
					BX.removeClass(_this.pAddSetCont, "photo-al-ed-add-hidden");
				else
					BX.addClass(_this.pAddSetCont, "photo-al-ed-add-hidden");
			};

			this.pUsePassword = BX('bxph_use_password' + this.id);
			this.pUsePasswordCont = BX('bxph_use_password_cont');

			this.pUsePassword.onclick = function()
			{
				if (_this.Params.bPassword)
				{
					BX('DROP_PASSWORD').value = this.checked ? "N" : "Y";
				}
				else
				{
					if (this.checked)
					{
						BX.addClass(_this.pUsePasswordCont, "bxph-show-pass-cont");
						BX('bxph_photo_password').value = "";
						BX('bxph_photo_password').focus();
					}
					else
					{
						BX.removeClass(_this.pUsePasswordCont, "bxph-show-pass-cont");
					}
				}
			};
		}
	};

	window.BXPhotoList.prototype = {
		ShowMore: function()
		{
			var _this = this;
			BX.addClass(this.pMorePhotoCont, "photo-ed-al-show-more-loading");

			this.currentPage++;
			BX.ajax.get(
				this.Params.actionUrl,
				{
					bx_photo_action: 'load_items',
					bx_photo_nav_page: this.currentPage
				},
				function(res)
				{
					setTimeout(function(){
						_this.ShowNewItems(window.bx_load_items_res);
						BX.removeClass(_this.pMorePhotoCont, "photo-ed-al-show-more-loading");

						if (_this.currentPage >=  _this.Params.navPageCount)
							_this.pMorePhotoCont.style.display = "none";
					}, 100);
				}
			)
		},

		AddElement: function(Item)
		{
			if (typeof Item != 'object' || !Item.id || !Item.src)
				return;

			var
				_this = this,
				inpName = 'ITEMS[' + Item.id + ']',
				pItem = this.pList.appendChild(BX.create("DIV", {props: {id: 'bxph_element_' + this.id + '_' + Item.id, className: 'photo-ed-al-item'}})),
				pThumb = pItem.appendChild(BX.create("DIV", {props: {className: 'photo-ed-al-item-thumb'}})).appendChild(BX.create("DIV", {props: {className: 'photo-ed-al-item-thumb-inner'}})),
				pThumbImg = pThumb.appendChild(BX.create("A", {props: {href: Item.url, target: '_blank'}})).appendChild(BX.create("IMG", {props: {src: Item.src}}));

			pThumb.style.width = this.thumbSize + "px";
			pThumb.style.height = this.thumbSize + "px";

			this.AdjustThumb(pThumbImg, Item.width, Item.height);

			var pParams = pItem.appendChild(BX.create("DIV", {props: {className: 'photo-ed-al-item-params'}}));
			if (this.Params.showTitle)
			{
				pParams.appendChild(BX.create("label", {props: {className: 'photo-al-ed-label-top', 'for': 'bxph_title_' + Item.id}, text: this.MESS.albumTitle}));
				var pTitle = pParams.appendChild(BX.create("input", {props: {className: 'photo-al-ed-width', id: 'bxph_title_' + Item.id, type: 'text', value: Item.title, name: inpName + '[title]'}}));
				pTitle.onchange = pTitle.onblur = pTitle.onkeyup = function()
				{
					var item = _this.Items[_this.ItemsIndex[parseInt(this.id.substr('bxph_title_'.length))]];
					if (item.pChanged.value == "N" && this.value != item.oItem.title)
						item.pChanged.value = "Y";
				};
			}

			pParams.appendChild(BX.create("label", {props: {className: 'photo-al-ed-label-top', 'for': 'bxph_desc_' + Item.id}, text: this.MESS.albumDesc}));
			var pDesc = pParams.appendChild(BX.create("textarea", {props: {className: 'photo-al-ed-width', id: 'bxph_desc_' + Item.id, name: inpName + '[desc]'}}));
			pDesc.value = Item.description;
			pDesc.onchange = pDesc.onblur = pDesc.onkeyup = function()
			{
				var item = _this.Items[_this.ItemsIndex[parseInt(this.id.substr('bxph_desc_'.length))]];
				if (item.pChanged.value == "N" && this.value != item.oItem.description)
					item.pChanged.value = "Y";
			};

			var pTags, pTagLink;
			if (this.Params.showTags)
			{
				pTags = pParams.appendChild(BX.create("input", {props: {type: 'hidden', name: inpName + '[tags]', value: Item.tags || "", title: this.MESS.EditTags}}));
				pTagLink = pParams.appendChild(BX.create("a", {props: {className: 'photo-al-ed-tags-link'}, text: this.MESS.addTags}));
				if (Item.tags != "")
				{
					pTagLink.innerHTML = BX.util.htmlspecialchars(Item.tags);
					BX.addClass(pTagLink, "photo-tags");
				}
				pTagLink.id = 'bxph_edit_tag_link' + Item.id;
				pTagLink.onclick = function(){_this.ShowTagsInput(parseInt(this.id.substr('bxph_edit_tag_link'.length)));};
			}
			var pCheck = pParams.appendChild(BX.create("input", {props: {className: 'photo-al-ed-item-check', type: 'checkbox', name: inpName + '[checked]', value: "Y"}}));
			pCheck.onclick = function(){_this.CheckMultipleControls(this.checked);};

			// Controls
			pParams.appendChild(BX.create("a", {props: {className: 'photo-al-ed-action', id: 'photo_del_' + Item.id}, text: this.MESS.del})).onclick = function(){_this.DeleteElement(parseInt(this.id.substr('photo_del_'.length)));};
			pParams.appendChild(BX.create("DIV", {props: {className: 'photo-al-ed-rotate photo-al-ed-rotate-l', id: 'photo_rotate_l_' + Item.id, title: this.MESS.rotateLeft}})).onclick = function(){_this.Rotate(parseInt(this.id.substr('photo_rotate_l_'.length)), 'left');};
			pParams.appendChild(BX.create("DIV", {props: {className: 'photo-al-ed-rotate photo-al-ed-rotate-r', id: 'photo_rotate_r_' + Item.id, title: this.MESS.rotateRight}})).onclick = function(){_this.Rotate(parseInt(this.id.substr('photo_rotate_r_'.length)), 'right');};
			pItem.appendChild(BX.create("a", {props: {className: 'photo-al-ed-action photo-al-ed-action-restore', id: 'photo_restore_' + Item.id}, text: this.MESS.restore})).onclick = function(){_this.RestoreElement(parseInt(this.id.substr('photo_restore_'.length)));};

			var pAnge = pParams.appendChild(BX.create("input", {props: {type: 'hidden', name: inpName + '[angle]', value: 0}}));
			var pDel = pParams.appendChild(BX.create("input", {props: {type: 'hidden', name: inpName + '[deleted]', value: "N"}}));
			var pChanged = pParams.appendChild(BX.create("input", {props: {type: 'hidden', name: inpName + '[changed]', value: "N"}}));

			this.Items.push({
				oItem: Item,
				pWnd: pItem,
				pCheck: pCheck,
				pThumb: pThumb,
				ange: 0,
				pAnge: pAnge,
				pTags: pTags,
				pTagLink: pTagLink,
				pDel: pDel,
				pChanged: pChanged
			});
			this.ItemsIndex[Item.id] = this.Items.length - 1;
		},

		AdjustThumb: function(img, w, h)
		{
			w = parseInt(w);
			h = parseInt(h);
			if (!w || !h)
				return;

			var r = w / h;
			if (r > 1)
			{
				img.style.width = (this.thumbSize * r) + "px";
				img.style.height = this.thumbSize + "px";
				img.style.left = Math.round((this.thumbSize - this.thumbSize * r /* width*/) / 2) + "px";
				img.style.top = 0;
			}
			else
			{
				img.style.height = Math.round(this.thumbSize / r) + "px";
				img.style.width = this.thumbSize + "px";
				img.style.top = Math.round((this.thumbSize - this.thumbSize / r /* height*/) / 2) + "px";
				img.style.left = 0;
			}
		},

		ShowNewItems: function(arItems)
		{
			if (typeof arItems != 'object')
				return;
			for (var id in arItems)
				this.AddElement(arItems[id]);

			// Update counters in the title and in the "Show more" button
			var len = parseInt(this.Items.length);
			var wholeCount = parseInt(this.Params.itemsCount);
			var text = this.MESS.nFromM.replace('#SHOWED#', len);
			text = text.replace('#COUNT#', wholeCount);
			this.pNfromM.innerHTML = " " + text;

			var delta = wholeCount - len;
			if (delta > this.Params.navPageSize)
				delta = parseInt(this.Params.navPageSize);
			var text = this.MESS.nFromM.replace('#SHOWED#', delta);
			text = text.replace('#COUNT#', wholeCount - len);
			if (this.pMorePhoto)
				this.pMorePhoto.innerHTML = this.MESS.MorePhotos + " " + text ;
		},

		DeleteElement: function(id)
		{
			var Item = this.GetItem(id);
			if (Item)
			{
				Item.pDel.value = "Y";
				BX.addClass(Item.pWnd, 'photo-ed-al-item-deleted');
			}
		},

		RestoreElement: function(id)
		{
			var Item = this.GetItem(id);
			if (Item)
			{
				Item.pDel.value = "N";
				BX.removeClass(Item.pWnd, 'photo-ed-al-item-deleted');
			}
		},

		Rotate: function(id, type)
		{
			var Item = this.GetItem(id);
			if (Item)
			{
				if (type == 'left')
					Item.ange -= 90;
				else
					Item.ange += 90;

				if (Item.ange < 0)
					Item.ange = 360 + Item.ange;
				else if (Item.ange == 360)
					Item.ange = 0;

				Item.pAnge.value = Item.ange;
				if (BX.browser.IsIE() && BX.browser.IsDoctype())  //
				{
					var
						link = Item.pThumb.firstChild,
						img = Item.pThumb.firstChild.firstChild;

					var
						top = img.getAttribute("data-bx-top"),
						left = img.getAttribute("data-bx-left");

					if (top === null)
						img.setAttribute("data-bx-top", img.style.top);
					else
						img.style.top = top;

					if (left === null)
						img.setAttribute("data-bx-left", img.style.left);
					else
						img.style.left = left;

					// Following code used to correct IE9 rotation specifics
					if (BX.browser.IsIE9())
					{
						link.className = 'photo-rotate-ie9-' + Item.ange;
						if (Item.ange == 90)
						{
							img.style.top = ( - parseInt(img.style.height) - parseInt(img.style.top)) + 'px';
							img.style.left = img.getAttribute("data-bx-left");
						}
						else if (Item.ange == 180)
						{
							img.style.top = ( - parseInt(img.style.height) - parseInt(img.style.top)) + 'px';
							img.style.left = ( - parseInt(img.style.width) - parseInt(img.style.left)) + 'px';
						}
						else if (Item.ange == 270)
						{
							img.style.left = ( - parseInt(img.style.width) - parseInt(img.style.left)) + 'px';
							img.style.top = img.getAttribute("data-bx-top");
						}
					}
					else
					{
						img.className = 'photo-rotate-' + Item.ange;
						var top1 = parseInt(img.style.top);
						var left1 = parseInt(img.style.left);
						if (Item.ange == 90)
						{
							img.style.top = left1 + 'px';
							img.style.left = top1 + 'px';
						}
						else if (Item.ange == 180)
						{
							img.style.top = 0 + 'px';
							img.style.left = 0 + 'px';
						}
						else if (Item.ange == 270)
						{
							img.style.left = 0 + 'px';
							img.style.top = 0  + 'px';
						}
					}
				}
				else
				{
					Item.pThumb.className = 'photo-ed-al-item-thumb-inner photo-rotate-' + Item.ange;
				}
				Item.pChanged.value = "Y";
			}
		},

		GetItem:function(id)
		{
			if (typeof this.ItemsIndex[id] == 'undefined' || !this.Items[this.ItemsIndex[id]])
				return false;
			return this.Items[this.ItemsIndex[id]];
		},

		SelectAll: function()
		{
			this.bSelectAll = !this.bSelectAll;
			if (this.bSelectAll)
				BX.addClass(this.pSellAll, "photo-ed-al-desel-all");
			else
				BX.removeClass(this.pSellAll, "photo-ed-al-desel-all");

			var i, l = this.Items.length;
			for (i = 0; i < l; i++)
				this.Items[i].pCheck.checked = this.bSelectAll;

			this.CheckMultipleControls(this.bSelectAll);
		},

		MultipleDel: function()
		{
			if (confirm(this.MESS.MultiDelConfirm))
			{
				this.pForm.multiple_action.value = 'delete';
				this.pForm.submit();
			}
		},

		MultipleMoveTo: function(id)
		{
			if (confirm(this.MESS.MultiMoveConfirm) && id > 0)
			{
				this.pForm.move_to.value = id;
				this.pForm.multiple_action.value = 'move';
				this.pForm.submit();
			}
		},

		ShowMultipleMovePopup: function()
		{
			var _this = this;
			if (!this.pMultiMovePopup)
			{
				this.pMultiMovePopup = new BX.CWindow(BX('bxph_multi_move_popup' + this.id), 'float');
				var i = 0, l = this.pMultiMovePopup.Get().childNodes.length, child, count = 0, maxWidth = 100;

				for (i = 0; i < l; i++)
				{
					child = this.pMultiMovePopup.Get().childNodes[i];
					if (child && child.id && child.id.substr(0, 'bxph_sect'.length) == 'bxph_sect')
					{
						count++;
						w = child.innerHTML.length * 8 + parseInt(child.style.paddingLeft);
						if (w > maxWidth)
							maxWidth = w;
						child.onmousedown = function(e)
						{
							_this.MultipleMoveTo(parseInt(this.id.substr('bxph_sect'.length)));
							return BX.PreventDefault(e);
						};
					}
				}
				this.pMultiMovePopup.Get().style.height = (count * 20) + "px";
				this.pMultiMovePopup.Get().style.width = maxWidth + "px";
			}

			BX.addClass(this.pMultiMovePopup.Get(), "photo-ed-al-move-popup");
			this.pMultiMovePopup.Show();
			var pos = BX.pos(this.pMultiMoveCont);
			this.pMultiMovePopup.Get().style.top = (pos.top + 18) + 'px';
			this.pMultiMovePopup.Get().style.left = (pos.left - 2) + 'px';

			setTimeout(function(){BX.bind(document, "click", BX.proxy(_this.CloseMultipleMovePopup, _this));}, 20);
		},

		CloseMultipleMovePopup: function()
		{
			this.pMultiMovePopup.Close();
			BX.unbind(document, "click", BX.proxy(this.CloseMultipleMovePopup, this));
		},

		CheckMultipleControls: function(checked)
		{
			var vis = "hidden";
			if (!checked)
			{
				var i, l = this.Items.length;
				for (i = 0; i < l; i++)
				{
					if (this.Items[i].pCheck.checked)
					{
						vis = "visible";
						break;
					}
				}
			}
			else
			{
				vis = "visible";
			}
			this.pMultiMove.style.visibility = this.pMultiDel.style.visibility = vis;
		},

		DoMultipleAction: function(action, Params)
		{
			this.pForm.multiple_action.value = action;
			bx_move_to: Params.albumId;
			this.pForm.submit();

			return;
			var _this = this, i, l = this.Items.length, arSelectedIds = [], arLast = [], arLastIndex = {}, pWnd;
			for (i = 0; i < l; i++)
			{
				if (this.Items[i].pCheck.checked)
					arSelectedIds.push(this.Items[i].oItem.id);
				else
				{
					arLast.push(this.Items[i]);
					arLastIndex[this.Items[i].oItem.id] = arLast.length - 1;
				}
				//this.Items[i].pCheck.checked = this.bSelectAll;
			}

			var par = {
				bx_photo_action: 'multi_' + action,
				bx_id: arSelectedIds
			};
			if (action == 'move')
				bx_move_to: Params.albumId;

			BX.ajax.get(
				this.Params.actionUrl,
				par,
				function(res)
				{
					setTimeout(function(){
						// BX.removeClass(_this.pMorePhotoCont, "photo-ed-al-show-more-loading");

						l = arSelectedIds.length;
						for (i = 0; i < l; i++)
						{
							pWnd = _this.Items[_this.ItemsIndex[arSelectedIds[i]]].pWnd;
							pWnd.parentNode.removeChild(pWnd);
						}
						_this.ItemsIndex = arLastIndex;
						_this.Items = arLast;
					}, 100);
				}
			)
		},

		ShowTagsInput: function(id)
		{
			this.HideTagsInput();
			var Item = this.GetItem(id);
			if (Item)
			{
				this.curTagItem = Item;
				Item.pTagLink.parentNode.appendChild(this.pTagsControl);
				Item.pTagLink.style.display = "none";
				this.pTagsControl.style.display = "";
				this.pTagsControl.value = Item.pTags.value;
			}
		},

		HideTagsInput: function()
		{
			if (this.curTagItem)
			{
				// Check if the tags popup showed - don't collapse input
				this.pTagsControlDiv = BX(this.pTagsControl.id + "_div");
				if (this.pTagsControlDiv && this.pTagsControlDiv.style.display != "none")
					return this.SaveTags();

				this.curTagItem.pTagLink.style.display = "";
				this.pTagsControl.style.display = "none";
				this.SaveTags();

				if (this.pTagsControl.value != "")
				{
					this.curTagItem.pTagLink.innerHTML = BX.util.htmlspecialchars(this.pTagsControl.value);
					BX.addClass(this.curTagItem.pTagLink, "photo-tags");
				}
				else
				{
					this.curTagItem.pTagLink.innerHTML = BX.util.htmlspecialchars(this.MESS.addTags);
					BX.removeClass(this.curTagItem.pTagLink, "photo-tags");
				}
				this.curTagItem = false;
			}
		},

		SaveTags: function()
		{
			if (this.curTagItem)
			{
				this.curTagItem.pTags.value = this.pTagsControl.value;
				this.curTagItem.pChanged.value = "Y";
			}
		}
	};

})(window);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:95:"/bitrix/components/bitrix/photogallery.section.list/templates/.default/script.js?15197088137387";s:6:"source";s:80:"/bitrix/components/bitrix/photogallery.section.list/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function EditAlbum(url)
{
	var oEditAlbumDialog = new BX.CDialog({
		title : '',
		content_url: url + (url.indexOf('?') !== -1 ? "&" : "?") + "AJAX_CALL=Y",
		buttons: [BX.CDialog.btnSave, BX.CDialog.btnCancel],
		width: 600,
		height: 400
	});
	oEditAlbumDialog.Show();

	BX.addCustomEvent(oEditAlbumDialog, "onWindowRegister", function(){
		oEditAlbumDialog.adjustSizeEx();
		var pName = BX('bxph_name');

		if (pName) // Edit album properies
		{
			BX.focus(pName);
			if (BX('bxph_pass_row'))
			{
				BX('bxph_use_password').onclick = function()
				{
					var ch = !!this.checked;
					BX('bxph_pass_row').style.display = ch ? '' : 'none';
					BX('bxph_photo_password').disabled = !ch;
					if (ch)
						BX.focus(BX('bxph_photo_password'));

					oEditAlbumDialog.adjustSizeEx();
				};
			}
		}
		else // Edit album icon
		{
		}
	});

	oEditAlbumDialog.ClearButtons();
	oEditAlbumDialog.SetButtons([
		new BX.CWindowButton(
		{
			title: BX.message('JS_CORE_WINDOW_SAVE'),
			id: 'savebtn',
			action: function()
			{
				var pForm = oEditAlbumDialog.Get().getElementsByTagName('form')[0];
				if (pForm.action.indexOf('icon') == -1)
					CheckForm(pForm);
				else // Edit album icon
					CheckFormEditIcon(pForm);
			}
		}),
		oEditAlbumDialog.btnCancel
	]);

	window.oPhotoEditAlbumDialog = oEditAlbumDialog;
}

function CheckForm(form)
{
	if (typeof form != "object")
		return false;

	oData = {"AJAX_CALL" : "Y"};
	for (var ii in form.elements)
	{
		if (form.elements[ii] && form.elements[ii].name)
		{
			if (form.elements[ii].type && form.elements[ii].type.toLowerCase() == "checkbox")
			{
				if (form.elements[ii].checked == true)
					oData[form.elements[ii].name] = form.elements[ii].value;
			}
			else
				oData[form.elements[ii].name] = form.elements[ii].value;
		}
	}

	BX.showWait('photo_window_edit');
	window.oPhotoEditAlbumDialogError = false;

	BX.ajax.post(
		form.action,
		oData,
		function(data)
		{
			setTimeout(function(){
				BX.closeWait('photo_window_edit');
				result = {};

				if (window.oPhotoEditAlbumDialogError !== false)
				{
					var errorTr = BX("bxph_error_row");
					errorTr.style.display = "";
					errorTr.cells[0].innerHTML = window.oPhotoEditAlbumDialogError;
					window.oPhotoEditAlbumDialog.adjustSizeEx();
				}
				else
				{
					try
					{
						eval("result = " + data + ";");
						if (result['url'] && result['url'].length > 0)
							BX.reload(result['url']);

						var arrId = {"NAME" : "photo_album_name_", "DATE" : "photo_album_date_", "DESCRIPTION" : "photo_album_description_"};
						for (var ID in arrId)
						{
							if (BX(arrId[ID] + result['ID']))
								BX(arrId[ID] + result['ID']).innerHTML = result[ID];
						}
						var res = BX('photo_album_info_' + result['ID']);

						if (res)
						{
							if (result['PASSWORD'].length <= 0)
								res.className = res.className.replace("photo-album-password", "");
							else
								res.className += " photo-album-password ";
						}
						window.oPhotoEditAlbumDialog.Close();
					}
					catch(e)
					{
						var errorTr = BX("bxph_error_row");
						errorTr.style.display = "";
						errorTr.cells[0].innerHTML = BXPH_MESS.UnknownError;
						window.oPhotoEditAlbumDialog.adjustSizeEx();
					}
				}
			}, 200);
		}
	);
}

function CheckFormEditIcon(form)
{
	if (typeof form != "object")
		return false;

	oData = {"AJAX_CALL" : "Y"};
	for (var ii in form.elements)
	{
		if (form.elements[ii] && form.elements[ii].name)
		{
			if (form.elements[ii].type && form.elements[ii].type.toLowerCase() == "checkbox")
			{
				if (form.elements[ii].checked == true)
					oData[form.elements[ii].name] = form.elements[ii].value;
			}
			else
				oData[form.elements[ii].name] = form.elements[ii].value;
		}
	}
	oData["photos"] = [];
	for (var ii = 0; ii < form.elements["photos[]"].length; ii++)
	{
		if (form.elements["photos[]"][ii].checked == true)
			oData["photos"].push(form.elements["photos[]"][ii].value);
	}

	BX.showWait('photo_window_edit');
	window.oPhotoEditIconDialogError = false;

	BX.ajax.post(
		form.action,
		oData,
		function(data)
		{
			setTimeout(function(){
				BX.closeWait('photo_window_edit');
				var result = {};

				if (window.oPhotoEditIconDialogError !== false)
				{
					var errorCont = BX("bxph_error_cont");
					errorCont.style.display = "";
					errorCont.innerHTML = window.oPhotoEditIconDialogError + "<br/>";
					window.oPhotoEditAlbumDialog.adjustSizeEx();
				}
				else
				{
					try
					{
						eval("result = " + data + ";");
					}
					catch(e)
					{
						result = {};
					}

					if (parseInt(result["ID"]) > 0)
					{
						if (BX("photo_album_img_" + result['ID']))
							BX("photo_album_img_" + result['ID']).src = result['SRC'];
						else if (BX("photo_album_cover_" + result['ID']))
							BX("photo_album_cover_" + result['ID']).style.backgroundImage = "url('" + result['SRC'] + "')";
						window.oPhotoEditAlbumDialog.Close();
					}
					else
					{
						var errorTr = BX("bxph_error_row");
						errorTr.style.display = "";
						errorTr.cells[0].innerHTML = BXPH_MESS.UnknownError;
						window.oPhotoEditAlbumDialog.adjustSizeEx();
					}
				}
			}, 200);
		}
	);
}

function DropAlbum(url, id)
{
	BX.showWait('photo_window_edit');
	window.oPhotoEditAlbumDialogError = false;

	if (id > 0)
	{
		var pAlbum = BX("photo_album_info_" + id);
		if (pAlbum)
			pAlbum.style.display = "none";
	}

	BX.ajax.post(
		url,
		{"AJAX_CALL" : "Y"},
		function(data)
		{
			setTimeout(function(){
				BX.closeWait('photo_window_edit');

				if (window.oPhotoEditAlbumDialogError !== false)
					return alert(window.oPhotoEditAlbumDialogError);

				try
				{
					eval("result = " + data + ";");
					if (result['ID'])
					{
						var pAlbum = BX("photo_album_info_" + result['ID']);
						if (pAlbum && pAlbum.parentNode)
							pAlbum.parentNode.removeChild(pAlbum);
					}
				}
				catch(e)
				{
					if (id > 0)
					{
						var pAlbum = BX("photo_album_info_" + id);
						if (pAlbum && pAlbum.parentNode)
							pAlbum.style.display = "";
					}

					if (window.BXPH_MESS)
						return alert(window.BXPH_MESS.UnknownError);
				}
			}, 200);
		}
	);

	return false;
}

window.__photo_check_name_length_count = 0;
function __photo_check_name_length()
{
	var nodes = document.getElementsByTagName('a');
	var result = false;
	for (var ii = 0; ii < nodes.length; ii++)
	{
		var node = nodes[ii];
		if (!node.id.match(/photo\_album\_name\_(\d+)/gi))
			continue;
		result = true;
		if (node.offsetHeight <= node.parentNode.offsetHeight)
			continue;
		var div = node.parentNode;
		var text = node.innerHTML.replace(/\<wbr\/\>/gi, '').replace(/\<wbr\>/gi, '').replace(/\&shy\;/gi, '');
		while (div.offsetHeight < node.offsetHeight || div.offsetWidth < node.offsetWidth)
		{
			if ((div.offsetHeight  < (node.offsetHeight / 2)) || (div.offsetWidth < (node.offsetWidth / 2)))
				text = text.substr(0, parseInt(text.length / 2));
			else
				text = text.substr(0, (text.length - 2));
			node.innerHTML = text;
		}
		node.innerHTML += '...';
		if (div.offsetHeight < node.offsetHeight || div.offsetWidth < node.offsetWidth)
			node.innerHTML = text.substr(0, (text.length - 3)) + '...';
	}
	if (!result)
	{
		window.__photo_check_name_length_count++;
		if (window.__photo_check_name_length_count < 7)
			setTimeout(__photo_check_name_length, 250);
	}
}
setTimeout(__photo_check_name_length, 250);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:71:"/bitrix/components/bitrix/system.field.edit/script.min.js?1519708813814";s:6:"source";s:53:"/bitrix/components/bitrix/system.field.edit/script.js";s:3:"min";s:57:"/bitrix/components/bitrix/system.field.edit/script.min.js";s:3:"map";s:57:"/bitrix/components/bitrix/system.field.edit/script.map.js";}"*/
function addElement(e,n){if(document.getElementById("main_"+e)){var d=document.getElementById("main_"+e).getElementsByTagName("div");if(d&&d.length>0&&d[0]){var t=d[0].parentNode;t.appendChild(d[d.length-1].cloneNode(true))}}}function addElementFile(e,n){var d=document.getElementById("main_"+e);var t=document.getElementById("main_add_"+e);if(d&&t){t=t.cloneNode(true);t.id="";t.style.display="";d.appendChild(t)}}function addElementDate(e,n){var d=document.getElementById("date_container_"+n);var t=document.getElementById("hidden_"+n).innerHTML;if(d&&t){var a=e[n].fieldName;var i=e[n].index;t=t.replace(/[#]FIELD_NAME[#]/g,a+"["+i+"]");t=t.replace(/[\%]23FIELD_NAME[\%]23/g,escape(a+"["+i+"]"));var l=d.appendChild(document.createElement("DIV"));l.innerHTML+=t;e[n].index++}}
/* End */
;; /* /bitrix/components/bitrix/photogallery/templates/.default/script.js?15197088146106*/
; /* /bitrix/components/bitrix/photogallery.section.edit/templates/.default/script.js?151970881417623*/
; /* /bitrix/components/bitrix/photogallery.section.list/templates/.default/script.js?15197088137387*/
; /* /bitrix/components/bitrix/system.field.edit/script.min.js?1519708813814*/

//# sourceMappingURL=page_d29e24376c9a8da517b64a606eeac5a2.map.js