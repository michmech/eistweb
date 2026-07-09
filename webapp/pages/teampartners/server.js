import sqlite from "better-sqlite3";

export default function(app, L, do404, rootdir){

  const slugRegex = "(" + L("gd", "#teampartnersslug") + "|" + L("en", "#teampartnersslug") + ")";

  app.get("/:uilang(gd|en)/"+slugRegex, function(req, res){
    let prose="";

    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try{
      const sql=`select nickname, value_${req.params.uilang} as value from assets where nickname in ('teampartners')`;
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

    res.render("teampartners/view.ejs", {
      uilang: req.params.uilang,
      L: (multistring, subpart) => L(req.params.uilang, multistring, subpart),
      pageTitle: L(req.params.uilang, "#teampartners"),
      pageDescription: L(req.params.uilang, "#teampartnerstagline"),
      section: "teampartners",
      pageUrls: {
        "gd": "/gd/" + L("gd", "#teampartnersslug"),
        "en": "/en/" + L("en", "#teampartnersslug"),
      },
      prose,
    });
  });
  
}