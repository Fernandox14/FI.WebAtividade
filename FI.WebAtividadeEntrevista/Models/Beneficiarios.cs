using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FI.WebAtividadeEntrevista.Models
{
    public class Beneficiarios
    {
        /// <summary>
        /// Id
        /// </summary>
        [Required]
        public long Id { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        public string CPF { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// CodigoCliente
        /// </summary>
        [Required]
        public long CodigoCliente { get; set; }


        /// <summary>
        /// Persistencia
        /// </summary>
        public string Persistencia { get; set; }
    }
}