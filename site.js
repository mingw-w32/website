/*
 * site.js
 *
 * General purpose functions for manipulation of page content.
 *
 *
 * $Id$
 *
 * Written by Keith Marshall <keith@users.osdn.me>
 * Copyright (C) 2020, 2021, MinGW.OSDN Project
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
  return element;
}

function set_page( title, text )
{ /* Helper function, for use in overlay page scripts, to update
   * the "title" and "subtitle" fields within the page header; note
   * that "text" may, and should, use ASCII hyphen-minus where any
   * hyphen is to be represented; these will be replaced by HTML
   * non-breaking hyphen entities, on header field assignment.
   */
  if( title == "title" ) document.title = text;
  set_content( "page-".concat( title ), text.replace( /-/g, "&#8209;" ));
}

function load_content( container, src )
{ /* Set the content of the specified HTML "container" element, by
   * injection of the entire contents of an external file which is
   * fetched by http server request; (either an http, or an https,
   * server connection is required; does not work for local files).
   */
  var request_handler = new XMLHttpRequest();
  request_handler.onreadystatechange = function()
  { if( this.readyState == this.DONE )
      switch( this.status )
      { case 200:
	  var element = set_content( container, this.responseText );
	  var idx; element = element.getElementsByTagName( "script" );
	  set_content( "e404-missing-page", document.URL );
	  for( idx = 0; idx < element.length; idx++ )
	  { var onload_action = Function( element[idx].innerHTML );
	    onload_action();
	  }
	  if( src.includes("#") )
	  { src = src.substring( src.indexOf("#") + 1, src.length );
	    element = document.getElementById( src );
	    if( element ) element.scrollIntoView();
	  }
	  break;
	case 404:
	  load_content( container, "missing.html" );
      }
  }
  request_handler.open( "GET", src, true );
  request_handler.send();
}

function load_page( src )
{ /* Load page content from the HTML fragment file, as determined
   * from the specified "src" URL; if no alternative fragment name
   * is specified, fall back to loading "about.html".
   */
  const ref = "?page=";
  const div = "page-content";
  set_content( div, null );
  load_content( "header", "header.html" );
  if( src.includes( ref ) )
    src = src.substring( src.indexOf( ref ) + ref.length, src.length );
  else src = "about.html";
  load_content( div, src );
}

/* $RCSfile$: end of file */
