import CheckoutMainContent from "@/components/CheckoutMainContent";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

const CheckoutPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Header setSelectedCompare={() => {}} setSelectedSearch={() => {}} />

      <div className="flex h-[calc(100vh-73px)] min-h-0 overflow-hidden lg:h-[calc(100vh-83px)] lg:flex-row">
        <Sidebar />
        <CheckoutMainContent />
      </div>
    </div>
  );
};

export default CheckoutPage;