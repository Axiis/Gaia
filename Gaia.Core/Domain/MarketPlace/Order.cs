using Gaia.Core.Utils;
using System;

namespace Gaia.Core.Domain.MarketPlace
{
    public class Order
    {
        public static readonly string TransactionIdFormat = "O-X00-0000-XXX00X-X0X0";
        public string TransactionId { get; set; } = IdGenerator.NewId(TransactionIdFormat);

        public Service Service { get; set; }
        public decimal Amount { get; set; }

        public DateTime TimeStamp { get; set; }

        public string Message { get; set; }
        public DateTime MessageTimeStamp { get; set; }
        public OrderStatus Status { get; set; }

        public string InputData { get; set;  }
        public string OutputData { get; set; }

        public Order Previous { get; set; }
        public Order Next { get; set; }
    }


    public enum OrderStatus
    {
        /// <summary>
        /// A brand-new order will always be in this state. This is the only point (for now) where an order may be cancelled
        /// </summary>
        Staged,

        /// <summary> as the payment is still being processed by the payment services
        /// </summary>
        ProcessingPayment,

        /// <summary>
        /// Soon after payment is confirmed, the service provider is notified that a new order has been placed by a customer.
        /// At this point, the system is awaiting acknowledgment from the service provider. Acknowledging the order begins
        /// the order-processing phase of the transaction
        /// </summary>
        AwaitingAcknowledgment,

        /// <summary>
        /// All of the intermediate processes that happens at the service provider's end will be represented by this state.
        /// "Acknowledging" an order automatically brings the order to this state.
        /// </summary>
        ServicingOrder,

        /// <summary>
        /// Once the order has been concluded, e.g, product picked up, or shipment delivered, etc, the service provider
        /// changes the status of the order to fulfilled.
        /// </summary>
        OrderFulfilled,

        /// <summary>
        /// A customer may cancel a "staged" transaction. No other action will be taken on the order.
        /// </summary>
        OrderCancelled,

        /// <summary>
        /// If some irrecoverable error happens during the life time of the order, before it is fulfilled, it is aborted.
        /// </summary>
        OrderAborted
    }
}
