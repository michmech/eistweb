export default function(app, L, do404, rootdir){

  app.get("/", function(req, res){
    res.redirect("/gd");
  });

  app.get("/:uilang(gd|en)/", function(req, res){
    res.render("home/view.ejs", {
      uilang: req.params.uilang,
      L: (multistring, subpart) => L(req.params.uilang, multistring, subpart),
      pageTitle: "ÈIST",
      pageDescription: "ÈIST",
      pageUrls: {
        "gd": "/gd",
        "en": "/en",
      },
    });
  });
  
}