import { getWeb3, getVotingContract } from "../getWeb3";


const Vote = ({ isOpen, project, onCloseFunc, refresh }) => {
    if (!isOpen) return null;

    const onVote = (e) => {
        e.preventDefault()

        const handleVote = async () => {
            try {
                const web3Instance = await getWeb3();
                const contract = await getVotingContract(web3Instance);
                const accounts = await web3Instance.eth.getAccounts();

                await contract.methods.vote(project.id).send({ from: accounts[0] });

                refresh()
            } catch (error) {
                console.error("Error adding project: ", error);
            }
        };
        handleVote()
        onCloseFunc()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-96 relative">
                <button className="absolute top-3 right-3 text-gray-600" onClick={onCloseFunc}>
                    <img alt="" src="data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15.281%2014.0591C15.3507%2014.1288%2015.406%2014.2116%2015.4437%2014.3026C15.4814%2014.3936%2015.5008%2014.4912%2015.5008%2014.5898C15.5008%2014.6883%2015.4814%2014.7859%2015.4437%2014.8769C15.406%2014.968%2015.3507%2015.0507%2015.281%2015.1204C15.2114%2015.1901%2015.1286%2015.2454%2015.0376%2015.2831C14.9465%2015.3208%2014.849%2015.3402%2014.7504%2015.3402C14.6519%2015.3402%2014.5543%2015.3208%2014.4632%2015.2831C14.3722%2015.2454%2014.2895%2015.1901%2014.2198%2015.1204L8.00042%208.90008L1.78104%2015.1204C1.64031%2015.2611%201.44944%2015.3402%201.25042%2015.3402C1.05139%2015.3402%200.860523%2015.2611%200.719792%2015.1204C0.579062%2014.9797%200.5%2014.7888%200.5%2014.5898C0.5%2014.3907%200.579062%2014.1999%200.719792%2014.0591L6.9401%207.83977L0.719792%201.6204C0.579062%201.47967%200.5%201.2888%200.5%201.08977C0.5%200.89075%200.579062%200.699878%200.719792%200.559147C0.860523%200.418417%201.05139%200.339355%201.25042%200.339355C1.44944%200.339355%201.64031%200.418417%201.78104%200.559147L8.00042%206.77946L14.2198%200.559147C14.3605%200.418417%2014.5514%200.339355%2014.7504%200.339355C14.9494%200.339355%2015.1403%200.418417%2015.281%200.559147C15.4218%200.699878%2015.5008%200.89075%2015.5008%201.08977C15.5008%201.2888%2015.4218%201.47967%2015.281%201.6204L9.06073%207.83977L15.281%2014.0591Z'%20fill='%23B5B5B5'/%3e%3c/svg%3e" />
                </button>
                <h2 className="text-gray-200 text-2xl font-bold mb-6">Vote for Project</h2>
                <div className="mb-6">
                    Are you really want to vote for "{project.name}"?
                </div>
                <button
                    className="w-full bg-blue-500 text-white py-3 rounded-md"
                    onClick={onVote}
                >
                    Vote for {project.name}
                </button>
            </div>
        </div>
    );
}

export default Vote;
