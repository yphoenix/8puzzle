/**
 * @package 8 Puzzle
 * @subpackage JS
 * @author Yorick Phoenix <yphoenix@scribblings.com>
 * @copyright Copyright (c) 2015 Yorick Phoenix, All Rights Reserved
 */

/*global $ */

$(document).ready(
	function DocumentReady()
	{
		'use strict';

		var tiles = [[],[],[]];		// 3x3 array of jQuery Objects for the tiles

		/**
		 * Create a random number between min and max
		 *
		 * @param {number} min
		 * @param {number} max
		 *
		 * @return {number}
		 *
		 * http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
		 */

		function randomIntFromInterval(min,max)
		{
		    return Math.floor(Math.random() * (max - min + 1) + min);
		}

		/**
		 * Get the jQuery reference to a Tile.
		 *
		 * @param {object} pos - {x: 0-2, y: 0-2}
		 *
		 * @return {jQuery}
		 */

		function GetTile(pos)
		{
			return tiles[pos.x][pos.y];
		}

		/**
		 * Check if a tile is empty
		 *
		 * @param {object} pos		- {x: 0-2, y: 0-2}
		 * @param {number} deltaX	- Additional offset from pos
		 * @param {number} deltaY	- Additional offset from pos
		 *
		 * @return {Boolean}
		 */

		function IsEmpty(pos, deltaX, deltaY)
		{
			return GetTile({"x": pos.x + deltaX, "y": pos.y + deltaY}) === undefined;
		}

		/**
		 * Find the empty square next to a given tile
		 *
		 * @param {object} - {x: 0-2, y: 0-2}
		 *
		 * @return {object|undefined} - {x: 0-2, y: 0-2} or undefined if there is no space next to that tile
		 */

		function FindEmpty(pos)
		{
			var res;

			if (pos.x > 0 && IsEmpty(pos, -1, 0))
			{
				res = {"x": pos.x - 1, "y": pos.y};
			}
			else
			if (pos.x < 2 && IsEmpty(pos, 1, 0))
			{
				res = {"x": pos.x + 1, "y": pos.y};
			}
			else
			if (pos.y > 0 && IsEmpty(pos, 0, -1))
			{
				res = {"x": pos.x, "y": pos.y - 1};
			}
			else
			if (pos.y < 2 && IsEmpty(pos, 0, 1))
			{
				res = {"x": pos.x, "y": pos.y + 1};
			}

			return res;
		}

		/**
		 * Find the current possition of a tile
		 *
		 * @param {jQuery} - Reference to the tile
		 *
		 * @param {object} - {x: 0-2, y: 0-2}
		 */

		function GetCurrentPos(jItem)
		{
			return {"x": Number(jItem.data('x')), "y": Number(jItem.data('y'))};
		}

		/**
		 * Move a tile to a new position
		 *
		 * @param {jQuery} jItem	- jQuery reference to Tile in the DOM
		 * @param {object} pos   	- new position {x: 0-2, y: 0-2}
		 * @param {number} [speed]	- optional annimation speed in milliseconds
		 */

		function SetPosition(jItem, pos, speed)
		{
			var cur;

			if (speed === undefined)
			{
				speed = 200;
			}

			cur = GetCurrentPos(jItem);

			if (!isNaN(cur.x))
			{
				tiles[cur.x][cur.y] = undefined;
			}

			tiles[pos.x][pos.y] = jItem;

			jItem.data('x', pos.x)
				 .data('y', pos.y)
				 .animate({"top": pos.y * 105 + 2, "left": pos.x * 105 + 2}, speed);
		}

		/**
		 * Handle a click on a tile
		 */

		function HandleClick()
		{
			var jItem, pos, freeSpace;

			jItem = $(this);

			pos = GetCurrentPos(jItem);

			freeSpace = FindEmpty(pos);

			if (freeSpace)
			{
				SetPosition(jItem, freeSpace);
			}
		}

		/**
		 * Find the empty square
		 *
		 * @return {object} - {x: 0-2, y: 0-2}
		 */

		function FindEmptySquare()
		{
			var x, y, jItem;

			for (x = 0; x < 3; x++)
			{
				for (y = 0; y < 3; y++)
				{
					jItem = GetTile({"x": x, "y": y});

					if (jItem === undefined)
					{
						break;
					}
				}

				if (jItem === undefined)
				{
					break;
				}
			}

			return {"x": x, "y": y};
		}

		/**
		 * Handle an arrow keydown event
		 *
		 * @param {Event} evt
		 */

		function HandleKeyDown(evt)
		{
			var map = {"37": {"x":  1, "y":  0},	// left
					   "38": {"x":  0, "y":  1},	// up
					   "39": {"x": -1, "y":  0},	// right
					   "40": {"x":  0, "y": -1}};	// down

			var delta, emptyPos, tilePos, jItem;

			delta = map[evt.keyCode];

			if (delta)
			{
				emptyPos = FindEmptySquare();

				tilePos = {"x": emptyPos.x + delta.x,
						   "y": emptyPos.y + delta.y};

				jItem = GetTile(tilePos);

				if (jItem)
				{
					SetPosition(jItem, emptyPos);
				}
			}
		}

		/**
		 * Randomize the tiles in the display
		 */

		function RandomizeTiles()
		{
			var x, y, done, found, next, jItem;

			done = [];

			for (x = 0; x < 3; x++)
			{
				for (y = 0; x < 2 ? y < 3 : y < 2; y++)
				{
					found = false;

					do
					{
						next = randomIntFromInterval(1, 8);

						if (done.indexOf(next) === -1)
						{
							jItem = GetTile({"x": x, "y": y});

							if (jItem)
							{
								jItem.text(next);
							}

							done.push(next);
							found = true;
						}
					} while (!found);
				}
			}
		}

		/**
		 * Create the tiles and insert in the DOM
		 */

		function CreateTiles()
		{
			var x, y, html, jItem, jFrame;

			jFrame = $('.frame');

			for (x = 0; x < 3; x++)
			{
				for (y = 0; x < 2 ? y < 3 : y < 2; y++)
				{
					html = '<div class=tile></div>';

					jItem = $(html);

					SetPosition(jItem, {"x": x, "y": y}, 0);

					jFrame.append(jItem);

					tiles[x][y] = jItem;
				}
			}
		}

		CreateTiles();

		RandomizeTiles();

		$('.tile').click(HandleClick);

		$(document).keydown(HandleKeyDown);
	});
