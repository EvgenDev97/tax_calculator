const navigation = document.querySelectorAll(".navigation__link"); //all elements with this selector
const calc = document.querySelectorAll(".calc");

for (let i = 0; i < navigation.length; i += 1) {
  navigation[i].addEventListener("click", (e) => {
    e.preventDefault();
    for (let j = 0; j < calc.length; j += 1) {
      if (navigation[i].dataset.tax === calc[j].dataset.tax) {
        calc[j].classList.add("calc_active");
        navigation[j].classList.add("navigation__link_active");
      } else {
        calc[j].classList.remove("calc_active");
        navigation[j].classList.remove("navigation__link_active");
      }
    }
  });
}

const formatMoney = (money) => {
  const currency = new Intl.NumberFormat("ru-RU", {
    // money formatting according to language
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2, //a number of simbols after comma
  });

  return currency.format(money); //
};

//pattern
const debounceTime = (fnc, msec) => {
  let lastCall = 0;
  let lastCallTimer;

  return () => {
    const previousCall = lastCall;
    lastCall = Date.now();

    if (previousCall && lastCall - previousCall < msec) {
      clearTimeout(lastCallTimer);
    }
    lastCallTimer = setTimeout(() => {
      fnc();
    }, msec);
  };
};

//AUSN calc
const ausn = document.querySelector(".ausn");
const ausnForm = ausn.querySelector(".calc__form"); //search inside ausn class
const total = ausn.querySelector(".result__total");
const calcExpenses = ausn.querySelector(".calc__expenses");
const error = "расходы больше доходов, рассчет невозможен";

const income = ausn.querySelector('.calc__input[name="income"]');
const expenses = ausn.querySelector('.calc__input[name="expenses"]');

const inputListener = () => {
  if (Number(income.value) < Number(expenses.value)) {
    //input always return string
    total.textContent = error;
  } else {
    total.textContent = formatMoney(
      (ausnForm.income.value - ausnForm.expenses.value) * 0.2
    );
  }
};

calcExpenses.style.display = "none";
ausnForm.addEventListener(
  "input",
  debounceTime(() => {
    if (ausnForm.type.value === "income") {
      calcExpenses.style.display = "none";
      total.textContent = formatMoney(ausnForm.income.value * 0.08);
      ausnForm.expenses.value = 0;
    } else {
      calcExpenses.style.display = "block";
      inputListener();
    }
  }, 500)
);

//NPD Calculator
const selfEmployment = document.querySelector(".self-employment");
const selfEmploymentForm = selfEmployment.querySelector(".calc__form");
const resultPhys = selfEmployment.querySelector(".result__phys");
const resultLegal = selfEmployment.querySelector(".legal_phys");
const totalResult = selfEmployment.querySelector(".self__result");

const resultTaxComp = selfEmployment.querySelector(".result__tax-comp ");
const resultTaxRest = selfEmployment.querySelector(".result__tax-rest");
const resultTaxResult = selfEmployment.querySelector(".result__tax-result");

const calculateTax = () => {
  if (selfEmploymentForm.elements.A.value) {
    //it can be change on resultPhys.value
    totalResult.textContent = formatMoney(+resultPhys.value * 0.04);
  } else if (selfEmploymentForm.elements.B.value) {
    //resultLegal.value
    totalResult.textContent = formatMoney(+resultLegal.value * 0.06);
  } else {
    totalResult.textContent = 0;
  }
  const generalTax = resultPhys.value * 0.04 + resultLegal.value * 0.06;
  totalResult.textContent = formatMoney(generalTax);
  checkComp();
  //console.log(typeof generalTax) string

  selfEmploymentForm.compensation.value =
    selfEmploymentForm.compensation.value > 10000
      ? 10000 //if
      : selfEmploymentForm.compensation.value; //else

  const benefit = selfEmploymentForm.compensation.value;
  const benefitResult = resultPhys.value * 0.01 + resultLegal.value * 0.02;
  const finalBenefit =
    benefit - benefitResult > 0 ? benefit - benefitResult : 0;
  const resultTax = generalTax - (benefit - finalBenefit);

  resultTaxComp.textContent = formatMoney(benefit - finalBenefit);
  resultTaxRest.textContent = formatMoney(finalBenefit); // Remaining tax credit
  resultTaxResult.textContent = formatMoney(resultTax); // general tax
};

selfEmploymentForm.addEventListener("input", calculateTax);

const compensation = selfEmployment.querySelector(".calc__label_compensation");
compensation.style.display = "none";

const resultCompensation = selfEmployment.querySelectorAll(
  //return array
  ".result__compensation"
);

const checkComp = () => {
  const setDisplay = selfEmploymentForm.elements.addCompensation.checked
    ? "block" //if true
    : "none"; //else false
  compensation.style.display = setDisplay;

  resultCompensation.forEach((elem) => {
    elem.style.display = setDisplay;
  });
};
checkComp();

// OSNO
{
  const calcOsno = document.querySelector(".osno");
  const calsOsnoForm = calcOsno.querySelector(".calc__form");

  const ndflExp = calcOsno.querySelector(".result__block-ndfl-exp");
  const ndflinc = calcOsno.querySelector(".result__block-ndfl-inc");
  const profit = calcOsno.querySelector(".result__block-profit");

  const resultTaxNds = calcOsno.querySelector(".result__tax_nds");
  const resultTaxProp = calcOsno.querySelector(".result__tax_prop");
  const resultTaxNdflExp = calcOsno.querySelector(".result__tax_ndfl-exp");
  const resultTaxNdflInc = calcOsno.querySelector(".result__tax_ndfl-inc");
  const resultTaxProf = calcOsno.querySelector(".result__tax-prof");

  const checkBusiness = () => {
    if (calsOsnoForm.elements.formBusiness.value === "IP") {
      ndflExp.style.display = "";
      ndflinc.style.display = "";
      profit.style.display = "none";
    }
    if (calsOsnoForm.formBusiness.value === "OOO") {
      ndflExp.style.display = "none";
      ndflinc.style.display = "none";
      profit.style.display = "";
    }
  };

  calsOsnoForm.addEventListener(
    "input",
    debounceTime(() => {
      checkBusiness();

      const income = calsOsnoForm.income.value;
      const expenses = calsOsnoForm.expenses.value;
      const property = calsOsnoForm.property.value;
      console.log(income);
      const nds = income * 0.2;
      resultTaxNds.textContent = formatMoney(nds);

      const taxProp = property * 0.02;
      resultTaxProp.textContent = formatMoney(taxProp);

      const prof = income - expenses;

      const ndflExpResult = prof * 0.13;
      resultTaxNdflExp.textContent = formatMoney(ndflExpResult);

      const ndflIncResult = (income - nds) * 0.13;
      resultTaxNdflInc.textContent = formatMoney(ndflIncResult);

      const taxProfit = prof * 0.2;
      resultTaxProf.textContent = formatMoney(taxProfit);
    }, 500)
  );
}

{
  //13%

  const taxReturn = document.querySelector(".tax-return");
  const taxForm = taxReturn.querySelector(".calc__form");
  const resultTaxNdfl = taxReturn.querySelector(".result__tax_ndfl");
  const resultTaxPossible = taxReturn.querySelector(".result__tax_possible");
  const resultTaxdeduction = taxReturn.querySelector(".result__tax_ded");

  let timer;
  taxForm.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(timer);
      const expenses = +taxForm.expenses.value;
      const income = +taxForm.income.value;
      const sumExp = +taxForm.typeExp.value;
      const ndfl = income * 0.13;
      const compensation = expenses < sumExp ? expenses * 0.13 : sumExp * 0.13;
      const deduction = compensation < ndfl ? compensation : ndfl;

      resultTaxNdfl.textContent = formatMoney(ndfl);
      resultTaxPossible.textContent = formatMoney(compensation);
      resultTaxdeduction.textContent = formatMoney(deduction);
    }, 500);
  });
}
