import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, MapPin, CreditCard, Edit, ArrowLeft, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderItemStatus, approveReturnRequest, rejectReturnRequest } from '@/store/admin-slice/order-slice';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderDetails, isLoading, error } = useSelector((state) => state.adminOrder);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  function getStatusColor(status) {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'returned': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const handleUpdateItem = async (orderId, productId, updates, id) => {
    try {
      await dispatch(updateOrderItemStatus({ orderId, productId, updates })).unwrap();
      await dispatch(fetchOrderById(id));
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  const handleApproveReturn = async (orderId, productId, id) => {
    try {
      await dispatch(approveReturnRequest({ orderId, productId })).unwrap();
      await dispatch(fetchOrderById(id));
    } catch (error) {
      console.error('Failed to approve return request:', error);
    }
  };

  const handleRejectReturn = async (orderId, productId, id) => {
    try {
      await dispatch(rejectReturnRequest({ orderId, productId })).unwrap();
      await dispatch(fetchOrderById(id));
    } catch (error) {
      console.error('Failed to reject return request:', error);
    }
  };

  function validateStatusTransition(currentStatus, newStatus) {
    const statusOrder = ['processing', 'shipped', 'delivered'];
    
    if (newStatus === 'cancelled') {
      return true
    }
    
    if (currentStatus === 'delivered') {
      return false;
    }
  
    if (currentStatus === 'processing' && newStatus === 'delivered') {
      return true;
    }
  
    return statusOrder.indexOf(newStatus) > statusOrder.indexOf(currentStatus);
  }

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading order details...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  if (!orderDetails) return <div className="flex items-center justify-center h-screen">Order not found</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Order header and navigation */}
      <div className="flex items-center mb-6">
        <Button variant="outline" className="mr-4" onClick={() => navigate('/admin/orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
        <h1 className="text-3xl font-bold text-primary">Order Details</h1>
      </div>

      {/* Order and customer information cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><ShoppingBag className="inline-block mr-2" /> <strong>Order ID:</strong> {orderDetails?.orderId}</p>
              <p><Calendar className="inline-block mr-2" /> <strong>Date:</strong> {new Date(orderDetails?.createdAt).toLocaleDateString()}</p>
              <p><CreditCard className="inline-block mr-2" /> <strong>Payment Method:</strong> {orderDetails?.paymentMethod === "cod" && "Cash on Delivery"}
                  {orderDetails?.paymentMethod === "card" && "Credit Card"}
                  {orderDetails?.paymentMethod === "upi" && "UPI Payment"}</p>
              <p><strong>Overall Status:</strong> <Badge className={getStatusColor(orderDetails?.status)}>{orderDetails?.status}</Badge></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {orderDetails?.addressId?.name || orderDetails?.userId?.username}</p>
              <p><MapPin className="inline-block mr-2" /> <strong>Address:</strong> {orderDetails?.addressId?.street}, {orderDetails?.addressId?.city}</p>
              <p><Phone className="inline-block mr-2" /> <strong>Phone:</strong> {orderDetails?.addressId?.mobile}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order items table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Package Size</TableHead>
                <TableHead>Flavor</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetails?.items?.map(item => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.packageSize}</TableCell>
                  <TableCell>{item.flavor || 'N/A'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.status !== 'delivered' && item.status !== 'returned' && item.status !== 'cancelled' && item.status !== 'Return Requested' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {setEditingItem({ 
                          orderId: orderDetails._id, 
                          item: { ...item }
                        })}}
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit Status
                      </Button>
                    )}
                    {item.status === 'Return Requested' && (
                      <div className='flex flex-col gap-1'>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            handleApproveReturn(orderDetails._id, item.productId, orderId)}}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRejectReturn(orderDetails._id, item.productId, orderId)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orderDetails?.items?.some(item => item.status === 'cancelled') && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <h3 className="font-bold text-red-800 mb-2">Cancelled Items:</h3>
              {orderDetails.items
                .filter(item => item.status === 'cancelled')
                .map(item => (
                  <p key={item._id} className="text-red-600">
                    {item.name}: {item.cancellationReason || 'No reason provided'}
                  </p>
                ))
              }
            </div>
          )}
          {orderDetails?.items?.some(item => item.status === 'returned') && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <h3 className="font-bold text-yellow-800 mb-2">Returned Items:</h3>
              {orderDetails.items
                .filter(item => item.status === 'returned')
                .map(item => (
                  <p key={item._id} className="text-yellow-600">
                    {item.name}: {item.returnReason || 'No reason provided'}
                  </p>
                ))
              }
            </div>
          )}
        </CardContent>
    <CardHeader>
      <CardTitle className="text-lg">Order Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-lg font-bold">₹{orderDetails?.subtotal?.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">Discount</p>
          <p className="text-lg font-bold">₹{orderDetails?.discount?.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">Coupon</p>
          <p className="text-lg font-bold">{orderDetails?.couponDiscount || 'None'}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">Final Payable</p>
          <p className="text-lg font-bold">₹{orderDetails?.total?.toFixed(2)}</p>
        </div>
      </div>
    </CardContent>
      </Card>

      {/* Status update dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Item Status</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingItem) {
                const updates = {
                  status: editingItem.item.status,
                  packageSize: editingItem.item.packageSize,
                  flavor: editingItem.item.flavor
                };
                if (editingItem.item.status === 'cancelled') {
                  updates.cancellationReason = editingItem.item.cancellationReason;
                }
                handleUpdateItem(editingItem.orderId, editingItem.item.productId, updates, orderId);
              }
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="status" className="text-right">Status</label>
                  <Select
                    value={editingItem.item.status}
                    onValueChange={(value) => {
                      if (validateStatusTransition(editingItem.item.status, value)) {
                        setEditingItem((prev) => ({
                          ...prev,
                          item: { ...prev.item, status: value }
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingItem.item.status === 'cancelled' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="cancellationReason" className="text-right">Cancellation Reason</label>
                    <Textarea
                      id="cancellationReason"
                      value={editingItem.item.cancellationReason || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, cancellationReason: e.target.value }
                      })}
                      className="col-span-3"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default OrderDetails;