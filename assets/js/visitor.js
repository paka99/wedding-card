function displayVisitor() {
    $.ajax({
        url: "/visitor",
        // context: document.body
    }).done ( res => {
        let boxList = $.find(".visitor marquee");
        res.messages.forEach( (msg, i) => {
            $(boxList[i%4]).append(
                `<div class="chatbox__messages__user-message--ind-message" style="display:inline-block; margin: 0; margin-left: 3em;">
                    <p class="message" style="margin: 0;margin-left: 1em; text-align: left">${msg.contents}</p>
                    <p class="name" style="margin: 0; margin-right: 1em; text-align: right">${msg.writer}</p>
                </div>` );
        });
    });
}


displayVisitor();