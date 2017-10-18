neodiv.innerHTML="<div class=\"list-group-item\" id=\""+
  layerID+"-listItem\">"+
    "<div class=\"panel-heading\" style="">"+
      "<h4 class=\"panel-title\">"+
        "<a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#"+collapseOne+"\">"+
          "<input type="checkbox" checked data-toggle=\"toggle\" data-size=\"mini\">&nbsp;&nbsp;&nbsp;"+getLayerName(layerID)+
        "</a>"+
      "</h4>"+
    "</div>"+
    "<div id=\""+collapseOne+"\" class=\"panel-collapse collapse in\">"+
      "<div class=\"panel-body\">"+
        "<a id=\""+layerID+"-delete-btn\" class=\"btn btn-danger btn-delete-item btn-xs pull-right\">Delete</a>"+
	"<input id=\""+
	layerID+
	"-slider\"type=\"range\" value=\"100\">"+
		"</div>"+
    "</div>"+
  "</div>"
  
  collapseOne=layerID+"-controlcontainer"
  
  
  <input type="checkbox" checked data-toggle="toggle" data-size="mini">