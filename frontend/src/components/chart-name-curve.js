import React, { useEffect, useState } from "react";
import NameDataService from "../services/name";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import LoadSpinner from "../LoadSpinner/LoadSpinner";
am4core.useTheme(am4themes_animated);
am4core.addLicense("ch-custom-attribution");
am4core.options.autoDispose = true;


const ChartNameCurve = props => {
    const [name, setName] = useState("alexis");
    const [nameSex, setNameSex] = useState("F");
    const [rankData, setRankData] = useState([]);
    const [percentData, setPercentData] = useState([]);
    const [dataType, setDataType] = useState("Percentage");
    const [dataTypeChanged, setDataTypeChanged] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [firstSubmit, setFirstSubmit] = useState(true);
    const [namesList, setNamesList] = useState([]);
    const [sexList, setSexList] = useState([]);
    const [theChart, setTheChart] = useState(0);
    const [init, setInit] = useState(false);
    const [index, setIndex] = useState(0);
    const [resData, setResData] = useState([]);
    const [loading, setLoading] = useState(false);
 



    async function submit(query, by, query2, by2) {
        //console.log("trying submit()");

        await NameDataService.findCurve(query, by, query2, by2)
            .then(res => {
                setResData(res.data);

                if (firstSubmit) {
                    setFirstSubmit(false);
                }
                
            })
            .catch(err => {
                console.log(err);
            });
    };



    const onChangeDataType = e => {
        const changeDataType = e.target.value;
        setDataType(changeDataType);
        //console.log("changed to " + changeDataType);
        setDataTypeChanged(true);
    }

    const onChangeName = e => {
        const changeName = e.target.value;
        setName(changeName);
    }

    const onChangeNameSex = e => {
        const changeNameSex = e.target.value;
        setNameSex(changeNameSex);
    }

    const submitName = () => {

        if (namesList.length < 2) {
            setLoading(true);
            let properName = name[0].toUpperCase() + name.substring(1).toLowerCase();

            submit(properName, "name", nameSex, "sex")

        }
        else {
            clearName();
            setLoading(true);
            let properName = name[0].toUpperCase() + name.substring(1).toLowerCase();

            submit(properName, "name", nameSex, "sex")
        }

    };

    const splitData = () => {
        
        let res_data = resData;

        let newNamesList = namesList;
        let newSexList = sexList;

        let newRankData = rankData;
        let newPercentData = percentData;

        for (var i = 0; i < res_data.length; i++) {

            newNamesList.push(res_data[i]["name"]);
            newSexList.push(nameSex);
            setNamesList(newNamesList);
            setSexList(newSexList);

            newRankData.push(res_data[i]["ranks"]);
            newPercentData.push(res_data[i]["percentages"]);
            
            //setSubmitted(false);
        }
        setRankData(newRankData);
        setPercentData(newPercentData);
        setSubmitted(true);


    }


    const clearName = () => {

        setInit(false);
        setRankData([]);
        setPercentData([]);
        setNamesList([]);
        setSexList([]);
        setIndex(0);
        setSubmitted(false);
    }

    const handleKeyPress = (e) => {

        if (e.charCode === 13) {
            e.preventDefault();

            submitName();
        }
    }


    useEffect(() => {

        const switchChartData = () => {
            let i = index*2;
            let chart = theChart;
            let valueAxis = chart.yAxes._values[0];
            let cursor = chart.cursor;

            if (dataType === "Ranking") {
                valueAxis.renderer.inversed = true;
                valueAxis.title.text = "Popularity (Ranking)";
                valueAxis.min = 1;
                valueAxis.max = 20000;
                valueAxis.numberFormatter.numberFormat = "#"
                valueAxis.adapter.add("extraTooltipPrecision", function(text, target, key) {
                    return 0;
                   });
            }
            else if (dataType === "Percentage") {
                valueAxis.renderer.inversed = false;
                valueAxis.title.text = "Popularity (Percentage)";
                valueAxis.min = 0.0001;
                valueAxis.max = 10;
                valueAxis.numberFormatter.numberFormat = "#.0000";
                valueAxis.adapter.add("extraTooltipPrecision", function(text, target, key) {
                    return 4;
                   });
                chart.xAxes._values[0].tooltip.label.adapter.add("text", function(text, target) {
                    if (text) {
                        return text.substring(0,4);
                    }
                     
                  });
            }
            for (let j=0; j < i; j++) {
                
                if (dataType === "Ranking") {
                    if (j === 0 || (j % 2) === 0) {
                        chart.series.values[j].strokeWidth = 2;
                        chart.series.values[j].hiddenInLegend = false;
                        chart.series.values[j].show();
                    } else {
                        chart.series.values[j].strokeWidth = 0;
                        chart.series.values[j].hiddenInLegend = true;
                        chart.series.values[j].hide();
                    }
                }
                else if (dataType === "Percentage") {

                    if (!(j === 0 || (j % 2) === 0)) {
                        
                        chart.series.values[j].strokeWidth = 2;
                        chart.series.values[j].hiddenInLegend = false;
                        chart.series.values[j].show();
                    } else {
                        chart.series.values[j].strokeWidth = 0;
                        chart.series.values[j].hiddenInLegend = true;
                        chart.series.values[j].hide();
                    }
                }
            }
        }


        const updateChart = () => {

            let chart = theChart;
            let colorSet = new am4core.ColorSet();
            

            let k = index;


            let j = 0;

            let dataObj = {};
            let dataArr = [];
            let years;
            let series;

            while (k<rankData.length) {
                if (dataType === "Ranking") {
                    years = rankData[k][0]
                    let valueAxis = chart.yAxes._values[0];
                    valueAxis.renderer.inversed = true;
                    valueAxis.title.text = "Popularity (Ranking)";
                    valueAxis.min = 1;
                    valueAxis.max = 20000;
                    valueAxis.numberFormatter.numberFormat = "#";
                    valueAxis.start = 0;
                    valueAxis.end = 1;
                    valueAxis.keepSelection = true;

                    if (submitted) {
                        dataArr = [];

                        series = chart.series.push(new am4charts.LineSeries());
                        
                        
                        series.stroke = am4core.color(colorSet.getIndex(k * 4));
                        series.defaultState.transitionDuration = 0;
                        series.hiddenState.transitionDuration = 0;
                        series.strokeWidth = 2;
                        series.dataFields.valueX = "year";
                        series.dataFields.valueY = "rank";
                        series.connect = false;
                        series.legendSettings.labelText = namesList[k] + " (" + sexList[k] + ")";

                        for (j = 0; j < years.length; j++) {
                            dataObj = {};
                            dataObj["year"] = parseInt(years[j][0]);
                            dataObj["rank"] = years[j][1];
                            dataArr.push(dataObj);
                        }
                        series.data = dataArr;
                        setIndex(k)

                        years = percentData[k][0];
                        dataArr = [];

                        series = chart.series.push(new am4charts.LineSeries());
                        
                        series.hide();
                        series.showOnInit = false;
                        series.defaultState.transitionDuration = 0;
                        series.hiddenState.transitionDuration = 0;
                        series.stroke = am4core.color(colorSet.getIndex(k * 4));
                        series.strokeWidth = 0;
                        series.dataFields.valueX = "year";
                        series.dataFields.valueY = "percentage";
                        series.connect = false;
                        series.legendSettings.labelText = namesList[k] + " (" + sexList[k] + ")";
                        series.hiddenInLegend = true;

                        for (j = 0; j < years.length; j++) {
                            dataObj = {};
                            dataObj["year"] = parseInt(years[j][0]);
                            dataObj["percentage"] = years[j][1];
                            dataArr.push(dataObj);
                        }

                        series.data = dataArr;
                        setIndex(k+1);

                    }
                    
                } 
                else if (dataType === "Percentage") {

                    let valueAxis = chart.yAxes._values[0];
                    valueAxis.renderer.inversed = false;
                    valueAxis.title.text = "Popularity (Percentage)";
                    valueAxis.min = 0.0001;
                    valueAxis.max = 10;

                    if (submitted) {



                        years = rankData[k][0];
                        dataArr = [];

                        series = chart.series.push(new am4charts.LineSeries());
                        series.hide();
                        series.showOnInit = false;
                        series.defaultState.transitionDuration = 0;
                        series.hiddenState.transitionDuration = 0;
                        series.stroke = am4core.color(colorSet.getIndex(k * 4));
                        series.strokeWidth = 0;
                        series.dataFields.valueX = "year";
                        series.dataFields.valueY = "rank";
                        series.connect = false;
                        series.legendSettings.labelText = namesList[k] + " (" + sexList[k] + ")";
                        series.hiddenInLegend = true;

                        for (j = 0; j < years.length; j++) {
                            dataObj = {};
                            dataObj["year"] = parseInt(years[j][0]);
                            dataObj["rank"] = years[j][1];
                            dataArr.push(dataObj);
                        }
                        series.data = dataArr;

                        setIndex(k);

                        years = percentData[k][0];
                        dataArr = [];

                        series = chart.series.push(new am4charts.LineSeries());
                        series.stroke = am4core.color(colorSet.getIndex(k * 4));
                        series.defaultState.transitionDuration = 0;
                        series.hiddenState.transitionDuration = 0;
                        series.strokeWidth = 2;
                        series.dataFields.valueX = "year";
                        series.dataFields.valueY = "percentage";
                        series.connect = false;
                        series.legendSettings.labelText = namesList[k] + " (" + sexList[k] + ")";

                        for (j = 0; j < years.length; j++) {
                            dataObj = {};
                            dataObj["year"] = parseInt(years[j][0]);
                            dataObj["percentage"] = years[j][1];
                            dataArr.push(dataObj);
                        }
                        series.data = dataArr;
                        setIndex(k + 1);

                    }
                    
                }
                k++
            }


            
        


        }

        const makeChart = () => {

            let chart = am4core.create("chartdiv", am4charts.XYChart);
            setTheChart(chart);
            chart.numberFormatter.numberFormat = "#";
            chart.paddingRight = 20;
            chart.legend = new am4charts.Legend();

            let dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
            dateAxis.renderer.grid.template.location = 0;
            dateAxis.renderer.minGridDistance = 50;
            dateAxis.title.text = "Year of Birth";
            dateAxis.min = 1880;
            dateAxis.max = 2020;
            dateAxis.strictMinMax = true;
            dateAxis.baseInterval = {
                count: 1,
                valueUnit: "year"
            }



            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.logarithmic = true;
            valueAxis.strictMinMax = true;
            valueAxis.renderer.minWidth = 35;
            if (dataType === "Ranking") {
                valueAxis.numberFormatter.numberFormat = "#"
                valueAxis.renderer.inversed = true;
                valueAxis.title.text = "Popularity (Ranking)";
                valueAxis.min = 1;
                valueAxis.max = 20000;
                valueAxis.adapter.add("extraTooltipPrecision", function(text, target, key) {
                    return 0;
                   });
            }

            else {
                valueAxis.numberFormatter.numberFormat = "#.0000"
                valueAxis.renderer.inversed = false;
                valueAxis.title.text = "Popularity (Percentage)";
                valueAxis.min = 0.0001;
                valueAxis.max = 10;
                valueAxis.adapter.add("extraTooltipPrecision", function(text, target, key) {
                    return 4;
                   });
                chart.xAxes._values[0].tooltip.label.adapter.add("text", function(text, target) {
                    if (text) {
                        return text.substring(0,4);
                    }
                     
                  });
            }

            chart.cursor = new am4charts.XYCursor();

            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarX.startGrip.icon.disabled = true;
            chart.scrollbarX.endGrip.icon.disabled = true;
            chart.scrollbarX.thumb.background.fill = am4core.color("#ebebeb");

            chart.scrollbarY = new am4core.Scrollbar();
            chart.scrollbarY.startGrip.icon.disabled = true;
            chart.scrollbarY.endGrip.icon.disabled = true;
            chart.scrollbarY.thumb.background.fill = am4core.color("#ebebeb");

        }

        if (init && dataTypeChanged) {

            switchChartData();

            setDataTypeChanged(false);
        } else if (dataTypeChanged) {

            setDataTypeChanged(false);
        }

        if (!init) {
            makeChart();
            setInit(true);
        }

        if (submitted && init) {

            if (rankData.length > 0) {
                updateChart();
            }
            setLoading(false);
            setSubmitted(false);
        }

        if (!firstSubmit) {
            splitData();
            setFirstSubmit(true);
        }



    }, [loading, submitted, rankData, percentData, firstSubmit, namesList, sexList, theChart, init, index, dataTypeChanged, dataType]);

    return (
        <div>
            
            <div className="container">
                <div className="row py-3 justify-content-center ">
                    <div className="col-8 justify-content-center">
                        <div className="text-center">Enter a first name to find the names with the most similar popularity over time.
                        </div>
                        <br></br>
                        <div className="text-center">View Popularity by:&ensp;&ensp;
                        <label>
                        
                        <input type="radio"
                            required
                            value="Ranking"
                            checked={dataType === "Ranking"}
                            onChange={onChangeDataType}
                            onKeyPress={handleKeyPress}
                        />
                        <span>&ensp;Ranking</span>
                        </label>
                        <label>
                        <span>&ensp;&ensp;&ensp;</span>
                        <input type="radio"
                            required
                            value="Percentage"
                            checked={dataType === "Percentage"}
                            onChange={onChangeDataType}
                            onKeyPress={handleKeyPress}
                        />
                        <span>&ensp;Percentage</span>
                        </label></div>
                    </div>
                </div>
            </div>
            
            <form onSubmit={submitName} onKeyPress={handleKeyPress}>
            <div className="container ml-4 justify-content-center">
                <div className="row px-5 justify-content-center">

                    <div className="col"></div>
                    <div className="col"></div>
                    <div className="col">
                        <div className="form-group">
                            <div className="row justify-content-center">
                            <div className="col-sm-auto">
                                <label>Name</label>
                            </div></div>
                            <input type="text"
                                id="name"
                                required
                                className="form-control form control-lg $"
                                value={name}
                                onChange={onChangeName}
                            />
                        </div>
                    </div>

                    <div className="col">

                        <div className="row justify-content-center">
                            <div className="form-group ">

                                <label>Sex of Name</label>
                                <br></br>
                                <span>&ensp;</span>
                                <label>
                                    <input type="radio"
                                        required
                                        value="F"
                                        checked={nameSex === "F"}
                                        onChange={onChangeNameSex}
                                    />
                                    <span> F</span>
                                </label>
                                <span>&ensp;&ensp;</span>
                                <label>
                                    <input type="radio"
                                        required
                                        value="M"
                                        checked={nameSex === "M"}
                                        onChange={onChangeNameSex}
                                    />
                                    <span> M</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col py-2 ml-3">

                        <input type="button" value="Search" onClick={submitName} className="btn btn-primary" /></div>

                    <div className="col py-2">
                        <input type="button" value="Clear" onClick={clearName} className="btn btn-danger" /></div>
                        <div className="col"></div>
                        <div className="col"></div>
                </div></div>

            </form>
            
            
            <div className="row py-2 mr-5 justify-content-center">
            <div id="col" style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", height: "400px"}}>{loading && <LoadSpinner/>}</div>
            <div id="chartdiv" style={{ width: "80%", height: "400px" }}></div>
            </div>
            <div className="footer">
                <footer className="card-footer bg-light font-small text-center gray fixed-bottom"><span>© 2023 Tate W. Jenkins &ensp;</span><a href="https://www.amcharts.com/">Built with amCharts</a>
                </footer>
            </div>
        </div>


    );
}



export default ChartNameCurve;