import React from "react";

export default function OrderTracking() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-pink-50 p-6">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="col-span-1 space-y-6 border-r pr-6">
          <div className="text-xl font-semibold tracking-wide">SHOPPERS STOP</div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">Customer Name</h3>
            <p>Prashant Patil</p>

            <h3 className="font-semibold text-gray-700 text-sm">Customer Contact</h3>
            <p>+91 99987-87122</p>

            <h3 className="font-semibold text-gray-700 text-sm">Delivery Address</h3>
            <p>
              306 North Plaza, South Motera,<br /> Nr 4D Square Mall, Sabarmati,<br /> Ahmedabad - 380005
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">Seller Name</h3>
            <p>Bewakoof India Brands Private Limited</p>

            <h3 className="font-semibold text-gray-700 text-sm">Seller Support</h3>
            <p>+91 99*****12</p>
            <p>support@bewakoof.com</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Tracking No.</p>
              <h2 className="font-bold text-gray-800">#34918713810</h2>

              <p className="mt-4 text-sm text-gray-500">your order is</p>
              <h1 className="text-4xl font-extrabold text-green-600">Delivered</h1>
              <p className="text-sm text-gray-600 mt-1">as on 27 Aug 2021, Friday</p>
              <p className="text-sm text-gray-400">Last updated on 29 Aug 2021, Sunday</p>
            </div>

            <div className="space-y-3 text-right">
              <button className="text-sm border px-3 py-2 rounded-lg hover:bg-gray-100">↩ Return Order</button>
              <button className="text-sm border px-3 py-2 rounded-lg hover:bg-gray-100 block">⇄ Exchange Item</button>
              <a href="#" className="text-blue-600 text-sm block mt-2">Contact Us</a>
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="text-sm text-gray-600 mb-2">How was your delivery experience?</p>
            <div className="flex space-x-4 text-2xl">
              <span>😞</span>
              <span>😐</span>
              <span>🙂</span>
              <span>😊</span>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-700">Tracking History</h3>

            <div className="border-l-2 border-gray-300 pl-6 space-y-8">
              <div>
                <div className="w-3 h-3 bg-green-500 rounded-full -ml-[22px]"></div>
                <p className="text-sm font-medium">27th Aug 2021 — 2:30 PM</p>
                <p className="text-gray-600 text-sm">Delivered at location Ahmedabad, GJ</p>
              </div>

              <div>
                <div className="w-3 h-3 bg-gray-400 rounded-full -ml-[22px]"></div>
                <p className="text-sm font-medium">27th Aug 2021 — 11:30 AM</p>
                <p className="text-gray-600 text-sm">Out For Delivery at location Ahmedabad, GJ</p>
              </div>

              <div>
                <div className="w-3 h-3 bg-gray-400 rounded-full -ml-[22px]"></div>
                <p className="text-sm font-medium">25th Aug 2021 — 05:30 PM</p>
                <p className="text-gray-600 text-sm">In transit from Mumbai, MH to Ahmedabad, GJ</p>
              </div>

              <div>
                <div className="w-3 h-3 bg-gray-400 rounded-full -ml-[22px]"></div>
                <p className="text-sm font-medium">24th Aug 2021 — 07:26 AM</p>
                <p className="text-gray-600 text-sm">Order Picked Up from Mumbai, MH</p>
              </div>

              <div>
                <div className="w-3 h-3 bg-gray-400 rounded-full -ml-[22px]"></div>
                <p className="text-sm font-medium">23rd Aug 2021 — 12:46 PM</p>
                <p className="text-gray-600 text-sm">Order Received at Mumbai, MH</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
