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

    let writeInfo = {};

    let writerName = $( "#visitor-message input[id='name']" );
    console.log($(writerName).val());
    writeInfo['writer'] = $(writerName).val();

    let password = $( "#visitor-message input[id='password']" );
    console.log($(password).val());
    writeInfo['password'] = $(password).val();

    let gubun = undefined;
    let checkedRadio = $( "#visitor-message input[type='radio']:checked" );
    if ( checkedRadio.length > 0) {
        if ( checkedRadio[0].id === 'show-visitor') {
            gubun = 'show';

        } else if (checkedRadio[0].id === 'jun-visitor') {
            gubun = 'jun';
        }
    }
    console.log(gubun);
    writeInfo['gubun'] = gubun;

    var message = $("textarea").val();
    console.log(message);
    writeInfo['message'] = message;

    // $.ajax({
    //     type: "POST",
    //     url: "/visitor",
    //     data: writeInfo,
    // }).done (
    //     displayVisitor()
    // )

});

/////
$(function() {
    $( ".write_button" ).click(function() {
        $( ".write_button" ).addClass( "onclick", 250, validate);
    });

    function validate() {
        setTimeout(function() {
            $( ".write_button" ).removeClass( "onclick" );
            $( ".write_button" ).addClass( "validate", 450, callback );
        }, 1500 );
    }
    function callback() {
        setTimeout(function() {
            $( ".write_button" ).removeClass( "validate" );
        }, 1250 );
    }
});