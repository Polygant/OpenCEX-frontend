const fees = {
  ru: {
    fees: "Комиссии",
    first_table_maker: "Мейкер",
    first_table_taker: "Тейкер",
    first_table_volume: "Объем торгов",
    first_table_header: "Уровни комиссии за торги",
    second_table_header: "Комиссии за депозит и вывод",
    second_table_currency: "Валюта",
    second_table_min_deposit: "Минимальный депозит",
    second_table_max_deposit: "Максимальный депозит",
    second_table_w_limits: "Лимиты на вывод",
    third_table_header: "Лимиты на ордера",
    third_table_1c: "Максимальная сумма",
    third_table_min: "Минимальная сумма",
    mindepositalert:
      "Внимание! Пополнение баланса одной транзакцией меньше чем на минимальную сумму депозита зачислено не будет.",
  },
  en: {
    fees: "Fees",
    first_table_taker: "Taker",
    first_table_maker: "Maker",
    first_table_volume: "Trade volume",
    first_table_header: "Trading fee levels",
    second_table_header: "Deposit and withdrawal fees",
    third_table_1c: "Max amount",
    third_table_min: "Min amount",
    third_table_header: "Order limits",
    second_table_currency: "Currency",
    second_table_min_deposit: "Min deposit",
    second_table_max_deposit: "Max deposit",
    second_table_w_limits: "Withdrawal limits",
    mindepositalert:
      "Warning! Balance top-up at 1 transaction less than the minimum deposit amount will not be deposited.",
  },
};

export default fees;
