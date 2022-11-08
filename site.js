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

function load_content( container, src, fallback, wanted )
{ /* Set the content of the specified HTML "container" element, by
   * injection of the entire contents of an external file which is
   * fetched by http server request; (either an http, or an https,
   * server connection is required; does not work for local files).
   */
  var request_handler = new XMLHttpRequest();
  function send_e404_notification( name )
  { var notification = set_content( "e404-missing-page", name );
    if( notification ) notification.removeAttribute( "id" );
  }
  function e404_subst( name ){ return name ? name : "missing.html"; }
  request_handler.onreadystatechange = function()
  { if( this.readyState == this.DONE )
      switch( this.status )
      { case 200:
	  var element = set_content( container, this.responseText );
	  if( element )
	  { var idx = 0; element = element.getElementsByTagName( "script" );
	    while( element[idx] )
	    { var onload_action = Function( element[idx++].innerHTML );
	      onload_action();
	    }
	  }
	  else if( container ) container.innerHTML = this.responseText;
	  send_e404_notification( fallback ? wanted : document.URL );
	  if( src.includes("#") )
	  { src = src.substring( src.indexOf("#") + 1, src.length );
	    element = document.getElementById( src );
	    if( element ) element.scrollIntoView();
	  }
	  break;
	case 404:
	  load_content( container, e404_subst( fallback ), fallback, src );
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

/* Web-Search Widget Helper Functions
 * ----------------------------------
 * Derived from the DuckDuckGo.com search widget implementation by
 * Juri Wornowitski, as described at https://www.plainlight.com/ddg,
 * these facilitate incorporation of multiple search widget variants,
 * at multiple locations across the site.
 *
 */
function ddg_widget( ref )
{ /* Acquire a reference to the "submit" button, within the search
   * widget; the containing "form" element uses this to simulate a
   * click event, if the form is submitted by pressing the "enter"
   * key, when the "input" field has the focus.
   */
  ref = ref.getElementsByTagName( "button" );
  for( idx = 0; idx < ref.length; idx++ )
    if( ref[idx].type == "submit" ) return ref[idx];
  return undefined;
}

function ddg_google_search_site( domain )
{ /* Encode a search "domain" as a "site:" reference, to be appended
   * to the query URL, when a DuckDuckGo.com search is directed to the
   * Google search engine, via DuckDuckGo.com's "bang" facility.
   */
  return "+".concat( encodeURIComponent( "site:".concat( domain )));
}

function ddg_bang( src, query, domain )
{ /* Set up a query, using DuckDuckGo.com's "bang" facility, (directed
   * to the "bang" identified by "src"); append the query, appropriately
   * encoded, and optionally a "domain" URL whence the query results are
   * to be retrieved.
   */
  const bang = "https://duckduckgo.com?q=".concat( encodeURIComponent( "!" ));
  query = bang.concat( src.concat( "+".concat( encodeURIComponent( query ))));
  return query.concat( domain );
}

function ddg_query( widget )
{ /* Retrieve the current value entered into the query "input" field;
   * (this is identified by having a "name" property value of "q").
   */
  widget = widget.getElementsByTagName( "input" );
  for( idx = 0; idx < widget.length; idx++ )
    if( widget[idx].name == "q" ) return widget[idx].value;
  return undefined;
}

function ddg_google_search( widget, target, domain )
{ /* Initiate a Google search, from the DuckDuckGo.com search widget;
   * (the "widget" reference is initially associated with the "submit"
   * button, whence we retrieve the query context via the parent form).
   * If "domain" is not null, it is assumed to represent a "site:" URL,
   * where the search is to be performed, while boolean value "target"
   * indicates whether or not a new browser window is to be opened to
   * display the search results.
   */
  var query = ddg_query( widget.parentElement );
  if( domain.length > 0 ) domain = ddg_google_search_site( domain );
  if( target ) window.open( ddg_bang( "g", query, domain ));
  else ddg_bang( "g", query, domain );
  return false;
}

function osdn_archive( project, list )
{ /* Construct a URL to represent the search domain for an OSDN.net
   * mailing list archive, for any specified "list", belonging to a
   * specified "project".
   */
  const template = "https://osdn.net/projects/%P%/lists/archive/";
  return template.replace( "%P%", project ).concat( list );
}

/* $RCSfile$: end of file */
