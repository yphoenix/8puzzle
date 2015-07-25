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
				res = {"x": pos.x + 1, "y": pos.y};;
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
			return $('.tile[x="' + pos.x + '"][y="' + pos.y + '"]');
		}

		function IsEmpty(pos, deltaX, deltaY)
		{
			return FindTile({"x": pos.x + deltaX, "y": pos.y + deltaY}).length === 0;
		}

		function GetCurrentPos(jItem)
		{
			return {"x": Number(jItem.attr('x')), "y": Number(jItem.attr('y'))};
		}

		function SetPosition(jItem, pos)
		{
			jItem.attr('x', pos.x).attr('y', pos.y);
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

					if (jItem.length === 0)
					{
						break;
					}
				}

				if (jItem.length === 0)
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

		$('.tile').click(HandleClick);

		$(document).keydown(HandleKeyDown);
	});
