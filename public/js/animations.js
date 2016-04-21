$(function(){
  $('form:first *:input[type!=hidden]:first').focus();

    //Scrollbar
    $("#chat").addClass("thin");

    $("#chat").mouseover(function(){
        $(this).removeClass("thin");
    });
    $("#chat").mouseout(function(){
        $(this).addClass("thin");
    });
    $("#chat").scroll(function () {
        $("#chat").addClass("thin");
    });
})