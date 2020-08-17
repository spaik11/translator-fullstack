const translate = require("@vitalets/google-translate-api");
const { options } = require("../translate");

module.exports = {
  translator: async (req, res, next) => {
    const { text, language } = req.body;
    try {
      console.log("REQ ######", req.body);
      let success = await translate(text, {
        to: translate.languages.getCode(language),
      });
      console.log("from lang ", success.from.language.iso);

      res.json(success.text);
    } catch (e) {
      console.log(e);
    }
  },
};
