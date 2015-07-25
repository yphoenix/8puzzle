/**
 * @package 8 Puzzle
 * @subpackage JS
 * @author Yorick Phoenix <yphoenix@scribblings.com>
 * @copyright Copyright (c) 2015 Yorick Phoenix, All Rights Reserved
 */

$(document).ready(
	function DocumentReady()
	{
		'use strict';

		var tiles = [[],[],[]];

		function randomIntFromInterval(min,max)
		{
		    return Math.floor(Math.random() * (max - min + 1) + min);
		}

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

		function FindTile(pos)
		{
			return tiles[pos.x][pos.y];
		}

		function IsEmpty(pos, deltaX, deltaY)
		{
			return FindTile({"x": pos.x + deltaX, "y": pos.y + deltaY}) === undefined;
		}

		function GetCurrentPos(jItem)
		{
			return {"x": Number(jItem.data('x')), "y": Number(jItem.data('y'))};
		}

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

		function FindEmptySquare()
		{
			var x, y, jItem;

			for (x = 0; x < 3; x++)
			{
				for (y = 0; y < 3; y++)
				{
					jItem = FindTile({"x": x, "y": y});

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

		function HandleKeyDown(evt)
		{
			var map = {"37": {"x":  1, "y":  0}, 	// left
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

				jItem = FindTile(tilePos);

				if (jItem)
				{
					SetPosition(jItem, emptyPos);
				}
			}
		}

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
							jItem = FindTile({"x": x, "y": y});

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
