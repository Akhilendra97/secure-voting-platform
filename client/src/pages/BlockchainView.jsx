import BlockchainView from "../components/BlockchainView";

function BlockchainPage() {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6">Blockchain Ledger</h1>

      <BlockchainView />
    </div>
  );
}

export default BlockchainPage;