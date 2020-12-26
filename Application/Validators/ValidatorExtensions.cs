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

        public static IRuleBuilder<T, string> OnlyLetters<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder.Matches("^[a-zA-Z ]+$").WithMessage("Only letters are allowed");

            return options;
        }
    }   
}
