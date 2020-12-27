using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder.NotEmpty().MinimumLength(6).WithMessage("Password must be at least 6 characters")
                    .Matches("[A-Z]").WithMessage("Password must contain 1 Uppercase letter");

            return options;
        }

        public static IRuleBuilderOptions<T, string> OnlyLetters<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder.Matches("^[a-zA-Z ]+$");

            return options;
        }


        public static IRuleBuilderOptions<T, DateTime> FutureDate<T>(this IRuleBuilder<T, DateTime> ruleBuilder)
        {
            var options = ruleBuilder.Must(x => x > DateTime.Now);

            return options;
        }
    }   
}
