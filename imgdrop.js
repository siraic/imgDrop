/***************************
 * imgDrop
 * jQuery Plugin for Drag-n-Drop Image Uploading
 * By: Bart 'siraic' Swaalf
 * First jQuery Plugin by me ever
 * Version: 0.1
 * Last update: 15-05-2011
 *************************************
 */
 
(function($){
	var m = {
		init : function( options ) {
			return this.each(function(){				
				$.extend(m.defaults,options);
         		$(this).data('imgDrop',m.defaults);
				$(this).bind({
					'dragenter.imgDrop' : m.dragenter,
					'dragover.imgDrop'  : m.dragover,
					'dragleave.imgDrop' : m.dragleave,
					'drop.imgDrop'		: m.drop				
					});
			});
		},
		
		dragenter : function(e){
			d = $(e.target).data('imgDrop');
			$(e.target).addClass(d.hoverClass);
			e.preventDefault();
			e.stopPropagation();
		},
		
		dragover : function(e){
			e.preventDefault();	//very important, otherwise image will be opened in tab
			e.stopPropagation();
		},
		
		dragleave : function(e){
			d = $(e.target).data('imgDrop');
			$(e.target).removeClass(d.hoverClass);
			e.preventDefault();
			e.stopPropagation();
		},
		
		drop : function(e){
			var files = e.originalEvent.dataTransfer.files;
			e.preventDefault();
			e.stopPropagation();
			d = $(e.target).data('imgDrop');
			$(e.target).removeClass(d.hoverClass);
			m.uploadFiles($(e.target),files)
		},
		
		uploadFiles : function(o,files){		
			var s = o.data('imgDrop');
			for ( var i = 0; i < files.length; i++) {
				if(s.fileTypes.indexOf(files[i].type)<0){
					console.log('The filetype of '+files[i].fileName+' is not supported and won\'t be uploaded');
				}else if(s.fileSize < files[i].fileSize && s.fileSize != 0){
					console.log('The filesize of '+files[i].fileName+' ('+files[i].fileSize+' bytes) exceeds the maximum allowed size of '+s.fileSize+' bytes)');
				}else{
					var f = {
						'name'	: files[i].fileName,
						'size' 	: files[i].fileSize,
						'start'	: new Date().getTime(),
						'fig'	: $('<figure>',{
							'class' : s.figureClass
						}),
						'cap'	: $('<figcaption>',{
							'class' : s.captionClass
						}),
						'image'	: $('<img>',{
							'class' : s.imageClass,
							'src'	: files[i]
						}),
						'bar'  	: $('<progress>',{
							'class' : s.progressClass,
							'value' : 0,
							'max' : files[i].fileSize
						})
					};
					$(o).append(f.fig.append(f.bar).append(f.cap));
					$.ajax({
	  					url: s.url,
	  					type: 'POST',
	  					processData: false,
	  					data : files[i],
	  					complete : function(img){
					    		return function(e) {
					    			img.fig.prepend(img.image.attr('src',e.responseText));
					    			img.bar.remove();
					    			console.log('upload of '+img.name+' completed');					
								}
							}(f),
						xhr: function(){
							xhr = $.ajaxSettings.xhr();
							xhr.upload.addEventListener('progress',function(img){
					    		return function(e) {
					    			if(e.lengthComputable){
					    				img.bar.attr('value',e.loaded)
					    			}					
								}
							}(f),false);
							return xhr;
						},
	  					headers : {
	  						'Cache-Control' :  'no-cache',
	  						'X-Requested-With' : 'XMLHttpRequest',
	  						'X-File-Name' : files[i].fileName,
	  						'X-File-Size' : files[i].fileSize,
	  						'x-File-Type' : files[i].type,
	  						'Content-Type' : 'multipart/form-data'
	  					},					
					});
				}
			}	
		},
		
		defaults : {
			'url' 			: 'upload.php',
			'hoverClass'	: 'imgDropHover',
			'figureClass'	: 'imgDropFig',
			'progressClass'	: 'imgDropProg',
			'captionClass'	: 'imgDropCaption',
			'imageClass'	: 'imgDropImg',
			'fileSize'		: 1024*1024*5, //5MB
			'fileTypes'		: Array('image/png','image/gif','image/jpeg')
		}
	};

	$.fn.imgDrop = function(method){
		if(m[method]){
			return m[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}else if(typeof method === 'object' || ! method ) {
			return m.init.apply( this, arguments );
		}else{
			$.error('Method '+method+' does not exist on jQuery.imgDrop');
		}
	};

})(jQuery);