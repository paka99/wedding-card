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

$("#visitor-message").submit( function(e) {
    e.preventDefault();

    $( ".write_button" ).addClass( "onclick", 250, validate);
    function validate() {
        setTimeout(function() {
            $( ".write_button" ).removeClass( "onclick" );
            $( ".write_button" ).addClass( "validate", 450, callback );
        }, 1000 );
    }
    function callback() {
        setTimeout(function() { $( ".write_button" ).removeClass( "validate" ); }, 1250 );

        $( "#visitor-message input[id='name']" ).val('');
        $( "#visitor-message input[id='password']" ).val('');
        $("textarea").val('');
        $( "#visitor-message input[type='radio']").val(false);

        $.ajax({
            type: "POST",
            url: "/visitor",
            data: writeInfo,

        }).done (
            // ES 쏘고 자동 리프레시
            setTimeout( displayVisitor(), 200 )
        )
    }

    let writeInfo = {};

    const writerName = $( "#visitor-message input[id='name']" ).val();
    writeInfo['writer'] = writerName;

    const password = $( "#visitor-message input[id='password']" ).val();
    writeInfo['password'] = password;

    let gubun = undefined;
    const checkedRadio = $( "#visitor-message input[type='radio']:checked" );
    if ( checkedRadio.length > 0) {
        if ( checkedRadio[0].id === 'show-visitor') {
            gubun = 'show';

        } else if (checkedRadio[0].id === 'jun-visitor') {
            gubun = 'jun';
        }
    }
    writeInfo['gubun'] = gubun;

    const message = $("textarea").val();
    writeInfo['message'] = message;

});