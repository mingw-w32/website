/*
 * site.js
 *
 * General purpose functions for manipulation of page content.
 *
 *
 * $Id$
 *
 * Written by Keith Marshall <keith@users.osdn.me>
 * Copyright (C) 2020, MinGW.org Project
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice, this permission notice, and the following
 * disclaimer shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OF OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */
function set_content( item, value )
{ /* Replace the existing content, if any, of the HTML element with
   * id attribute named "item", (if such an element exists), with new
   * content as specified by "value".
   */
  var element = document.getElementById( item );
  if( element ) element.innerHTML = value;
}

function load_content( container, src )
{ /* Set the content of the specified HTML "container" element, by
   * injection of the entire contents of an external file which is
   * fetched by http server request; (either an http, or an https,
   * server connection is required; does not work for local files).
   */
  var request_handler = new XMLHttpRequest();
  request_handler.onreadystatechange = function()
  { if( (this.readyState == this.DONE) && (this.status == 200) )
      set_content( container, this.responseText );
  }
  request_handler.open( "GET", src, true );
  request_handler.send();
}

function load_page_content( src, subtitle )
{ /* Propagate the HTML document title to the "masthead" display,
   * update the displayed page subtitle, (which may be null), and
   * load the page content from the specified "src" file.
   */
  set_content( "page-title", document.title );
  set_content( "page-subtitle", subtitle );
  load_content( "page-content", src );
}

function new_page( src, subtitle )
{ /* Create a new page display, starting from scratch; assign the
   * displayed title from the HTML document title attribute, adding
   * the specified subtitle, lay out the standard page header block,
   * and load the page content from the "src" file.
   */
  load_content( "header", "header.html" );
  load_page_content( src, subtitle );
}

/* $RCSfile$: end of file */
