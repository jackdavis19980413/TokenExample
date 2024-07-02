import React, { useState } from "react";

import Vote from "../Modals/Vote";
import Fund from "../Modals/Fund";
import Web3 from "web3"

export default function Projects({ projects, isOwner, refresh, refreshAccount }) {
    const [isVoteOpen, setIsVoteOpen] = useState(false);
    const [isFundOpen, setIsFundOpen] = useState(false);
    const [project, setProject] = useState({});

    const onVoteBtn = (project_id, project_name) => {
        setProject({ id: project_id, name: project_name })
        setIsVoteOpen(true)
    }

    const onFundBtn = (project_id, project_name) => {
        setProject({ id: project_id, name: project_name })
        setIsFundOpen(true)
    }

    return (projects.length ? (
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <Vote isOpen={isVoteOpen} project={project} onCloseFunc={setIsVoteOpen} refresh={refresh} />
            <Fund isOpen={isFundOpen} project={project} onCloseFunc={setIsFundOpen} refresh={refresh} refreshAccount={refreshAccount} />
            <table className="mt-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                        <th className="px-3 py-3">Name</th>
                        <th className="px-3 py-3">Description</th>
                        <th className="px-3 py-3">Votes</th>
                        <th className="px-3 py-3">Funded</th>
                        <th className="px-3 py-3">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, index) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            key={project.name + '.' + index}>
                            <td className="px-3 py-2">
                                {project.name}
                            </td>
                            <td className="px-3 py-2">
                                {project.description}
                            </td>
                            <td className="px-3 py-2">
                                {project.voteCount ? Web3.utils.fromWei(project.voteCount, 'ether') : 0}
                            </td>
                            <td className="px-3 py-2">
                                {project.funded ? 'Funded' : 'Never'}
                            </td>
                            <td className="px-3 py-2 text-nowrap">
                                <button
                                    onClick={(e) => onVoteBtn(index, project.name)}
                                    className="font-medium text-green-600 dark:text-green-500 hover:underline mx-1"
                                >
                                    Vote
                                </button>
                                {isOwner && (
                                    <button
                                        onClick={(e) => onFundBtn(index, project.name)}
                                        className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline mx-1"
                                    >
                                        Fund
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    ) : (
        <></>
    )

    )
}