function parseThumbnailElements(el) {
    let thumbElements = el.querySelectorAll('a');

    let items = [];

    thumbElements.forEach( function(linkEl) {
        let size = linkEl.getAttribute('data-size').split('x');

        let item = {
            src: linkEl.getAttribute('href'),
            msrc: linkEl.getAttribute('href'),
            // msrc: linkEl.getElementsByTagName('img')[0].src,
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10),
            el: linkEl.getElementsByTagName('img')[0],
            // orgSize: size,
        };

        items.push(item);
    });

    return items;
}

function closest(el, fn) {
    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
}

function onThumbnailsClick(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    var eTarget = e.target || e.srcElement;

    // find root element of slide
    var clickedListItem = closest(eTarget, function(el) {
        return (el.tagName && el.tagName.toUpperCase() === 'A');
    });

    if(!clickedListItem) {
        return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    var clickedGallery = clickedListItem.parentNode,
        childNodes = clickedListItem.parentNode.querySelectorAll('a'),
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;

    for (var i = 0; i < numChildNodes; i++) {
        if(childNodes[i].nodeType !== 1) {
            continue;
        }

        if(childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
        }
        nodeIndex++;
    }

    if(index >= 0) {
        // open PhotoSwipe if valid index found
        openPhotoSwipe( index, clickedGallery );
    }
    return false;
}

function photoswipeParseHash() {
    var hash = window.location.hash.substring(1),
        params = {};

    if(hash.length < 5) {
        return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
        if(!vars[i]) {
            continue;
        }
        var pair = vars[i].split('=');
        if(pair.length < 2) {
            continue;
        }
        params[pair[0]] = pair[1];
    }

    if(params.gid) {
        params.gid = parseInt(params.gid, 10);
    }

    return params;
}

function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;

    items = parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = {
        index: index,

        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
        showHideOpacity: true,

        getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            let rect = items[index].el.getBoundingClientRect();

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        }
    };

    // exit if index not found
    if( isNaN(options.index) ) {
        return;
    }

    if(disableAnimation) {
        options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}

const initPhotoSwipeFromDOM = function (gallerySelector) {
    var galleryElements = document.querySelectorAll( gallerySelector );
    galleryElements[0].setAttribute('data-pswp-uid', 1);
    galleryElements[0].onclick = onThumbnailsClick;

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');