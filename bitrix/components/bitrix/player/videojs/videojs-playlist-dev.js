/**
 * videojs-playlist-thumbs
 * @version 0.1.5
 * @copyright 2016 Emmanuel Alves <manel.pb@gmail.com>
 * @license MIT
 */
(function(f){
	if(typeof exports==="object" && typeof module!=="undefined")
	{
		module.exports=f()
	}
	else if(typeof define==="function"&&define.amd)
	{
		define([],f)
	}
	else
	{
		var g;
		if(typeof this!=="undefined")
		{
			g=this
		}
		else if(typeof self!=="undefined")
		{
			g=self
		}
		else if(typeof window!=="undefined")
		{
			g=window
		}
		else if(typeof global!=="undefined")
		{
			g=global
		}
		g.videojsPlaylist = f()
	}
})(function()
{
	var define,module,exports;
	return (function e(t,n,r)
	{
		function s(o,u)
		{
			if(!n[o])
			{
				if(!t[o])
				{
					var a=typeof require=="function"&&require;
					if(!u&&a)
						return a(o,!0);
					if(i)
						return i(o,!0);
					var f=new Error("Cannot find module '"+o+"'");
					throw f.code="MODULE_NOT_FOUND",f
				}
				var l=n[o]={exports:{}};
				t[o][0].call(l.exports,function(e)
				{
					var n=t[o][1][e];
					return s(n?n:e)
				},l,l.exports,e,t,n,r)
			}return n[o].exports
		}
		var i=typeof require=="function"&&require;
		for(var o=0;o<r.length;o++)
			s(r[o]);
		return s
	})({1:[function(require,module,exports){
		(function (global){
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

			var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

			var _videoJs2 = _interopRequireDefault(_videoJs);

//var _videoJs2 = _interopRequireDefault(_videoJs);

// Default options for the plugin.
			var defaults = {
				thumbnailSize: 190,
				playlistItems: 3,
				hideIcons: false,
				upNext: true,
				hideSidebar: false,
				mobile: false
			};

			var player = undefined;
			var mobile = false;
			var currentIdx = [];
			var videos = [];
			var players = [];
			var playlistsElemens = [];
			var playlistsElemen = null;

			/**
			 * creates each video on the playlist
			 */
			var createVideoElement = function createVideoElement(player_id, idx, title, thumbnail) {
				var videoElement = document.createElement("li");
				var videoTitle = document.createElement("div");
				videoTitle.className = "vjs-playlist-video-title";

				if (idx == 0) {
					if (defaults.upNext) {
						var upNext = document.createElement("div");
						upNext.className = "vjs-playlist-video-upnext";
						upNext.innerText = "UP Next";

						videoTitle.appendChild(upNext);
					}
				}

				if (title) {
					var videoTitleText = document.createElement("div");
					videoTitleText.innerText = title;

					videoTitle.appendChild(videoTitleText); // = "<span>" + title + "</span>";

					videoElement.appendChild(videoTitle);
				}

				if (thumbnail)
					videoElement.setAttribute("style", "background-image: url('" + thumbnail + "');");
				videoElement.setAttribute("data-index", idx);

				// when the user clicks on the playlist, the video will start playing
				videoElement.onclick = function (ev) {

					var idx = parseInt(ev.target.getAttribute("data-index"));

					// updates the list and everything before this index should be moved to the end
					var videosBefore = videos[player_id].splice(0, idx);

					videosBefore.map(function (video) {
						// adds to the end of the array
						videos[player_id].push(video);
					});

					// and play this video
					updatePlaylistAndPlay(player_id, true);
				};

				return videoElement;
			};

			/**
			 * Function to invoke when the player is ready.
			 *
			 * This is a great place for your plugin to initialize itself. When this
			 * function is called, the player will have its DOM and child components
			 * in place.
			 *
			 * @function onPlayerReady
			 * @param    {Player} player
			 * @param    {Object} [options={}]
			 */
			var onPlayerReady = function onPlayerReady(player, options) {
				videos[player.id_] = options.videos;
				currentIdx[player.id_] = 0;
				mobile = options.playlist.mobile;

				if (options.playlist && options.playlist.thumbnailSize) {
					defaults.thumbnailSize = options.playlist.thumbnailSize.toString().replace("px", "");
				}

				if (options.playlist && options.playlist.items) {
					defaults.playlistItems = options.playlist.items;
				}

				if (options.playlist && options.playlist.hideIcons) {
					defaults.hideIcons = options.playlist.hideIcons;
				}

				if (options.playlist && options.playlist.hideSidebar) {
					defaults.hideSidebar = options.playlist.hideSidebar;
				}

				createElements(player, options);
				updateElementWidth(player);
			};

			var updatePlaylistAndPlayBack = function updatePlaylistAndPlayBack(player_id, autoplay) {

				if (!player_id)
				{
					player_id = player.id_;
				}

				var last = videos[player_id].splice(-1, 1);

				videos[player_id].unshift(last[0]);

				// clean the playlist
				while (playlistsElemens[player_id].firstChild) {
					playlistsElemens[player_id].removeChild(playlistsElemens[player_id].firstChild);
				}

				// add each video on the playlist
				videos[player_id].map(function (video, idx) {
					playlistsElemens[player_id].appendChild(createVideoElement(player_id, idx, video.title, video.thumbnail));
				});

				playVideo(player_id, videos[player_id].length-1, autoplay);

			};

			var updatePlaylistAndPlay = function updatePlaylistAndPlay(player_id, autoplay) {

				if (!player_id)
				{
					player_id = player.id_;
				}

				// plays the first video on the playlist
				playVideo(player_id, 0, autoplay);

				// and move this video to the end of the playlist
				var first = videos[player_id].splice(0, 1);

				// then add at the end of the array
				videos[player_id].push(first[0]);

				// clean the playlist
				while (playlistsElemens[player_id].firstChild) {
					playlistsElemens[player_id].removeChild(playlistsElemens[player_id].firstChild);
				}

				// add each video on the playlist
				videos[player_id].map(function (video, idx) {
					playlistsElemens[player_id].appendChild(createVideoElement(player_id, idx, video.title, video.thumbnail));
				});
			};

			/**
			 * Creates the root html elements for the playlist
			 */
			var createElements = function createElements(player, options) {
				// creates the playlist items and add on the video player
				playlistsElemen = document.createElement("ul");
				playlistsElemen.className = "vjs-playlist-items";

				if (!defaults.hideSidebar) {
					player.el().appendChild(playlistsElemen);
				}

				playlistsElemens[player.id_] = playlistsElemen;

				// plays the first video
				if (videos[player.id_].length > 0) {
					updatePlaylistAndPlay(player.id_,false);
				}

				// create next and previous button
				if (!defaults.hideIcons) {
					var prevBtn = document.createElement("button");
					prevBtn.className = "vjs-button-prev";
					prevBtn.onclick = onPrevClick;

					player.controlBar.el().insertBefore(prevBtn, player.controlBar.playToggle.el());

					var nextBtn = document.createElement("button");
					nextBtn.className = "vjs-button-next";
					nextBtn.onclick = onNextClick;

					player.controlBar.el().insertBefore(nextBtn, player.controlBar.volumeMenuButton.el());
				}

				// creates the loading next on video ends
				player.on("ended", createPlayingNext);

				// adds the main class on the player
				player.addClass('vjs-playlist');

			};

			var createPlayingNext = function createPlayingNext() {
				nextVideo();
			};

			var onNextClick = function onNextClick(ev) {
				var player_id = ev.target.parentNode.parentNode.id;
				nextVideo(player_id);
			};

			var onPrevClick = function onPrevClick(ev) {
				var player_id = ev.target.parentNode.parentNode.id;
				previousVideo(player_id);
			};

			/**
			 * updates the main video player width
			 */
			var updateElementWidth = function updateElementWidth(player) {
				var resize = function resize(p) {
					var itemWidth = defaults.thumbnailSize;

					var playerWidth = p.el().offsetWidth;
					var playerHeight = p.el().offsetHeight;
					var itemHeight = Math.round(playerHeight / defaults.playlistItems);

					var youtube = p.$(".vjs-tech");
					var newSize = playerWidth - itemWidth;

					if (newSize >= 0) {
						var style = document.createElement('style');
						var def = ' ' + '.vjs-playlist .vjs-poster { width: ' + newSize + 'px !important; }' + '.vjs-playlist .vjs-playlist-items { width: ' + itemWidth + 'px !important; }' + '.vjs-playlist .vjs-playlist-items li { width: ' + itemWidth + 'px !important; height: ' + itemHeight + 'px !important; }' + '.vjs-playlist .vjs-modal-dialog { width: ' + newSize + 'px !important; } ' + '.vjs-playlist .vjs-control-bar, .vjs-playlist .vjs-tech { width: ' + newSize + 'px !important; } ' + '.vjs-playlist .vjs-big-play-button, .vjs-playlist .vjs-loading-spinner { left: ' + Math.round(newSize / 2) + 'px !important; } ';

						style.setAttribute('type', 'text/css');
						document.getElementsByTagName('head')[0].appendChild(style);

						if (style.styleSheet) {
							style.styleSheet.cssText = def;
						} else {
							style.appendChild(document.createTextNode(def));
						}
					}
				};

				if (!defaults.hideSidebar) {
					window.onresize = function () {
						resize(player);
					};

					if (player) {
						resize(player);
					}
				}
			};

			/**
			 * plays the video based on an index
			 */
			var playVideo = function playVideo(player_id, idx, autoPlay) {

				if (!player_id)
				{
					player_id = player.id_;
				}

				var video = { type: videos[player_id][idx].type, src: videos[player_id][idx].src };

				players[player_id].src(video);
				players[player_id].poster(videos[player_id][idx].thumbnail);

				if (!mobile && (autoPlay || players[player_id].options_.autoplay)) {
					try {
						players[player_id].play();
					} catch (e) {}
				}
			};

			/**
			 * plays the next video, if it comes to the end, loop
			 */
			var nextVideo = function nextVideo(player_id) {

				if (!player_id)
				{
					player_id = player.id_;
				}

				if (currentIdx[player_id] < videos[player_id].length) {
					currentIdx[player_id]++;
				} else {
					currentIdx[player_id] = 0;
				}

				updatePlaylistAndPlay(player_id, true);
			};

			/**
			 * plays the previous video, if it comes to the first video, loop
			 */
			var previousVideo = function previousVideo(player_id) {
				if (!player_id)
				{
					player_id = player.id_;
				}
				if (currentIdx[player_id] > 0) {
					currentIdx[player_id]--;
				} else {
					currentIdx[player_id] = videos[player_id].length - 1;
				}
				//playVideo(player_id, currentIdx[player_id], true);
				//updatePlaylistAndPlay(player_id, true);
				updatePlaylistAndPlayBack(player_id, true);
			};

			/**
			 * A video.js plugin.
			 *
			 * In the plugin function, the value of `this` is a video.js `Player`
			 * instance. You cannot rely on the player being in a "ready" state here,
			 * depending on how the plugin is invoked. This may or may not be important
			 * to you; if not, remove the wait for "ready"!
			 *
			 * @function playlist
			 * @param    {Object} [options={}]
			 *           An object of options left to the plugin author to define.
			 */
			var playlist = function playlist(options) {

				var _this = this;

				this.ready(function () {
					player = _this;
					players[player.id_] = player;
					onPlayerReady(_this, _videoJs2["default"].mergeOptions(options, defaults));
				});
			};

			_videoJs2["default"].plugin('playlist', playlist);

			exports["default"] = playlist;
			module.exports = exports["default"];
		}).call(this,
			typeof this !== "undefined" ? this:
				typeof self !== "undefined" ? self :
					typeof global !== "undefined" ? global :
						typeof window !== "undefined" ? window : {}
		)
	},{}]},{},[1])(1)
});