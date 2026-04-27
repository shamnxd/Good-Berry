import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { ArrowUpCircle, ArrowDownCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchWallet, addMoneyToWallet, fetchTransactions } from "@/store/user-slice/wallet-slice";
import { useToast } from "@/hooks/use-toast";
import MESSAGES from '../../constants/messages';


const ITEMS_PER_PAGE = 5;

const WalletPage = () => {
  const dispatch = useDispatch();
  const { balance, transactions, isLoading } = useSelector((state) => state.wallet);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const onSubmit = (data) => {
    const parsedData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    if(parsedData.amount > 1000) {
      return toast({
        title: MESSAGES.AMOUNT_EXEED,
        description: MESSAGES.CANT_ADD_MORE_THAN_1000_PLEASE_TRY_AGAIN,
        variant: 'destructive',
      }) 
    } else if (parsedData.amount <= 0) {
      return toast({
        title: MESSAGES.INVALID_AMOUNT,
        description: MESSAGES.AMOUNT_MUST_BE_GREATER_THAN_0,
        variant: 'destructive',
      })
    }
    if (parsedData.amount > 0) {
      dispatch(addMoneyToWallet(parsedData)).then(() => {
        reset();
        setIsDialogOpen(false);
      });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setValue('amount', value);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-2 !p-0">
      <Card className='!rounded-none !border-none !shadow-none !p-0'>
        <CardHeader className="flex flex-row items-center justify-between !p-4">
          <div>
            <CardTitle className='text-md'>Wallet Balance</CardTitle>
            <p className="text-3xl font-bold mt-2">₹{balance.toFixed(2)}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Money</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Money to Wallet</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  {...register("amount")}
                  placeholder="Amount"
                  type="number"
                  onChange={handleAmountChange}
                />
                <Input {...register("description")} placeholder="Description" />
                <Button type="submit" disabled={isLoading}>
                  Add Money
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
      <Card className='!rounded-none !border-none !shadow-none'>
        <CardHeader className='!p-4'>
          <CardTitle className='text-lg'>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className='!p-4 !pt-0'>
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between py-3 px-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {transaction.type === "credit" ? (
                    <ArrowUpCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{transaction.type === "credit" ? "Credit" : "Debit"}</p>
                    <p className="text-sm text-gray-500">{transaction.description || "No description"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-lg font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                  </span>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 !max-w-[350px]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;