$('.cpf').mask('000.000.000-00', { reverse: true });


/*!
*	Gerador e Validador de CPF v1.0.0
*	https://github.com/tiagoporto/gerador-validador-cpf
*	Copyright (c) 2014-2015 Tiago Porto (http://www.tiagoporto.com)
*	Released under the MIT license



var CPF = new CPF();

$("#CPF").keypress(function () {

    const response = CPF.valida($(this).val());

    getMessage(response);
});

$("#CPF").blur(function () {

    const response = CPF.valida($(this).val());

    getMessage(response);
});

function getMessage(response) {
    if (response == "OK") {
        $("#CPF").css("border-color", "");
        $("#salvar").prop("disabled", false);
    } else {
        $("#CPF").css("border-color", "red");
        $("#salvar").prop("disabled", true);
    }
}
*/
