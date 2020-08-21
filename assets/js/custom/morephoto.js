$( ".collapsible" ).click( function() {

    let size = $(this).siblings(".more_photo").length;

    for (let i = 0; i < size; i++ ) {
        let jPhoto = $( $(this).siblings(".more_photo")[i] );

        if (jPhoto.is(":hidden")) {
            jPhoto.slideDown();
            $(this)[0].innerText = "사진 접기";

        } else {
            jPhoto.slideUp();
            $(this)[0].innerText = "사진 더보기 (+" + size + ")";
        }
    }
});