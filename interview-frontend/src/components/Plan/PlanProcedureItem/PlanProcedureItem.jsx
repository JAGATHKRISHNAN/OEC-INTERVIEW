import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { assignUsersToProcedure } from "../../../api/api";

const PlanProcedureItem = ({ procedure, planId, users,userNames}) => {
    const [selectedUsers, setSelectedUsers] = useState(null);

    useEffect(() => {
        const selected = userNames.map(userName => users.find(user => user.label === userName));
        setSelectedUsers(selected.filter(Boolean)); 
    }, [userNames, users]);

    const handleAssignUserToProcedure = async (e) => {
        setSelectedUsers(e);
        const userIds = e.map(user => user.value);

        const requestBody = {
            procedureId: procedure.procedureId,
            userIds: userIds,
            planId: planId,
        };
        // console.log("requestBody=====",requestBody)

        try {
            const response = await assignUsersToProcedure(requestBody);
            console.log('Assignment successful:', response);
            } catch (error) {
                console.error('Failed to assign users:', error);
            }
    };

    return (
        <div className="py-2">
            <div>
                {procedure.procedureTitle}
            </div>
                <ReactSelect
                    className="mt-2"
                    placeholder="Select User to Assign"
                    isMulti={true}
                    options={users}
                    value={selectedUsers}
                    onChange={handleAssignUserToProcedure}
                />
        </div>
    );
};

export default PlanProcedureItem;
