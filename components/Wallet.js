import React from "react";


const Wallet = ({ userBalances }) => {
    return (
      <div className="grid grid-cols-5 pb-20 justify-end">
        <div className="col-span-5 flex justify-end pr-10">
        <div className="rounded-md flex flex-col justify-center items-center mt-3 pl-3 pr-3 bg-gray-600">
          <button className="text-sm font-medium gap-6 font-quantic text-white border-transparent focus:outline-none">
            {userBalances.availableBalance} liquid / {userBalances.lockedBalance} locked
            $FLIP
          </button>
        </div>
        </div>
      </div>
      )
}

export default Wallet