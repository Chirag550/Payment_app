import Checkout from "./components/CheckoutForm";

export default function Home() {
  return (
    <div>
      <h1 className="text-gray-800 text-center text-lg font-semibold mt-2 mb-5">
        Stripe Payment
      </h1>
      <div className="flex justify-center items-center m-auto mt-20 h-[100%] w-]80%] p-5 border-gray-400 border-2">
        <Checkout />
      </div>
    </div>
  );
}
