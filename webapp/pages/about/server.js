export default function(app, L, do404, rootdir){

  app.get("/:uilang(gd|en)/(about|about)", function(req, res){
    res.render("about/view.ejs", {
      uilang: req.params.uilang,
      L: (multistring, subpart) => L(req.params.uilang, multistring, subpart),
      pageTitle: "ÈIST",
      pageDescription: "ÈIST",
      section: "about",
      pageUrls: {
        "gd": "/gd/about",
        "en": "/en/about",
      },
    });
  });
  
}