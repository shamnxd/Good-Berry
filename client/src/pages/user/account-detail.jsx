import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getUser, updateUser } from "@/store/user-slice/account-slice";
import { Edit, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MESSAGES from '../../constants/messages';


const AccountDetailPage = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.account);
  const { toast } = useToast();

  const [data, setData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.username) {
      toast({
        title: MESSAGES.PLEASE_ENTER_FULL_NAME,
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{10}$/.test(data.phone)) {
      toast({
        title: MESSAGES.PHONE_NUMBER_MUST_BE_10_DIGITS,
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await dispatch(updateUser(data));
      if (res.payload.success) {
        setData((prevState) => ({
          ...prevState,
          ...res.payload.user,
        }));
        toast({
          title: res.payload.message,
        });
      } else {
        toast({
          title: res.payload.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      toast({
        title: MESSAGES.FAILED_TO_UPDATE_USER,
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) =>
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  return (
    <Card className="w-full rounded-none !shadow-none !border-none">
      <CardContent className="space-y-4 px-3 mt-5 lg:px-4">
        <div className="grid grid-cols-1 gap-5 mb-3">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              className="max-w-[400px]"
              value={data.username}
              onChange={handleChange}
              name="username"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              className="max-w-[400px]"
              value={data.email}
              name="email"
              type="email"
              disabled
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input
              className="max-w-[400px]"
              value={data.phone}
              onChange={handleChange}
              name="phone"
              type="number"
              placeholder="Enter phone number"
            />
          </div>
        </div>
        <Button
          className="w-[200px]"
          onClick={handleSubmit}
          disabled={data.username === "" || data.phone === ""}
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Edit className="w-4 h-4" />
          )}{" "}
          {isLoading ? "Updating..." : "Update Details"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountDetailPage;