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

function no_break( text )
{ /* Helper function to replace all occurrences of ASCII hyphen-minus,
   * within "text", by substitution of HTML non-breaking hyphen.
   */
  return text.replace( /-/g, "&#8209;" );
}

function update_page_content_header( tag )
{ /* Update the "page-title" and "page-subtitle" content-header text,
   * by substitution into the "as-page-title" and "as-page-subtitle"
   * place-holder elements, respectively.
   */
  var element = document.getElementById( "page-".concat( tag ));
  if( element )
  { if( tag == "title" ) document.title = element.innerHTML;
    set_content( "as-page-".concat( tag ), no_break( element.innerHTML ));
  }
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
	  set_content( container, this.responseText );
	  update_page_content_header( "title" );
	  update_page_content_header( "subtitle" );
	  set_content( "e404-missing-page", document.URL );
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
