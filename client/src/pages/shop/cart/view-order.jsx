import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrderById, cancelOrderItem, returnOrderItem } from "@/store/shop-slice/order-slice";
import { Button } from "@/components/ui/button";
import MESSAGES from '../../../constants/messages';
import {

  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CreditCard,
  Package,
  RefreshCcw,
  Truck,
  ShoppingBag,
  Info,
  Download,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import OrderSuccess from "./success-order";
import PropTypes from "prop-types";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderStatusBadge = ({ status, icon }) => (
  <Badge variant={status === "cancelled" ? "destructive" : "outline"} className="mt-1 w-fit capitalize px-3 py-1 rounded-full font-medium">
    {icon}
    <span className="ml-1.5">{status}</span>
  </Badge>
);

const CancellationDialog = ({ onCancel, cancelReason, setCancelReason, item }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline" size="sm">
        Cancel Item
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="w-[92vw] max-w-md rounded-xl">
      <AlertDialogHeader>
        <AlertDialogTitle>Cancel Order Item</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to cancel {item.name} ({item.packageSize}
          {item.flavor && `, ${item.flavor}`})? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <h4 className="font-medium">Reason for Cancellation</h4>
          <textarea
            className="w-full min-h-[100px] p-3 border rounded-md"
            placeholder="Please provide a reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep Item</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onCancel(item._id)}
          disabled={!cancelReason.trim()}
        >
          Cancel Item
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ReturnDialog = ({ onReturn, returnReason, setReturnReason, item }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline" size="sm">
        Return Item
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="w-[92vw] max-w-md rounded-xl">
      <AlertDialogHeader>
        <AlertDialogTitle>Return Order Item</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to return {item.name} ({item.packageSize}
          {item.flavor && `, ${item.flavor}`})? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <h4 className="font-medium">Reason for Return</h4>
          <textarea
            className="w-full min-h-[100px] p-3 border rounded-md"
            placeholder="Please provide a reason for return..."
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep Item</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onReturn(item._id)}
          disabled={!returnReason.trim()}
        >
          Return Item
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const OrderItem = ({ item, onCancel, cancelReason, setCancelReason, onReturn, returnReason, setReturnReason, navigate }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <RefreshCcw className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      case "failed":
        return <Info className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-row items-start gap-3 sm:gap-4 p-4 sm:p-4 border rounded-xl hover:bg-gray-50/50 transition-colors">
      <div 
        className="relative cursor-pointer group flex-shrink-0"
        onClick={() => navigate(`/shop/product/${item.productId}`)}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
      </div>
      
      <div className="flex-grow min-w-0">
        <div 
          className="cursor-pointer"
          onClick={() => navigate(`/shop/product/${item.productId}`)}
        >
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm sm:text-lg line-clamp-2">
              {item.name}
              {item.flavor && <span className="text-gray-500 font-normal hidden sm:inline"> - {item.flavor}</span>}
            </h3>
            <p className="text-sm font-bold text-[#92c949] flex-shrink-0">
              ₹{item.price.toFixed(0)}
            </p>
          </div>
          {item.flavor && <p className="text-[10px] sm:hidden text-gray-500">{item.flavor}</p>}
          <div className="flex items-center gap-3 mt-1 sm:mt-2">
            <p className="text-[10px] sm:text-sm text-gray-500">Size: {item.packageSize}</p>
            <p className="text-[10px] sm:text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <OrderStatusBadge 
            status={item.status} 
            icon={getStatusIcon(item.status)} 
          />
          
          <div className="flex gap-2">
            {item.status === "processing" && (
              <CancellationDialog
                onCancel={onCancel}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                item={item}
              />
            )}
            {item.status === "shipped" && (
              <CancellationDialog
                onCancel={onCancel}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                item={item}
              />
            )}
            {item.status === "delivered" && (
              <ReturnDialog
                onReturn={onReturn}
                returnReason={returnReason}
                setReturnReason={setReturnReason}
                item={item}
              />
            )}
          </div>
        </div>
        {item.status === "cancelled" && (
          <p className="text-[10px] sm:text-xs text-red-500 italic mt-2 line-clamp-1 bg-red-50 p-1 px-2 rounded">
            Reason: {item.cancellationReason}
          </p>
        )}
      </div>
    </div>
  );
};

const OrderSummary = ({ order }) => (
  <div className="grid gap-6 md:grid-cols-2 mt-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        <p className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>₹{order.subtotal?.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span>₹{order.shippingCost?.toFixed(2)}</span>
        </p>
        {order.couponDiscount > 0 && (
          <p className="flex justify-between text-[#92c949]">
            <span>Coupon:</span>
            <span>-₹{order.couponDiscount?.toFixed(2)}</span>
          </p>
        )}
        {order.discount > 0 && (
          <p className="flex justify-between text-[#92c949]">
            <span>Discount:</span>
            <span>-₹{order.discount?.toFixed(2)}</span>
          </p>
        )}
        <Separator className="my-2" />
        <p className="flex justify-between font-semibold">
          <span>Total:</span>
          <span className="text-[#92c949]">₹{order.total?.toFixed(2)}</span>
        </p>
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
      <div className="space-y-2">
        <p className="font-medium">{order.addressId?.name}</p>
        <p className="text-gray-600">{order.addressId?.street}</p>
        <p className="text-gray-600">
          {order.addressId?.city}, {order.addressId?.state} {order.addressId?.zip}
        </p>
        <p className="text-gray-600">{order.addressId?.country}</p>
      </div>
    </div>
  </div>
);

export default function OrderView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { order, isLoading, error } = useSelector((state) => state.order);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = async (itemId) => {
    if (!cancelReason.trim()) {
      toast({
        title: MESSAGES.ERROR,
        description: MESSAGES.PLEASE_PROVIDE_A_REASON_FOR_CANCELLATION,
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(cancelOrderItem({ 
        orderId: id, 
        itemId, 
        reason: cancelReason 
      })).unwrap();
      
      toast({
        title: MESSAGES.SUCCESS,
        description: MESSAGES.ITEM_HAS_BEEN_CANCELLED_SUCCESSFULLY,
      });
      setCancelReason("");
    } catch (error) {
      toast({
        title: MESSAGES.ERROR,
        description: error.message || "Failed to cancel item",
        variant: "destructive",
      });
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // Set initial coordinates
    const leftMargin = 15;
    const rightAlign = 190;
    const topMargin = 20;

    // Company name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Good Berry", leftMargin, topMargin);
    doc.setFontSize(9);
    doc.text("Private Limited", leftMargin, topMargin + 4);

    // Invoice header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Invoice", rightAlign - 50, topMargin);

    // Invoice details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Invoice#: ${order.orderId}`, rightAlign - 50, topMargin + 8);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      rightAlign - 50,
      topMargin + 13
    );

    // Bill To section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Shipping Address:", leftMargin, topMargin + 28);

    // Customer details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      [
        order.addressId.name,
        order.addressId.street,
        `${order.addressId.city}, ${order.addressId.state}, ${order.addressId.zip}`,
        order.addressId.mobile,
      ],
      leftMargin,
      topMargin + 34
    );

    // Items table
    const tableColumn = [
      { header: "ITEM DESCRIPTION", dataKey: "item" },
      { header: "PRICE", dataKey: "price" },
      { header: "QTY", dataKey: "qty" },
      { header: "TOTAL", dataKey: "total" },
    ];

    const tableRows = order.items.map((item) => ({
      item: item.name,
      price: `${item.price.toFixed(2)}`,
      qty: item.quantity,
      total: `${(item.price * item.quantity).toFixed(2)}`,
    }));

    autoTable(doc, {
      startY: 80,
      head: [tableColumn.map((col) => col.header)],
      body: tableRows.map((row) => [row.item, row.price, row.qty, row.total]),
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
      },
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.0,
      },
      didDrawCell: (order) => {
        // Add bottom border to last row
        if (order.row.index === tableRows.length - 1) {
          doc.line(
            order.cell.x,
            order.cell.y + order.cell.height,
            order.cell.x + order.cell.width,
            order.cell.y + order.cell.height
          );
        }
      },
    });

    const finalY = doc.lastAutoTable.finalY || 120;

    doc.setFont("helvetica", "normal");
    doc.text("SUB TOTAL", rightAlign - 90, finalY + 15);
    doc.text(`${order.subtotal.toFixed(2)}`, rightAlign - 20, finalY + 15, {
      align: "right",
    });

    doc.text("Discount", rightAlign - 90, finalY + 22);
    doc.text(`-${order.discount.toFixed(2)}`, rightAlign - 20, finalY + 22, {
      align: "right",
    });

    doc.text("Coupon Discount", rightAlign - 90, finalY + 28);
    doc.text(
      `-${order.couponDiscount.toFixed(2)}`,
      rightAlign - 20,
      finalY + 28,
      { align: "right" }
    );

    // Grand total with bold font
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total", rightAlign - 90, finalY + 37);
    doc.text(`${order.total.toFixed(2)}`, rightAlign - 20, finalY + 37, {
      align: "right",
    });

    // Contact section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Contact", leftMargin, finalY + 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      [
        "Goodberry Inc. Anytown, USA, 123 Main Street",
        "help@goodberry.com",
        "www.goodberry.com",
      ],
      leftMargin,
      finalY + 72
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Thank you for choosing us!", leftMargin, finalY + 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "We appreciate your trust in us and hope you enjoy your purchase.",
      leftMargin,
      finalY + 106
    );
    doc.text(
      "If you have any questions, feel free to reach out to our support team.",
      leftMargin,
      finalY + 109
    );

    // Save the PDF
    doc.save(`invoice-${order.orderId}.pdf`);
  };

  const handleReturn = async (itemId) => {
    if (!returnReason.trim()) {
      toast({
        title: MESSAGES.ERROR,
        description: MESSAGES.PLEASE_PROVIDE_A_REASON_FOR_RETURN,
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(returnOrderItem({ 
        orderId: id, 
        itemId, 
        reason: returnReason 
      })).unwrap();
      
      toast({
        title: MESSAGES.SUCCESS,
        description: MESSAGES.ITEM_HAS_BEEN_RETURN_REQUSTED_SUCCESSFULLY,
      });
      setReturnReason("");
    } catch (error) {
      toast({
        title: MESSAGES.ERROR,
        description: error.message || "Failed to return item",
        variant: "destructive",
      });
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handleRepay = async () => {
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        toast({
          title: MESSAGES.RAZORPAY_SDK_FAILED_TO_LOAD,
          variant: 'destructive',
        });
        return;
      }

      const razorpayOrder = await axios.post(`${import.meta.env.VITE_API_BASE}/api/user/create-razorpay-order`, {
        orderId: order._id
      }, {
        withCredentials: true
      });

      const options = {
        key: 'rzp_test_CS2mGJMpuRbxFh',
        amount: razorpayOrder.data.amount,
        currency: razorpayOrder.data.currency,
        name: "Good Berry",
        description: `Order ${order.orderId}`,
        order_id: razorpayOrder.data.orderId,
        handler: async function (response) {
          try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE}/api/user/verify-payment`, {
              orderCreationId: razorpayOrder.data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderData: order
            }, {
              withCredentials: true
            });

            setPaymentSuccess(true);
            toast({
              title: MESSAGES.PAYMENT_SUCCESSFUL,
              description: `Order ID: ${data.orderId}`,
            });
            dispatch(fetchOrderById(id)); 
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast({
              title: MESSAGES.PAYMENT_VERIFICATION_FAILED,
              description: error.response?.data?.message || 'Please contact support',
              variant: 'destructive',
            });
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              await axios.post(`${import.meta.env.VITE_API_BASE}/api/user/payment-failure`, {
                orderId: order._id
              }, {
                withCredentials: true
              });
              toast({
                title: MESSAGES.PAYMENT_CANCELLED,
                description: MESSAGES.YOUR_PAYMENT_WAS_CANCELLED_PLEASE_TRY_AGAIN,
                variant: 'destructive',
              });
            } catch (error) {
              console.error("Error handling payment failure:", error);
              toast({
                title: MESSAGES.ERROR_HANDLING_PAYMENT_FAILURE,
                description: error.message || 'Please contact support',
                variant: 'destructive',
              });
            }
          }
        },
        prefill: {
          name: order.addressId?.name,
          email: "", 
          contact: order.addressId?.mobile,
        },
        notes: {
          address: "Good Berry Store Order"
        },
        theme: {
          color: "#8AB446"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      toast({
        title: MESSAGES.ERROR_INITIATING_PAYMENT,
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (paymentSuccess) {
      return <OrderSuccess data={order} setPaymentSuccess={setPaymentSuccess} isRepay={true} />;
  }
  

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-24" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>Error loading order: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <p>Order not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:p-0 py-4 lg:py-3 lg:my-8 max-w-[1400px]">
      <Card className="shadow-none px-2 border-none bg-transparent">
        <CardHeader className="border-b px-0 pt-2 lg:pt-0 sm:px-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                Order <span className="text-[#92c949]">#{order.orderId}</span>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              {order.status === 'failed' ? (
                  <Button 
                    variant="outline" 
                    onClick={handleRepay}
                    className="rounded-xl"
                  >
                    Repay
                  </Button>
                ) : (
                <div className="flex sm:justify-end w-full sm:w-auto">
                  <OrderStatusBadge 
                    status={order.status} 
                    icon={<Package className="h-4 w-4" />} 
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-0 sm:px-6">
          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <OrderItem
                key={item._id}
                item={item}
                onCancel={handleCancel}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                onReturn={handleReturn}
                returnReason={returnReason}
                setReturnReason={setReturnReason}
                navigate={navigate}
              />
            ))}
          </div>

          <Separator />
          
          <OrderSummary order={order} />

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Payment Information
              </h3>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <p className="text-gray-600">
                  {order.paymentMethod === "cod" && "Cash on Delivery"}
                  {order.paymentMethod === "wallet" && "Wallet Payment"}
                  {order.paymentMethod === "upi" && "UPI Payment"}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Payment Status: <span className="font-medium">{order.paymentStatus}</span>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                If you have any questions about your order, please contact our
                customer support at <span className="font-medium">+91 96566 33324</span> or{" "}
                <span className="font-medium">goodberry@support.com</span>
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pb-5 flex flex-col sm:flex-row items-center justify-between px-0 sm:px-6">
          <p className="text-xs sm:text-sm text-gray-500 pt-4 text-center sm:text-left">
            Thank you for shopping with us! We appreciate your business.
          </p>
          <Button variant="outline" className="mt-4 w-full sm:w-auto rounded-xl" onClick={() => downloadInvoice()}> Invoice <Download className="ml-2 h-4 w-4"/></Button>
        </CardFooter>
      </Card>
    </div>
  );
}


OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

CancellationDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  cancelReason: PropTypes.string.isRequired,
  setCancelReason: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    packageSize: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

ReturnDialog.propTypes = {
  onReturn: PropTypes.func.isRequired,
  returnReason: PropTypes.string.isRequired,
  setReturnReason: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    packageSize: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

OrderItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    productId: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    packageSize: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    cancellationReason: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  cancelReason: PropTypes.string.isRequired,
  setCancelReason: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
  returnReason: PropTypes.string.isRequired,
  setReturnReason: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

OrderSummary.propTypes = {
  order: PropTypes.shape({
    subtotal: PropTypes.number,
    shippingCost: PropTypes.number,
    discount: PropTypes.number,
    couponDiscount: PropTypes.number,
    total: PropTypes.number.isRequired,
    addressId: PropTypes.shape({
      name: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

OrderView.propTypes = {
  id: PropTypes.string,
};
