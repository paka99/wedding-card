function displayVisitor() {
    $.ajax({
        url: "/visitor",
        // context: document.body
    }).done ( res => {
        $($.find(".visitor marquee div")).remove();


        let boxList = $.find(".visitor marquee");
        res.messages.forEach( (msg, i) => {
            $(boxList[i%4]).append(
                `<div class="chatbox__messages__user-message--ind-message">
                    <p class="message">${msg.contents}</p>
                    <p class="name">${msg.writer}</p>
                </div>` );
        });
    });
}

displayVisitor();