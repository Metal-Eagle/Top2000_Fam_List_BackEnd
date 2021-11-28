const axios = require("axios");

module.exports = getDataFormVoteList = async (url, year) => {
  if (url.length !== 40) {
    let urlObject = new URL(url);
    let urlId = urlObject.pathname.split("/").pop();
    url = urlId;
  }

  if (url !== null) {
    if (year === 2019) yearAddon = "";
    else yearAddon = `-${year}`;
    if (url.length === 40) {
      let getUrl = `https://backend.stem.nporadio.nl/api/form/top2000${yearAddon}/${url}`;
      const { data } = await axios.get(getUrl);

      data.year = year;
      return data;
    }
  }
};
