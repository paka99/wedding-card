function displayVisitor() {
    $.ajax({
        url: "/visitor",
        // context: document.body
    }).done ( res => {
        let boxList = $.find(".visitor marquee");
        res.messages.forEach( (msg, i) => {
            $(boxList[i%4]).append( "<div style=\"display:inline-block; margin-right: 1em;\">" + msg + "</div>" );
        });
    });
}


displayVisitor();