﻿using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            model.Beneficiarios = model.Beneficiarios ?? new List<Beneficiarios>();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }else if (!Utils.IsValid(model.CPF))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, new List<string> { "CPF INVÁLIDO!" }));
            }
            else if (bo.VerificarExistencia(model.CPF))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, new List<string> { "CPF JÁ EXISTE NA BASE DE DADOS!" }));
            }
            else
            {
                
                model.Id = bo.Incluir(new Cliente()
                {                    
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                foreach (var item in model.Beneficiarios)
                {
                    item.CodigoCliente = model.Id;
                    Persistir(item);
                }

                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            model.Beneficiarios = model.Beneficiarios ?? new List<Beneficiarios>();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else if (!Utils.IsValid(model.CPF))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, new List<string> { "CPF INVÁLIDO!" }));
            }
            else if (bo.VerificarExistenciaCadastrado(model.CPF, model.Id))
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, new List<string> { "CPF JÁ EXISTE NA BASE DE DADOS!" }));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                foreach (var item in model.Beneficiarios)
                {
                    item.CodigoCliente = model.Id;
                    Persistir(item);
                }

                return Json("Cadastro alterado com sucesso");
            }
        }

        private void Persistir(Beneficiarios item)
        {
            BoBeneficiario bene = new BoBeneficiario();

            switch (item.Persistencia)
            {
                case "INSERT":
                    bene.Incluir(new Beneficiario
                    {
                        CodigoCliente = item.CodigoCliente,
                        CPF = item.CPF,
                        Nome = item.Nome,
                        Id = item.Id,
                    });
                    break;
                case "UPDATE":
                    var beneficiario = bene.Consultar(item.Id);
                    if (beneficiario != null)
                    {
                        beneficiario.CodigoCliente = item.CodigoCliente;
                        beneficiario.CPF = item.CPF;
                        beneficiario.Nome = item.Nome;
                        bene.Alterar(beneficiario);
                    }
                    break;
                case "DELETE":
                    bene.Excluir(item.Id);
                    break;
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario be = new BoBeneficiario();
            Cliente cliente = bo.Consultar(id);

            List<Beneficiarios> benes = be.Listar(cliente.Id).Select(x=> new Beneficiarios
            {
                CodigoCliente = x.CodigoCliente,
                CPF = x.CPF,
                Nome = x.Nome,
                Id = x.Id,
            }).ToList();


            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF,
                    Beneficiarios = benes
                };

            
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}