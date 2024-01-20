const express = require("express");
const app = express();
const port = 3000;
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.get("/home", home);

app.get("/project", project);
app.post("/project", addProject);

app.get("/delete/:id", delProject);

app.get("/reproject/:id", editProjectView);
app.post("/reproject", editProject);

app.get("/project-detaill/:id", projectDetail);

app.get("/testimonial", testimonial);

app.get("/dataTestimonial", dataTesti);

app.get("/contact-me", contact);

const data = [];
const query = "SELECT * FROM projects";

async function home(req, res) {
  const tittleTab = "Home";
  const objProjects = await sequelize.query(query, { type: QueryTypes.SELECT });

  console.log("ini data table projects", objProjects);

  res.render("index", { tittleTab, data: objProjects });
}

function project(req, res) {
  const tittleTab = "Add Project";
  res.render("project", { tittleTab });
}

function addProject(req, res) {
  let { tittle, startDate, endDate, desc, tech } = req.body;

  let startGet = new Date(startDate);
  let endGet = new Date(endDate);

  let diffDate = endGet.getTime() - startGet.getTime();
  let days = diffDate / (1000 * 60 * 60 * 24);

  let week = Math.floor(days / 7);
  // let weekDays = days % 7;

  let month = Math.floor(days / 30);
  let monthDays = days % 30;

  let years = Math.floor(days / 365);
  let yearsDays = days % 365;

  let timeProject = "";

  if (diffDate < 0) {
    return alert("End Date harus setelah Start Date!");
  }

  if (days <= 6) {
    timeProject = `${days} hari`;
  } else if (years > 0) {
    if (yearsDays > 0) {
      timeProject = `${years} Tahun ${Math.floor(
        yearsDays / 30
      )} Bulan ${Math.floor(yearsDays % 30)} Hari`;
    } else {
      timeProject = `${years} Tahun`;
    }
  } else if (month > 0) {
    if (monthDays > 0) {
      timeProject = `${month} Bulan ${monthDays} Hari`;
    } else {
      timeProject = `${month} Bulan `;
    }
  } else if (days > 0) {
    timeProject = `${days} Hari`;
  } else {
    timeProject = `${week} Minggu`;
  }

  const proj = {
    tittle,
    startDate,
    endDate,
    timeProject,
    desc,
    tech: Array.isArray(tech) ? tech : [tech],
    author: "Malik Mahdi",
  };
  data.unshift(proj);
  res.redirect("home#resultProject");
}

function delProject(req, res) {
  const { id } = req.params;

  data.splice(id, 1);
  res.redirect("/home#resultProject");
}

function editProjectView(req, res) {
  const { id } = req.params;

  const dataFilter = data[parseInt(id)];
  dataFilter.id = parseInt(id);
  res.render("edit-project", { data: dataFilter });
}

function editProject(req, res) {
  let { tittle, startDate, endDate, desc, tech, id } = req.body;

  let startGet = new Date(startDate);
  let endGet = new Date(endDate);

  let diffDate = endGet.getTime() - startGet.getTime();
  let days = diffDate / (1000 * 60 * 60 * 24);

  let week = Math.floor(days / 7);
  // let weekDays = days % 7;

  let month = Math.floor(days / 30);
  let monthDays = days % 30;

  let years = Math.floor(days / 365);
  let yearsDays = days % 365;

  let timeProject = "";

  if (diffDate < 0) {
    return alert("End Date harus setelah Start Date!");
  }

  if (days <= 6) {
    timeProject = `${days} hari`;
  } else if (years > 0) {
    if (yearsDays > 0) {
      timeProject = `${years} Tahun ${Math.floor(
        yearsDays / 30
      )} Bulan ${Math.floor(yearsDays % 30)} Hari`;
    } else {
      timeProject = `${years} Tahun`;
    }
  } else if (month > 0) {
    if (monthDays > 0) {
      timeProject = `${month} Bulan ${monthDays} Hari`;
    } else {
      timeProject = `${month} Bulan `;
    }
  } else if (days > 0) {
    timeProject = `${days} Hari`;
  } else {
    timeProject = `${week} `;
  }

  data[parseInt(id)] = {
    tittle,
    startDate,
    endDate,
    timeProject,
    desc,
    tech: Array.isArray(tech) ? tech : [tech],
    author: "Malik Mahdi",
    id,
  };

  res.redirect("/home#resultProject");
}

async function projectDetail(req, res) {
  const { id } = req.params;
  const tittleTab = "Detail Project";

  const objProjects = await sequelize.query(query, { type: QueryTypes.SELECT });
  // const datadet = objProjects[id];
  console.log("ini data detail", objProjects[id]);
  res.render("project-detaill", { tittleTab, dataDetail: objProjects[id] });
}

function testimonial(req, res) {
  const tittleTab = "Testimonials";
  res.render("testimonial", { tittleTab });
}

function contact(req, res) {
  const tittleTab = "Contact Me";
  res.render("contact", { tittleTab });
}

function dataTesti(req, res) {
  res.json([
    {
      author: "Agun",
      review: "Keren bangetttt",
      image: "assets/img/people1.jpg",
      rating: 5,
    },
    {
      author: "Alif",
      review: "Lumayan",
      image: "assets/img/people1.jpg",
      rating: 3,
    },
    {
      author: "Firdaus",
      review: "Saya kurang suka",
      image: "assets/img/people1.jpg",
      rating: 1,
    },
    {
      author: "Malik",
      review: "Tidak masalah",
      image: "assets/img/people1.jpg",
      rating: 3,
    },
    {
      author: "Lukman",
      review: "Mantap pokoknya",
      image: "assets/img/people1.jpg",
      rating: 5,
    },
  ]);
}

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
