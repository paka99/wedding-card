function drawKakaoMap() {
    const mapContainer = document.getElementById('map'),
        mapOption = {
            // center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            center: new kakao.maps.LatLng(37.5039660612952, 127.042909941112), // 지도의 중심좌표
            // draggable: false,
            level: 5 // 지도의 확대 레벨
        };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 상록아트홀 좌표
    const coords = new kakao.maps.LatLng(37.5039660612952, 127.042909941112);
    const marker = new kakao.maps.Marker({
        map: map,
        position: coords
    });


    kakao.maps.event.addListener(marker, 'click', function () {
        // Focus Center
        var coords = new kakao.maps.LatLng(37.5039660612952, 127.042909941112);
        map.setCenter(coords);
    });

    var infowindow = new kakao.maps.InfoWindow({
        content: '<div style="width:150px; text-align:center; color:black;" onclick="focusOnMarker()">상록아트홀 5층</div>',
        // removable : iwRemoveable
    });
    infowindow.open(map, marker);

    map.setCenter(coords);

// map.setZoomable(false);

// $(".come-map").bind("wheel mousewheel DOMMouseScroll", function(e){
//     e.preventDefault();
// });
}

drawKakaoMap();