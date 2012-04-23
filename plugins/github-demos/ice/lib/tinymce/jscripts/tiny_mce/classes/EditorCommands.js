(function(tinymce){var each=tinymce.each,undefined,TRUE=true,FALSE=false;tinymce.EditorCommands=function(editor){var dom=editor.dom,selection=editor.selection,commands={state:{},exec:{},value:{}},settings=editor.settings,bookmark;function execCommand(command,ui,value){var func;command=command.toLowerCase();if(func=commands.exec[command]){func(command,ui,value);return TRUE}return FALSE}function queryCommandState(command){var func;command=command.toLowerCase();if(func=commands.state[command]){return func(command)}return -1}function queryCommandValue(command){var func;command=command.toLowerCase();if(func=commands.value[command]){return func(command)}return FALSE}function addCommands(command_list,type){type=type||"exec";each(command_list,function(callback,command){each(command.toLowerCase().split(","),function(command){commands[type][command]=callback})})}tinymce.extend(this,{execCommand:execCommand,queryCommandState:queryCommandState,queryCommandValue:queryCommandValue,addCommands:addCommands});function execNativeCommand(command,ui,value){if(ui===undefined){ui=FALSE}if(value===undefined){value=null}return editor.getDoc().execCommand(command,ui,value)}function isFormatMatch(name){return editor.formatter.match(name)}function toggleFormat(name,value){editor.formatter.toggle(name,value?{value:value}:undefined)}function storeSelection(type){bookmark=selection.getBookmark(type)}function restoreSelection(){selection.moveToBookmark(bookmark)}addCommands({"mceResetDesignMode,mceBeginUndoLevel":function(){},"mceEndUndoLevel,mceAddUndoLevel":function(){editor.undoManager.add()},"Cut,Copy,Paste":function(command){var doc=editor.getDoc(),failed;try{execNativeCommand(command)}catch(ex){failed=TRUE}if(failed||!doc.queryCommandSupported(command)){if(tinymce.isGecko){editor.windowManager.confirm(editor.getLang("clipboard_msg"),function(state){if(state){open("http://www.mozilla.org/editor/midasdemo/securityprefs.html","_blank")}})}else{editor.windowManager.alert(editor.getLang("clipboard_no_support"))}}},unlink:function(command){if(selection.isCollapsed()){selection.select(selection.getNode())}execNativeCommand(command);selection.collapse(FALSE)},"JustifyLeft,JustifyCenter,JustifyRight,JustifyFull":function(command){var align=command.substring(7);each("left,center,right,full".split(","),function(name){if(align!=name){editor.formatter.remove("align"+name)}});toggleFormat("align"+align);execCommand("mceRepaint")},"InsertUnorderedList,InsertOrderedList":function(command){var listElm,listParent;execNativeCommand(command);listElm=dom.getParent(selection.getNode(),"ol,ul");if(listElm){listParent=listElm.parentNode;if(/^(H[1-6]|P|ADDRESS|PRE)$/.test(listParent.nodeName)){storeSelection();dom.split(listParent,listElm);restoreSelection()}}},"Bold,Italic,Underline,Strikethrough,Superscript,Subscript":function(command){toggleFormat(command)},"ForeColor,HiliteColor,FontName":function(command,ui,value){toggleFormat(command,value)},FontSize:function(command,ui,value){var fontClasses,fontSizes;if(value>=1&&value<=7){fontSizes=tinymce.explode(settings.font_size_style_values);fontClasses=tinymce.explode(settings.font_size_classes);if(fontClasses){value=fontClasses[value-1]||value}else{value=fontSizes[value-1]||value}}toggleFormat(command,value)},RemoveFormat:function(command){editor.formatter.remove(command)},mceBlockQuote:function(command){toggleFormat("blockquote")},FormatBlock:function(command,ui,value){return toggleFormat(value||"p")},mceCleanup:function(){var bookmark=selection.getBookmark();editor.setContent(editor.getContent({cleanup:TRUE}),{cleanup:TRUE});selection.moveToBookmark(bookmark)},mceRemoveNode:function(command,ui,value){var node=value||selection.getNode();if(node!=editor.getBody()){storeSelection();editor.dom.remove(node,TRUE);restoreSelection()}},mceSelectNodeDepth:function(command,ui,value){var counter=0;dom.getParent(selection.getNode(),function(node){if(node.nodeType==1&&counter++==value){selection.select(node);return FALSE}},editor.getBody())},mceSelectNode:function(command,ui,value){selection.select(value)},mceInsertContent:function(command,ui,value){var parser,serializer,parentNode,rootNode,fragment,args,marker,nodeRect,viewPortRect,rng,node,node2,bookmarkHtml,viewportBodyElement;parser=editor.parser;serializer=new tinymce.html.Serializer({},editor.schema);bookmarkHtml='<span id="mce_marker" data-mce-type="bookmark">\uFEFF</span>';args={content:value,format:"html"};selection.onBeforeSetContent.dispatch(selection,args);value=args.content;if(value.indexOf("{$caret}")==-1){value+="{$caret}"}value=value.replace(/\{\$caret\}/,bookmarkHtml);if(!selection.isCollapsed()){editor.getDoc().execCommand("Delete",false,null)}parentNode=selection.getNode();args={context:parentNode.nodeName.toLowerCase()};fragment=parser.parse(value,args);node=fragment.lastChild;if(node.attr("id")=="mce_marker"){marker=node;for(node=node.prev;node;node=node.walk(true)){if(node.type==3||!dom.isBlock(node.name)){node.parent.insert(marker,node,node.name==="br");break}}}if(!args.invalid){value=serializer.serialize(fragment);node=parentNode.firstChild;node2=parentNode.lastChild;if(!node||(node===node2&&node.nodeName==="BR")){dom.setHTML(parentNode,value)}else{selection.setContent(value)}}else{selection.setContent(bookmarkHtml);parentNode=editor.selection.getNode();rootNode=editor.getBody();if(parentNode.nodeType==9){parentNode=node=rootNode}else{node=parentNode}while(node!==rootNode){parentNode=node;node=node.parentNode}value=parentNode==rootNode?rootNode.innerHTML:dom.getOuterHTML(parentNode);value=serializer.serialize(parser.parse(value.replace(/<span (id="mce_marker"|id=mce_marker).+<\/span>/i,function(){return serializer.serialize(fragment)})));if(parentNode==rootNode){dom.setHTML(rootNode,value)}else{dom.setOuterHTML(parentNode,value)}}marker=dom.get("mce_marker");nodeRect=dom.getRect(marker);viewPortRect=dom.getViewPort(editor.getWin());if((nodeRect.y+nodeRect.h>viewPortRect.y+viewPortRect.h||nodeRect.y<viewPortRect.y)||(nodeRect.x>viewPortRect.x+viewPortRect.w||nodeRect.x<viewPortRect.x)){viewportBodyElement=tinymce.isIE?editor.getDoc().documentElement:editor.getBody();viewportBodyElement.scrollLeft=nodeRect.x;viewportBodyElement.scrollTop=nodeRect.y-viewPortRect.h+25}rng=dom.createRng();node=marker.previousSibling;if(node&&node.nodeType==3){rng.setStart(node,node.nodeValue.length)}else{rng.setStartBefore(marker);rng.setEndBefore(marker)}dom.remove(marker);selection.setRng(rng);selection.onSetContent.dispatch(selection,args);editor.addVisual()},mceInsertRawHTML:function(command,ui,value){selection.setContent("tiny_mce_marker");editor.setContent(editor.getContent().replace(/tiny_mce_marker/g,function(){return value}))},mceSetContent:function(command,ui,value){editor.setContent(value)},"Indent,Outdent":function(command){var intentValue,indentUnit,value;intentValue=settings.indentation;indentUnit=/[a-z%]+$/i.exec(intentValue);intentValue=parseInt(intentValue);if(!queryCommandState("InsertUnorderedList")&&!queryCommandState("InsertOrderedList")){each(selection.getSelectedBlocks(),function(element){if(command=="outdent"){value=Math.max(0,parseInt(element.style.paddingLeft||0)-intentValue);dom.setStyle(element,"paddingLeft",value?value+indentUnit:"")}else{dom.setStyle(element,"paddingLeft",(parseInt(element.style.paddingLeft||0)+intentValue)+indentUnit)}})}else{execNativeCommand(command)}},mceRepaint:function(){var bookmark;if(tinymce.isGecko){try{storeSelection(TRUE);if(selection.getSel()){selection.getSel().selectAllChildren(editor.getBody())}selection.collapse(TRUE);restoreSelection()}catch(ex){}}},mceToggleFormat:function(command,ui,value){editor.formatter.toggle(value)},InsertHorizontalRule:function(){editor.execCommand("mceInsertContent",false,"<hr />")},mceToggleVisualAid:function(){editor.hasVisual=!editor.hasVisual;editor.addVisual()},mceReplaceContent:function(command,ui,value){editor.execCommand("mceInsertContent",false,value.replace(/\{\$selection\}/g,selection.getContent({format:"text"})))},mceInsertLink:function(command,ui,value){var link=dom.getParent(selection.getNode(),"a"),img,style,cls;if(tinymce.is(value,"string")){value={href:value}}value.href=value.href.replace(" ","%20");if(!link){if(tinymce.isWebKit){img=dom.getParent(selection.getNode(),"img");if(img){style=img.style.cssText;cls=img.className;img.style.cssText=null;img.className=null}}execNativeCommand("CreateLink",FALSE,"javascript:mctmp(0);");if(style){img.style.cssText=style}if(cls){img.className=cls}each(dom.select("a[href='javascript:mctmp(0);']"),function(link){dom.setAttribs(link,value)})}else{if(value.href){dom.setAttribs(link,value)}else{editor.dom.remove(link,TRUE)}}},selectAll:function(){var root=dom.getRoot(),rng=dom.createRng();rng.setStart(root,0);rng.setEnd(root,root.childNodes.length);editor.selection.setRng(rng)}});addCommands({"JustifyLeft,JustifyCenter,JustifyRight,JustifyFull":function(command){return isFormatMatch("align"+command.substring(7))},"Bold,Italic,Underline,Strikethrough,Superscript,Subscript":function(command){return isFormatMatch(command)},mceBlockQuote:function(){return isFormatMatch("blockquote")},Outdent:function(){var node;if(settings.inline_styles){if((node=dom.getParent(selection.getStart(),dom.isBlock))&&parseInt(node.style.paddingLeft)>0){return TRUE}if((node=dom.getParent(selection.getEnd(),dom.isBlock))&&parseInt(node.style.paddingLeft)>0){return TRUE}}return queryCommandState("InsertUnorderedList")||queryCommandState("InsertOrderedList")||(!settings.inline_styles&&!!dom.getParent(selection.getNode(),"BLOCKQUOTE"))},"InsertUnorderedList,InsertOrderedList":function(command){return dom.getParent(selection.getNode(),command=="insertunorderedlist"?"UL":"OL")}},"state");addCommands({"FontSize,FontName":function(command){var value=0,parent;if(parent=dom.getParent(selection.getNode(),"span")){if(command=="fontsize"){value=parent.style.fontSize}else{value=parent.style.fontFamily.replace(/, /g,",").replace(/[\'\"]/g,"").toLowerCase()}}return value}},"value");if(settings.custom_undo_redo){addCommands({Undo:function(){editor.undoManager.undo()},Redo:function(){editor.undoManager.redo()}})}}})(tinymce);