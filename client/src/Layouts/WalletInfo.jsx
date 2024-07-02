
export default function WalletInfo({ address, balanceEth, balanceGet }) {
  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="text-gray-900 dark:text-gray-200">
        <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium">Your address:</span>
          <span className="text-sm break-all bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
            {address}
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-lg font-medium">Balance:</span>
          <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
            {balanceEth} ETH
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-lg font-medium">Token:</span>
          <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
            {balanceGet} GET
          </span>
        </div>
      </div>
    </div>
  );
};