using Microsoft.Extensions.Options;
using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using PayPalHttp;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Linq;
using Application.Paypal;
using Application.Paypal.Dtos;
using Microsoft.AspNetCore.Http;
using PayoutsSdk.Payouts;
using System.Globalization;

namespace Infrastructure.Paypal
{
    public class PaypalAccessor : IPaypalAccessor
    {
        private readonly PaypalSettings _paypalSettings;
        private readonly PayPalHttpClient _paypalClient;

        public PaypalAccessor(IOptions<PaypalSettings> paypalSettings)
        {
            _paypalSettings = new PaypalSettings
            {
                ClientId = paypalSettings.Value.ClientId,
                Secret = paypalSettings.Value.Secret,
                CancelUrl = paypalSettings.Value.CancelUrl,
                ReturnUrl = paypalSettings.Value.ReturnUrl
            };

            PayPalEnvironment environment = new SandboxEnvironment(_paypalSettings.ClientId, _paypalSettings.Secret);
            _paypalClient = new PayPalHttpClient(environment);
        }

        public PaypalOrderDto CreateOrder(decimal amount)
        {
            var order = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                PurchaseUnits = new List<PurchaseUnitRequest>
                {
                    new PurchaseUnitRequest
                    {
                        AmountWithBreakdown = new AmountWithBreakdown
                        {
                            CurrencyCode = "PHP",
                            Value = amount.ToString()
                        }
                    }
                },
                ApplicationContext = new ApplicationContext()
                {
                    ReturnUrl = _paypalSettings.ReturnUrl,
                    CancelUrl = _paypalSettings.CancelUrl,
                }
            };

            var request = new OrdersCreateRequest();
            request.Prefer("return=representation");
            request.RequestBody(order);
            var response = _paypalClient.Execute(request).Result;
            var statusCode = response.StatusCode;
            Order result = response.Result<Order>();

            return new PaypalOrderDto
            {
                CheckoutLink = result.Links[1].Href,
                OrderId = result.Id,
            };
        }

        public PaypalCaptureOrderDto CaptureOrder(string orderId)
        {
            var request = new OrdersCaptureRequest(orderId);
            request.RequestBody(new OrderActionRequest());
            var response = _paypalClient.Execute(request).Result;
            var statusCode = response.StatusCode;
            Order result = response.Result<Order>();

            return new PaypalCaptureOrderDto
            {
                CaptureId = result.Id,
                Status = result.Status,
            };
        }

        public PaypalPayoutDto CreatePayout(decimal amount, string email)
        {

            var body = new CreatePayoutRequest()
            {
                SenderBatchHeader = new SenderBatchHeader()
                {
                    EmailMessage = $"Congrats on recieving " +
                    $"{ string.Format(new CultureInfo("en-PH", false), "{0:N2}", amount) }",
                    EmailSubject = "WagerzLounge payout"
                },
                Items = new List<PayoutItem>() {
                    new PayoutItem()
                    {
                        RecipientType = "EMAIL",
                        Amount = new Currency() {
                            CurrencyCode = "PHP",
                            Value = amount.ToString(),
                        },
                        Receiver = email,
                    }
                }
            };

            PayoutsPostRequest request = new PayoutsPostRequest();
            request.RequestBody(body);
            var response = _paypalClient.Execute(request).Result;
            var result = response.Result<CreatePayoutResponse>();

            return new PaypalPayoutDto
            {
                BatchId = result.BatchHeader.PayoutBatchId
            };
        }
    }
}
