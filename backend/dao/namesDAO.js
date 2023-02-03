import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let names

export default class NamesDAO {
  static async injectDB(conn) {
    if (names) {
      return
    }
    try {
      names = await conn.db(process.env.NAMES_NS)
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in namesDAO: ${e}`,
      )
    }
  }


  static async getAllNames({
    filters = null
  } = {}) {
    console.log("getting all names");
    let query
    if (filters) {
      if ("name" in filters) {
        query = {"name":1} 
      }
    }

    let cursor1
    
    try {
        let allNamesList
        let coll = "ranks_f";
        if ("sex" in filters) {
          if (filters["sex"] == "F") {
            coll = "ranks_f"
          } else {
            coll = "ranks_m"
          }
        }
        if ("name" in filters) {
          allNamesList = await names.collection(coll).distinct("name")
        }
      return { allNamesList }
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { allNamesList }
    }

  }

  static async getNames({
    filters = null
  } = {}) {
    console.log("getting names");
    let query
    if (filters) {
      if ("year" in filters) {
        query = { "year": { $eq: filters["year"] } }
      } else if ("name" in filters) {
        query = { "name": { $eq: filters["name"] }}
      }
    }

    let cursor1
    
    try {
        let coll = "ranks_f";
        if ("sex" in filters) {
          if (filters["sex"] == "F") {
            coll = "ranks_f"
          } else {
            coll = "ranks_m"
          }
        }
        if ("name" in filters) {
          cursor1 = await names.collection(coll).find(query)
        } else {
          cursor1 = await names.collection(coll).find(query)
        }
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { ranksList: [], totalNumNames: 0 }
    }

    let query2

    if (filters) {
      if ("year" in filters) {
        query2 = { "year": { $eq: filters["year"] } }
      } else if ("name" in filters) {
        query2 = { "name": { $eq: filters["name"] }}
      }
    }

    let cursor2
    
    try {
        let coll2 = "percentages_f";
        if ("sex" in filters) {
          if (filters["sex"] == "F") {
            coll2 = "percentages_f"
          } else {
            coll2 = "percentages_m"
          }
        }
        if ("name" in filters) {
          cursor2 = await names.collection(coll2).find(query2)
        } else {
          cursor2 = await names.collection(coll2).find(query2)
        }
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { ranksList: [], totalNumNames: 0 }
    }

    const displayCursor1 = cursor1
    const displayCursor2 = cursor2

    try {
      console.log("try return data");
      const ranksList = await displayCursor1.toArray();
      const percentagesList = await displayCursor2.toArray();

      return { ranksList, percentagesList }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { namesList: [], totalNumNames: 0 }
    }
  }


  static async getMatches({
    filters = null
  } = {}) {

    let query
    if (filters) {
      if ("name" in filters) {
        query = { "name": { $eq: filters["name"] }}
      }
    }
    let cursor1
    
    try {
        let coll = "percentages_f";
        if ("sex" in filters) {
          if (filters["sex"] == "F") {
            coll = "percentages_f"
          } else {
            coll = "percentages_m"
          }
        }
        if ("name" in filters) {
          cursor1 = await names.collection(coll).find(query).toArray()
        }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { namesList: [], totalNumNames: 0 }
    }
  
    console.log(cursor1)

    let ranksObj = {};
    let percentagesObj = {};
    try {
      //ranksObj = Object.values(cursor1)[0]["ranks"];
      percentagesObj = Object.values(cursor1)[0]["percentages"];
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

    for (var key in percentagesObj) {
      if (percentagesObj.hasOwnProperty(key)) {
        percentagesArr.push([key, percentagesObj[key]]);
      }
    }
    dataArr.push(percentagesArr);
    console.log(dataArr);

    console.log("getting matches");
    query = { "$and": []}
    let subquery
    let subquery1
    let subquery2
    let rank_year
    let factor = 12
    let allNamesList = []
    let allRanksList = []
    let prevNamesList = []

    while (true) {
      if (filters) {
        if ("name" in filters) {
          let key
          let term1
          let term2
          let perc_i
          for (var i=1880; i<2021; i++) {
            key = "" + i
            if (percentagesObj.hasOwnProperty(key)) {
              perc_i = percentagesObj[key]
            } else {
              continue
            }
  
            subquery = {}
            subquery1 = {}
            subquery2 = {}
            rank_year = "percentages." + i
            term1 = factor*perc_i
            subquery1[rank_year] = { $lte: term1 }
            term2 = perc_i/factor
            subquery2[rank_year] = { $gte: term2 }
            subquery = { $and: [subquery1, subquery2] }
            
            console.log(subquery)
            query["$and"].push(subquery)
          }
          console.log(query)
        }
      }
  
  
  
      try {
          let coll = "percentages_f";
          if ("sex" in filters) {
            if (filters["sex"] == "F") {
              coll = "percentages_f"
            } else {
              coll = "percentages_m"
            }
          }
          if ("name" in filters) {
            prevNamesList = [...allNamesList]
            allNamesList = await names.collection(coll).find(query).toArray()
          }
          if (allNamesList.length > 7) {
            factor = factor*5/6
            continue
          } else if (allNamesList.length === 0) {
            allNamesList = [...prevNamesList]
          }
          

          if (filters["sex"] == "F") {
            coll = "ranks_f"
          } else {
            coll = "ranks_m"
          }
          let currName;
          for (i=0; i<allNamesList.length; i++) {
            query = { "name": { $eq: allNamesList[i]["name"] }}
            currName = await names.collection(coll).find(query).toArray()
            allRanksList.push(currName[0]);
          }

        console.log(allRanksList)
        return { allNamesList, allRanksList }

      } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        return { allNamesList }
      }
    }
    
    }
    

}
