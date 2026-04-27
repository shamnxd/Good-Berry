import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/store/shop-slice/order-slice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100  text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'returned':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error, currentPage, totalPages } = useSelector((state) => state.order);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const loadOrders = useCallback((page = 1) => {
    dispatch(fetchOrders({ page, limit: 9, search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handlePageChange = (newPage) => {
    loadOrders(newPage);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadOrders();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, loadOrders]);

  return (
    <div className="space-y-4 py-2 px-3 lg:p-0">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4 lg:mb-10">
            <Input
              type="text"
              placeholder="Search by Order ID"
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Select onValueChange={handleStatusChange} value={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Package className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                  {order.status}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigate(`/account/order/${order.orderId}`)}>View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <p>Loading orders...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="text-center py-4">
          <p>No orders found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 !py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
