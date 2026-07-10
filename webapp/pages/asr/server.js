import sqlite from "better-sqlite3";

export default function(app, L, do404, rootdir){

  const slugRegex = "(" + L("gd", "#asrslug") + "|" + L("en", "#asrslug") + ")";

  app.get("/:uilang(gd|en)/"+slugRegex, function(req, res){
    let prose="";

    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try{
      const sql=`select nickname, value_${req.params.uilang} as value from assets where nickname in ('asr')`;
      const stmt=db.prepare(sql);
      stmt.all().map(row => {
        prose = row['value'];
        prose = app.doMarkdown(prose);
      });
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }

    res.render("asr/view.ejs", {
      uilang: req.params.uilang,
      L: (multistring, subpart) => L(req.params.uilang, multistring, subpart),
      pageTitle: L(req.params.uilang, "#asrpagetitle"),
      pageDescription: L(req.params.uilang, "#asrtagline"),
      section: "asr",
      pageUrls: {
        "gd": "/gd/" + L("gd", "#asrslug"),
        "en": "/en/" + L("en", "#asrslug"),
      },
      prose,
    });
  });
  
}