import NamesDAO from "../dao/namesDAO.js"


export default class NamesController {

  static async apiGetCurve(req, res, next) {
    //const namesPerPage = 140
    //const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.year) {
      filters.year = req.query.year
    } else if (req.query.name) {
      filters.name = req.query.name
    } 
    if (req.query.sex) {
      filters.sex = req.query.sex
    }
    console.log("check1");
    const { allNamesList, allRanksList } = await NamesDAO.getMatches({
      filters
    })
    //console.log(allNamesList)
    //const result = await CalcService.getCurve(dataArr);
    let percentagesObj
    let ranksObj
    for (var i=0; i < allNamesList.length; i++) {
      try {
        ranksObj = Object.values(allRanksList)[i]["ranks"];
        percentagesObj = Object.values(allNamesList)[i]["percentages"];
      } catch(err) {
        return;
      }

      let dataArr1 = [];
      let dataArr2 = [];
      let ranksArr = [];
      let percentagesArr = [];
      let year = 0;
      let rank = 0;
      let years = [];
      let ranks = [];

      for (var key in ranksObj) {
        if (ranksObj.hasOwnProperty(key)) {
          ranksArr.push([key, ranksObj[key]]);
        }
      }
      dataArr1.push(ranksArr);
      for (var key in percentagesObj) {
        if (percentagesObj.hasOwnProperty(key)) {
          percentagesArr.push([key, percentagesObj[key]]);
          
        }

      }
      dataArr2.push(percentagesArr);
      allNamesList[i]["ranks"] = dataArr1;
      allNamesList[i]["percentages"] = dataArr2;
    }
    
    

    res.json(allNamesList)
    

    
  }


  static async apiGetNames(req, res, next) {
    //const namesPerPage = 140
    //const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.year) {
      filters.year = req.query.year
    } else if (req.query.name) {
      filters.name = req.query.name
    } 
    if (req.query.sex) {
      filters.sex = req.query.sex
    }
    console.log("check1");
    const { ranksList, percentagesList } = await NamesDAO.getNames({
      filters
    })
    console.log(ranksList);
    let ranksObj = {};
    let percentagesObj = {};
    try {
      ranksObj = Object.values(ranksList)[0]["ranks"];
      percentagesObj = Object.values(percentagesList)[0]["percentages"];
    } catch(err) {
      return;
    }
    
    let dataArr = [];
    let ranksArr = [];
    let percentagesArr = [];
    let year = 0;
    let rank = 0;
    let years = [];
    let ranks = [];

    for (var key in ranksObj) {
      if (ranksObj.hasOwnProperty(key)) {
        ranksArr.push([key, ranksObj[key]]);
      }
    }
    dataArr.push(ranksArr);
    for (var key in percentagesObj) {
      if (percentagesObj.hasOwnProperty(key)) {
        percentagesArr.push([key, percentagesObj[key]]);
      }
    }
    dataArr.push(percentagesArr);

    let response = {
      names: ranksList,
      filters: filters
    }
    res.json(dataArr)
  }
}