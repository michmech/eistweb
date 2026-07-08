export default function(app, L, do404, rootdir){

  const slugRegex = "(" + L("gd", "#aboutslug") + "|" + L("en", "#aboutslug") + ")";

  app.get("/:uilang(gd|en)/"+slugRegex, function(req, res){
    res.render("about/view.ejs", {
      uilang: req.params.uilang,
      L: (multistring, subpart) => L(req.params.uilang, multistring, subpart),
      pageTitle: L(req.params.uilang, "#about"),
      pageDescription: L(req.params.uilang, "#abouttagline"),
      section: "about",
      pageUrls: {
        "gd": "/gd/" + L("gd", "#aboutslug"),
        "en": "/en/" + L("en", "#aboutslug"),
      },
    });
  });
  
}