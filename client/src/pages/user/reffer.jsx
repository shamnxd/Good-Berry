import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, CheckCircle, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyReferralCode,
  getReferralCode,
  getReferredCount,
} from "@/store/user-slice/account-slice";

export default function ReferAndEarn() {
  const [copiedCode, setCopiedCode] = useState(false);
  const referralCodeRef = useRef(null);
  const applyCodeRef = useRef(null);
  const dispatch = useDispatch();
  const { referralCode, appliedCode, applyResult, referredCount, isLoading } =
    useSelector((state) => state.account);

  useEffect(() => {
    dispatch(getReferralCode());
    dispatch(getReferredCount());
  }, [dispatch]);

  const copyReferralCode = () => {
    if (referralCodeRef.current) {
      referralCodeRef.current.select();
      document.execCommand("copy");
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleApplyReferralCode = () => {
    const enteredCode = applyCodeRef.current?.value;
    if (enteredCode) {
      dispatch(applyReferralCode(enteredCode));
    }
  };

  return (
    <div className="container mx-auto">
      <Card className="w-full mx-auto !rounded-none !border-0 !shadow-none">
        <CardHeader className="p-3 lg:p-4">
          <CardTitle>Refer a Friend & Earn</CardTitle>
          <CardDescription>
            Share your unique code and both you and your friend get FLAT 100
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-3 lg:p-4">
          <div className="flex items-center justify-between bg-[#f0f7e6] rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-[#7eb53f]" />
              <div>
                <h4 className="text-sm font-medium text-[#4a6b22]">
                  Referred Users
                </h4>
                <p className="text-xs text-[#6b8e3c]">Total referrals</p>
              </div>
            </div>
            <span className="text-3xl font-bold text-[#7eb53f]">
              {referredCount}
            </span>
          </div>
          <div>
            <label
              htmlFor="referral-code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Referral Code
            </label>
            <div className="flex">
              <Input
                id="referral-code"
                ref={referralCodeRef}
                value={referralCode || ""}
                readOnly
                className="rounded-r-none"
              />
              <Button
                onClick={copyReferralCode}
                className="rounded-l-none"
                variant="outline"
              >
                {copiedCode ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {!appliedCode && (
            <div>
              <label
                htmlFor="apply-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Apply a Referral Code
              </label>
              <div className="flex">
                <Input
                  id="apply-code"
                  ref={applyCodeRef}
                  placeholder="Enter code"
                  className="rounded-r-none"
                  disabled={appliedCode}
                />
                <Button
                  onClick={handleApplyReferralCode}
                  className="rounded-l-none"
                  disabled={appliedCode || isLoading}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
          {applyResult && (
            <div
              className={`text-sm ${
                applyResult.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {applyResult}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Terms and conditions apply. Offer valid for new customers only.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
