
let arrayBeneficiarios = [];

var CPF = new CPF();

function SalvaBeneficiario() {

    $(".valid-cpf").css('visibility', 'hidden');
    $(".valid-nome").css('visibility', 'hidden');

    let Beneficiario = {
        Id: $("#formBeneficiario").find("#CodigoBeneficiario").val(),
        CPF: $("#formBeneficiario").find("#CPF_beneficiario").val(),
        Nome: $("#formBeneficiario").find("#Nome_beneficiario").val(),
        CodigoCliente: $("#formBeneficiario").find("#CodigoCliente").val(),
        Persistencia: "UPDATE"
    };


    let index = arrayBeneficiarios.findIndex(x => x.CPF == Beneficiario.CPF);

    let search = arrayBeneficiarios[index];

    Beneficiario.Persistencia = search ? "UPDATE" : "INSERT"

    if (!Beneficiario.Nome) {
        $(".valid-nome").text('Nome é obrigatório');
        $(".valid-nome").css('visibility', 'visible');
        event.preventDefault();
        return;
    }

    if (ValidaCpf(Beneficiario.CPF)) {
        $(".valid-cpf").text('CPF inválido');
        $(".valid-cpf").css('visibility', 'visible');
        event.preventDefault();
        return;
    }

    if (ValidaCpfRepetido(Beneficiario.CPF, Beneficiario)) {
        $(".valid-cpf").text('CPF já existe cadastrado');
        $(".valid-cpf").css('visibility', 'visible');
        event.preventDefault();
        return;
    }

    if (search) {
        arrayBeneficiarios[index] = (Beneficiario);
    } else {
        arrayBeneficiarios.push(Beneficiario);
    }

    ListarBeneficiarios(arrayBeneficiarios);

    $("#formBeneficiario")[0].reset();

    event.preventDefault();

    return;
}

function ValidaCpfRepetido(value, beneficiario) {

    if (beneficiario.Persiste == "INSERT") {

        let items = arrayBeneficiarios.filter(x => x.CPF == value);

        return items.length > 0;
    }

    let items = arrayBeneficiarios.filter(x => x.CPF == value && beneficiario.Id != x.Id);

    return items.length > 0;

}

function ValidaCpf(value) {

    const response = CPF.valida(value);

    return response == "ERROR";

}

function Alterar(value) {

    let item = arrayBeneficiarios.filter(x => x.CPF == value)[0];

    $("#formBeneficiario").find("#CodigoBeneficiario").val(item.Id);
    $("#formBeneficiario").find("#CPF_beneficiario").val(item.CPF);
    $("#formBeneficiario").find("#Nome_beneficiario").val(item.Nome);
    $("#formBeneficiario").find("#CodigoCliente").val(item.CodigoCliente);

}

function Excluir(value) {

    let index = arrayBeneficiarios.findIndex(x => x.CPF == value);

    let Beneficiario = arrayBeneficiarios[index];

    Beneficiario.Persistencia = "DELETE";

    arrayBeneficiarios[index] = (Beneficiario);

    let items = arrayBeneficiarios.filter(x => x.Persistencia != "DELETE");

    ListarBeneficiarios(items);
}


function ListarBeneficiarios(arrayBeneficiarios) {

    $("#body-beneficiarios").html('');

    arrayBeneficiarios.forEach(function (item, index) {
        $("#body-beneficiarios").append(`
            <tr>
                <td>${item.CPF}</td>
                <td>${item.Nome}</td>
                <td>
                    <button class="btn btn-m btn-primary" onclick="Alterar('${item.CPF}')">Alterar</button>
                    <button class="btn btn-m btn-primary" onclick="Excluir('${item.CPF}')">Excluir</button>
                </td>
            </tr>
        `);
    });
}

$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #CPF').prop('readonly', true);
        $('#formBeneficiario #CodigoCliente').val(obj.Id);

        arrayBeneficiarios = obj.Beneficiarios;

        ListarBeneficiarios(obj.Beneficiarios);
    }

    $("#beneficiarios").click(function () {
        $("#modal-beneficiario").modal();
    });

    $("#incluirBeneficario").click(function () {
        SalvaBeneficiario();
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
                "Beneficiarios": arrayBeneficiarios
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function CPF() {
    "user_strict"; function r(r) {
        for (var t = null, n = 0; 9 > n; ++n)
            t += r.toString().charAt(n) * (10 - n);
        var i = t % 11;
        return i = 2 > i ? 0 : 11 - i
    }
    function t(r) {
        for (var t = null, n = 0; 10 > n; ++n)
            t += r.toString().charAt(n) * (11 - n);
        var i = t % 11;
        return i = 2 > i ? 0 : 11 - i
    }
    var n = "ERROR", i = "OK";
    this.gera = function () {
        for (var n = "", i = 0; 9 > i; ++i)
            n += Math.floor(9 * Math.random()) + "";
        var o = r(n), a = n + "-" + o + t(n + "" + o);
        return a
    }, this.valida = function (o) {
        for (var a = o.replace(/\D/g, ""), u = a.substring(0, 9), f = a.substring(9, 11), v = 0; 10 > v; v++)if ("" + u + f == "" + v + v + v + v + v + v + v + v + v + v + v) return n; var c = r(u), e = t(u + "" + c); return f.toString() === c.toString() + e.toString() ? i : n
    }
}