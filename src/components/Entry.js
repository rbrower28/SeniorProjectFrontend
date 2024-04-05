import { useEffect, useState } from "react";
import "./Entry.css";
import {
  isValidNumber,
  validateNumbers,
  validateNumbersRequired,
  cleanNumber,
  formatCommas,
} from "../utils/validate";
import Axios from "axios";

export default function Entry({ props }) {
  // INCOME
  const [workIncome, setWorkIncome] = useState("");
  const [socialSecurity, setSocialSecurity] = useState("");
  const [pension, setPension] = useState("");
  const [realEstate, setRealEstate] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  // EXPENSES
  const [livingExpenses, setLivingExpenses] = useState("");
  const [mortgage, setMortgage] = useState("");
  const [insurance, setInsurance] = useState("");
  const [investing, setInvesting] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  // Button shake
  const [buttonShake, setButtonShake] = useState(false);

  // Populate data if existing scenario
  useEffect(() => {
    setWorkIncome(formatCommas(props.workIncome));
    setSocialSecurity(formatCommas(props.socialSecurity));
    setPension(formatCommas(props.pension));
    setRealEstate(formatCommas(props.realEstate));
    setOtherIncome(formatCommas(props.otherIncome));
    setLivingExpenses(formatCommas(props.livingExpenses));
    setMortgage(formatCommas(props.mortgage));
    setInsurance(formatCommas(props.insurance));
    setInvesting(formatCommas(props.investing));
    setOtherExpenses(formatCommas(props.otherExpenses));
  }, [props]);

  async function sendData(data) {
    await Axios.put("http://localhost:8080/scenario", data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.status === 201) {
          window.location.reload();
        } else {
          setButtonShake(true);
        }
      })
      .catch((err) => {
        console.log("REQUEST FAILED", err.response.data);
        setButtonShake(true);
      });
  }

  const refreshData = (e) => {
    e.preventDefault();

    if (
      validateNumbersRequired([
        workIncome,
        socialSecurity,
        pension,
        realEstate,
        livingExpenses,
        mortgage,
        insurance,
        investing,
      ]) === false
    ) {
      setButtonShake(true);
      return;
    }

    if (validateNumbers([otherIncome, otherExpenses]) === false) {
      setButtonShake(true);
      return;
    }

    const formData = {
      workIncome: cleanNumber(workIncome),
      socialSecurity: cleanNumber(socialSecurity),
      pension: cleanNumber(pension),
      realEstate: cleanNumber(realEstate),
      otherIncome: cleanNumber(otherIncome),
      livingExpenses: cleanNumber(livingExpenses),
      mortgage: cleanNumber(mortgage),
      insurance: cleanNumber(insurance),
      investing: cleanNumber(investing),
      otherExpenses: cleanNumber(otherExpenses),
    };

    sendData(formData);
  };

  return (
    <div className="entrybox">
      <form onSubmit={refreshData}>
        <div className="formblocks">
          <fieldset>
            <h3>Income</h3>
            <label>
              Work Income
              <input
                type="text"
                placeholder="90,000"
                value={workIncome}
                className={isValidNumber(workIncome) ? "valid" : "invalid"}
                onChange={(e) => {
                  setWorkIncome(e.target.value);
                }}
              />
            </label>
            <label>
              Social Security
              <input
                type="text"
                placeholder="4,555"
                value={socialSecurity}
                className={isValidNumber(socialSecurity) ? "valid" : "invalid"}
                onChange={(e) => {
                  setSocialSecurity(e.target.value);
                }}
              />
            </label>
            <label>
              Pension
              <input
                type="text"
                placeholder="20,000"
                value={pension}
                className={isValidNumber(pension) ? "valid" : "invalid"}
                onChange={(e) => {
                  setPension(e.target.value);
                }}
              />
            </label>
            <label>
              Real Estate
              <input
                type="text"
                placeholder="10,000"
                value={realEstate}
                className={isValidNumber(realEstate) ? "valid" : "invalid"}
                onChange={(e) => {
                  setRealEstate(e.target.value);
                }}
              />
            </label>
            <label>
              Other Income
              <input
                type="text"
                placeholder="-"
                value={otherIncome === "0" ? "" : otherIncome}
                className={isValidNumber(otherIncome) ? "valid" : "invalid"}
                onChange={(e) => {
                  setOtherIncome(e.target.value);
                }}
              />
            </label>
          </fieldset>
          <fieldset>
            <h3>Expenses</h3>
            <label>
              Living Expenses
              <input
                type="text"
                placeholder="100,000"
                value={livingExpenses}
                className={isValidNumber(livingExpenses) ? "valid" : "invalid"}
                onChange={(e) => {
                  setLivingExpenses(e.target.value);
                }}
              />
            </label>
            <label>
              Mortgage
              <input
                type="text"
                placeholder="15,000"
                value={mortgage}
                className={isValidNumber(mortgage) ? "valid" : "invalid"}
                onChange={(e) => {
                  setMortgage(e.target.value);
                }}
              />
            </label>
            <label>
              Insurance
              <input
                type="text"
                placeholder="10,000"
                value={insurance}
                className={isValidNumber(insurance) ? "valid" : "invalid"}
                onChange={(e) => {
                  setInsurance(e.target.value);
                }}
              />
            </label>
            <label>
              Investing
              <input
                type="text"
                placeholder="10,000"
                value={investing}
                className={isValidNumber(investing) ? "valid" : "invalid"}
                onChange={(e) => {
                  setInvesting(e.target.value);
                }}
              />
            </label>
            <label>
              Other Expenses
              <input
                type="text"
                placeholder="-"
                value={otherExpenses === "0" ? "" : otherExpenses}
                className={isValidNumber(otherExpenses) ? "valid" : "invalid"}
                onChange={(e) => {
                  setOtherExpenses(e.target.value);
                }}
              />
            </label>
          </fieldset>
        </div>
        <div className="action">
          <button
            type="submit"
            className={buttonShake ? "shake" : ""}
            onAnimationEnd={(e) => setButtonShake(false)}
          >
            Refresh Data
          </button>
        </div>
      </form>
    </div>
  );
}
