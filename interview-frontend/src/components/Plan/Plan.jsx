import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addProcedureToPlan,
  getPlanProcedures,
  getPlanProceduresUsers,
  getProcedures,
  getUsers,
} from "../../api/api";
import Layout from '../Layout/Layout';
import ProcedureItem from "./ProcedureItem/ProcedureItem";
import PlanProcedureItem from "./PlanProcedureItem/PlanProcedureItem";

const Plan = () => {
  let { id } = useParams();
  const [procedures, setProcedures] = useState([]);
  const [planProcedures, setPlanProcedures] = useState([]);
  const [planProceduresUsers, setPlanProceduresUsers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      var procedures = await getProcedures();
      var planProcedures = await getPlanProcedures(id);
      var planProceduresUsers = await getPlanProceduresUsers(id);
      var users = await getUsers();

      var userOptions = users.map((u) => ({
        label: u.name,
        value: u.userId
      }));

      setUsers(userOptions);
      setProcedures(procedures);
      setPlanProcedures(planProcedures);

      const userNamesByProcedureId = planProceduresUsers.reduce((acc, item) => {
        const user = userOptions.find(u => u.value === item.userId);
        const userName = user ? user.label : 'Unknown User';

        if (!acc[item.procedureId]) {
          acc[item.procedureId] = [];
        }
        acc[item.procedureId].push(userName);
        return acc;
      }, {});

      const planProcedureUserData = planProceduresUsers.map((item) => ({
        ...item,
        userNames: userNamesByProcedureId[item.procedureId]
      }));

      setPlanProceduresUsers(planProcedureUserData);
      // console.log("data of planProceduresUsers table: ", planProcedureUserData);
    })();
  }, [id]);

  const handleAddProcedureToPlan = async (procedure) => {
    const hasProcedureInPlan = planProcedures.some((p) => p.procedureId === procedure.procedureId);
    if (hasProcedureInPlan) return;

    await addProcedureToPlan(id, procedure.procedureId);
    setPlanProcedures((prevState) => {
      return [
        ...prevState,
        {
          planId: id,
          procedureId: procedure.procedureId,
          procedure: {
            procedureId: procedure.procedureId,
            procedureTitle: procedure.procedureTitle,
          },
        },
      ];
    });
  };

  return (
    <Layout>
      <div className="container pt-4">
        <div className="d-flex justify-content-center">
          <h2>OEC Interview Frontend</h2>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className="card shadow">
              <h5 className="card-header">Repair Plan</h5>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h4>Procedures</h4>
                    <div>
                      {procedures.map((p) => (
                        <ProcedureItem
                          key={p.procedureId}
                          procedure={p}
                          handleAddProcedureToPlan={handleAddProcedureToPlan}
                          planProcedures={planProcedures}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col">
                    <h4>Added to Plan</h4>
                    <div>
                      {planProcedures.map((p) => {
                        const planProcedureUser = planProceduresUsers.find(pu => pu.procedureId === p.procedureId);
                        return (
                          <PlanProcedureItem
                            key={p.procedure.procedureId}
                            procedure={p.procedure}
                            planId={id}
                            userNames={planProcedureUser ? planProcedureUser.userNames : ['Unknown User']}
                            users={users}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Plan;
