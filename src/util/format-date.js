exports.formatDate = (date) => {
    let dataArray;
    let tip_data_cu_punct = false;
    let dataNoua;

      if (date.split(" ")[0].includes("/")) {
        dataArray = date.split(" ")[0].split("/");
      }

      if (date.split(" ")[0].includes(".")) {
        dataArray = date.split(" ")[0].split(".");
        tip_data_cu_punct = true;
      }

      if (dataArray[0].length === 1) {
        dataArray[0] = "0" + dataArray[0];
      }

      if (dataArray[1].length === 1) {
        dataArray[1] = "0" + dataArray[1];
      }

      if (tip_data_cu_punct) {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[1] +
          "-" +
          dataArray[0] +
          "T22:00:00.000Z";
      } else {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[0] +
          "-" +
          dataArray[1] +
          "T22:00:00.000Z";
      }

      return dataNoua;
}