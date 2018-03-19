$(function() {
  var crs25831 = new L.Proj.CRS('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
     {
          resolutions: [1100, 550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25]
     }
  );

  var initPoint = [41.6480, 2.7712];
  var initZoom = 11;
  var maxZoom = 11;
  /*
  var bounds = L.geoJSON(bookmarks_2018).getBounds();
  var maxBounds = [[bounds.getSouth(),bounds.getWest()],[bounds.getNorth(),bounds.getEast()]];
  */
  var maxBounds = [[41.4346, 2.2439],[42.330, 3.330]];

  var map = L.map('mapid',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom, maxBounds: maxBounds});
  var map1 = L.map('mapid1',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom, maxBounds: maxBounds});
  var map2 = L.map('mapid2',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom, maxBounds: maxBounds});

  var servicio1 = 'https://geoserveis.icgc.cat/map/bases/service?';
  var layer1 = 'orto';
  var attribution1 = 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>';

  var servicio2 = 'https://geoserveis.icgc.cat/icgc_costa201803/wms/service?';
  var layer2 = 'costa1803';
  var attribution2 = 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>';

  var myLayer1 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : attribution1,
});

  var myLayer2 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : attribution2,
});

  var myLayer3 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : attribution1,
});

  var myLayer4 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : attribution2,
});

  map.addLayer(myLayer1);
  map.addLayer(myLayer2);

  map1.addLayer(myLayer3);
  map2.addLayer(myLayer4);

  L.control.sideBySide(myLayer1, myLayer2).addTo(map);

  map1.sync(map2);
  map2.sync(map1);

  var hash = new L.Hash(map);
  var hash2 = new L.Hash(map1);

  $('#mapid').hide();

  $('.btn-sticky button').on('click',function(){
    $('.panel-sticky').show();
  });

  $('.btn-sync').on('click',function(){
    $('#mapid').hide();
    $('#mapid1').show();
    $('#mapid2').show();
    $('.panel-sticky').hide();
    map1.invalidateSize();
    map2.invalidateSize();
  });

  $('.btn-sidebyside').on('click',function(){
    $('#mapid').show();
    $('#mapid1').hide();
    $('#mapid2').hide();
    map.invalidateSize();
    $('.panel-sticky').hide();
  });

  $('#list-booksmarks').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    var center = hash.parseHash(selectedD);
    map.setView(center.center, center.zoom);
  });

  function updateBookmarks(total, subgroup){
	  
	 
    var features = total.features;
    features.sort(compare);
    var list = [];
    for(var i = 0, length = features.length; i < length; i++){
      var feature = features[i];
      if (null !== subgroup && !findObjectByNOM(subgroup.features, feature.properties.NOM)){
        list.push("<option value='#11/"+feature.geometry.coordinates[1]+"/"+feature.geometry.coordinates[0]+"' disabled class='disabled'>"+feature.properties.NOM+"</option>");
      }else{
        list.push("<option value='#11/"+feature.geometry.coordinates[1]+"/"+feature.geometry.coordinates[0]+"'>"+feature.properties.NOM+"</option>");
      }
    }

    $('#list-booksmarks').empty();

    $('#list-booksmarks').append(list.join(""));

    $('#list-booksmarks').removeClass('hide');

    $('#list-booksmarks').selectpicker('refresh');
  }

  function compare(a,b) {
    if (a.properties.NOM < b.properties.NOM)
      return -1;
    if (a.properties.NOM > b.properties.NOM)
      return 1;
    return 0;
  }

  function findObjectByNOM(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].properties.NOM === value) {
            return true;
        }
    }
    return false;
  }
  
  updateBookmarks(bookmarks,bookmarks_2018);
  
  function updateApp(layer){
	  	  
	  cmb1=$('#list-ortos1').val();
	  cmb2=$('#list-ortos2').val();
	  
	  if((cmb1.indexOf("costa1803")!=-1)||(cmb2.indexOf("costa1803")!=-1)){
			map.setMaxBounds(maxBounds);
			  map1.setMaxBounds(maxBounds);
			  map2.setMaxBounds(maxBounds);
			  updateBookmarks(bookmarks,bookmarks_2018);		  
	  }else{
			updateBookmarks(bookmarks,null);
			  map.setMaxBounds(null);
			  map1.setMaxBounds(null);
			  map2.setMaxBounds(null);
	  }  
  
	  
	 

	    
  }
  

  $('#list-ortos1').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    var params = selectedD.split("@#_#@");
    myLayer1.setUrl(params[0]).setParams({layers: params[1]});
    myLayer3.setUrl(params[0]).setParams({layers: params[1]});
	
    updateApp(params[1]);
  });

  $('#list-ortos2').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    var params = selectedD.split("@#_#@");
    myLayer2.setUrl(params[0]).setParams({layers: params[1]});
    myLayer4.setUrl(params[0]).setParams({layers: params[1]});
	
    updateApp(params[1]);
  });

  var list2 = "";
  for(var i = 0, length = ortos.length; i < length; i++){
    var orto = ortos[i];
    list2 += "<option value='"+orto.url+"@#_#@"+orto.layer+"'>"+orto.label+"</option>"
  }

  $('#list-ortos1').append(list2);
  $('#list-ortos1').removeClass('hide');
  $('#list-ortos1').selectpicker('refresh');
  $('#list-ortos1').selectpicker('val', servicio1+'@#_#@'+layer1);

  $('#list-ortos2').append(list2);
  $('#list-ortos2').removeClass('hide');
  $('#list-ortos2').selectpicker('refresh');
  $('#list-ortos2').selectpicker('val', servicio2+'@#_#@'+layer2);

  $('.info-btn').on('click',function(){
    $('#infomodal').modal('show');
  });

  $('.enllaca').on('click',function(){
    var currentURL = window.location;
    $('#urlMap').val(currentURL);
    var iframecode = '<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+currentURL+'" ></iframe>';
    $('#iframeMap').html(iframecode);
    $('#enllacamodal').modal('show');
  });

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $("#share").jsSocials({
      showLabel: false,
      showCount: false,
      shares: ["email", "twitter", "facebook", "googleplus", "pinterest", "whatsapp"]
    });
  }else{
    $("#share").jsSocials({
      showLabel: false,
      showCount: false,
      shares: ["email", "twitter", "facebook", "googleplus", "pinterest"]
    });
  }

  $(document).hotkeys('alt+ctrl+j', 'alt+ctrl+m', function(){
    $('#alertmodal .alertmodal-body').html("Aquesta és l'última aplicació publicada amb Jaume Miranda com a director de l'Institut Cartogràfic i Geològic de Catalunya<br><br><i>tempus fugit</i>");
    $('#alertmodal').modal('show');
  });

});
